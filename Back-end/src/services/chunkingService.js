const normalizeWhitespace = (text) => text.replace(/\s+/g, " ").trim();

const estimateTokens = (text) => Math.ceil(text.length / 4);

export const chunkTranscript = (transcript, options = {}) => {
    const chunkSize = options.chunkSize || 3000;
    const overlap = options.overlap || 350;
    const cleaned = normalizeWhitespace(transcript || "");
    const chunks = [];

    if (!cleaned) return chunks;

    let start = 0;
    let index = 0;

    while (start < cleaned.length) {
        let end = Math.min(start + chunkSize, cleaned.length);

        if (end < cleaned.length) {
            const sentenceBoundary = cleaned.lastIndexOf(". ", end);
            const lineBoundary = cleaned.lastIndexOf("\n", end);
            const boundary = Math.max(sentenceBoundary, lineBoundary);
            if (boundary > start + chunkSize * 0.6) end = boundary + 1;
        }

        const text = cleaned.slice(start, end).trim();
        if (text) {
            chunks.push({
                index,
                text,
                startChar: start,
                endChar: end,
                tokenEstimate: estimateTokens(text),
            });
            index += 1;
        }

        if (end === cleaned.length) break;
        start = Math.max(0, end - overlap);
    }

    return chunks;
};

export const chunkForAnalysis = (transcript, options = {}) => {
    return chunkTranscript(transcript, {
        chunkSize: options.chunkSize || 9000,
        overlap: options.overlap || 500,
    });
};
