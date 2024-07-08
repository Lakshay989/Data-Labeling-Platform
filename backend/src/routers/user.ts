import {PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken" ;


const JWT_SECRET = "Need to change later";

const router = Router();
const prismaClient = new PrismaClient() ;

// We are supporting signin with address (Wallet)
router.post("/signin", async(req, res) => {
    // TODO : Add signin verification logic
    const hardcodedWalletAddress = "aaaa" ;
    //const user = await prismaClient.user.upsert() // alternate for if (user){} else {} ...

    const existingUser = await prismaClient.user.findFirst({
        where:{
            address : hardcodedWalletAddress
        }
    })
    
    if(existingUser){
        const token = jwt.sign({
            userId : existingUser.id
        }, JWT_SECRET)

        res.json({
            token
        })
    }
    else{
        const user = await prismaClient.user.create({
            data:{
                address : hardcodedWalletAddress
            }
        })
        const token = jwt.sign({
            userId : user.id
        }, JWT_SECRET)

        res.json({
            token
        })
    }
})

export default router ;