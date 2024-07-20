from celery.result import AsyncResult
from ragmind_api.celery_config import celery
from ragmind_api.logger import get_logger
from ragmind_api.modules.knowledge.dto.inputs import KnowledgeStatus
from ragmind_api.modules.knowledge.service.knowledge_service import KnowledgeService
from ragmind_api.modules.notification.dto.inputs import NotificationUpdatableProperties
from ragmind_api.modules.notification.entity.notification import NotificationsStatusEnum
from ragmind_api.modules.notification.service.notification_service import NotificationService

logger = get_logger("notifier_service", "notifier_service.log")
notification_service = NotificationService()
knowledge_service = KnowledgeService()


def notifier(app):
    state = app.events.State()

    def handle_task_event(event):
        try:
            state.event(event)
            task = state.tasks.get(event["uuid"])
            task_result = AsyncResult(task.id, app=app)
            task_name, task_kwargs = task_result.name, task_result.kwargs

            if (
                task_name == "process_file_and_notify"
                or task_name == "process_crawl_and_notify"
            ):
                notification_id = task_kwargs["notification_id"]
                knowledge_id = task_kwargs.get("knowledge_id", None)
                if event["type"] == "task-failed":
                    logger.error(
                        f"task {task.id} process_file_and_notify {task_kwargs} failed. Sending notifition {notification_id}"
                    )
                    notification_service.update_notification_by_id(
                        notification_id,
                        NotificationUpdatableProperties(
                            status=NotificationsStatusEnum.ERROR,
                            description=(
                                f"An error occurred while processing the file"
                                if task_name == "process_file_and_notify"
                                else f"An error occurred while processing the URL"
                            ),
                        ),
                    )
                    if knowledge_id:
                        knowledge_service.update_status_knowledge(
                            knowledge_id, KnowledgeStatus.ERROR
                        )
                    logger.error(
                        f"task {task.id} process_file_and_notify {task_kwargs} failed. Updating knowledge {knowledge_id} to Error"
                    )

                if event["type"] == "task-succeeded":
                    logger.info(
                        f"task {task.id} process_file_and_notify {task_kwargs} succeeded. Sending notification {notification_id}"
                    )
                    notification_service.update_notification_by_id(
                        notification_id,
                        NotificationUpdatableProperties(
                            status=NotificationsStatusEnum.SUCCESS,
                            description=(
                                "Your file has been properly uploaded!"
                                if task_name == "process_file_and_notify"
                                else "Your URL has been properly crawled!"
                            ),
                        ),
                    )
                    if knowledge_id:
                        knowledge_service.update_status_knowledge(
                            knowledge_id, KnowledgeStatus.UPLOADED
                        )
                    logger.info(
                        f"task {task.id} process_file_and_notify {task_kwargs} failed. Updating knowledge {knowledge_id} to UPLOADED"
                    )
        except Exception as e:
            logger.exception(f"handling event {event} raised exception: {e}")

    with app.connection() as connection:
        recv = app.events.Receiver(
            connection,
            handlers={
                "task-failed": handle_task_event,
                "task-succeeded": handle_task_event,
            },
        )
        recv.capture(limit=None, timeout=None, wakeup=True)


if __name__ == "__main__":
    logger.info("Started RAGMind Notifier Notification...")
    notifier(celery)
