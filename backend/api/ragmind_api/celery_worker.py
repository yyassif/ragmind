import os
from tempfile import NamedTemporaryFile
from uuid import UUID

from celery.schedules import crontab
from ragmind_api.celery_config import celery
from ragmind_api.logger import get_logger
from ragmind_api.middlewares.auth.auth_bearer import AuthBearer
from ragmind_api.models.files import File
from ragmind_api.models.settings import get_supabase_client
from ragmind_api.modules.brain.integrations.Notion.Notion_connector import NotionConnector
from ragmind_api.modules.brain.service.brain_service import BrainService
from ragmind_api.modules.brain.service.brain_vector_service import BrainVectorService
from ragmind_api.modules.knowledge.dto.inputs import KnowledgeStatus
from ragmind_api.modules.knowledge.service.knowledge_service import KnowledgeService
from ragmind_api.modules.notification.dto.inputs import NotificationUpdatableProperties
from ragmind_api.modules.notification.entity.notification import NotificationsStatusEnum
from ragmind_api.modules.notification.service.notification_service import NotificationService
from ragmind_api.modules.onboarding.service.onboarding_service import OnboardingService
from ragmind_api.packages.files.crawl.crawler import CrawlWebsite, slugify
from ragmind_api.packages.files.parsers.github import process_github
from ragmind_api.packages.files.processors import filter_file
from ragmind_api.packages.utils.telemetry import maybe_send_telemetry

logger = get_logger(__name__)

onboardingService = OnboardingService()
notification_service = NotificationService()
brain_service = BrainService()
auth_bearer = AuthBearer()


@celery.task(name="process_file_and_notify")
def process_file_and_notify(
    file_name: str,
    file_original_name: str,
    brain_id,
    notification_id=None,
    integration=None,
    delete_file=False,
    knowledge_id: UUID | None = None,
):
    try:
        supabase_client = get_supabase_client()
        tmp_name = file_name.replace("/", "_")
        base_file_name = os.path.basename(file_name)
        _, file_extension = os.path.splitext(base_file_name)

        with NamedTemporaryFile(
            suffix="_" + tmp_name,  # pyright: ignore reportPrivateUsage=none
        ) as tmp_file:
            res = supabase_client.storage.from_("ragmind").download(file_name)
            tmp_file.write(res)
            tmp_file.flush()
            file_instance = File(
                file_name=base_file_name,
                tmp_file_path=tmp_file.name,
                bytes_content=res,
                file_size=len(res),
                file_extension=file_extension,
            )
            brain_vector_service = BrainVectorService(brain_id)
            knowledge_service = KnowledgeService()
            if delete_file:  # TODO fix bug
                brain_vector_service.delete_file_from_brain(
                    file_original_name, only_vectors=True
                )

            filter_file(
                file=file_instance,
                brain_id=brain_id,
                original_file_name=file_original_name,
            )

            if notification_id:
                notification_service.update_notification_by_id(
                    notification_id,
                    NotificationUpdatableProperties(
                        status=NotificationsStatusEnum.SUCCESS,
                        description="Your file has been properly uploaded!",
                    ),
                )
            if knowledge_id:
                knowledge_service.update_status_knowledge(
                    knowledge_id, KnowledgeStatus.UPLOADED
                )
            brain_service.update_brain_last_update_time(brain_id)

            return True

    except TimeoutError:
        logger.error("TimeoutError")

    except Exception as e:
        logger.exception(e)
        notification_service.update_notification_by_id(
            notification_id,
            NotificationUpdatableProperties(
                status=NotificationsStatusEnum.ERROR,
                description=f"An error occurred while processing the file: {e}",
            ),
        )
        if knowledge_id:
            knowledge_service.update_status_knowledge(
                knowledge_id, KnowledgeStatus.ERROR
            )


@celery.task(name="process_crawl_and_notify")
def process_crawl_and_notify(
    crawl_website_url: str,
    brain_id: UUID,
    notification_id=None,
):
    crawl_website = CrawlWebsite(url=crawl_website_url)

    if not crawl_website.checkGithub():
        # Build file data
        extracted_content = crawl_website.process()
        extracted_content_bytes = extracted_content.encode("utf-8")
        file_name = slugify(crawl_website.url) + ".txt"

        with NamedTemporaryFile(
            suffix="_" + file_name,  # pyright: ignore reportPrivateUsage=none
        ) as tmp_file:
            tmp_file.write(extracted_content_bytes)
            tmp_file.flush()
            file_instance = File(
                file_name=file_name,
                tmp_file_path=tmp_file.name,
                bytes_content=extracted_content_bytes,
                file_size=len(extracted_content),
                file_extension=".txt",
            )
            filter_file(
                file=file_instance,
                brain_id=brain_id,
                original_file_name=crawl_website_url,
            )
            notification_service.update_notification_by_id(
                notification_id,
                NotificationUpdatableProperties(
                    status=NotificationsStatusEnum.SUCCESS,
                    description="Your URL has been properly crawled!",
                ),
            )
    else:
        process_github(
            repo=crawl_website.url,
            brain_id=brain_id,
        )

    if notification_id:
        notification_service.update_notification_by_id(
            notification_id,
            NotificationUpdatableProperties(
                status=NotificationsStatusEnum.SUCCESS,
                description="Your file has been properly uploaded!",
            ),
        )

    brain_service.update_brain_last_update_time(brain_id)
    return True


@celery.task
def remove_onboarding_more_than_x_days_task():
    onboardingService.remove_onboarding_more_than_x_days(7)


@celery.task(name="NotionConnectorLoad")
def process_integration_brain_created_initial_load(brain_id, user_id):
    notion_connector = NotionConnector(brain_id=brain_id, user_id=user_id)

    pages = notion_connector.load()

    print("pages: ", len(pages))


@celery.task
def process_integration_brain_sync_user_brain(brain_id, user_id):
    notion_connector = NotionConnector(brain_id=brain_id, user_id=user_id)

    notion_connector.poll()


@celery.task
def ping_telemetry():
    maybe_send_telemetry("ping", {"ping": "pong"})


celery.conf.beat_schedule = {
    "remove_onboarding_more_than_x_days_task": {
        "task": f"{__name__}.remove_onboarding_more_than_x_days_task",
        "schedule": crontab(minute="0", hour="0"),
    },
    "ping_telemetry": {
        "task": f"{__name__}.ping_telemetry",
        "schedule": crontab(minute="*/30", hour="*"),
    },
    "process_sync_active": {
        "task": "process_sync_active",
        "schedule": crontab(minute="*/1", hour="*"),
    },
}
