from uuid import UUID
from ragmind_api.logger import get_logger
from ragmind_api.models.databases.llm_models import LLMModel

logger = get_logger(__name__)


class NullableUUID(UUID):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(v, values, **kwargs):
        logger.info(f"Validating UUID: {v}")
        if v == "":
            return None
        try:
            return UUID(v)
        except ValueError:
            return None

# TODO: Rewrite expected later
def find_model_and_generate_metadata(
    brain_model: str | None,
    user_settings,
    models_settings,
    default_model = "gpt-3.5-turbo-0125"
):
    model_to_use = LLMModel(
        name=default_model, max_input=4000, max_output=1000
    )

    logger.debug("Brain model: %s", brain_model)

    # If brain.model is None, set it to the default_model
    if brain_model is None:
        brain_model = default_model

    is_brain_model_available = any(
        brain_model == model_dict.get("name") for model_dict in models_settings
    )

    is_user_allowed_model = brain_model in user_settings.get(
        "models", [default_model]
    ) # Checks if the model is available in the list of models

    logger.debug(f"Brain model: {brain_model}")
    logger.debug(f"User models: {user_settings.get('models', [])}")
    logger.debug(f"Model available: {is_brain_model_available}")
    logger.debug(f"User allowed model: {is_user_allowed_model}")

    if is_brain_model_available and is_user_allowed_model:
        # Use the model from the brain
        model_to_use.name = brain_model
        for model_dict in models_settings:
            if model_dict.get("name") == model_to_use.name:
                model_to_use.max_input = model_dict.get("max_input")
                model_to_use.max_output = model_dict.get("max_output")
                break

    logger.info(f"Model to use: {model_to_use}")

    return model_to_use
