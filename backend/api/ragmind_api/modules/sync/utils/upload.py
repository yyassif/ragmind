from typing import Optional
from uuid import UUID
import os

from fastapi import HTTPException, UploadFile
from ragmind_api.celery_worker import process_file_and_notify
from ragmind_api.modules.brain.entity.brain_entity import RoleEnum
from ragmind_api.modules.brain.service.brain_authorization_service import (
    validate_brain_authorization,
)
from ragmind_api.modules.knowledge.dto.inputs import CreateKnowledgeProperties
from ragmind_api.modules.knowledge.service.knowledge_service import KnowledgeService
from ragmind_api.modules.notification.dto.inputs import (
    CreateNotification,
    NotificationUpdatableProperties,                                                                                                                                                                                                            
)
from ragmind_api.modules.notification.entity.notification import NotificationsStatusEnum
from ragmind_api.modules.notification.service.notification_service import (
    NotificationService,
)
from ragmind_api.modules.upload.service.upload_file import upload_file_storage
from ragmind_api.packages.utils.telemetry import maybe_send_telemetry

knowledge_service = KnowledgeService()
notification_service = NotificationService()


async def upload_file(
    upload_file: UploadFile,
    brain_id: UUID,
    current_user: str,
    bulk_id: Optional[UUID] = None,
):
    validate_brain_authorization(brain_id, current_user, [RoleEnum.Editor, RoleEnum.Owner])
    upload_notification = notification_service.add_notification(
        CreateNotification(
            user_id=current_user,
            bulk_id=bulk_id,
            status=NotificationsStatusEnum.INFO,
            title=f"{upload_file.filename}",
            category="sync",
            brain_id=str(brain_id),
        )
    )
    
    maybe_send_telemetry("upload_file", {"file_name": upload_file.filename})
    file_content = await upload_file.read()
    filename_with_brain_id = str(brain_id) + "/" + str(upload_file.filename)

    try:
        file_in_storage = upload_file_storage(file_content, filename_with_brain_id)

    except Exception as e:
        print(e)

        notification_service.update_notification_by_id(
            upload_notification.id if upload_notification else None,
            NotificationUpdatableProperties(
                status=NotificationsStatusEnum.ERROR,
                description=f"There was an error uploading the file: {e}",
            ),
        )
        if "The resource already exists" in str(e):
            raise HTTPException(
                status_code=403,
                detail=f"File {upload_file.filename} already exists in storage.",
            )
        else:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload file to storage. {e}"
            )

    knowledge_to_add = CreateKnowledgeProperties(
        brain_id=brain_id,
        file_name=upload_file.filename,
        extension=os.path.splitext(
            upload_file.filename  # pyright: ignore reportPrivateUsage=none
        )[-1].lower(),
    )

    added_knowledge = knowledge_service.add_knowledge(knowledge_to_add)

    process_file_and_notify.delay(
        file_name=filename_with_brain_id,
        file_original_name=upload_file.filename,
        brain_id=brain_id,
        notification_id=upload_notification.id,
        knowledge_id=added_knowledge.id,
    )
    return {"message": "File processing has started."}
