import { Router } from "express";

const router = Router();

router.post('/',(req,res)=>{
    res.json('This is for reservation.');
});

export default router;
