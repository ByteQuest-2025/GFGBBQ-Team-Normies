import { NextResponse } from 'next/server';
import {connect }from '@/dbConfig/dbConfig' // Your DB connection helper
import Song from '@/models/songmodels';

export async function GET() {
  try {
    await connect();
    const songs = await Song.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, songs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch songs" }, { status: 500 });
  }
}