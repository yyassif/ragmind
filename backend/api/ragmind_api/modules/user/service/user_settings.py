from ragmind_api.logger import get_logger
from ragmind_api.models.databases.supabase.supabase import SupabaseDB
from ragmind_api.models.settings import get_supabase_db
from ragmind_api.modules.user.entity.user_identity import UserIdentity

logger = get_logger(__name__)


class UserSettings(UserIdentity):
    def __init__(self, **data):
        super().__init__(**data)

    @property
    def supabase_db(self) -> SupabaseDB:
        return get_supabase_db()

    def get_models(self):
        """
        Fetch the user request stats from the database
        """
        request = self.supabase_db.get_models()
        return request

    def get_user_settings(self):
        """
        Fetch the user settings from the database
        """
        request = self.supabase_db.get_user_settings(self.id)
        return request
