import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          { role: "system", content: "You are DNA, a hands-free delivery assistant for drivers from OCD Logistics." },
          { role: "user", content: message }
        ]
      })
    });
    const data = await r.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "No reply." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Connection error." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`DNA proxy running on ${port}`));
