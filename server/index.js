import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.8-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              answerIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING }
            },
            required: ['question', 'options', 'answerIndex', 'explanation']
          }
        }
      }
    });

    const prompt = `You are an expert tutor. Generate exactly 10 multiple-choice questions from the study material below.
Each question must have 4 options. Keep every explanation to 1 short sentence.

Study Material:
${text}`;

    const start = Date.now();
    const result = await model.generateContent(prompt);
    console.log("Time:", (Date.now() - start) / 1000, "seconds");

    const response = await result.response;
    const quizData = JSON.parse(response.text());
    
    res.json({ quiz: quizData });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate quiz content' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`QuizForge backend running on http://localhost:${PORT}`);
});