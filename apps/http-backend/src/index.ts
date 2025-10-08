import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {createUserSchema , signinSchema, createRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/clients";
const app = express();
app.use(express.json());
app.post("/signup", async(req,res) =>{
    const parsedData = createUserSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log(parsedData.error);
        return res.json({
            "message" : "Invalid inputs :)"
        })
        return;  
    }

    //todo : db call
    try{
        const user = await prismaClient.user.create({
            data:{
                email : parsedData.data?.username,
                password : parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId : user.id
        })
    }
    catch(e){
        res.status(411).json({
            message:"user already exists :)"
        })
    }
    
})

app.post("/signin", async (req,res) =>{
    const parsedData = signinSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            "message" : "Invalid inputs :)"
        })
        return;  
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email : parsedData.data.username,
            password : parsedData.data.password
        }
    })

    if(!user){
        res.status(411).json({
            message:"not authorized :("
        })
        return;
    }
    const token = jwt.sign({
        userId:user?.id
    },JWT_SECRET);

    res.json({
        token
    });
})

app.post("/room", middleware,async(req,res) =>{
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            "message" : "Invalid inputs :)"
        }) 
        return;  
    }
    try{
        const userId = req.userId;
        const room = await prismaClient.room.create({
            data:{
                slug : parsedData.data.name,
                adminId : userId
            }
        })

        res.json({
            roomId : room.id
        })
    }catch(e){
        res.status(411).json({
            message: "room already exists :)"
        })
    }
})

app.listen(3001);