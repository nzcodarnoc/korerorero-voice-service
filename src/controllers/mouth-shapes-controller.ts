import axios from "axios";
import { MOUTH_SHAPES } from "../utils";
import { ShapesPayload } from "../types"

export default (ttsCall: string) => {
  return new Promise<ShapesPayload>((resolve, reject) => {
    console.info(`ℹ️ Calling /process with { speech_url: "${ttsCall}"`);
    axios
      .post(MOUTH_SHAPES + "/process", {
        speech_url: ttsCall,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
