import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from core.goodfire_client import GoodfireBot

class UserSession:
    """
    Tracks a single game session for one user.

    Phases
    ------
    1. Chat phase     – user can send messages for `chat_duration`
                        or up to `max_messages`, whichever hits first.
    2. Guess phase    – user gets `max_guesses` attempts to name the topic.
                        If they fail and `allow_second_try` is True, we give
                        them one more identical chat/guess cycle.
    """

    # ── configuration defaults (tweak to taste) ───────────────────────────────
    CHAT_DURATION_SEC = 60            # 1-minute chat window
    MAX_MESSAGES      = 10            # or cap on # messages instead
    MAX_GUESSES       = 3
    ALLOW_SECOND_TRY  = True
    # ───────────────────────────────────────────────────────────────────────────

    # -------------------------------------------------------------------------
    # Construction
    # -------------------------------------------------------------------------
    def __init__(
        self,
        bot: GoodfireBot,
        chat_duration_sec: int = CHAT_DURATION_SEC,
        max_messages: int      = MAX_MESSAGES,
        max_guesses: int       = MAX_GUESSES,
        allow_second_try: bool = ALLOW_SECOND_TRY,
    ):
        self.session_id: str           = str(uuid.uuid4())
        self.bot: GoodfireBot          = bot

        self.chat_duration = timedelta(seconds=chat_duration_sec)
        self.max_messages  = max_messages
        self.max_guesses   = max_guesses
        self.allow_second_try = allow_second_try

        # live state ----------------------------------------------------------
        self._reset_chat_window()
        self._reset_guess_window()

        # bookkeeping
        self.second_try_used = False
        self.won             = False

    # -------------------------------------------------------------------------
    # Helpers
    # -------------------------------------------------------------------------
    def _reset_chat_window(self) -> None:
        self.chat_start  = datetime.utcnow()
        self.messages_sent = 0
        self.chat_closed   = False

    def _reset_guess_window(self) -> None:
        self.guesses_left   = self.max_guesses
        self.guess_closed   = False

    def _in_chat_window(self) -> bool:
        return (
            not self.chat_closed
            and datetime.utcnow() - self.chat_start < self.chat_duration
            and self.messages_sent < self.max_messages
        )

    @staticmethod
    def _distance(a: str, b: str) -> int:
        """
        Replace with Levenshtein or embedding similarity if you need
        something fancier. Return 0 for perfect match.
        """
        return 0 if a.strip().lower() == b.strip().lower() else 1

    # -------------------------------------------------------------------------
    # Public API – call these from your endpoints
    # -------------------------------------------------------------------------
    async def send_message(self, prompt: str):
        if not self._in_chat_window():
            self.chat_closed = True
            return {"error": "chat_window_closed"}

        self.messages_sent += 1
        resp = await self.bot.send_classified_chat(prompt)
        return {"assistant_response": resp}

    def make_guess(self, guess: str, threshold: int = 0) -> Dict[str, Any]:
        """
        Evaluate a guess against the hidden topic.
        """
        if self.won:
            return {"error": "game_already_won"}

        if self.guess_closed:
            return {"error": "no_guesses_remaining"}

        # --- scoring ---------------------------------------------------------
        distance = self._distance(guess, self.bot.concept)
        correct  = distance <= threshold

        if correct:
            self.won = True
            self.guess_closed = True
            return {"result": "correct", "distance": distance}

        # incorrect guess
        self.guesses_left -= 1
        if self.guesses_left == 0:
            # first failure – maybe grant a second try
            if self.allow_second_try and not self.second_try_used:
                self.second_try_used = True
                self._reset_chat_window()
                self._reset_guess_window()
                return {"result": "incorrect", "distance": distance,
                        "second_try": True}
            # no more guesses – game over
            self.guess_closed = True
            return {"result": "incorrect", "distance": distance,
                    "game_over": True}

        return {"result": "incorrect", "distance": distance,
                "guesses_left": self.guesses_left}

    # -------------------------------------------------------------------------
    # Convenience getters
    # -------------------------------------------------------------------------
    @property
    def time_left(self) -> float:
        """
        Seconds remaining in the current chat window (0 if closed).
        """
        if self.chat_closed:
            return 0.0
        remaining = self.chat_duration - (datetime.utcnow() - self.chat_start)
        return max(0.0, remaining.total_seconds())

    def summary(self) -> Dict[str, Any]:
        """
        Serialize minimal public state (handy for front-end polling).
        """
        return {
            "session_id":     self.session_id,
            "won":            self.won,
            "messages_sent":  self.messages_sent,
            "time_left_sec":  self.time_left,
            "guesses_left":   self.guesses_left,
            "second_try_used": self.second_try_used,
        }
