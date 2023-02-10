import { Router } from "express";
import { authUser } from "../middleware/auth";
import bookingModel from "../models/booking";

const router = new Router();

router.get("/", (req,res)=>{
    
})