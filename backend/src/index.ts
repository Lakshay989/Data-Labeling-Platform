// import {Express} from "express";
import express from "express" ;

import userRouter from "./routers/user";
import workerRouter from "./routers/worker";

const app = express() ;

app.use("/v1/user", userRouter); // All user routes in userRouter
app.use("/v1/worker", workerRouter); // All worker routes in workerRouter

app.listen(3000) ;