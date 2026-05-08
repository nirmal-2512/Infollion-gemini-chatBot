# 🤖 Gemini Chatbot

A minimal web-based chatbot powered by Google's Gemini API. Supports text conversation, document upload (PDF/TXT), image upload (PNG/JPG), and multi-chat session management.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini 2.5 Flash API

---

## ✨ Features

- 💬 Natural text conversation with Gemini AI
- 📄 Upload PDF/TXT documents and ask questions about them
- 🖼️ Upload PNG/JPG images and get AI descriptions
- 🧠 Context-aware responses (remembers conversation history)
- 💾 Multiple chat sessions with sidebar navigation
- 🔄 New Chat button to reset context completely
- ✅ Markdown rendering in bot responses

---

## 📁 Project Structure
gemini-chatbot/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── uploads/       # Temporary file storage
│   ├── server.js
│   ├── .env           # API key (not committed)
│   └── package.json
└── README.md

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/nirmal-2512/Infollion-gemini-chatBot.git
cd Infollion-gemini-chatBot
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

---

## 🔑 How to Get a Gemini API Key

1. Go to 👉 https://aistudio.google.com/app/apikey
2. Click **"Create API Key in new project"**
3. Copy the key and paste it in `backend/.env`

---

## ▶️ How to Run

### Start Backend
```bash
cd backend
node server.js
```
You should see:
"Backend running at http://localhost:3000"


### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Open 👉 **http://localhost:5173**

---

## 📖 Example Usage

### Example 1: Document Q&A
1. Click **📄 Document** and upload a PDF or TXT file
2. Ask: *"Summarize this document"*
3. Follow up: *"What was the third point mentioned?"*

### Example 2: Image Q&A
1. Click **🖼️ Image** and upload a PNG or JPG
2. Ask: *"What's in this image?"*
3. Follow up: *"Is there any text visible?"*

### Example 3: Context Reset
1. Have a conversation and upload files
2. Click **+ New Chat**
3. The new chat starts with completely fresh context

---

## 🌐 Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com)
- **Backend:** Deployed on [Render](https://render.com)

### Environment Variables on Render (Backend)
| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `PORT` | `3000` |

---

## ⚠️ Limitations

- Chat state is stored **in-memory only** — restarting the server clears all chats
- No authentication or user sessions
- Only PDF and TXT supported for documents
- Only PNG and JPG supported for images
- Free tier Gemini API has rate limits (15 requests/day per model)

---

## 👨‍💻 Author

**Nirmal Patidar**  
3rd Year B.Tech — IIT Kharagpur  
GitHub: [@nirmal-2512](https://github.com/nirmal-2512)



cd ~/Desktop/Web/Infollion_Assign
cat > README.md << 'EOF'
# paste content here
EOF

git add README.md
git commit -m "Add README.md"
git push
