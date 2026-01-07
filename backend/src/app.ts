import express  from "express";
import cors from 'cors';
import authRouter from "./routes/authRoute";


const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth/", authRouter)
app.get("/", (req, res)=>{
    res.status(200).send("MediCare+ Backend Running")
})

export default app