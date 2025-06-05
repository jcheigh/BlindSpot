from fastapi import APIRouter, Body, Depends

from core.goodfire_client import client
from .deps import get_session, Session

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"msg": "pong"}


@router.post("/chat")
async def chat(
    prompt: str = Body(..., embed=True),  # expects {"prompt":"hi"}
    ses: Session = Depends(get_session),
):
    """Free-form probe: counts against call budget."""
    if ses.calls_left <= 0:
        return {"error": "call budget exhausted"}

    ses.calls_left -= 1
    resp = client.chat.completions.create(
        model=ses.variant,
        messages=[{"role": "user", "content": prompt}],
    )
    answer = resp.choices[0].message.content
    return {"reply": answer, "calls_left": ses.calls_left}