"use client";
import { useClient, useConnection } from "wagmi";
import Header from "@/components/header";
import SignupForm from "@/components/signup";
export default function Login(){
    const { isConnected } = useConnection();
    console.log(isConnected)
    return (
        <div>

        
        <Header/>
        <div>
            {isConnected? (
                <div className="flex justify-center align-middle"> <SignupForm /></div>
            )
            :(
                <div className="flex justify-center align-middle">Please Connect Your Wallet Connect Wallet</div>
            )}
        </div>
        </div>
    )
}