import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Request Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// AI Forecast Endpoint
app.post("/api/forecast", async (req, res) => {
  try {
    const { stockSymbol, historicalData, news } = req.body;
    
    const prompt = `
      Analyze the following stock data and provide a forecast.
      Stock: ${stockSymbol}
      Recent Price Data: ${JSON.stringify(historicalData)}
      Recent News/Sentiment: ${JSON.stringify(news)}

      Return a JSON response with the following structure:
      {
        "signal": "Strong Buy" | "Hold" | "Weak" | "Sell",
        "score": number (0 to 1),
        "targetPrice": number,
        "stopLoss": number,
        "explanation": "Provide a professional explanation in simple Bangla as requested by the user.",
        "riskLevel": "Low" | "Medium" | "High",
        "confidence": number (0 to 100),
        "sentiment": "Bullish" | "Bearish" | "Neutral"
      }
      ONLY return the JSON.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = result.text || "{}";
    const forecast = JSON.parse(text);

    res.json(forecast);
  } catch (error) {
    console.error("AI Forecast Error:", error);
    res.status(500).json({ error: "Failed to generate AI forecast" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
