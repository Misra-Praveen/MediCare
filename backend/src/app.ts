import express  from "express";
import cors from 'cors';
import authRouter from "./routes/authRoute";
import medicineRouter from "./routes/medicineRoute";
import categoryRouter from "./routes/categoryRoute";
import billRouter from "./routes/billRoute";
import returnRouter from "./routes/returnRoute";


const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth/", authRouter);
app.use("/api", medicineRouter)
app.use("/api", categoryRouter)
app.use("/api", billRouter)
app.use("/api", returnRouter)

app.get("/", (req, res)=>{
    res.status(200).send("MediCare+ Backend Running")
})

export default app