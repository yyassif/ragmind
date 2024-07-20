from abc import ABC, abstractmethod

from langchain_core.documents import Document
from ragmind_core.storage.file import FileExtension, RAGMindFile


# TODO: processors should be cached somewhere ?
# The processor should be cached by processor type
# The cache should use a single
class ProcessorBase(ABC):
    supported_extensions: list[FileExtension | str]

    @abstractmethod
    async def process_file(self, file: RAGMindFile) -> list[Document]:
        raise NotImplementedError

    def check_supported(self, file: RAGMindFile):
        if file.file_extension not in self.supported_extensions:
            raise ValueError(f"can't process a file of type {file.file_extension}")
