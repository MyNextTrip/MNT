import mongoose from "mongoose";

const ChatbotUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    default: "Chatbot",
  }
}, {
  collection: 'MNT-chatbot-user'
});

export default mongoose.models.ChatbotUser || mongoose.model("ChatbotUser", ChatbotUserSchema);
