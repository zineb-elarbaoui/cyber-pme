"""
PFA N°13 — Sprint 4 — diagnostic_extraction.py

Script de diagnostic UNIQUEMENT : compare deux méthodes d'extraction de texte
PDF (pdfplumber vs PyMuPDF) pour identifier laquelle produit un texte lisible
sur TON exemplaire du guide. À lancer une seule fois, pas un composant du
pipeline final.

Prérequis :
    pip install pymupdf --break-system-packages

Usage :
    python diagnostic_extraction.py "C:\\chemin\\vers\\ton_guide.pdf"
"""

import sys
from pathlib import Path


def test_pdfplumber(path):
    try:
        import pdfplumber
    except ImportError:
        return "[pdfplumber non installé]"
    try:
        with pdfplumber.open(path) as pdf:
            page = pdf.pages[0]
            text = page.extract_text() or "[page vide]"
            return text[:500]
    except Exception as e:
        return f"[erreur pdfplumber: {e}]"


def test_pymupdf(path):
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return "[PyMuPDF non installé — lance : pip install pymupdf --break-system-packages]"
    try:
        doc = fitz.open(path)
        page = doc[0]
        text = page.get_text()
        doc.close()
        return text[:500] if text.strip() else "[page vide]"
    except Exception as e:
        return f"[erreur PyMuPDF: {e}]"


def main():
    if len(sys.argv) < 2:
        sys.exit("Usage : python diagnostic_extraction.py chemin_vers_guide.pdf")

    path = Path(sys.argv[1])
    if not path.exists():
        sys.exit(f"Fichier introuvable : {path}")

    print("=" * 70)
    print("EXTRAIT AVEC pdfplumber (première page, 500 premiers caractères) :")
    print("=" * 70)
    print(test_pdfplumber(str(path)))

    print()
    print("=" * 70)
    print("EXTRAIT AVEC PyMuPDF (première page, 500 premiers caractères) :")
    print("=" * 70)
    print(test_pymupdf(str(path)))


if __name__ == "__main__":
    main()