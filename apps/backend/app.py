from fastapi import FastAPI, HTTPException
from session_manager import UserSession
from pydantic import BaseModel
from core.goodfire_client import GoodfireBot
import goodfire 

app = FastAPI()
sessions: dict[str, UserSession] = {}
class ChatIn(BaseModel):
    prompt: str

@app.get("/")
def hello_world():
    return {"msg": "Hello, World"}
    
@app.post("/start")
async def start_game():
    bot = GoodfireBot(concept="Sports")
    session = UserSession(bot)
    sessions[session.session_id] = session
    return {"session_id": session.session_id}

@app.post("/chat/{session_id}")
async def chat(session_id: str, chat_in: ChatIn):
    session = sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="session not found")

    try:
        return await session.send_message(chat_in.prompt)
    except goodfire.exceptions.GoodfireException as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/guess/{session_id}")
def guess(session_id: str, guess: str):
    session = sessions[session_id]
    return session.make_guess(guess)

