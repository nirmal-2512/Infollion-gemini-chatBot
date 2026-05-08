export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Gemini ChatBOT</h2>
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
