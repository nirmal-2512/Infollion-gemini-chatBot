import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const pdfParse = require("pdf-parse");
import { GoogleGenerativeAI } from "@google/generative-ai";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const upload = multer({ dest: "uploads/" });

const chatStore = {};

function getChat(chatId) {
  if (!chatStore[chatId]) {
    chatStore[chatId] = {
      messages: [],
      documentText: "",
      imageBase64: "",
      imageMime: "",
    };
  }
  return chatStore[chatId];
}

app.post("/api/chat", async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ error: "chatId and message are required" });
  }

  const chat = getChat(chatId);

  try {
    const parts = [];

    if (chat.documentText) {
      parts.push({
        text: `The user has uploaded a document. Here is its content:\n\n${chat.documentText}\n\n`,
      });
    }

    if (chat.messages.length > 0) {
      const historyText = chat.messages
        .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
        .join("\n");
      parts.push({ text: `Conversation so far:\n${historyText}\n\n` });
    }

    if (chat.imageBase64) {
      parts.push({
        inlineData: {
          data: chat.imageBase64,
          mimeType: chat.imageMime,
        },
      });
    }

    parts.push({ text: `User: ${message}` });

    const result = await model.generateContent(parts);
    const botReply = result.response.text();

    chat.messages.push({ role: "user", text: message });
    chat.messages.push({ role: "bot", text: botReply });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

app.post("/api/upload/document", upload.single("file"), async (req, res) => {
  const { chatId } = req.body;

  if (!chatId || !req.file) {
    return res.status(400).json({ error: "chatId and file are required" });
  }

  const chat = getChat(chatId);
  const filePath = req.file.path;
  const originalName = req.file.originalname.toLowerCase();

  try {
    let extractedText = "";

    if (originalName.endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (originalName.endsWith(".txt")) {
      extractedText = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).json({ error: "Only PDF and TXT files are supported" });
    }

    chat.documentText = extractedText;

    fs.unlinkSync(filePath);

    res.json({ message: "Document uploaded successfully", fileName: req.file.originalname });
  } catch (err) {
    console.error("Document upload error:", err.message);
    res.status(500).json({ error: "Failed to process document" });
  }
});

app.post("/api/upload/image", upload.single("file"), (req, res) => {
  const { chatId } = req.body;

  if (!chatId || !req.file) {
    return res.status(400).json({ error: "chatId and file are required" });
  }

  const chat = getChat(chatId);
  const filePath = req.file.path;
  const mime = req.file.mimetype;

  if (!["image/png", "image/jpeg"].includes(mime)) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "Only PNG and JPG images are supported" });
  }

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    chat.imageBase64 = base64Image;
    chat.imageMime = mime;

    fs.unlinkSync(filePath);

    res.json({ message: "Image uploaded successfully", fileName: req.file.originalname });
  } catch (err) {
    console.error("Image upload error:", err.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

app.post("/api/new-chat", (req, res) => {
  const { chatId } = req.body;

  if (chatId && chatStore[chatId]) {
    delete chatStore[chatId];
  }

  const newChatId = `chat_${Date.now()}`;
  chatStore[newChatId] = {
    messages: [],
    documentText: "",
    imageBase64: "",
    imageMime: "",
  };

  res.json({ chatId: newChatId });
});

app.get("/api/history/:chatId", (req, res) => {
  const { chatId } = req.params;
  const chat = chatStore[chatId];

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json({ messages: chat.messages });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});