

from io import BytesIO
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)

# Palette reprise de styles.css (--primary, --primary-accent, --success, etc.)
COLOR_PRIMARY = HexColor("#1a2540")      # navy profond
COLOR_ACCENT = HexColor("#2e6ee0")       # bleu électrique
COLOR_MUTED = HexColor("#6b7280")
COLOR_CRITICAL = HexColor("#c0392b")
COLOR_WARNING = HexColor("#c77b1e")
COLOR_SUCCESS = HexColor("#3d8a5c")
COLOR_BORDER = HexColor("#dcdfe6")

PRIORITY_LABELS = {"critical": "Critique", "high": "Élevée", "medium": "Moyenne", "low": "Faible"}
PRIORITY_COLORS = {"critical": COLOR_CRITICAL, "high": COLOR_WARNING, "medium": COLOR_ACCENT, "low": COLOR_SUCCESS}


def _styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("H1Cyber", parent=styles["Title"], textColor=COLOR_PRIMARY, fontSize=22, spaceAfter=4))
    styles.add(ParagraphStyle("H2Cyber", parent=styles["Heading2"], textColor=COLOR_PRIMARY, fontSize=14, spaceBefore=16, spaceAfter=8))
    styles.add(ParagraphStyle("Meta", parent=styles["Normal"], textColor=COLOR_MUTED, fontSize=9.5))
    styles.add(ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14))
    styles.add(ParagraphStyle("RecoTitle", parent=styles["Normal"], fontSize=11.5, leading=14, textColor=COLOR_PRIMARY, spaceAfter=2))
    styles.add(ParagraphStyle("RecoMeta", parent=styles["Normal"], fontSize=8.5, textColor=COLOR_MUTED, spaceAfter=4))
    styles.add(ParagraphStyle("RecoBody", parent=styles["Normal"], fontSize=9.5, leading=13))
    return styles


def generer_pdf_rapport(
    *,
    profil: dict,           # {"nom_entreprise": str, "secteur_activite": str, "taille_effectif": str}
    global_score: int,
    max_score: int,
    domaines: list[dict],   # [{"nom": str, "score": int, "max": int}, ...]
    recommandations: list[dict],  # [{"titre","domaine","priority","cout","difficulte","impact","section","justification","score_priorite"}]
) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20 * mm, bottomMargin=18 * mm, leftMargin=18 * mm, rightMargin=18 * mm,
        title=f"Rapport de maturité cybersécurité — {profil.get('nom_entreprise', '')}",
    )
    styles = _styles()
    story = []

    # --- En-tête -------------------------------------------------------
    story.append(Paragraph("Rapport de diagnostic cybersécurité", styles["H1Cyber"]))
    story.append(Paragraph(profil.get("nom_entreprise", "—"), styles["Body"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        f"Généré le {date.today().strftime('%d/%m/%Y')} · basé sur le guide de référence CMRPI/AUSIM",
        styles["Meta"],
    ))
    story.append(Spacer(1, 14))

    # --- Score global ----------------------------------------------------
    pct = round((global_score / max_score) * 100) if max_score else 0
    story.append(Paragraph("Score global de maturité", styles["H2Cyber"]))
    story.append(Paragraph(f"<b>{global_score} / {max_score}</b>  ({pct}%)", styles["Body"]))
    story.append(Spacer(1, 10))

    # --- Tableau des 15 domaines ------------------------------------------
    story.append(Paragraph("Maturité par domaine", styles["H2Cyber"]))
    table_data = [["Domaine", "Score", "Statut"]]
    for d in domaines:
        ratio = (d["score"] / d["max"]) if d["max"] else 0
        statut = "Critique" if ratio < 0.25 else "À renforcer" if ratio < 0.5 else "Défini" if ratio < 0.75 else "Maîtrisé"
        table_data.append([d["nom"], f"{d['score']}/{d['max']}", statut])

    t = Table(table_data, colWidths=[95 * mm, 25 * mm, 50 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COLOR_PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), HexColor("#ffffff")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [HexColor("#ffffff"), HexColor("#f7f8fa")]),
    ]))
    story.append(t)
    story.append(PageBreak())

    # --- Plan d'action priorisé --------------------------------------------
    story.append(Paragraph(f"Plan d'action priorisé — {len(recommandations)} recommandation(s)", styles["H2Cyber"]))
    story.append(Paragraph(
        "Triées par score de priorité (méthodologie détaillée en annexe technique du projet).",
        styles["Meta"],
    ))
    story.append(Spacer(1, 8))

    reco_triees = sorted(recommandations, key=lambda r: r.get("score_priorite", 0), reverse=True)
    for i, r in enumerate(reco_triees, start=1):
        prio_color = PRIORITY_COLORS.get(r.get("priority"), COLOR_MUTED)
        prio_label = PRIORITY_LABELS.get(r.get("priority"), r.get("priority", ""))
        story.append(Paragraph(f"{i:02d}. {r.get('titre', '')}", styles["RecoTitle"]))
        story.append(Paragraph(
            f'<font color="{prio_color.hexval()}"><b>Priorité {prio_label}</b></font> · '
            f"{r.get('domaine', '')} · Coût: {r.get('cout', '—')} · "
            f"Difficulté: {r.get('difficulte', '—')} · Impact: {r.get('impact', '—')} · "
            f"Réf. guide §{r.get('section', '—')}",
            styles["RecoMeta"],
        ))
        if r.get("justification"):
            story.append(Paragraph(r["justification"], styles["RecoBody"]))
        story.append(Spacer(1, 10))

    doc.build(story)
    return buffer.getvalue()