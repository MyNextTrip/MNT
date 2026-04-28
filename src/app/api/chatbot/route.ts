import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import kbData from "@/data/knowledgeBase.json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Role: You are "MNT Chatbot", a smart, friendly, and professional virtual assistant for MyNextTrip (MNT).

Knowledge Base: You have a specific database of Questions and Answers (provided in the conversation context).
Always prioritize the provided Q&A for answering.

Tone: Helpful, witty, and grounded. No errors, no hallucination.

Protocol:
1. If the user asks via Voice, make the answer sound more natural and conversational (short and clear for speech), but never contradict the facts provided in the Q&A.
2. If the answer is NOT in the provided Q&A, answer politely in the style of MNT Chatbot and then guide them to talk to a human expert.
3. Lead Capture Protocol: After providing the answer or at the end of the conversation, collect the user's Name and WhatsApp Number politely. Example: "To help you better, could I get your name and WhatsApp number for exclusive deals?"
4. Once you receive these details, acknowledge them warmly.
5. Do not answer sensitive or out-of-context questions.
`;

function findLocalMatch(query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  const cities = ["patna", "ranchi", "nepal", "motihari", "jamshedpur", "kolkata", "goa", "kerala", "kashmir"];
  
  let bestMatch = null;
  let highestScore = 0;

  for (const item of kbData) {
    let score = 0;
    const itemKeywords = item.keywords.map(k => k.toLowerCase());
    
    // 1. Mandatory Location Check
    const mentionedCities = cities.filter(city => normalizedQuery.includes(city));
    if (mentionedCities.length > 0) {
      const hasCityMatch = mentionedCities.some(city => itemKeywords.includes(city));
      if (!hasCityMatch) continue; 
    }

    // 2. Scoring logic
    for (const kw of itemKeywords) {
      if (normalizedQuery === kw) {
        score += 30; // Direct exact match is highest priority
      } else if (normalizedQuery.includes(kw)) {
        // Longer keyword matches are worth more (e.g., "la vista" > "hotel")
        score += kw.length >= 4 ? kw.length : 2;
      }
    }

    // 3. Question text similarity bonus
    if (normalizedQuery.includes(item.question.toLowerCase().replace('?', '').trim())) {
      score += 20;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.answer;
    }
  }

  return highestScore >= 4 ? bestMatch : null;
}

import connectToDatabase from "@/lib/mongodb";
import ChatbotUser from "@/lib/models/ChatbotUser";

async function saveLeadData(name: string, whatsapp: string) {
  try {
    await connectToDatabase();
    
    // 1. Check for duplicate in MongoDB first (faster)
    const existingUser = await ChatbotUser.findOne({ whatsapp });
    if (existingUser) {
      return { success: true, duplicate: true };
    }

    // 2. Save to MongoDB
    const newUser = new ChatbotUser({ name, whatsapp });
    await newUser.save();

    // 3. Save to Google Sheets
    const sheetId = process.env.MNT_CHATBOT_SHEET;
    if (sheetId) {
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

      if (serviceAccountEmail && privateKey) {
        const auth = new JWT({
          email: serviceAccountEmail,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new GoogleSpreadsheet(sheetId, auth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        
        try {
          await sheet.addRow({
            "Name": name,
            "WhatsApp Number": whatsapp,
            "Timestamp": new Date().toLocaleString(),
            "Source": "Chatbot"
          });
        } catch (err) {
          await sheet.addRow({
            "NAME": name,
            "WHATSAPP NUMBER": whatsapp,
          });
        }
      }
    }

    return { success: true, duplicate: false };
  } catch (error) {
    console.error("Lead Storage Error:", error);
    return { success: false, duplicate: false };
  }
}

export async function POST(req: Request) {
  try {
    const { messages, leadData, isVoice } = await req.json();

    if (leadData) {
      const result = await saveLeadData(leadData.name, leadData.whatsapp);
      if (result.duplicate) {
        return NextResponse.json({ 
          text: `Thank you ${leadData.name}! Your number is already registered with us. Our expert will contact you shortly.` 
        });
      }
      return NextResponse.json({ 
        text: `Thank you ${leadData.name}! Your details have been saved. An MNT expert will contact you on WhatsApp (+${leadData.whatsapp}) very soon.` 
      });
    }

    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    
    // 1. Try Local Match First
    const localMatch = findLocalMatch(lastUserMessage);
    if (localMatch && !isVoice) {
      return NextResponse.json({ text: localMatch });
    }

    // 2. If no local match or if it's Voice (to make it sound more natural), use Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    const chatHistory = messages
      .slice(-6)
      .map((m: any) => `${m.role === "user" ? "USER" : "MNT BOT"}: ${m.content}`)
      .join("\n\n");

    const voiceContext = isVoice 
      ? "User is speaking via VOICE. Make your response very natural, concise, and conversational for speech." 
      : "User is typing via TEXT.";

    const finalPrompt = `
KNOWLEDGE BASE FACTS:
${JSON.stringify(kbData.slice(0, 50))} // Providing a sample of facts to Gemini to ensure accuracy
... and 150+ more facts in internal memory.

${voiceContext}

CONVERSATION LOG:
${chatHistory}

Please respond to the final USER message, sticking STRICTLY to the facts provided above if applicable. If the answer is found in the local match "${localMatch || "None"}", use it as a base but enhance for ${isVoice ? "voice" : "text"}.
`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chatbot API Error:", error.message || error);
    return NextResponse.json({ 
      text: "I'm sorry, I'm having trouble providing a voice response due to a network issue. May I assist you via text instead?" 
    });
  }
}
