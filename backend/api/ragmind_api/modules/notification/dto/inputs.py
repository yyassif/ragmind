from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from ragmind_api.logger import get_logger
from ragmind_api.modules.notification.entity.notification import NotificationsStatusEnum

logger = get_logger("notification")

class CreateNotification(BaseModel):
    """Properties that can be received on notification creation"""

    user_id: UUID
    status: NotificationsStatusEnum
    title: str
    description: Optional[str] = None
    bulk_id: Optional[UUID] = None
    category: Optional[str] = None
    brain_id: Optional[str] = None

    def model_dump(self, *args, **kwargs):
        notification_dict = super().model_dump(*args, **kwargs)
        logger.debug("Notification Dict: %s", notification_dict)

        notification_dict["user_id"] = str(notification_dict["user_id"])
        if "bulk_id" in notification_dict:
            notification_dict["bulk_id"] = str(notification_dict["bulk_id"])
        return notification_dict


class NotificationUpdatableProperties(BaseModel):
    """Properties that can be received on notification update"""

    status: Optional[NotificationsStatusEnum]
    description: Optional[str]
