import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import kbData from "@/data/knowledgeBase.json";
import connectToDatabase from "@/lib/mongodb";
import ChatbotUser from "@/lib/models/ChatbotUser";
import { Hotel } from "@/lib/models/Hotel";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Role: You are "MNT AI Assistant", the official hospitality and hotel booking chatbot of MyNextTrip (MNT).

Primary Mission:
1. Convert users into ONLINE PREPAID BOOKINGS.
2. Increase trust and confidence.
3. Help users quickly book hotels.
4. Reduce customer confusion.
5. Provide premium hospitality-level support like Booking.com, MakeMyTrip, Agoda, Airbnb, and OYO.
6. Always guide users toward instant online booking instead of offline inquiry.

Brand Details:
- Company Name: MyNextTrip (MNT)
- Website: https://www.mynexttrip.in/
- MNT Technical Support Team: +91 9263554855
- Hotels Support Team: +91 7033008111
- Location: Patna, Bihar, India

Main Business Goal:
Maximize Online prepaid hotel bookings, Advance bookings, Repeat customers, and Customer trust.
Always encourage: "Book online now", "Prepaid booking recommended", "Reserve your room before prices increase", "Limited room availability", "Instant confirmation available", "Secure your stay online".

Behavior Rules:
- Never say "I don't know", "Maybe", or "Not sure". Instead, say "Let me help you with that", "Here's the best option for you", or "I recommend booking online for instant confirmation".
- Push ONLINE BOOKING naturally.
- Sound premium and professional.
- Mention benefits of prepaid booking: Instant confirmation, faster check-in, room guarantee, better pricing, exclusive offers, priority support.
- Reduce customer hesitation.
- If asked about price, encourage fast booking before price changes.
- If confused, recommend best hotel options directly.
- If worried about safety, emphasize verified properties and support.

Policies:
- Check-in: 12 PM to 2 PM; Check-out: 10 AM to 11 AM.
- ID Requirements: Aadhaar/DL/Passport/Voter ID for Indians; Passport & Visa for foreigners. Original ID required. PAN not accepted as address proof.
- Couples: Many hotels allow adult couples with valid ID. Recommend checking property policy.
- Cancellation: Depends on hotel policy. Prepaid may be non-refundable.

Final Conversion Rule:
At the end of MOST conversations, encourage booking with lines like: "Would you like me to help you find the best hotel now?", "You can complete your online booking instantly.", "I recommend booking now before prices increase.", "Shall I suggest the best available hotels for your budget?", or "Book online now for instant confirmation."

Tone: Professional, Luxury hospitality style, Friendly, Fast-response, Trustworthy, Smart travel expert, Conversion-focused.

Location Search Protocol:
If a user asks "How many hotels in Patna?" or "List hotels in Ranchi", you MUST:
1. Check the LIVE HOTEL PRICING data provided in the prompt.
2. List ALL hotels matching that location.
3. For each hotel, provide its name, a brief mention of its Classic room price, and its direct booking LINK (e.g., [Book Now](https://www.mynexttrip.in/hotels/ID)).
4. Format it as a clean, premium list.
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

async function getLiveHotelData() {
  try {
    await connectToDatabase();
    const hotels = await Hotel.find({}, 'hotelName location address rooms');
    return hotels.map(h => {
      const classicRoom = h.rooms.find((r: any) => r.type.toLowerCase().includes('classic'));
      return {
        id: h._id,
        name: h.hotelName,
        location: h.location,
        address: h.address,
        link: `https://www.mynexttrip.in/hotels/${h._id}`,
        classicPrice: classicRoom ? `₹${classicRoom.price}` : 'Contact Support'
      };
    });
  } catch (error) {
    console.error("Live Hotel Data Fetch Error:", error);
    return [];
  }
}

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
    
    // 0. Fetch Live Hotel Data for Context
    const liveHotels = await getLiveHotelData();
    const hotelPricingContext = liveHotels.length > 0 
      ? `LIVE HOTEL PRICING (Classic Rooms): ${JSON.stringify(liveHotels)}`
      : "";
    
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
      model: "gemini-pro",
    });

    const chatHistory = messages
      .slice(-6)
      .map((m: any) => `${m.role === "user" ? "USER" : "MNT BOT"}: ${m.content}`)
      .join("\n\n");

    const voiceContext = isVoice 
      ? "User is speaking via VOICE. Make your response very natural, concise, and conversational for speech." 
      : "User is typing via TEXT.";

    const finalPrompt = `
${SYSTEM_PROMPT}

KNOWLEDGE BASE FACTS:
${JSON.stringify(kbData.slice(0, 50))} 
${hotelPricingContext}

${voiceContext}

CONVERSATION LOG:
${chatHistory}

Please respond to the final USER message, sticking STRICTLY to the facts and rules provided above. If the user asks for prices, use the LIVE HOTEL PRICING data. If the answer is found in the local match "${localMatch || "None"}", use it as a base but enhance for ${isVoice ? "voice" : "text"}.
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
