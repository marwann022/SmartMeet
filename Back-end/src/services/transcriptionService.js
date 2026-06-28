import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const audioExtensions = new Set([".mp3", ".wav"]);

export const extractAudioIfNeeded = async (recordingPath) => {
    const ext = path.extname(recordingPath).toLowerCase();
    if (audioExtensions.has(ext)) return recordingPath;

    const audioDir = path.join("uploads", "audio");
    await fs.mkdir(audioDir, { recursive: true });
    const outputPath = path.join(audioDir, `${path.basename(recordingPath, ext)}.wav`);

    await runFfmpeg([
        "-y",
        "-i",
        recordingPath,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        outputPath,
    ]);

    return outputPath;
};

export const transcribeAudio = async (audioPath, task = "transcribe") => {
    const baseUrl = process.env.STT_SERVICE_URL || "http://localhost:8001/transcribe";
    const serviceUrl = `${baseUrl}?task=${task}`;
    const buffer = await fs.readFile(audioPath);
    const form = new FormData();
    form.append("audio", new Blob([buffer]), path.basename(audioPath));

    const response = await fetch(serviceUrl, {
        method: "POST",
        body: form,
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Transcription service failed (${response.status}): ${body}`);
    }

    const data = await response.json();
    if (!data.transcript) throw new Error("Transcription service returned an empty transcript");
    return data;
};

const runFfmpeg = (args) => new Promise((resolve, reject) => {
    const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
    const ffmpeg = spawn(ffmpegPath, args);
    let stderr = "";

    ffmpeg.stderr.on("data", (data) => {
        stderr += data.toString();
    });

    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
        if (code === 0) return resolve();
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
    });
});
