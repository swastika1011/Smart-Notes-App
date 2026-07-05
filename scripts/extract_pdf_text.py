import json
import sys
import fitz


def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: extract_pdf_text.py <pdf_path>"}))
        return 2

    pdf_path = sys.argv[1]

    try:
        doc = fitz.open(pdf_path)

        pages = []

        for page in doc:
            pages.append(page.get_text("text"))

        doc.close()

        text = "\n".join(pages).strip()

        if not text:
            print(json.dumps({"error": "No readable text found in PDF"}))
            return 1

        print(json.dumps({"text": text}))

        return 0

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())