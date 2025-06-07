import goodfire
from core.config import settings

client = goodfire.Client(api_key=settings.GOODFIRE_API_KEY)

def new_variant(model_id: str | None = None) -> goodfire.Variant:
    return goodfire.Variant(model_id or settings.GOODFIRE_MODEL)
