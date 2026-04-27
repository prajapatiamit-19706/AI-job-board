// server/listModels.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = await genAI.listModels();
for await (const model of models) {
    console.log(model.name, '|', model.supportedGenerationMethods);
}