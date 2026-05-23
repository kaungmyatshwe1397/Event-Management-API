import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Concert } from "../entities/concert";

const router = Router();

router.get("/",async(req,res)=>{
    const concerts = await AppDataSource.getRepository(Concert).find();
    res.json(concerts);
})

export default router;