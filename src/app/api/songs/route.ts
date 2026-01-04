import { connect } from '@/dbConfig/dbConfig';
import Song from '@/models/songmodels';
import { NextRequest, NextResponse } from 'next/server';
import lighthouse from '@lighthouse-web3/sdk';

export async function POST(request: NextRequest) {
    try {
        await connect();
        const body = await request.json();
        const { artistName, songName, audioUrl, signerAddress, txHash, action } = body;

        // STEP 1: If action is 'upload', just handle Lighthouse
        if (action === "getUri") {
            const metadata = JSON.stringify({
                name: songName,
                artist: artistName,
                audio: audioUrl,
                description: "Zeno Master Token"
            });
            const uploadResponse = await lighthouse.uploadText(metadata, process.env.LIGHTHOUSE_API_KEY!);
            const uri = `https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`;
            return NextResponse.json({ success: true, uri });
        }

        // STEP 2: If action is 'save', store everything after successful mint
        const newSong = new Song({
            artistName,
            songName,
            audioUrl,
            lighthouseUri: body.lighthouseUri,
            mintTxHash: txHash,
            signerAddress
        });

        await newSong.save();
        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}