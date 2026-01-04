import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    artistName: { type: String, required: true },
    songName: { type: String, required: true },
    lighthouseUri: { type: String, required: true }, // The JSON metadata link
    audioUrl: { type: String, required: true },     // The actual song link
    mintTxHash: { type: String, required: true },   // Proof of minting
    signerAddress: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.songs || mongoose.model("songs", songSchema);