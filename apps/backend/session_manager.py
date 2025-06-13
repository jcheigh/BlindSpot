import uuid
from datetime import datetime, timedelta
from typing import Any, Dict

from core.goodfire_client import GoodfireBot
from core.config import settings
from core.utils import Logger
from core.distance import Distance
class UserSession:
    """Tracks a single game session for one user.

    Phases
    -------
    1. **Chat phase**  – user can send messages for ``chat_duration`` seconds
       *or* up to ``max_messages`` messages, whichever comes first.
    2. **Guess phase** – user gets ``max_guesses`` attempts to name the hidden
       concept.
    """
    def __init__(
                self,
                bot              : GoodfireBot,
                chat_duration_sec: int = settings.CHAT_DURATION_SEC,
                max_messages     : int = settings.MAX_MESSAGES,
                max_guesses      : int = settings.MAX_GUESSES,
                ):
        self.session_id: str   = str(uuid.uuid4())
        self.bot: GoodfireBot  = bot

        self.chat_duration = timedelta(seconds=chat_duration_sec)
        self.max_messages  = max_messages
        self.max_guesses   = max_guesses

        ### live state
        self._reset_chat_window()
        self._reset_guess_window()
        self.won = False
        Logger.info(f"New session {self.session_id} started")

    def _reset_chat_window(self) -> None:
        self.chat_start    = datetime.now()
        self.messages_sent = 0
        self.chat_closed   = False
        Logger.sub_step(f"Chat window reset for session {self.session_id}")

    def _reset_guess_window(self) -> None:
        self.guesses_left = self.max_guesses
        self.guess_closed = False
        Logger.sub_step(f"Guess window reset for session {self.session_id}")

    def _in_chat_window(self) -> bool:
        return (
            not self.chat_closed
            and datetime.now() - self.chat_start < self.chat_duration
            and self.messages_sent < self.max_messages
        )

    @staticmethod
    def _distance(a: str, b: str) -> int:
        return Distance.distance(a, b)

    async def send_message(self, prompt: str) -> Dict[str, str]:
        if not self._in_chat_window():
            self.chat_closed = True
            Logger.warning(f"Chat window closed – rejecting message for session {self.session_id}")
            return {"error": "chat_window_closed"}

        self.messages_sent += 1
        Logger.info(f"[Session {self.session_id}] USER ({self.messages_sent}/{self.max_messages}): {prompt}")
        try:
            resp = await self.bot.send_classified_chat(prompt)
        except Exception as exc:
            Logger.error(f"Bot error in session {self.session_id}: {exc}")
            return {"error" : f'chatbot error {exc}'}

        Logger.info(f"[Session {self.session_id}] ASSISTANT: {resp}")
        return {"message" : resp} 

    def send_guess(self, guess: str, threshold: int = 0.2) -> Dict[str, Any]:
        Logger.info(f"[Session {self.session_id}] GUESS: '{guess}'")

        if self.won:
            Logger.warning(f"Guess received after game already won (session {self.session_id})")
            return {"error": "game_already_won"}

        if self.guess_closed:
            Logger.warning(f"No guesses remaining for session {self.session_id}")
            return {"error": "no_guesses_remaining"}

        distance = self._distance(guess, self.bot.concept)
        correct  = distance <= threshold

        if correct:
            self.won = True
            self.guess_closed = True
            Logger.success(f"Correct guess in session {self.session_id} – distance {distance}")
            return {"correct": True, "targetConcept" : self.bot.concept}

        self.guesses_left -= 1
        Logger.info(f"Incorrect guess (distance {distance}). Guesses left: {self.guesses_left}")

        if self.guesses_left == 0:
            self.guess_closed = True
            Logger.warning(f"Game over for session {self.session_id}")
            return {
                "correct"       : False,
                "targetConcept" : self.bot.concept
            }

        return {
            "correct"       : False,
            "targetConcept" : self.bot.concept
        }
        
    @property
    def time_left(self) -> float:
        """Seconds remaining in the current chat window (0 if closed)."""
        if self.chat_closed:
            return 0.0
        remaining = self.chat_duration - (datetime.now() - self.chat_start)
        return max(0.0, remaining.total_seconds())
