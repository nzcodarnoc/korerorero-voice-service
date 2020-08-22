import { Response, Request, NextFunction } from "express";
import ttsController from "./tts-controller";
import mouthShapesController from "./mouth-shapes-controller";
import crypto from "crypto";
import slugify from "slugify";
import { ShapesPayload } from "../types";
import axios from "axios";
import { MOUTH_SHAPES, VOICE_CACHE } from "../utils";
import fs from "fs";

function filenameHash(phrase: string) {
  const hash = crypto
    .createHash("sha256")
    .update(phrase, "utf8")
    .digest("base64");
  return (
    slugify(phrase.substring(0, 12), {
      lower: true,
      strict: true,
      locale: "en",
    }) +
    "_" +
    hash
  );
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const message = String(req.body.message);
  const filename = filenameHash(message);
  const ttsCall = await ttsController(message);
  const mouthShapes: ShapesPayload = await mouthShapesController(ttsCall);
  await saveAudio(mouthShapes.data.metadata.soundFile, filename);
  mouthShapes.data.metadata.soundFile = filename;
  saveJson(filename, mouthShapes)
  res.json(mouthShapes.data);
};

function saveJson(filename: string, mouthShapes: ShapesPayload) {
  fs.writeFileSync(VOICE_CACHE + "/" + filename + ".json", JSON.stringify(mouthShapes.data))
}
 
async function saveAudio(source: string, destination: string) {
  return axios({
    method: "get",
    url: MOUTH_SHAPES + source,
    responseType: "stream",
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream(VOICE_CACHE + "/" + destination));
    })
    .catch(function (error) {
      console.log(error);
    });
}
