import goodfire

from core.config import get_settings

settings = get_settings()
client = goodfire.Client(api_key=settings.goodfire_key)
BASE_LLM = "meta-llama/Llama-3.3-70B-Instruct"


def new_variant() -> goodfire.Variant:
    """
    Return a *fresh* Variant cloned from the base model.
    Use per-session to keep edits isolated.
    """
    return goodfire.Variant(BASE_LLM)