import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {createUserSchema , signinSchema, createRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/clients";
const app = express();

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
        await prismaClient.user.create({
            data:{
                email : parsedData.data?.username,
                password : parsedData.data.password,
                name: parsedData.data.name
            }
        })
    }
    catch(e){
        res.status(411).json({
            message:"user already exists :)"
        })
    }
    res.json({
        userId : "123"
    })
})

app.post("/signin", (req,res) =>{
    const parsedData = signinSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            "message" : "Invalid inputs :)"
        })
        return;  
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token
    });
})

app.post("/room", middleware,(req,res) =>{
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            "message" : "Invalid inputs :)"
        }) 
        return;  
    }

    //todo : db call

    res.json({
        roomId : 123
    })
})

app.listen(3001);