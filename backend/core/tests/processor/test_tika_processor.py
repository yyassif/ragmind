from pathlib import Path
from uuid import uuid4

import pytest

from ragmind_core.processor.pdf_processor import TikaParser
from ragmind_core.storage.file import RAGMindFile

# TODO: TIKA server should be set


@pytest.fixture
def pdf():
    return RAGMindFile(
        id=uuid4(),
        brain_id=uuid4(),
        original_filename="dummy.pdf",
        path=Path("./tests/processor/data/dummy.pdf"),
        file_extension=".pdf",
    )


@pytest.mark.asyncio
async def test_process_file(pdf):
    tparser = TikaParser()
    doc = await tparser.process_file(pdf)
    assert len(doc) > 0
    assert doc[0].page_content.strip("\n") == "Dummy PDF download"


@pytest.mark.asyncio
async def test_send_parse_tika_exception(pdf):
    # TODO: Mock correct tika for retries
    tparser = TikaParser(tika_url="test.test")
    with pytest.raises(RuntimeError):
        doc = await tparser.process_file(pdf)
        assert len(doc) > 0
        assert doc[0].page_content.strip("\n") == "Dummy PDF download"
