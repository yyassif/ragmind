from fastapi import APIRouter, Depends, Request
from ragmind_api.middlewares.auth import AuthBearer, get_current_user
from ragmind_api.modules.brain.service.brain_user_service import BrainUserService
from ragmind_api.modules.user.dto.inputs import UserUpdatableProperties
from ragmind_api.modules.user.entity.user_identity import UserIdentity
from ragmind_api.modules.user.repository.users import Users
from ragmind_api.modules.user.service.user_settings import UserSettings

user_router = APIRouter()
brain_user_service = BrainUserService()
user_repository = Users()


@user_router.get("/user", dependencies=[Depends(AuthBearer())], tags=["User"])
async def get_user_endpoint(
    request: Request, current_user: UserIdentity = Depends(get_current_user)
):
    user_settings_instance = UserSettings(
        id=current_user.id,
        email=current_user.email,
    )
    user_settings = user_settings_instance.get_user_settings()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "models": user_settings.get("models", []),
    }


@user_router.put(
    "/user/identity",
    dependencies=[Depends(AuthBearer())],
    tags=["User"],
)
def update_user_identity_route(
    user_identity_updatable_properties: UserUpdatableProperties,
    current_user: UserIdentity = Depends(get_current_user),
) -> UserIdentity:
    """
    Update user identity.
    """
    return user_repository.update_user_properties(
        current_user.id, user_identity_updatable_properties
    )


@user_router.get(
    "/user/identity",
    dependencies=[Depends(AuthBearer())],
    tags=["User"],
)
def get_user_identity_route(
    current_user: UserIdentity = Depends(get_current_user),
) -> UserIdentity:
    """
    Get user identity.
    """
    return user_repository.get_user_identity(current_user.id)


@user_router.delete(
    "/user_data",
    dependencies=[Depends(AuthBearer())],
    tags=["User"],
)
async def delete_user_data_route(
    current_user: UserIdentity = Depends(get_current_user),
):
    """
    Delete a user.

    - `user_id`: The ID of the user to delete.

    This endpoint deletes a user from the system.
    """

    user_repository.delete_user_data(str(current_user.id))

    return {"message": "User deleted successfully"}
