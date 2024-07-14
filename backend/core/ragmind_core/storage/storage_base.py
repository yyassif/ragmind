from abc import ABC, abstractmethod
from uuid import UUID

from ragmind_core.storage.local_storage import RAGMindFile


class StorageBase(ABC):
    @abstractmethod
    def get_files(self) -> list[RAGMindFile]:
        raise Exception("Unimplemented get_files method")

    @abstractmethod
    def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        raise Exception("Unimplemented  upload_file method")

    @abstractmethod
    def remove_file(self, file_id: UUID) -> None:
        raise Exception("Unimplemented remove_file method")
