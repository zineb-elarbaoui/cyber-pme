import argparse
import json
import re
import sys
from pathlib import Path


TESSERACT_CMD_WINDOWS = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Détecte les en-têtes du type "3.1.2 Titre de la section" ou "5.2 Titre"
# en début de ligne. Accepte 1 à 4 niveaux de numérotation (ex: "2" ou "3.1.2").
SECTION_HEADER_REGEX = re.compile(
    r"^(?P<numero>\d{1,2}(?:\.\d{1,2}){0,3})\s+(?P<titre>[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ][^\n]{2,120})$"
)

# Taille cible d'un chunk en caractères si une section est trop longue et doit
# être sous-découpée (pour ne pas dépasser la fenêtre de contexte du LLM/retriever)
MAX_CHUNK_CHARS = 1500
MIN_CHUNK_CHARS = 40  # en dessous, on fusionne avec le chunk suivant (bruit)


def read_pdf(path: Path) -> str:
    try:
        import pdfplumber
    except ImportError:
        sys.exit(
            "pdfplumber n'est pas installé. Lance : pip install pdfplumber --break-system-packages"
        )
    text_parts = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_parts.append(page_text)
    return "\n".join(text_parts)


def read_pdf_ocr(path: Path) -> str:
    """
    Extraction par OCR : rend chaque page en image puis lit le texte
    visuellement avec Tesseract. À utiliser quand l'extraction directe du
    texte du PDF est corrompue (police avec table d'encodage cassée) —
    symptôme typique : caractères CJK/illisibles en sortie de read_pdf().
    """
    try:
        import fitz  # PyMuPDF
    except ImportError:
        sys.exit("PyMuPDF n'est pas installé. Lance : pip install pymupdf --break-system-packages")
    try:
        import pytesseract
        from PIL import Image
        import io
    except ImportError:
        sys.exit(
            "pytesseract/Pillow ne sont pas installés. Lance : "
            "pip install pytesseract pillow --break-system-packages"
        )

    if sys.platform.startswith("win"):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD_WINDOWS

    text_parts = []
    doc = fitz.open(str(path))
    n_pages = len(doc)
    for i, page in enumerate(doc):
        # zoom x2 (~300 DPI depuis un rendu par défaut à 72 DPI) pour une
        # meilleure précision OCR sur du texte de taille normale
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        page_text = pytesseract.image_to_string(img, lang="fra")
        text_parts.append(page_text)
        print(f"  OCR page {i + 1}/{n_pages}...", end="\r")
    doc.close()
    print()
    return "\n".join(text_parts)


def read_docx(path: Path) -> str:
    try:
        import docx
    except ImportError:
        sys.exit(
            "python-docx n'est pas installé. Lance : pip install python-docx --break-system-packages"
        )
    document = docx.Document(str(path))
    return "\n".join(p.text for p in document.paragraphs)


def read_txt(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def load_document_text(path: Path, use_ocr: bool = False) -> str:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return read_pdf_ocr(path) if use_ocr else read_pdf(path)
    if suffix == ".docx":
        return read_docx(path)
    if suffix == ".txt":
        return read_txt(path)
    raise ValueError(f"Format non supporté : {suffix} (attendu : .pdf, .docx, .txt)")


def split_by_sections(raw_text: str):
    """
    Parcourt le texte ligne par ligne. Chaque ligne qui matche
    SECTION_HEADER_REGEX ouvre une nouvelle section ; tout le texte jusqu'à
    la prochaine en-tête lui est rattaché.

    Retourne une liste de dicts : {"numero": str, "titre": str, "texte": str}
    """
    lines = raw_text.split("\n")
    sections = []
    current = {"numero": "0", "titre": "Préambule / non sectionné", "texte_lines": []}

    for line in lines:
        stripped = line.strip()
        match = SECTION_HEADER_REGEX.match(stripped)
        if match:
            # on clôt la section en cours si elle contient du texte utile
            if current["texte_lines"]:
                sections.append(current)
            current = {
                "numero": match.group("numero"),
                "titre": match.group("titre").strip(),
                "texte_lines": [],
            }
        else:
            if stripped:
                current["texte_lines"].append(stripped)

    if current["texte_lines"]:
        sections.append(current)

    result = []
    for s in sections:
        result.append(
            {
                "numero": s["numero"],
                "titre": s["titre"],
                "texte": " ".join(s["texte_lines"]).strip(),
            }
        )
    return result


def subdivide_long_sections(sections):
    """
    Si une section dépasse MAX_CHUNK_CHARS, la redécoupe en plusieurs chunks
    (découpage sur les fins de phrase les plus proches de la limite, pour ne
    pas couper au milieu d'une idée). Chaque sous-chunk garde le même numéro
    de section (traçabilité vers section_guide_precise conservée).
    """
    chunks = []
    for s in sections:
        texte = s["texte"]
        if len(texte) <= MAX_CHUNK_CHARS:
            if len(texte) >= MIN_CHUNK_CHARS:
                chunks.append(s)
            continue

        start = 0
        while start < len(texte):
            end = min(start + MAX_CHUNK_CHARS, len(texte))
            if end < len(texte):
                # recule jusqu'au dernier point avant la limite pour couper proprement
                last_period = texte.rfind(". ", start, end)
                if last_period != -1 and last_period > start + MIN_CHUNK_CHARS:
                    end = last_period + 1
            sub_texte = texte[start:end].strip()
            if len(sub_texte) >= MIN_CHUNK_CHARS:
                chunks.append({"numero": s["numero"], "titre": s["titre"], "texte": sub_texte})
            start = end
    return chunks


def chunk_guide(path: Path, use_ocr: bool = False):
    raw_text = load_document_text(path, use_ocr=use_ocr)
    sections = split_by_sections(raw_text)
    chunks = subdivide_long_sections(sections)

    for i, c in enumerate(chunks):
        c["ordre"] = i

    return chunks


def main():
    parser = argparse.ArgumentParser(description="Chunking du guide CMRPI/AUSIM")
    parser.add_argument("guide_path", type=str, help="Chemin vers le guide (.pdf, .docx ou .txt)")
    parser.add_argument("--out", type=str, default="chunks.json", help="Fichier JSON de sortie")
    parser.add_argument(
        "--ocr",
        action="store_true",
        help="Force l'extraction par OCR (à utiliser si l'extraction directe produit du texte corrompu)",
    )
    args = parser.parse_args()

    path = Path(args.guide_path)
    if not path.exists():
        sys.exit(f"Fichier introuvable : {path}")

    if args.ocr:
        print("Extraction par OCR — ça va prendre plusieurs minutes selon le nombre de pages...")
    chunks = chunk_guide(path, use_ocr=args.ocr)

    if not chunks:
        print(
            "ATTENTION : aucun chunk produit. Le regex SECTION_HEADER_REGEX ne "
            "détecte probablement pas le format des titres de TON document. "
            "Ouvre le fichier et ajuste le regex en haut du script."
        )
    else:
        n_sections_detectees = len({c["numero"] for c in chunks if c["numero"] != "0"})
        print(f"{len(chunks)} chunks produits, {n_sections_detectees} sections numérotées détectées.")
        if n_sections_detectees < 5:
            print(
                "ATTENTION : très peu de sections détectées — vérifie chunks.json "
                "et ajuste le regex si besoin avant de lancer embeddings.py."
            )

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    print(f"Écrit dans {args.out}")


if __name__ == "__main__":
    main()