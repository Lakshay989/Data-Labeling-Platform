import express from "express" ;
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import cors from "cors"

const app = express() ;

app.use(express.json()) ;
app.use(cors())

app.use("/v1/user", userRouter); // All user routes in userRouter
app.use("/v1/worker", workerRouter); // All worker routes in workerRouter

app.listen(3000) ;