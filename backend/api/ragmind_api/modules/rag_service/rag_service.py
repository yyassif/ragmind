import datetime
from uuid import UUID, uuid4

from ragmind_api.logger import get_logger
from ragmind_api.models.settings import (
    get_embedding_client,
    get_supabase_client,
    settings,
)
from ragmind_api.modules.brain.entity.brain_entity import BrainEntity
from ragmind_api.modules.brain.service.brain_service import BrainService
from ragmind_api.modules.brain.service.utils.format_chat_history import (
    format_chat_history,
)
from ragmind_api.modules.chat.controller.chat.utils import (
    find_model_and_generate_metadata,
)
from ragmind_api.modules.chat.dto.inputs import CreateChatHistory
from ragmind_api.modules.chat.dto.outputs import GetChatHistoryOutput
from ragmind_api.modules.chat.service.chat_service import ChatService
from ragmind_api.modules.knowledge.repository.knowledges import KnowledgeRepository
from ragmind_api.modules.prompt.entity.prompt import Prompt
from ragmind_api.modules.prompt.service.prompt_service import PromptService
from ragmind_api.modules.rag_service.utils import generate_source
from ragmind_api.modules.user.entity.user_identity import UserIdentity
from ragmind_api.modules.user.service.user_settings import UserSettings
from ragmind_api.vectorstore.supabase import CustomSupabaseVectorStore
from ragmind_core.chat import ChatHistory as ChatHistoryCore
from ragmind_core.config import LLMEndpointConfig, RAGConfig
from ragmind_core.llm.llm_endpoint import LLMEndpoint
from ragmind_core.models import ParsedRAGResponse, RAGResponseMetadata
from ragmind_core.ragmind_rag import RAGMindQARAG

logger = get_logger(__name__)


class RAGService:
    def __init__(
        self,
        current_user: UserIdentity,
        brain_id: UUID | None,
        chat_id: UUID,
        brain_service: BrainService,
        prompt_service: PromptService,
        chat_service: ChatService,
        knowledge_service: KnowledgeRepository,
    ):
        # Services
        self.brain_service = brain_service
        self.prompt_service = prompt_service
        self.chat_service = chat_service
        self.knowledge_service = knowledge_service

        # Base models
        self.current_user = current_user
        self.chat_id = chat_id
        self.brain = self.get_or_create_brain(brain_id, self.current_user.id)
        self.prompt = self.get_brain_prompt(self.brain)

        # check at init time
        self.model_to_use = self.retrieve_model_to_use(self.current_user, self.brain)

    def get_brain_prompt(self, brain: BrainEntity) -> Prompt | None:
        return (
            self.prompt_service.get_prompt_by_id(brain.prompt_id)
            if brain.prompt_id
            else None
        )

    def _build_chat_history(
        self,
        history: list[GetChatHistoryOutput],
    ) -> ChatHistoryCore:
        transformed_history = format_chat_history(history)
        chat_history = ChatHistoryCore(
            brain_id=self.brain.brain_id, chat_id=self.chat_id
        )

        [chat_history.append(m) for m in transformed_history]
        return chat_history

    def _build_rag_config(self) -> RAGConfig:
        ollama_url = (
            settings.ollama_api_base_url
            if settings.ollama_api_base_url
            and self.model_to_use.name.startswith("ollama")
            else None
        )

        rag_config = RAGConfig(
            llm_config=LLMEndpointConfig(
                model=self.model_to_use.name,
                llm_base_url=ollama_url,
                llm_api_key="abc-123" if ollama_url else None,
                temperature=(
                    self.brain.temperature
                    if self.brain.temperature
                    else LLMEndpointConfig.model_fields["temperature"].default
                ),
                max_input=self.model_to_use.max_input,
                max_tokens=(
                    self.brain.max_tokens
                    if self.brain.max_tokens
                    else LLMEndpointConfig.model_fields["max_tokens"].default
                ),
            ),
            prompt=self.prompt.content if self.prompt else None,
        )
        return rag_config

    def get_llm(self, rag_config: RAGConfig):
      return LLMEndpoint.from_config(rag_config.llm_config)
    
    def get_or_create_brain(self, brain_id: UUID | None, user_id: UUID) -> BrainEntity:
        brain = None
        if brain_id is not None:
            brain = self.brain_service.get_brain_details(brain_id, user_id)

        # TODO: Create if doesn't exist
        assert brain

        if brain.integration:
            # TODO: entity should be UUID
            assert brain.integration.user_id == str(user_id)
        return brain

    def retrieve_model_to_use(self, user: UserIdentity, brain: BrainEntity):
        user_settings = UserSettings(id=user.id, email=user.email)
        all_models = user_settings.get_models()

        model_to_use = find_model_and_generate_metadata(
            brain.model,
            user_settings.get_user_settings(),
            all_models,
        )
        return model_to_use

    def create_vector_store(
        self, brain_id: UUID, max_input: int
    ) -> CustomSupabaseVectorStore:
        supabase_client = get_supabase_client()
        embeddings = get_embedding_client()
        return CustomSupabaseVectorStore(
            supabase_client,
            embeddings,
            table_name="vectors",
            brain_id=brain_id,
            max_input=max_input,
        )

    def save_answer(self, question: str, answer: ParsedRAGResponse):
        return self.chat_service.update_chat_history(
            CreateChatHistory(
                **{
                    "chat_id": self.chat_id,
                    "user_message": question,
                    "assistant": answer.answer,
                    "brain_id": self.brain.brain_id,
                    # TODO: prompt_id should always be not None
                    "prompt_id": self.prompt.id if self.prompt else None,
                    "metadata": answer.metadata.model_dump() if answer.metadata else {},
                }
            )
        )

    async def generate_answer(
        self,
        question: str,
    ):
        logger.info(
            f"Creating question for chat {self.chat_id} with brain {self.brain.brain_id}"
        )
        rag_config = self._build_rag_config()
        logger.debug(f"generate_answer with config : {rag_config.model_dump()}")

        history = await self.chat_service.get_chat_history(self.chat_id)
        # Get list of files
        list_files = self.knowledge_service.get_all_knowledge_in_brain(
            self.brain.brain_id
        )
        # Build RAG dependencies to inject
        vector_store = self.create_vector_store(
            self.brain.brain_id, rag_config.llm_config.max_input
        )
        llm = self.get_llm(rag_config)
        # Initialize the RAG pipline
        rag_pipeline = RAGMindQARAG(
            rag_config=rag_config, llm=llm, vector_store=vector_store
        )
        #  Format the history, sanitize the input
        chat_history = self._build_chat_history(history)

        parsed_response = rag_pipeline.answer(question, chat_history, list_files)

        # Save the answer to db
        new_chat_entry = self.save_answer(question, parsed_response)

        # Format output to be correct
        return GetChatHistoryOutput(
            **{
                "chat_id": self.chat_id,
                "user_message": question,
                "assistant": parsed_response.answer,
                "message_time": new_chat_entry.message_time,
                "prompt_title": (self.prompt.title if self.prompt else None),
                "brain_name": self.brain.name if self.brain else None,
                "message_id": new_chat_entry.message_id,
                "brain_id": str(self.brain.brain_id) if self.brain else None,
                "metadata": (
                    parsed_response.metadata.model_dump()
                    if parsed_response.metadata
                    else {}
                ),
            }
        )

    async def generate_answer_stream(
        self,
        question: str,
    ):
        logger.info(
            f"Creating question for chat {self.chat_id} with brain {self.brain.brain_id} "
        )
        # Build the rag config
        rag_config = self._build_rag_config()

        # Getting chat history
        history = await self.chat_service.get_chat_history(self.chat_id)
        
        #  Format the history, sanitize the input
        chat_history = self._build_chat_history(history)

        # Get list of files urls
        # TODO: Why do we get ALL the files ?
        list_files = self.knowledge_service.get_all_knowledge_in_brain(
            self.brain.brain_id
        )
        llm = self.get_llm(rag_config)
        vector_store = self.create_vector_store(
            self.brain.brain_id, rag_config.llm_config.max_input
        )
        # Initialize the rag pipline
        rag_pipeline = RAGMindQARAG(
            rag_config=rag_config, llm=llm, vector_store=vector_store
        )

        full_answer = ""

        message_metadata = {
            "chat_id": self.chat_id,
            "message_id": uuid4(),  # do we need it ?,
            "user_message": question,  # TODO: define result
            "message_time": datetime.datetime.now(),  # TODO: define result
            "prompt_title": (self.prompt.title if self.prompt else ""),
            "brain_name": self.brain.name if self.brain else None,
            "brain_id": self.brain.brain_id if self.brain else None,
        }

        async for response in rag_pipeline.answer_astream(
            question, chat_history, list_files
        ):
            # Format output to be correct servicedf;j
            if not response.last_chunk:
                streamed_chat_history = GetChatHistoryOutput(
                    assistant=response.answer,
                    metadata=response.metadata.model_dump(),
                    **message_metadata,
                )
                full_answer += response.answer
                yield f"data: {streamed_chat_history.model_dump_json()}"

        # For last chunk  parse the sources, and the full answer
        streamed_chat_history = GetChatHistoryOutput(
            assistant=response.answer, # type: ignore
            metadata=response.metadata.model_dump(), # type: ignore
            **message_metadata,
        )

        sources_urls = generate_source(
            response.metadata.sources, # type: ignore
            self.brain.brain_id,
            (
                streamed_chat_history.metadata["citations"]
                if streamed_chat_history.metadata
                else None
            ),
        )
        if streamed_chat_history.metadata:
            streamed_chat_history.metadata["sources"] = sources_urls

        self.save_answer(
            question,
            ParsedRAGResponse(
                answer=full_answer,
                metadata=RAGResponseMetadata(**streamed_chat_history.metadata), # type: ignore
            ),
        )
        yield f"data: {streamed_chat_history.model_dump_json()}"
