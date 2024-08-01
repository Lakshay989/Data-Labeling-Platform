import nacl from "tweetnacl"
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken" ;
import { TOTAL_DECIMALS, WORKER_JWT_SECRET } from "../config";
import { workerMiddleware } from "../middleware";
import { getNextTask } from "../db";
import { createSubmissionInput } from "../types";
import { Transaction, SystemProgram, PublicKey, Keypair, sendAndConfirmTransaction, Connection } from "@solana/web3.js";
import { privateKey } from "../privateKey";
import bs58 from "bs58" ;

const connection = new Connection(process.env.NEXT_PUBLIC_NEXT_PUBLIC_RPC_URL ?? "");

const TOTAL_SUBMISSIONS = 100

const router = Router();

const prismaClient = new PrismaClient() ;

prismaClient.$transaction(
    async (prisma) => {
      // Code running in a transaction...
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
)

router.post("/payout", workerMiddleware, async(req, res)=> {
   //@ts-ignore
    const userId = req.userId ; 
    const worker = await prismaClient.worker.findFirst({
        where: {
            id: Number(userId)
        }
    })

    if(!worker){
        return res.status(403).json({
            message : "User not found"
        })
    }

    const address = worker.address 

    // Creating in memory transaction --> meaning we do not send it to the Solana blockchain just yet

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey("GKkbba5zTPmYduQTpH6HM4P8CEEvMjxn8CPX4pQ8Y8Q1"), // parent wallet address
            toPubkey: new PublicKey(worker.address),
            lamports:  1000_000_000 * worker.pending_amount/TOTAL_DECIMALS,
        })
    );

    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));

    // TODO: There's a double spending problem here
    // The user can request the withdrawal multiple times
    // Can u figure out a way to fix it?
    let signature = ""
    try{
        signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    )}
    catch(e){
        return res.json({
            message: "Transaction failed"
        })
    }
    

    await prismaClient.$transaction(async tx => {
        await tx.worker.update({
            where: {
                id: Number(userId),
            },
            data: {
                pending_amount: {
                    decrement: worker.pending_amount
                },
                locked_amount: {
                    increment: worker.pending_amount
                }
            }
        })

        await tx.payouts.create({
            data: {
                user_id: Number(userId),
                amount: worker.pending_amount,
                status: "Processing",
                signature: signature,
            } 
        })
    })

    // Now this should go through the Solana Blockchain.

    res.json({
        message: "Processing Transaction",
        amount: worker.pending_amount
    })

})

router.get("/balance" , workerMiddleware, async(req, res) => {
    //@ts-ignore
    const userId = req.userId;

    const worker = await prismaClient.worker.findFirst({
        where:{
            id: userId
        }
    })

    res.json({
        pendingAmount: worker?.pending_amount,
        lockedAmount: worker?.locked_amount,
    })

})

router.post("/submission", workerMiddleware, async(req, res) =>{
    //@ts-ignore
    const userId = req.userId
    const body = req.body ;
    const parsedBody = createSubmissionInput.safeParse(body) ;

    if(parsedBody.success){
        const task =  await getNextTask(Number(userId)) ;

        if(!task || task.id !== Number(parsedBody.data.taskId)){
            return res.status(411).json({
                message: "Invalid task id"
            })
        }

        const amount = (Number(task.amount)/TOTAL_SUBMISSIONS).toString() ;

        const submission = prismaClient.$transaction(async tx=>{
            
            const submission = await tx.submission.create({
                data: {
                    option_id: Number(parsedBody.data.selection),
                    worker_id: userId,
                    task_id: Number(parsedBody.data.taskId),
                    amount: Number(amount)
                }
            })

            await tx.worker.update({
                where:{
                    id: userId,
                },
                data: {
                    pending_amount: {
                        increment: Number(amount)
                    }
                }
            })

            return submission
        })

        const nextTask = await getNextTask(userId)
        res.json({
            nextTask,
            amount
        })
    }
    else{
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }

})

router.get("/nextTask", workerMiddleware, async(req, res) => {

    //@ts-ignore
    const userId = req.userId;

    const task =  await getNextTask(Number(userId)) ;

    if(!task){
        res.status(411).json({
            message : "You have no more tasks to review"
        })
    }
    else{
        res.json({
            task
        })
    }
})

router.post("/signin", async(req, res) => {

    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("Sign into mechanical turks as a worker");

    const result = nacl.sign.detached.verify(
        message,
        new Uint8Array(signature.data),
        new PublicKey(publicKey).toBytes(),
    );

    if (!result) {
        return res.status(411).json({
            message: "Incorrect signature"
        })
    }

    const existingUser = await prismaClient.worker.findFirst({
        where:{
            address : publicKey
        }
    })
    
    if(existingUser){
        const token = jwt.sign({
            userId : existingUser.id
        }, WORKER_JWT_SECRET)

        res.json({
            token
        })
    }
    else{
        const user = await prismaClient.worker.create({
            data:{
                address : publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        })
        const token = jwt.sign({
            userId : user.id
        }, WORKER_JWT_SECRET)

        res.json({
            token
        })
    }
})

export default router ;