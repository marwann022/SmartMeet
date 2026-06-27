import fs from "fs/promises";
import path from "path";
import { transcribeAudio } from "../services/transcriptionService.js";

const testArabic = async () => {
    const audioPath = process.argv[2];
    if (!audioPath) {
        console.error("Please provide the path to an audio file. Example: node src/scripts/testArabicSTT.js uploads/audio/1782597777245-meeting-recording.wav");
        process.exit(1);
    }

    try {
        console.log(`Transcribing & translating file: ${audioPath} ...`);
        const result = await transcribeAudio(audioPath);
        console.log("\n--- RESULT ---");
        console.log("Detected Language:", result.language);
        console.log("Duration:", result.duration, "seconds");
        console.log("Transcript (English):", result.transcript);
        console.log("--------------\n");
    } catch (error) {
        console.error("Error during transcription:", error);
    }
};

testArabic();
