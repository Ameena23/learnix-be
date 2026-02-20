import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const getGenAI = () => {
  const apiKey = "AIzaSyAu546xggtXW_PPL8TzfGcrlhvrOxWfLJU";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const handleChat = async (req, res) => {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const genAI = getGenAI();
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: "You are an AI assistant for a School Management System called Learnix. You help teachers, students, and administrators with their queries about student marks, attendance, and general school management. Be polite, concise, and helpful.",
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return res.json({ response: text, modelUsed: modelName });
    } catch (error) {
      lastError = error;
      // If it's not a 404 or unsupported model error, don't bother trying others
      if (!error.message.includes("404") && !error.message.includes("not found")) {
        break;
      }
      console.warn(`Model ${modelName} failed, trying next...`);
    }
  }

  console.error("AI Chat Error Details:", {
    message: lastError.message,
    status: lastError.status,
    errorDetails: lastError.errorDetails
  });

  res.status(500).json({
    error: lastError.message || "Failed to process chat message",
    details: lastError.errorDetails
  });
};
