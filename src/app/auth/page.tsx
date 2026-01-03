"use client";
import { useClient, useConnection } from "wagmi";
import Header from "@/components/header";
import SignupForm from "@/components/signup";
export default function Login(){
    const { isConnected } = useConnection();
    console.log(isConnected)
    return (
        <div>
            {isConnected? (
                <div>connected</div>
            )
            :(
                <div className="flex justify-center align-middle"> <SignupForm /></div>
            )}
        </div>
    )
}