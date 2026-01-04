import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/usermodels';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { username, password } = await request.json();

        // 1. Find user
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
        }

        // 2. Check Password 
        // Note: If you used bcrypt to sign up, use: await bcrypt.compare(password, user.password)
        const isPasswordCorrect = password === user.password; 
        
        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, error: "Invalid password" }, { status: 400 });
        }

        // 3. Return user data including the role
        return NextResponse.json({ 
            success: true, 
            role: user.role, 
            username: user.username 
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}