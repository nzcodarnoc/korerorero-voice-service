import { Response, Request, NextFunction } from "express";
import { VOICE_CACHE } from "../utils";
export default async (req: Request, res: Response, next: NextFunction) => {
  const audioFile = String(req.params.audioFile);
  res.set("Content-Type", "audio/wav");
  res.sendFile(encodeURIComponent(audioFile), { root: VOICE_CACHE });
};
