from ragmind_core.processor.processor_base import ProcessorBase
from ragmind_core.processor.txt_parser import TxtProcessor

DEFAULT_PARSERS: dict[str, ProcessorBase] = {
    ".txt": TxtProcessor(),
}
