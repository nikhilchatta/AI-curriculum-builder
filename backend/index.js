const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-plan", async (req, res) => {
  const { topic, pace, style, depth, days, startDate } = req.body;

  const prompt = `
You are a curriculum generator. Create a personalized 5-day learning plan:
- Topic: ${topic}
- Pace: ${pace}
- Style(s): ${style.join(", ")}
- Depth: ${depth}

Format the result as valid JSON like:
[
  {
    "day": 1,
    "topic": "Intro to ${topic}",
    "objectives": ["Understand basics", "Learn tools"],
    "resources": ["https://example.com/1", "https://example.com/2"],
    "assignment": "Summarize what you learned"
  }
]
`;

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // You can also try llama3
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    res.json(parsed);
  } catch (err) {
    console.error("❌ Together.ai Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate curriculum" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running with Together.ai at http://localhost:5000");
});
