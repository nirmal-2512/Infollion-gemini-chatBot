import { useState, useRef } from "react";

export default function MessageInput({
  onSend,
  onDocumentUpload,
  onImageUpload,
  loading,
}) {
  const [text, setText] = useState("");
  const docRef = useRef(null);
  const imgRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) onDocumentUpload(file);
    e.target.value = "";
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(file);
    e.target.value = "";
  };

  return (
    <div className="message-input-area">
      <div className="upload-buttons">
        <button
          onClick={() => docRef.current.click()}
          disabled={loading}
          title="Upload PDF or TXT"
        >
          📄 Document
        </button>
        <button
          onClick={() => imgRef.current.click()}
          disabled={loading}
          title="Upload PNG or JPG"
        >
          🖼️ Image
        </button>
        <input
          ref={docRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleDocChange}
          hidden
        />
        <input
          ref={imgRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleImgChange}
          hidden
        />
      </div>

      <div className="input-row">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={2}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="send-btn"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
