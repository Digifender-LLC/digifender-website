"""Build public PDF copies from the same rendered document blocks as the website."""
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape
from html import unescape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, HRFlowable
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DOCUMENTS = json.loads((ROOT / '.evidence/documents.json').read_text())
INK = colors.HexColor('#10223a')
GRAY = colors.HexColor('#465361')
BASE = ParagraphStyle('Body', fontName='Helvetica', fontSize=10, leading=14, textColor=INK,
                      spaceAfter=8, allowWidows=0, allowOrphans=0, splitLongWords=True)
STYLES = {
    'body': BASE,
    'brand': ParagraphStyle('Brand', parent=BASE, fontName='Helvetica-Bold', fontSize=11, spaceAfter=16),
    'eyebrow': ParagraphStyle('Group', parent=BASE, fontSize=8, leading=11, textColor=GRAY, spaceAfter=9),
    'title': ParagraphStyle('Title', parent=BASE, fontName='Helvetica-Bold', fontSize=25, leading=29,
                            spaceAfter=14, keepWithNext=True),
    'h2': ParagraphStyle('Heading', parent=BASE, fontName='Helvetica-Bold', fontSize=13, leading=17,
                         spaceBefore=13, spaceAfter=7, keepWithNext=True),
    'draft': ParagraphStyle('Draft', parent=BASE, fontName='Helvetica-Bold', fontSize=9, leading=13,
                            borderColor=colors.HexColor('#c8cdd2'), borderWidth=.6, borderPadding=10,
                            backColor=colors.HexColor('#f7f7f3'), spaceBefore=8, spaceAfter=15),
    'meta': ParagraphStyle('Meta', parent=BASE, fontSize=8, leading=12, textColor=GRAY, spaceAfter=7),
    'bullet': ParagraphStyle('Bullet', parent=BASE, spaceAfter=5),
}

def pdf_inline(value):
    # The Node renderer has already escaped source text and allowlisted links.
    value = value.replace('<strong>', '<b>').replace('</strong>', '</b>')
    value = value.replace('<code>', '<font name="Courier" size="9">').replace('</code>', '</font>')
    value = re.sub(r'href="/(?!/)', 'href="https://digifender.com/', value)
    value = value.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', ' - ')
    return value

def normalized_text(value):
    return re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', '', pdf_inline(value)))).strip()

results = []
for item in DOCUMENTS:
    destination = ROOT / 'dist' / item['pdfRoute'].lstrip('/')
    destination.parent.mkdir(parents=True, exist_ok=True)
    story = [Paragraph('digifender.', STYLES['brand']),
             Paragraph(escape(item['group'].upper()) + ' / LEGAL', STYLES['eyebrow']),
             Paragraph(escape(item['title']), STYLES['title'])]
    if item['draft']:
        story.append(Paragraph('DRAFT FOR REVIEW - NOT YET ADOPTED<br/>Effective date remains pending. Publishing this copy does not establish acceptance.', STYLES['draft']))
    story.append(HRFlowable(width='100%', thickness=.6, color=colors.HexColor('#cbd2d7'), spaceAfter=15))
    for block in item['blocks']:
        if block['type'] == 'list':
            story.append(ListFlowable([ListItem(Paragraph(pdf_inline(text), STYLES['bullet'])) for text in block['items']],
                                      bulletType='bullet', start='circle', leftIndent=15,
                                      bulletFontName='Helvetica', bulletFontSize=5, spaceAfter=8))
        else:
            story.append(Paragraph(pdf_inline(block['html']), STYLES['h2' if block['type'] == 'h2' else 'body']))
    def draw_page(canvas, doc, item=item):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#d0d6da'))
        canvas.line(43, 44, LETTER[0]-43, 44)
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(GRAY)
        label = item['group'] + ' | ' + item['title']
        if item['draft']:
            label += ' | DRAFT'
        canvas.drawString(43, 32, label)
        canvas.drawRightString(LETTER[0]-43, 32, f'Page {doc.page}')
        canvas.drawString(43, 21, item['canonical'] + ' | Revision ' + item['sha256'][:12])
        canvas.linkURL(item['canonical'], (43, 19, LETTER[0]-43, 28), relative=0)
        canvas.restoreState()

    doc = SimpleDocTemplate(str(destination), pagesize=LETTER, leftMargin=43, rightMargin=43,
                            topMargin=43, bottomMargin=56, title=item['group']+' '+item['title'],
                            author='Digifender LLC', subject='Draft for review' if item['draft'] else 'Company legal notice')
    doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    reader = PdfReader(destination)
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    if not text.strip() or item['title'] not in text:
        raise ValueError('PDF text missing: '+item['pdfRoute'])
    if item['draft'] and 'NOT YET ADOPTED' not in text:
        raise ValueError('PDF draft status missing: '+item['pdfRoute'])
    if any(not (page.extract_text() or '').strip() for page in reader.pages):
        raise ValueError('Blank PDF page: '+item['pdfRoute'])
    # Ignore the page footer when checking paragraphs split across page breaks.
    body_text = normalized_text('\n'.join(page.extract_text(visitor_text=lambda *args: None,
                                                          extraction_mode='plain') or '' for page in reader.pages))
    label = item['group'] + ' | ' + item['title'] + (' | DRAFT' if item['draft'] else '')
    for page_number in range(1, len(reader.pages) + 1):
        footer = normalized_text(label + ' Page ' + str(page_number) + ' ' + item['canonical'] + ' | Revision ' + item['sha256'][:12])
        body_text = body_text.replace(footer, '')
    body_text = re.sub(r'\s+', ' ', body_text)
    for block in item['blocks']:
        for value in block['items'] if block['type'] == 'list' else [block['html']]:
            if normalized_text(value) not in body_text:
                raise ValueError('PDF content mismatch: '+item['pdfRoute']+' '+normalized_text(value)[:100])
    results.append({'route':item['pdfRoute'], 'pages':len(reader.pages), 'revision':item['sha256'], 'bytes':destination.stat().st_size})

(ROOT/'.evidence/pdf-manifest.json').write_text(json.dumps(results, indent=2)+'\n')
print(f'Generated and text-checked {len(results)} PDF copies from shared document blocks.')
