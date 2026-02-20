import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const apiKey = "AIzaSyAu546xggtXW_PPL8TzfGcrlhvrOxWfLJU";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const modelList = await genAI.listModels();
        console.log("Available Models:");
        modelList.models.forEach((m) => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods})`);
        });
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
