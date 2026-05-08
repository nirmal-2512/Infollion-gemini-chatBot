import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWindow({ messages, loading, uploadStatus }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="empty-state">
          <p>👋 Start a conversation with Gemini!</p>
          <p>You can also upload a document or image.</p>
        </div>
      )}

      {messages.map((msg, idx) => {
        if (msg.role === "image-preview") {
          return (
            <div key={idx} className="message user">
              <img src={msg.text} alt="uploaded" className="image-preview" />
            </div>
          );
        }
        return (
          <div key={idx} className={`message ${msg.role}`}>
            <span className="message-label">
              {msg.role === "user" ? "You" : "Gemini"}
            </span>
            {msg.role === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        );
      })}

      {loading && (
        <div className="message bot">
          <span className="message-label">Gemini</span>
          <p className="typing">Thinking...</p>
        </div>
      )}

      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}

      <div ref={bottomRef} />
    </div>
  );
}
