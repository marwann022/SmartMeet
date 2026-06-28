from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI()
model = WhisperModel("small", device="cpu", compute_type="int8")

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...), task: str = "transcribe"):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name
    try:
        segments, info = model.transcribe(tmp_path, beam_size=5, task=task)
        transcript = " ".join(seg.text for seg in segments)
        return {"transcript": transcript, "language": info.language, "duration": info.duration}
    finally:
        os.unlink(tmp_path)

@app.get("/health")
async def health():
    return {"status": "ok"}
