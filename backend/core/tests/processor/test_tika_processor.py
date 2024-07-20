import pytest

from ragmind_core.processor.tika_processor import TikaProcessor

@pytest.mark.asyncio
async def test_process_file(ragmind_pdf):
    tparser = TikaProcessor()
    doc = await tparser.process_file(ragmind_pdf)
    assert len(doc) > 0
    assert doc[0].page_content.strip("\n") == "Dummy PDF download"


@pytest.mark.asyncio
async def test_send_parse_tika_exception(ragmind_pdf):
    # TODO: Mock correct tika for retries
    tparser = TikaProcessor(tika_url="test.test")
    with pytest.raises(RuntimeError):
        doc = await tparser.process_file(ragmind_pdf)
        assert len(doc) > 0
        assert doc[0].page_content.strip("\n") == "Dummy PDF download"