from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from termcolor import colored
import uvicorn
from typing import Dict
import json
from models.grok_client import GrokClient

# Constants
HOST = "127.0.0.1"
PORT = 8003
TEMPLATES_DIR = "templates"
STATIC_DIR = "static"

try:
    app = FastAPI(title="Library Advisor", description="AI-powered library recommendation system")
    templates = Jinja2Templates(directory=TEMPLATES_DIR)
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    grok_client = GrokClient()
    print(colored("FastAPI app initialized successfully", "green"))
except Exception as e:
    print(colored(f"Error initializing app: {str(e)}", "red"))
    raise

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        print(colored(f"Error serving index page: {str(e)}", "red"))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/process-speech")
async def process_speech(speech_data: Dict):
    try:
        print(colored(f"Processing speech input: {speech_data['text'][:100]}...", "cyan"))
        response = await grok_client.get_library_recommendations(speech_data["text"])
        print(colored("Successfully received Grok response", "green"))
        
        return {"recommendations": response}
    except Exception as e:
        print(colored(f"Error processing speech: {str(e)}", "red"))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print(colored("Starting server...", "yellow"))
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True) 