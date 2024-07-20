import os
import shutil
from pathlib import Path
from typing import Set
from uuid import UUID

from ragmind_core.storage.file import RAGMindFile
from ragmind_core.storage.storage_base import StorageBase


class LocalStorage(StorageBase):
    name: str = "local_storage"

    def __init__(self, dir_path: Path | None = None, copy_flag: bool = True):
        self.files: list[RAGMindFile] = []
        self.hashes: Set[str] = set()
        self.copy_flag = copy_flag

        if dir_path is None:
            self.dir_path = Path(
                os.getenv("RAGMIND_LOCAL_STORAGE", "~/.cache/ragmind/files")
            )
        else:
            self.dir_path = dir_path
        os.makedirs(self.dir_path, exist_ok=True)

    def _load_files(self) -> None:
        # TODO: load existing files
        pass

    def nb_files(self) -> int:
        return len(self.files)

    def info(self):
        return {"directory_path": self.dir_path, **super().info()} # type: ignore

    async def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        dst_path = os.path.join(
            self.dir_path, str(file.brain_id), f"{file.id}{file.file_extension}"
        )

        if file.file_md5 in self.hashes and not exists_ok:
            raise FileExistsError(f"file {file.original_filename} already uploaded")

        if self.copy_flag:
            shutil.copy2(file.path, dst_path)
        else:
            os.symlink(file.path, dst_path)

        file.path = Path(dst_path)
        self.files.append(file)
        self.hashes.add(file.file_md5)

    async def get_files(self) -> list[RAGMindFile]:
        return self.files

    async def remove_file(self, file_id: UUID) -> None:
        raise NotImplementedError


class TransparentStorage(StorageBase):
    """Transparent Storage."""

    name: str = "transparent_storage"

    def __init__(self):
        self.id_files = {}

    async def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        self.id_files[file.id] = file

    def nb_files(self) -> int:
        return len(self.id_files)

    async def remove_file(self, file_id: UUID) -> None:
        raise NotImplementedError

    async def get_files(self) -> list[RAGMindFile]:
        return list(self.id_files.values())