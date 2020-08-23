// @ts-nocheck
import fs from "fs";
import objectMapper from "object-mapper";
import { flatten } from "array-flatten";
import { cache } from "../controllers/cache-controller";

let buffer = fs.readFileSync("cli/skill-My-first-skill.json");
let skill = JSON.parse(String(buffer));

const map_dialog_nodes = {
  "dialog_nodes[].output.generic[].values[].text": "text[]+",
  "system_settings.disambiguation.prompt": "text[]+",
  "system_settings.disambiguation.none_of_the_above_prompt": "text[]+",
  "system_settings.human_agent_assist.prompt": "text[]+",
};

const destination = objectMapper(skill, map_dialog_nodes);

const messages = flatten(destination.text);

fillCache(messages);

async function fillCache(messages) {
  for (const message of messages) {
    console.log(`caching: ${message}`);
    await cache(message);
  }
}
