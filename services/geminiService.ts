
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePortfolio(portfolioData: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following credit portfolio for LIMBANK and provide a summary of health, risks, and suggestions for improvement. Return the analysis in a structured, concise Markdown format.
      Data: ${JSON.stringify(portfolioData)}`
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Unable to perform portfolio analysis at this moment.";
  }
}

export async function checkCreditRisk(clientData: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a credit risk assessment for this client. Suggest a maximum loan amount and risk level (Low, Medium, High). 
      Client: ${JSON.stringify(clientData)}`
    });
    return response.text;
  } catch (error) {
    console.error("AI Credit Check Error:", error);
    return "Risk assessment currently unavailable.";
  }
}
