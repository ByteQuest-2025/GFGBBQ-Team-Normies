import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/usermodels';
import {NextRequest,NextResponse} from 'next/server'

connect()

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json()
        const {username,address,password,role}=reqBody;
        // validation
        console.log(reqBody);
        const userExist = await User.findOne({username});
        
        if(userExist){
            return NextResponse.json({error: "User already exist"},{status : 400})
        }
        const newUser = new User({
            username,
            address,
            password,
            role
        })
        const savedUser = await newUser.save()

        console.log(savedUser);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error : any) {
        return NextResponse.json({error:error.message},{status: 500})
    }
}