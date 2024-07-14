from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from langchain_core.documents import Document
from ragmind_core.storage.file import RAGMindFile


class ProcessorBase(ABC):
    supported_extensions: list[str]

    @abstractmethod
    async def process_file(self, file: RAGMindFile) -> list[Document]:
        pass


P = TypeVar("P", bound=ProcessorBase)


class ProcessorsMapping(Generic[P]):
    def __init__(self, mapping: dict[str, P]) -> None:
        # Create an empty list with items of type T
        self.ext_parser: dict[str, P] = mapping

    def add_parser(self, extension: str, parser: P):
        # TODO: deal with existing ext keys
        self.ext_parser[extension] = parser
