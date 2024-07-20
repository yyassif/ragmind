from abc import ABC, abstractmethod
from uuid import UUID

from ragmind_core.brain.info import StorageInfo
from ragmind_core.storage.local_storage import RAGMindFile


class StorageBase(ABC):
    name: str

    def __init_subclass__(cls, **kwargs):
        for required in ("name",):
            if not getattr(cls, required):
                raise TypeError(
                    f"Can't instantiate abstract class {cls.__name__} without {required} attribute defined"
                )
        return super().__init_subclass__(**kwargs)

    @abstractmethod
    def nb_files(self) -> int:
        raise Exception("Unimplemented nb_files method")

    @abstractmethod
    async def get_files(self) -> list[RAGMindFile]:
        raise Exception("Unimplemented get_files method")

    @abstractmethod
    async def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        raise Exception("Unimplemented upload_file method")

    @abstractmethod
    async def remove_file(self, file_id: UUID) -> None:
        raise Exception("Unimplemented remove_file method")

    def info(self) -> StorageInfo:
        return StorageInfo(
            storage_type=self.name,
            n_files=self.nb_files(),
        )