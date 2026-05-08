import { useState } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import Sidebar from "./components/Sidebar";
import "./App.css";

const API = "http://localhost:3000/api";

export default function App() {
  const [chats, setChats] = useState([
    { id: `chat_${Date.now()}`, label: "Chat 1" },
  ]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  const getMessages = (chatId) => messages[chatId] || [];

  const addMessage = (chatId, role, text) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { role, text }],
    }));
  };

  const handleSend = async (message) => {
    if (!message.trim()) return;
    addMessage(activeChatId, "user", message);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        chatId: activeChatId,
        message,
      });
      addMessage(activeChatId, "bot", res.data.reply);
    } catch (err) {
      addMessage(activeChatId, "bot", "❌ Error getting response from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", activeChatId);
    setUploadStatus((prev) => ({
      ...prev,
      [activeChatId]: "Uploading document...",
    }));
    try {
      await axios.post(`${API}/upload/document`, formData);
      setUploadStatus((prev) => ({
        ...prev,
        [activeChatId]: `📄 ${file.name} uploaded`,
      }));
      addMessage(
        activeChatId,
        "bot",
        `📄 Document **${file.name}** uploaded! You can now ask questions about it.`,
      );
    } catch {
      setUploadStatus((prev) => ({
        ...prev,
        [activeChatId]: "❌ Upload failed",
      }));
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", activeChatId);
    setUploadStatus((prev) => ({
      ...prev,
      [activeChatId]: "Uploading image...",
    }));
    try {
      await axios.post(`${API}/upload/image`, formData);
      const previewUrl = URL.createObjectURL(file);
      setUploadStatus((prev) => ({
        ...prev,
        [activeChatId]: `🖼️ ${file.name} uploaded`,
      }));
      addMessage(activeChatId, "image-preview", previewUrl);
      addMessage(
        activeChatId,
        "bot",
        `🖼️ Image **${file.name}** uploaded! Ask me anything about it.`,
      );
    } catch {
      setUploadStatus((prev) => ({
        ...prev,
        [activeChatId]: "❌ Upload failed",
      }));
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await axios.post(`${API}/new-chat`, { chatId: activeChatId });
      const newId = res.data.chatId;
      const newLabel = `Chat ${chats.length + 1}`;
      setChats((prev) => [...prev, { id: newId, label: newLabel }]);
      setActiveChatId(newId);
      setUploadStatus((prev) => ({ ...prev, [newId]: "" }));
    } catch {
      console.error("Failed to create new chat");
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <div className="chat-area">
        <ChatWindow
          messages={getMessages(activeChatId)}
          loading={loading}
          uploadStatus={uploadStatus[activeChatId] || ""}
        />
        <MessageInput
          onSend={handleSend}
          onDocumentUpload={handleDocumentUpload}
          onImageUpload={handleImageUpload}
          loading={loading}
        />
      </div>
    </div>
  );
}
