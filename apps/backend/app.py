from fastapi import FastAPI
from session_manager import UserSession
from core.goodfire_client import GoodfireBot

app = FastAPI()
sessions: dict[str, UserSession] = {}

@app.get("/")
def hello_world():
    return {"msg": "Hello, World"}
    
@app.post("/start")
def start_game():
    bot = GoodfireBot(concept="Sports")                # ↩️  pick your concept
    session = UserSession(bot)
    sessions[session.session_id] = session
    return {"session_id": session.session_id}

@app.post("/chat/{session_id}")
def chat(session_id: str, prompt: str):
    session = sessions[session_id]
    return session.send_message(prompt)

@app.post("/guess/{session_id}")
def guess(session_id: str, guess: str):
    session = sessions[session_id]
    return session.make_guess(guess)

