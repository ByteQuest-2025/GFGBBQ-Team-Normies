import { connect } from '@/dbConfig/dbConfig';
import Song from '@/models/songmodels';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        await connect();
        const body = await request.json();
        const { artist, song, audio, signerAddress, mintTxHash, action, lighthouseUri } = body;

        // STEP 1: Handle Metadata Upload (Switching to Pinata)
        if (action === "getUri") {
            const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
            
            const metadata = {
                name: `${song} - Metadata`,
                keyvalues: {
                    artist: artist,
                    platform: "Zeno"
                },
                content: {
                    name: song,
                    artist: artist,
                    audio: audio,
                    description: "Zeno Master Token Music NFT"
                }
            };

            const pinataRes = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                metadata.content, // We only pin the inner content
                {
                    headers: {
                        'Authorization': `Bearer ${pinataJwt}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Pinata returns the IpfsHash
            const uri = `https://gateway.pinata.cloud/ipfs/${pinataRes.data.IpfsHash}`;
            return NextResponse.json({ success: true, uri });
        }

        // STEP 2: Save to MongoDB
        const newSong = new Song({
            artistName: artist,
            songName: song,
            audioUrl: audio,
            lighthouseUri: lighthouseUri, // This will now store the Pinata link
            mintTxHash: mintTxHash,
            signerAddress: signerAddress
        });

        await newSong.save();
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("IPFS/DB Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Storage Provider Error: Check API Key or Quota" }, { status: 500 });
    }
}