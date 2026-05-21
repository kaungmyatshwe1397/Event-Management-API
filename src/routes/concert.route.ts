import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.json("this is concert lists");
})

export default router;