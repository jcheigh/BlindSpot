import time, uuid, random, json, pathlib
from typing import Dict

from fastapi import Header, HTTPException

from core.goodfire_client import new_variant
from core.config           import get_settings
from core.goodfire_client  import client  # reuse global

_BUNDLE_PATH = pathlib.Path(__file__).resolve().parent.parent / "../../packages/shared/feature_bundles.json"
BUNDLES = json.loads(_BUNDLE_PATH.read_text())

settings = get_settings()
_SESSIONS: Dict[str, "Session"] = {}


class Session:
    """Holds one player's state."""

    def __init__(self):
        self.bundle = random.choice(list(BUNDLES.keys()))
        self.ids    = BUNDLES[self.bundle]
        self.variant = new_variant()
        # **Ablate** entire bundle
        self.variant.set({fid: 0.0 for fid in self.ids})
        self.calls_left = settings.call_budget
        self.grid = []
        self.started = time.time()


async def get_session(x_session: str | None = Header(None)) -> Session:
    """
    Dependency that auto-creates a session and returns 428 to client
    on first request. Subsequent calls must send X-Session header.
    """
    if x_session and (sess := _SESSIONS.get(x_session)):
        return sess

    new_id = uuid.uuid4().hex
    _SESSIONS[new_id] = Session()
    raise HTTPException(
        status_code=428,
        detail="Session created; resend with X-Session header.",
        headers={"X-Set-Session": new_id},
    )