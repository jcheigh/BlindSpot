from core.config import settings
from core.goodfire_client import client, new_variant

print("Budget:", settings.CALL_BUDGET)
print("Goodfire base model:", settings.GOODFIRE_MODEL)

v = new_variant()
print("Variant created:", v)
