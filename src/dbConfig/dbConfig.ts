import mongoose from "mongoose";

export async function connect(){
    try {

        mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI !)
        const connection=mongoose.connection
        connection.on('connected',()=>{
            console.log("Mongo connected")
            
    })
        connection.on('error',(err)=>{
            console.log("Mongo connection error, db is off : ", err);
            process.exit()
            
        })
    } catch (error) {
        console.log("Connection to db went wrong");
        console.log(error)
    }
}