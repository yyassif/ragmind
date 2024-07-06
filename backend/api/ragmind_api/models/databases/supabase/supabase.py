from ragmind_api.models.databases.supabase import (
    BrainSubscription,
    File,
    UserModelSettings,
    Vector,
)


# TODO: REMOVE THIS CLASS !
class SupabaseDB(
    UserModelSettings,
    File,
    BrainSubscription,
    Vector,
):
    def __init__(self, supabase_client):
        self.db = supabase_client
        UserModelSettings.__init__(self, supabase_client)
        File.__init__(self, supabase_client)
        BrainSubscription.__init__(self, supabase_client)
        Vector.__init__(self, supabase_client)
