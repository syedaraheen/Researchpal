from typing import Union, BinaryIO
import fitz  # PyMuPDF


def extract_text_from_pdf(file_or_bytes: Union[BinaryIO, bytes]) -> str:
    if isinstance(file_or_bytes, (bytes, bytearray)):
        data = bytes(file_or_bytes)
    else:
        data = file_or_bytes.read()
    doc = fitz.open(stream=data, filetype="pdf")
    texts: list[str] = []
    for page in doc:
        texts.append(page.get_text())
    return "\n".join(texts)

