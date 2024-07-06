import os

from fpdf import FPDF
from pydantic import BaseModel


class PDFModel(BaseModel):
    title: str
    content: str


class PDFGenerator(FPDF):
    def __init__(self, pdf_model: PDFModel, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pdf_model = pdf_model
        self.add_font(
            "DejaVu",
            "",
            os.path.join(os.path.dirname(__file__), "font/DejaVuSansCondensed.ttf"),
            uni=True,
        )
        self.add_font(
            "DejaVu",
            "B",
            os.path.join(
                os.path.dirname(__file__), "font/DejaVuSansCondensed-Bold.ttf"
            ),
            uni=True,
        )
        self.add_font(
            "DejaVu",
            "I",
            os.path.join(
                os.path.dirname(__file__), "font/DejaVuSansCondensed-Oblique.ttf"
            ),
        )

    def header(self):
        # Logo
        logo_path = os.path.join(os.path.dirname(__file__), "logo.png")
        self.image(logo_path, 10, 10, 20)  # Adjust size as needed

        # Move cursor to right of image
        self.set_xy(20, 15)

        # Title
        self.set_font("DejaVu", "B", 12)
        self.multi_cell(0, 10, self.pdf_model.title, align="C")
        self.ln(5)  # Padding after title

    def chapter_body(self):

        self.set_font("DejaVu", "", 12)
        self.multi_cell(0, 10, self.pdf_model.content, markdown=True)
        self.ln()

    def print_pdf(self):
        self.add_page()
        self.chapter_body()


if __name__ == "__main__":
    pdf_model = PDFModel(
        title="Summary of Services Rendered by Google",
        content="""
**Summary:** 
The document is an invoice from Google LLC for digital marketing services provided to client ABC Corp. The total fees and disbursements amount to $12,500.00 for services rendered through June 30, 2024. The invoice includes specific instructions for payment remittance and contact information for inquiries. Online payment through googlepay.com is also an option.

**Key Points:**
- Google LLC, based in the United States and represented by Sundar Pichai, provided digital marketing services to client ABC Corp.
- Services included search engine optimization (SEO), pay-per-click (PPC) advertising, social media marketing, and content creation.
- The team involved in providing these services included John Doe, Jane Smith, Michael Johnson, Emily Davis, and Robert Brown.
- The total hours billed for the services provided was 100.00, with a total cost of $12,500.00.
- Instructions for payment remittance, contact information, and online payment options through googlepay.com.
""",
    )
    pdf = PDFGenerator(pdf_model)
    pdf.print_pdf()
    pdf.output("google_services_summary.pdf")

