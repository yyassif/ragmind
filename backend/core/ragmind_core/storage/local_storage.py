import os
import shutil
from pathlib import Path
from uuid import UUID

from ragmind_core.storage.file import RAGMindFile
from ragmind_core.storage.storage_base import StorageBase


class LocalStorage(StorageBase):
    def __init__(self, dir_path: Path | None = None, copy_flag: bool = True):
        self.files: list[RAGMindFile] = []
        self.copy_flag = copy_flag

        if dir_path is None:
            self.dir_path = Path(
                os.getenv("RAGMIND_LOCAL_STORAGE", "~/.cache/ragmind/files")
            )
        else:
            self.dir_path = dir_path
        os.makedirs(self.dir_path, exist_ok=True)

    def _load_files(self) -> None:
        # TODO(@aminediro): load existing files
        pass

    def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        dst_path = os.path.join(
            self.dir_path, str(file.brain_id), f"{file.id}{file.file_extension}"
        )

        # TODO(@aminediro): Check hash of file not file path
        if os.path.exists(dst_path) and not exists_ok:
            raise FileExistsError("file already exists")

        if self.copy_flag:
            shutil.copy2(file.path, dst_path)
        else:
            os.symlink(file.path, dst_path)

        file.path = Path(dst_path)
        self.files.append(file)

    def get_files(self) -> list[RAGMindFile]:
        return self.files

    def remove_file(self, file_id: UUID) -> None:
        raise NotImplementedError


class TransparentStorage(StorageBase):
    """Transparent Storage.
    uses default

    """

    def __init__(self):
        self.files = []

    def upload_file(self, file: RAGMindFile, exists_ok: bool = False) -> None:
        self.files.append(file)

    def remove_file(self, file_id: UUID) -> None:
        raise NotImplementedError

    def get_files(self) -> list[RAGMindFile]:
        return self.files
