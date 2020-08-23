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
  return encodeURIComponent(
    slugify(phrase.substring(0, 24), {
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
  let shapesPayload;
  if (fs.existsSync(withPath(filename))) {
    shapesPayload = {
      data: JSON.parse(String(fs.readFileSync(withPath(filename + ".json")))),
    };
  } else {
    shapesPayload = await cache(message);
  }
  res.json(shapesPayload.data);
};

export async function cache(message: string) {
  const filename = filenameHash(message);
  const ttsCall = await ttsController(message);
  const mouthShapes: ShapesPayload = await mouthShapesController(ttsCall);
  await saveAudio(mouthShapes.data.metadata.soundFile, filename);
  mouthShapes.data.metadata.soundFile = "audio/" + filename;
  saveJson(filename, mouthShapes);
  return mouthShapes;
}

function saveJson(filename: string, mouthShapes: ShapesPayload) {
  fs.writeFileSync(
    withPath(filename + ".json"),
    JSON.stringify(mouthShapes.data)
  );
}

async function saveAudio(source: string, destination: string) {
  return axios({
    method: "get",
    url: MOUTH_SHAPES + source,
    responseType: "stream",
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream(withPath(destination)));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function withPath(file: string) {
  return VOICE_CACHE + "/" + file;
}
