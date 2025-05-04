"use client";
import { useState, useRef, useEffect } from "react";

// Mock Data
const users = [
  {
    id: "1",
    name: "Mandeep Bhaiya",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "online",
  },
  {
    id: "2",
    name: "Maya Ma'am",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "offline",
  },
  {
    id: "3",
    name: "Aakash Rai",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "online",
  },
  {
    id: "4",
    name: "Abheepay_Card_Swipe",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    status: "offline",
  },
  {
    id: "5",
    name: "Mrityunjay Roy Sir",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    status: "online",
  },
  {
    id: "6",
    name: "Malika Ji",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    status: "away",
  },
];

const chats = [
  {
    id: "1",
    userId: "1",
    lastMessage: "Ok",
    lastTime: "6:35 pm",
    unread: 1,
    messages: [
      { from: "1", text: "Ok", time: "6:35 pm" },
      { from: "me", text: "Hello!", time: "6:34 pm" },
    ],
  },
  {
    id: "2",
    userId: "2",
    lastMessage: "Photo",
    lastTime: "4:59 pm",
    unread: 0,
    messages: [
      { from: "2", text: "Photo", time: "4:59 pm" },
      { from: "me", text: "Send the update", time: "4:58 pm" },
    ],
  },
  {
    id: "3",
    userId: "3",
    lastMessage: "Team name...",
    lastTime: "11:11 am",
    unread: 0,
    messages: [
      { from: "3", text: "Date--04 may 2025 Team name...", time: "11:11 am" },
    ],
  },
  {
    id: "4",
    userId: "4",
    lastMessage: "DEAR TEAM MEMBER OF...",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { from: "4", text: "DEAR TEAM MEMBER OF...", time: "Yesterday" },
    ],
  },
  {
    id: "5",
    userId: "5",
    lastMessage: "Humko nhi lagta sir ye kar payega...",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { from: "5", text: "Humko nhi lagta sir ye kar payega...", time: "Yesterday" },
    ],
  },
  {
    id: "6",
    userId: "6",
    lastMessage: "Hmmmmmm ji",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { from: "6", text: "Hmmmmmm ji", time: "Yesterday" },
    ],
  },
];

export default function Page() {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState(chats);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = { from: "me", text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setChatList((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: message, lastTime: newMsg.time }
          : c
      )
    );
    setSelectedChat((prev) => ({ ...prev, messages: [...prev.messages, newMsg], lastMessage: message, lastTime: newMsg.time }));
    setMessage("");
  };

  const filteredChats = chatList.filter((c) => {
    const user = users.find((u) => u.id === c.userId);
    return user && user.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-[#f7f9fa]">
      {/* Sidebar */}
      <div className="w-20 bg-[#f0f2f5] flex flex-col items-center py-4 border-r border-gray-200">
        <div className="bg-[#25d366] w-12 h-12 rounded-full flex items-center justify-center mb-6">
          <svg width="28" height="28" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M16 2.667A13.333 13.333 0 0 0 4.12 24.56L2.68 29.72a1.333 1.333 0 0 0 1.6 1.6l5.16-1.44A13.333 13.333 0 1 0 16 2.667Zm0 24A10.667 10.667 0 0 1 8.2 25.2a1.333 1.333 0 0 0-.92-.16l-3.36.94.94-3.36a1.333 1.333 0 0 0-.16-.92A10.667 10.667 0 1 1 16 26.667Z"/><path fill="#fff" d="M23.32 19.6c-.36-.18-2.12-1.04-2.44-1.16-.32-.12-.56-.18-.8.18-.24.36-.92 1.16-1.12 1.4-.2.24-.4.28-.76.1-.36-.18-1.52-.56-2.9-1.8-1.07-.96-1.8-2.16-2-2.52-.2-.36-.02-.56.16-.74.16-.16.36-.4.54-.6.18-.2.24-.36.36-.6.12-.24.06-.44-.02-.62-.08-.18-.8-1.92-1.1-2.64-.3-.72-.6-.62-.8-.62-.2 0-.44-.02-.68-.02-.24 0-.62.08-.94.36-.32.28-1.24 1.2-1.24 2.92 0 1.72 1.24 3.38 1.42 3.62.18.24 2.44 3.74 6.06 5.08.84.32 1.5.5 2.02.64.84.22 1.6.18 2.2.1.68-.1 2.12-.86 2.42-1.7.3-.84.3-1.56.22-1.7-.08-.14-.32-.22-.68-.4Z"/></svg>
        </div>
        <div className="flex flex-col gap-6 text-gray-400">
          <button className="hover:text-[#25d366]"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" fill="currentColor"/></svg></button>
          <button className="hover:text-[#25d366]"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" fill="currentColor"/></svg></button>
          <button className="hover:text-[#25d366]"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" fill="currentColor"/></svg></button>
        </div>
      </div>
      {/* Chat List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-2xl font-semibold text-[#25d366]">WhatsApp</span>
          <button className="text-gray-500 hover:text-[#25d366]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/><circle cx="5" cy="12" r="2" fill="currentColor"/></svg>
          </button>
        </div>
        <div className="px-4 py-3 bg-[#f6f6f6]">
          <div className="relative">
            <input
              className="w-full rounded-lg pl-10 pr-4 py-2 bg-[#f0f2f5] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#25d366]"
              placeholder="Search or start a new chat"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 rounded-full text-sm bg-[#25d366] text-white">All</button>
            <button className="px-3 py-1 rounded-full text-sm bg-[#f0f2f5] text-gray-700">Unread</button>
            <button className="px-3 py-1 rounded-full text-sm bg-[#f0f2f5] text-gray-700">Groups</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const user = users.find((u) => u.id === chat.userId)!;
            return (
              <div
                key={chat.id}
                className={`flex items-center gap-3 px-6 py-4 cursor-pointer border-b border-gray-100 hover:bg-[#f6f6f6] ${selectedChat.id === chat.id ? "bg-[#e7f8ef]" : ""}`}
                onClick={() => setSelectedChat(chat)}
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">{user.name}</span>
                    <span className="text-xs text-gray-400">{chat.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500 truncate">{chat.lastMessage}</span>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-[#25d366] text-white text-xs rounded-full px-2 py-0.5">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#f7f9fa]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
          <img src={users.find(u => u.id === selectedChat.userId)?.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">{users.find(u => u.id === selectedChat.userId)?.name}</div>
            <div className="text-xs text-gray-500">{users.find(u => u.id === selectedChat.userId)?.status}</div>
          </div>
          <button className="text-gray-500 hover:text-[#25d366]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/><circle cx="5" cy="12" r="2" fill="currentColor"/></svg>
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {selectedChat.messages.map((msg, idx) => {
            const isMe = msg.from === "me";
            const user = users.find(u => u.id === selectedChat.userId)!;
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${isMe ? "bg-[#dcf8c6] text-gray-900" : "bg-white text-gray-900"}`}>
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-400 text-right mt-1">{msg.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center gap-3">
          <button className="text-gray-400 hover:text-[#25d366]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10Zm1-14h-2v6h2V8Zm0 8h-2v2h2v-2Z" fill="currentColor"/></svg>
          </button>
          <input
            className="flex-1 rounded-full px-4 py-2 bg-[#f0f2f5] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#25d366]"
            placeholder="Type a message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            className="bg-[#25d366] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#20ba5a]"
            onClick={handleSend}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
} 