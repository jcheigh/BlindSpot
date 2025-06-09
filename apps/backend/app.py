import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from session_manager import UserSession
from core.goodfire_client import GoodfireBot
from core.utils import Logger
from core.concepts import CONCEPTS, Difficulty
from core.config import settings

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: dict[str, UserSession] = {}
class ChatIn(BaseModel):
    prompt: str
    
@app.get("/")
def hello_world():
    Logger.success("Root endpoint hit")
    return {"msg": "Hello, World"}

@app.post("/start")
async def start_game(difficulty: Difficulty = Difficulty.EASY):
    """
    Create a new *UserSession* and return its ID.
    TODO: randomize concept, add difficulties
    """
    candidates = [c for c in CONCEPTS if c["difficulty"] == difficulty]
    if not candidates:
        raise HTTPException(status_code=500, detail="No concepts available for that difficulty.")

    concept = random.choice(candidates)
    Logger.step(f"Starting game with concept: {concept['name']} ({concept['difficulty']})")

    bot = GoodfireBot(concept=concept["name"])
    session = UserSession(bot)
    sessions[session.session_id] = session

    Logger.success(f"Game started – session_id={session.session_id}")
    return {
        "id": session.session_id,
        "difficulty": concept["difficulty"],
        "startTime": session.chat_start.isoformat(),
        "messages": [],  
        "targetConcept": concept,
        "guessCount": 0,
        "revealed": False,
    }

@app.post("/chat/{session_id}")
async def chat(session_id: str, chat_in: ChatIn):
    """Send a user message within the chat window."""
    session = sessions.get(session_id)
    if session is None:
        Logger.error(f"Chat attempt on unknown session_id={session_id}")
        raise HTTPException(status_code=404, detail="session not found")
    try:
        payload = await session.send_message(chat_in.prompt)
    except Exception as e:
        Logger.error(f"Error in session {session_id}: {e}")
        raise HTTPException(status_code=502, detail=str(e))

    if "error" in payload:
        # session handles window‑closed logic internally
        Logger.warning(f"[Session {session_id}] {payload['error']}")

    return payload

@app.post("/guess/{session_id}")
def guess(session_id: str, guess: str):
    """Submit a guess for the hidden concept."""
    session = sessions.get(session_id)
    if session is None:
        Logger.error(f"Guess attempt on unknown session_id={session_id}")
        raise HTTPException(status_code=404, detail="session not found")

    result = session.send_guess(guess)

    # --- logging --------------------------------------------------------
    if result.get("result") == "correct":
        Logger.success(f"[Session {session_id}] Correct guess: '{guess}'")
    elif result.get("game_over"):
        Logger.warning(f"[Session {session_id}] Game over – last guess '{guess}'")
    elif result.get("error"):
        Logger.warning(f"[Session {session_id}] {result['error']}")
    else:
        Logger.info(
            f"[Session {session_id}] Incorrect guess '{guess}'. "
            f"Guesses left: {result.get('guesses_left')}"
        )

    return result
