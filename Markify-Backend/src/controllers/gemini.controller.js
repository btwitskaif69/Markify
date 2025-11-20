const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.refactorDescription = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API key not configured" });
        }

        // 1. Update usage count
        await prisma.user.update({
            where: { id: userId },
            data: {
                geminiUsage: {
                    increment: 1,
                },
            },
        });

        // 2. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Refactor the following blog post content to be well-structured, engaging, and easy to read. 
    - Use bullet points where appropriate.
    - Highlight key phrases using **bold** text.
    - Ensure the tone is professional yet accessible.
    - Keep the meaning of the original text.
    
    Original Text:
    ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const refactoredText = response.text();

        res.status(200).json({ refactoredText });
    } catch (error) {
        console.error("Gemini Refactor Error:", error);
        res.status(500).json({ message: "Failed to refactor text", error: error.message });
    }
};
