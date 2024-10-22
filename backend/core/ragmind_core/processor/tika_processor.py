import logging
from importlib.metadata import version
from typing import AsyncIterable

import httpx
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter, TextSplitter

from ragmind_core.processor.processor_base import ProcessorBase
from ragmind_core.processor.registry import FileExtension
from ragmind_core.processor.splitter import SplitterConfig
from ragmind_core.storage.file import RAGMindFile

logger = logging.getLogger("ragmind_core")


class TikaProcessor(ProcessorBase):
    supported_extensions = [FileExtension.pdf]

    def __init__(
        self,
        tika_url: str = "http://localhost:9998/tika",
        splitter: TextSplitter | None = None,
        splitter_config: SplitterConfig = SplitterConfig(),
        timeout: float = 5.0,
        max_retries: int = 3,
    ) -> None:
        self.tika_url = tika_url
        self.max_retries = max_retries
        self._client = httpx.AsyncClient(timeout=timeout)

        self.splitter_config = splitter_config

        if splitter:
            self.text_splitter = splitter
        else:
            self.text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                chunk_size=splitter_config.chunk_size,
                chunk_overlap=splitter_config.chunk_overlap,
            )

    async def _send_parse_tika(self, f: AsyncIterable[bytes]) -> str:
        retry = 0
        headers = {"Accept": "text/plain"}
        while retry < self.max_retries:
            try:
                resp = await self._client.put(self.tika_url, headers=headers, content=f)
                resp.raise_for_status()
                return resp.content.decode("utf-8")
            except Exception as e:
                retry += 1
                logger.debug(f"tika url error :{e}. retrying for the {retry} time...")
        raise RuntimeError("can't send parse request to tika server")

    async def process_file(self, file: RAGMindFile) -> list[Document]:
        self.check_supported(file)

        async with file.open() as f:
            txt = await self._send_parse_tika(f)
        document = Document(page_content=txt)
        # Use the default splitter
        docs = self.text_splitter.split_documents([document])
        file_metadata = file.metadata

        for doc in docs:
            doc.metadata = {
                "chunk_size": len(doc.page_content),
                "chunk_overlap": self.splitter_config.chunk_overlap,
                "parser_name": self.__class__.__name__,
                "ragmind_core_version": version("ragmind-core"),
                **file_metadata,
            }

        return docs