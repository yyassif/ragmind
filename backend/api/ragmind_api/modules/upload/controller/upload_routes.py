import os
from uuid import UUID
from typing import Optional

from ragmind_api.logger import get_logger
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from ragmind_api.celery_worker import process_file_and_notify
from ragmind_api.middlewares.auth import AuthBearer, get_current_user
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
from ragmind_api.modules.user.entity.user_identity import UserIdentity
from ragmind_api.packages.utils.telemetry import maybe_send_telemetry

logger = get_logger(__name__)
upload_router = APIRouter()

notification_service = NotificationService()
knowledge_service = KnowledgeService()


@upload_router.get("/upload/healthz", tags=["Health"])
async def healthz():
    return {"status": "ok"}


@upload_router.post("/upload", dependencies=[Depends(AuthBearer())], tags=["Upload"])
async def upload_file(
    uploadFile: UploadFile,
    bulk_id: Optional[UUID] = Query(None, description="The ID of the bulk upload"),
    brain_id: UUID = Query(..., description="The ID of the brain"),
    chat_id: Optional[UUID] = Query(None, description="The ID of the chat"),
    current_user: UserIdentity = Depends(get_current_user),
    integration: Optional[str] = None,
    integration_link: Optional[str] = None,
):
    validate_brain_authorization(
        brain_id, current_user.id, [RoleEnum.Editor, RoleEnum.Owner]
    )
    uploadFile.file.seek(0)

    upload_notification = notification_service.add_notification(
        CreateNotification(
            user_id=current_user.id,
            bulk_id=bulk_id,
            status=NotificationsStatusEnum.INFO,
            title=f"{uploadFile.filename}",
            category="upload",
            brain_id=str(brain_id),
        )
    )

    maybe_send_telemetry("upload_file", {"file_name": uploadFile.filename})
    file_content = await uploadFile.read()
    filename_with_brain_id = str(brain_id) + "/" + str(uploadFile.filename)

    try:
        upload_file_storage(file_content, filename_with_brain_id)

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
                detail=f"File {uploadFile.filename} already exists in storage.",
            )
        else:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload file to storage. {e}"
            )

    knowledge_to_add = CreateKnowledgeProperties(
        brain_id=brain_id,
        file_name=uploadFile.filename,
        extension=os.path.splitext(
            uploadFile.filename  # pyright: ignore reportPrivateUsage=none
        )[-1].lower(),
        integration=integration,
        integration_link=integration_link,
    )

    knowledge = knowledge_service.add_knowledge(knowledge_to_add)

    process_file_and_notify.delay( # type: ignore
        file_name=filename_with_brain_id,
        file_original_name=uploadFile.filename,
        brain_id=brain_id,
        notification_id=upload_notification.id,
        knowledge_id=knowledge.id,
        integration=integration,
        integration_link=integration_link,
    )
    return {"message": "File processing has started."}
