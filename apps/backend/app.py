import random
from pydantic import BaseModel
from typing import List, Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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
class GuessRequest(BaseModel):
    guess: str 

class Message(BaseModel):
    role: Literal["user", "assistant", "system", "tool"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    message: str

@app.get("/")
def hello_world():
    Logger.success("Root endpoint hit")
    return {"msg": "Hello, World"}

@app.post("/start")
async def start_game(difficulty: Difficulty = Difficulty.EASY):
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
        "id"           : session.session_id,
        "difficulty"   : concept["difficulty"],
        "messages"     : [],  
        "targetConcept": concept,
        "guessCount"   : 0,
        "revealed"     : False
    }

@app.post("/chat/{session_id}", response_model=ChatResponse)
async def chat(session_id: str, chat_request: ChatRequest):
    session = sessions.get(session_id)
    if session is None:
        Logger.error(f"Chat attempt on unknown session_id={session_id}")
        raise HTTPException(status_code=404, detail="session not found")
    try:
        prompt = next((msg.content for msg in chat_request.messages[::-1] if msg.role == 'user'), None)

        if not prompt:
            raise HTTPException(status_code=422, detail='no user prompt found.')

        payload = await session.send_message(prompt)
    except Exception as e:
        Logger.error(f"Error in session {session_id}: {e}")
        raise HTTPException(status_code=502, detail=str(e))

    if "error" in payload:
        Logger.warning(f"[Session {session_id}] {payload['error']}")

        if "chatbot error" in payload['error']:
            raise HTTPException(status_code=502, detail=payload['error'])

    return payload
    

@app.post("/guess/{session_id}")
def guess(session_id: str, guess_in: GuessRequest):
    """
    Returns either {
            "correct"       : False,
            "targetConcept" : concept
        }
    or {"error" : {error_msg}}
    """
    session = sessions.get(session_id)
    if session is None:
        Logger.error(f"Guess attempt on unknown session_id={session_id}")
        raise HTTPException(status_code=404, detail="session not found")

    result = session.send_guess(guess_in.guess)

    if result.get("correct"):
        Logger.success(f"[Session {session_id}] Correct guess: '{guess_in.guess}'")
    elif result.get("error"):
        Logger.warning(f"[Session {session_id}] {result['error']}")
    else:
        Logger.info(f"[Session {session_id}] Incorrect guess '{guess_in.guess}'. ")

    return result

@app.post("/reveal/{session_id}")
def reveal_concept(session_id: str):
    session = sessions.get(session_id)
    if session is None:
        Logger.error(f"Reveal attempt on unknown session_id={session_id}")
        raise HTTPException(status_code=404, detail="session not found")

    Logger.info(f"[Session {session_id}] Revealing concept: {session.bot.concept}")
    session.revealed = True  

    return {"targetConcept": session.bot.concept}
