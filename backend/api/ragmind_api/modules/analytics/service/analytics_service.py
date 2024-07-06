from ragmind_api.modules.analytics.repository.analytics import Analytics
from ragmind_api.modules.analytics.repository.analytics_interface import (
    AnalyticsInterface,
)


class AnalyticsService:
    repository: AnalyticsInterface

    def __init__(self):
        self.repository = Analytics() # type: ignore

    def get_brains_usages(self, user_id, graph_range, brain_id=None):

        return self.repository.get_brains_usages(user_id, graph_range, brain_id)
