import { address } from '@/config/config';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/usermodels';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { username, password } = await request.json();

        const user = await User.findOne({ username });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

        const validPass = password;
        if (!validPass) return NextResponse.json({ error: "Invalid password" }, { status: 400 });

        return NextResponse.json({ message: "Login success", success: true, username: user.username, role : user.role }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}