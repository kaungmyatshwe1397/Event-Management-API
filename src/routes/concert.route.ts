import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Concert } from "../entities/concert";
import { getLogger } from "../libs/logger";

const router = Router();

router.get("/", async (req, res) => {
  const concerts = await AppDataSource.getRepository(Concert).find();
  res.json(concerts);
  const log = getLogger();
  log.info("Fetching all concerts.");
});

export default router;
