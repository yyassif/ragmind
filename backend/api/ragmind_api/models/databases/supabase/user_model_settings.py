from ragmind_api.logger import get_logger
from ragmind_api.models.databases.repository import Repository

logger = get_logger(__name__)


class UserModelSettings(Repository):
    def __init__(self, supabase_client):
        self.db = supabase_client

    def get_user_settings(self, user_id):
        """
        Fetch the user settings from the database
        """

        user_settings_response = (
            self.db.from_("user_settings")
            .select("*")
            .filter("user_id", "eq", str(user_id))
            .execute()
        ).data

        if len(user_settings_response) == 0:
            # Create the user settings
            user_settings_response = (
                self.db.table("user_settings")
                .insert({"user_id": str(user_id)})
                .execute()
            ).data

        if len(user_settings_response) == 0:
            raise ValueError("User settings could not be created")

        user_settings = user_settings_response[0]

        return user_settings

    def get_models(self):
        model_settings_response = (self.db.from_("models").select("*").execute()).data
        if len(model_settings_response) == 0:
            raise ValueError("An issue occured while fetching the model settings")
        return model_settings_response

    def get_user_monthly(self, user_id):
        pass

