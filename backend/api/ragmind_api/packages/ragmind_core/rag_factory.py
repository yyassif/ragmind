from typing import Type

from ragmind_api.logger import get_logger
from ragmind_api.modules.brain.entity.integration_brain import IntegrationEntity
from ragmind_api.modules.brain.integrations.Big.Brain import BigBrain
from ragmind_api.modules.brain.integrations.GPT4.Brain import GPT4Brain
from ragmind_api.modules.brain.integrations.Multi_Contract.Brain import MultiContractBrain
from ragmind_api.modules.brain.integrations.Notion.Brain import NotionBrain
from ragmind_api.modules.brain.integrations.Proxy.Brain import ProxyBrain
from ragmind_api.modules.brain.integrations.Self.Brain import SelfBrain
from ragmind_api.modules.brain.integrations.SQL.Brain import SQLBrain
from ragmind_api.modules.brain.knowledge_brain_qa import KnowledgeBrainQA

logger = get_logger(__name__)


class RAGServiceFactory:
    integration_list: dict[str, Type[KnowledgeBrainQA]] = {
        "notion": NotionBrain,
        "gpt4": GPT4Brain,
        "sql": SQLBrain,
        "big": BigBrain,
        "doc": KnowledgeBrainQA,
        "proxy": ProxyBrain,
        "self": SelfBrain,
        "multi-contract": MultiContractBrain,
    }

    def get_brain_cls(self, integration: IntegrationEntity):
        pass
