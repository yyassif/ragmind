from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from ragmind_api.celery_worker import process_crawl_and_notify
from ragmind_api.logger import get_logger
from ragmind_api.middlewares.auth import AuthBearer, get_current_user
from ragmind_api.modules.brain.entity.brain_entity import RoleEnum
from ragmind_api.modules.brain.service.brain_authorization_service import (
    validate_brain_authorization,
)
from ragmind_api.modules.knowledge.dto.inputs import CreateKnowledgeProperties
from ragmind_api.modules.knowledge.service.knowledge_service import KnowledgeService
from ragmind_api.modules.notification.dto.inputs import CreateNotification
from ragmind_api.modules.notification.entity.notification import NotificationsStatusEnum
from ragmind_api.modules.notification.service.notification_service import (
    NotificationService,
)
from ragmind_api.modules.user.entity.user_identity import UserIdentity
from ragmind_api.packages.files.crawl.crawler import CrawlWebsite

logger = get_logger(__name__)
crawl_router = APIRouter()

notification_service = NotificationService()
knowledge_service = KnowledgeService()


@crawl_router.get("/crawl/healthz", tags=["Health"])
async def healthz():
    return {"status": "ok"}


@crawl_router.post("/crawl", dependencies=[Depends(AuthBearer())], tags=["Crawl"])
async def crawl_endpoint(
    request: Request,
    crawl_website: CrawlWebsite,
    brain_id: UUID = Query(..., description="The ID of the brain"),
    chat_id: Optional[UUID] = Query(None, description="The ID of the chat"),
    current_user: UserIdentity = Depends(get_current_user),
):
    """
    Crawl a website and process the crawled data.
    """
    validate_brain_authorization(brain_id, current_user.id, [RoleEnum.Editor, RoleEnum.Owner])
    upload_notification = notification_service.add_notification(
        CreateNotification(
            user_id=current_user.id,
            status=NotificationsStatusEnum.INFO,
            title=f"Processing Crawl {crawl_website.url}",
        )
    )

    knowledge_to_add = CreateKnowledgeProperties(
        brain_id=brain_id,
        url=crawl_website.url,
        extension="html",
    )

    added_knowledge = knowledge_service.add_knowledge(knowledge_to_add)
    logger.info(f"Knowledge {added_knowledge} added successfully")

    process_crawl_and_notify.delay( # type: ignore
        crawl_website_url=crawl_website.url,
        brain_id=brain_id,
        notification_id=upload_notification.id,
    )

    return {"message": "Crawl processing has started."}
