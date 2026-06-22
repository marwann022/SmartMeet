import fs from "fs";
import { chunkTranscript } from "./services/ragService.js";

const meetings = JSON.parse(
  fs.readFileSync("./src/data/meetings.json", "utf-8")
);

const chunks = chunkTranscript(
  meetings[0].transcript
);

console.log(chunks);