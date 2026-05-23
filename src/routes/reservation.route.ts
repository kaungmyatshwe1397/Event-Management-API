import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { Concert } from "../entities/concert";

const router = Router();

router.post('/',async (req,res)=>{
    // user and concert id must include in request body
    const {userId , concertId} = req.body;
    // Find and select the wanted concert by using concert id
    const selectedConcert =  await AppDataSource.getRepository(Concert).findOne({
        where: { id: concertId }
    });
    // If there is no concert or concert have no ticket, return this
    if(!selectedConcert || selectedConcert.stock == 0){
        return res.status(400).json({message:"Concert is sold out"})
    };
    // If concert is there and ticket is reserved , decrease ticket stock count from that concert
    selectedConcert.stock -= 1;

    // Update the concert state 
    await AppDataSource.getRepository(Concert).save(selectedConcert);
    // Create a new ticket for user for selectecd concert by using ticket entities
    await AppDataSource.getRepository(Ticket).save({
        userId:userId,
        concertId:concertId,
        status:'PENDING',
        category:'Basic',
        createAt:new Date()
    })
    res.json({message:"ticket is reserved."})
});

export default router;
