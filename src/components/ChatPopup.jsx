import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleChat,
  setActiveTab,
  clearUnread,
} from "../store/storeComponent/chatComponent";
import socketService from "../services/socket";

function ChatPopup() {
  const dispatch = useDispatch();
  const { messages, isOpen, unreadCount, activeTab } = useSelector(
    (s) => s.chat
  );
  const { name: userName, role } = useSelector((s) => s.user);
  const { list: students } = useSelector((s) => s.students);

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleToggle = () => {
    dispatch(toggleChat());
    if (!isOpen) dispatch(clearUnread());
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const message = {
      sender: role,
      senderName: role === "teacher" ? "Teacher" : userName,
      text: messageInput.trim(),
    };

    socketService.emit("chat:message", message);
    setMessageInput("");
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed bottom-9 right-9 w-14 h-14 rounded-full 
             bg-linear-to-r from-[#7565D9] to-[#4D0ACD] text-white text-2xl 
             flex items-center justify-center shadow-[0_8px_24px_rgba(95,62,184,0.20)]
             hover:scale-110 transition-all z-[999]">
        💬
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white 
                     w-6 h-6 flex items-center justify-center rounded-full 
                     text-[10px] font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-[100px] right-6 w-[400px] h-[500px] bg-white 
                  rounded-xl shadow-2xl flex flex-col z-[998] animate-scaleIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => dispatch(setActiveTab("chat"))}
                className={`px-3 py-1 font-semibold text-sm border-b-2 transition ${
                  activeTab === "chat"
                    ? "text-[#6C5CE7] border-[#6C5CE7]"
                    : "text-gray-500 border-transparent"
                }`}>
                Chat
              </button>
              <button
                onClick={() => dispatch(setActiveTab("participants"))}
                className={`px-3 py-1 font-semibold text-sm border-b-2 transition ${
                  activeTab === "participants"
                    ? "text-[#6C5CE7] border-[#6C5CE7]"
                    : "text-gray-500 border-transparent"
                }`}>
                Participants
              </button>
            </div>
            <button
              onClick={handleToggle}
              className="text-gray-500 text-xl px-2 hover:text-black transition">
              ✕
            </button>
          </div>

          {activeTab === "chat" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-center">
                    <p className="text-gray-400 text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[80%] px-3 py-2 rounded-lg ${
                        msg.sender === role
                          ? "bg-[#6C5CE7] text-white ml-auto"
                          : "bg-gray-100 text-black"
                      }`}>
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          msg.sender === role
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}>
                        {msg.senderName}
                      </div>
                      <div className="wrap-break-word text-sm">{msg.text}</div>
                    </div>
                  ))
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 p-4 border-t border-gray-200">
                <input
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-md text-sm font-semibold">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between text-xs font-semibold text-gray-500 uppercase">
                <h4>Name</h4>
                {role === "teacher" && <h4>Action</h4>}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Teacher */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">
                    {role === "teacher" ? "Teacher (You)" : "Teacher"}
                  </span>
                </div>

                {students.map((student) => (
                  <div
                    key={student.socketId}
                    className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm">{student.name}</span>

                    {role === "teacher" && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Kick out ${student.name}?`)) {
                            socketService.emit(
                              "student:kick",
                              student.socketId
                            );
                          }
                        }}
                        className="text-[#6C5CE7] font-semibold text-sm hover:text-[#5E4DBD]">
                        Kick out
                      </button>
                    )}
                  </div>
                ))}

                {students.length === 0 && role === "teacher" && (
                  <p className="text-gray-400 text-sm mt-3">
                    No students joined yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatPopup;
