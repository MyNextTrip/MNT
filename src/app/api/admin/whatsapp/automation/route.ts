import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Nuclear helper to correctly parse private key from environment variables
// Handles all common .env formats (quoted, unquoted, escaped, etc.)
const getPrivateKey = () => {
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) {
    throw new Error('GOOGLE_PRIVATE_KEY is missing from .env');
  }

  // 1. Remove surrounding quotes if present (both single and double)
  key = key.trim().replace(/^["']|["']$/g, '');

  // 2. Unescape newline characters
  // We handle both double-escaped (\\n) and single-escaped (\n)
  key = key.replace(/\\n/g, '\n');

  // 3. Ensure the key starts and ends with the correct PEM headers
  // (Sometimes copy-pasting removes them or adds extra spaces)
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}`;
  }
  if (!key.includes('-----END PRIVATE KEY-----')) {
    key = `${key}\n-----END PRIVATE KEY-----`;
  }

  return key;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            sheetUrl, sheetTab, 
            evolutionUrl, instanceName, evolutionApiKey,
            aiModel, aiApiKey, systemPrompt,
            template, useAI,
            batchSize, batchDelay, messageDelayMin, messageDelayMax
        } = body;

        // Basic validation
        if (!sheetUrl || !evolutionUrl || !instanceName || !evolutionApiKey) {
            return NextResponse.json({ success: false, message: "Missing required configuration fields" }, { status: 400 });
        }

        const sheetIdMatch = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!sheetIdMatch) {
            return NextResponse.json({ success: false, message: "Invalid Google Sheet URL format" }, { status: 400 });
        }
        const sheetId = sheetIdMatch[1];

        // --- AUTH VALIDATION PHASE (Synchronous) ---
        let rows: any[] = [];
        try {
            const privateKey = getPrivateKey();
            
            const auth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.replace(/^["']|["']$/g, ''), // Clean email too
                key: privateKey,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const doc = new GoogleSpreadsheet(sheetId, auth);
            
            console.log("📄 Loading Spreadsheet Info...");
            await doc.loadInfo();
            
            const sheet = doc.sheetsByTitle[sheetTab] || doc.sheetsByIndex[0];
            console.log(`📑 Accessing Sheet: ${sheet.title}`);
            
            rows = await sheet.getRows();
            
            // Apply 1000 guest limit per campaign
            if (rows.length > 1000) {
                console.log(`⚠️ Sheet has ${rows.length} rows. Limiting to first 1000 as per system rules.`);
                rows = rows.slice(0, 1000);
            }
            
            console.log(`✅ Successfully fetched and capped at ${rows.length} rows.`);

        } catch (authError: any) {
            console.error("❌ Google Sheets Auth Error:", authError);
            
            // Extract the most helpful error message
            const errorMessage = authError.message || "Unknown Authentication Error";
            const isOpensslError = errorMessage.includes('ERR_OSSL') || errorMessage.includes('DECODER');
            
            return NextResponse.json({ 
                success: false, 
                message: isOpensslError ? "Private Key Format Error" : "Google Authentication Failed",
                errorDetails: errorMessage,
                hint: isOpensslError 
                    ? "The GOOGLE_PRIVATE_KEY in your .env is not formatted correctly. Ensure it is the full PEM string starting with '-----BEGIN PRIVATE KEY-----' and all newlines are represented as \\n." 
                    : "Check if the Service Account Email is correct and the Google Sheet is shared with it.",
                stack: authError.stack
            }, { status: 500 });
        }

        // --- BACKGROUND EXECUTION PHASE ---
        runWhatsAppAutomation({
            rows,
            evolutionUrl, instanceName, evolutionApiKey,
            aiModel, aiApiKey, systemPrompt,
            template, useAI,
            batchSize, batchDelay, messageDelayMin, messageDelayMax
        }).catch(err => {
            console.error("🚀 Background Automation Error:", err);
        });

        return NextResponse.json({ 
            success: true, 
            message: `Successfully connected! Starting automation for ${rows.length} recipients.`,
            totalRows: rows.length
        });

    } catch (error: any) {
        console.error("❌ API Route Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "System Error", 
            errorDetails: error.message 
        }, { status: 500 });
    }
}

async function runWhatsAppAutomation(config: any) {
    const { rows } = config;

    // AI Setup
    const genAI = new GoogleGenerativeAI(config.aiApiKey || process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Processing in Batches
    for (let i = 0; i < rows.length; i += config.batchSize) {
        const batch = rows.slice(i, i + config.batchSize);
        
        for (const row of batch) {
            try {
                const rowData = row.toObject();
                const phoneNumber = rowData.Phone || rowData.phone || rowData.whatsapp || rowData.WhatsApp;
                
                if (!phoneNumber) continue;

                let finalMessage = config.template;
                Object.keys(rowData).forEach(key => {
                    finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), rowData[key] || "");
                });

                if (config.useAI) {
                    try {
                        const prompt = `${config.systemPrompt}\n\nRecipient Data: ${JSON.stringify(rowData)}\nOriginal Template: ${finalMessage}\n\nPlease generate a natural, personalized variation of this message for WhatsApp. Keep it concise and professional.`;
                        const result = await model.generateContent(prompt);
                        const aiText = result.response.text();
                        if (aiText) finalMessage = aiText;
                    } catch (aiErr) {
                        console.error(`🤖 AI Personalization failed for ${phoneNumber}`);
                    }
                }

                const formattedNumber = phoneNumber.toString().replace(/[^0-9]/g, '');
                const finalNumber = formattedNumber.length === 10 ? `91${formattedNumber}` : formattedNumber;

                await fetch(`${config.evolutionUrl}/message/sendText/${config.instanceName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': config.evolutionApiKey
                    },
                    body: JSON.stringify({
                        number: finalNumber,
                        text: finalMessage,
                        linkPreview: true
                    })
                });

            } catch (rowError) {
                console.error("❌ Error processing row:", rowError);
            }

            const delay = Math.floor(Math.random() * (config.messageDelayMax - config.messageDelayMin + 1) + config.messageDelayMin) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        if (i + config.batchSize < rows.length) {
            await new Promise(resolve => setTimeout(resolve, config.batchDelay * 1000));
        }
    }
}
