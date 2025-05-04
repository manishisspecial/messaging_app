"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  typing: boolean;
}
interface Message {
  id: string;
  userId: string;
  text: string;
  time: string;
  reactions: { [emoji: string]: string[] };
  image?: string;
  file?: string;
  voice?: string;
}

// Mock Data
const randomAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/48.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/women/49.jpg",
];
const unsplashImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
];
const initialUsers: User[] = [
  { id: "1", name: "Alice", avatar: randomAvatars[1], status: "online", online: true, typing: false },
  { id: "2", name: "Bob", avatar: randomAvatars[0], status: "brb", online: true, typing: false },
  { id: "3", name: "Charlie", avatar: randomAvatars[2], status: "busy", online: true, typing: false },
  { id: "4", name: "Daisy", avatar: randomAvatars[3], status: "online", online: true, typing: false },
];
const myId = "1";
const initialMessages: Message[] = [
  { id: "m1", userId: "2", text: "Hey Alice!", time: "09:00", reactions: {}, image: unsplashImages[0] },
  { id: "m2", userId: "1", text: "Hi Bob! 👋", time: "09:01", reactions: {} },
  { id: "m3", userId: "3", text: "Morning everyone!", time: "09:02", reactions: { "👍": ["1"] }, file: "ProjectPlan.pdf" },
];
const emojiList = ["👍", "😂", "❤️", "😮", "😢", "🔥"];
const statusList = ["online", "brb", "busy"];
const bgPattern = "https://www.transparenttextures.com/patterns/cubes.png";

export default function Page() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [myStatus, setMyStatus] = useState("online");
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate other users typing
  useEffect(() => {
    if (input) {
      setTyping(true);
      setUsers((prev) => prev.map(u => u.id === myId ? { ...u, typing: true } : u));
    } else {
      setTyping(false);
      setUsers((prev) => prev.map(u => u.id === myId ? { ...u, typing: false } : u));
    }
  }, [input]);

  // Simulate someone else typing randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => prev.map(u =>
        u.id !== myId && Math.random() < 0.1
          ? { ...u, typing: !u.typing }
          : u
      ));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Send message
  const sendMessage = () => {
    if (!input.trim() && !uploadImage && !uploadFile && !isRecording) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        userId: myId,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reactions: {},
        image: uploadImage || undefined,
        file: uploadFile || undefined,
        voice: isRecording ? "voice-message.mp3" : undefined,
      },
    ]);
    setInput("");
    setUploadImage(null);
    setUploadFile(null);
    setIsRecording(false);
  };

  // Add emoji reaction
  const addReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const usersReacted = m.reactions[emoji] || [];
        const hasReacted = usersReacted.includes(myId);
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]: hasReacted
              ? usersReacted.filter((id) => id !== myId)
              : [...usersReacted, myId],
          },
        };
      })
    );
    setRecentEmojis((prev) => [emoji, ...prev.filter(e => e !== emoji)].slice(0, 6));
  };

  // Change status
  const changeStatus = (status: string) => {
    setMyStatus(status);
    setUsers((prev) => prev.map(u => u.id === myId ? { ...u, status } : u));
  };

  // Responsive sidebar toggle
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  // Dark mode toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Handle image upload (mocked)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  // Handle file upload (mocked)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0].name);
    }
  };
  // Handle voice message (mocked)
  const handleVoice = () => {
    setIsRecording(!isRecording);
  };

  // WhatsApp-style animated typing dots
  const TypingDots = () => (
    <span className="inline-flex items-center gap-0.5">
      <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-bounce" style={{ animationDelay: "100ms" }} />
      <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
    </span>
  );

  // Bubble tail SVGs
  const BubbleTailLeft = () => (
    <svg className="absolute -left-2 bottom-0" width="16" height="24" viewBox="0 0 16 24"><path d="M16 0v24L0 12z" fill="#fff" className="dark:fill-gray-800"/></svg>
  );
  const BubbleTailRight = () => (
    <svg className="absolute -right-2 bottom-0" width="16" height="24" viewBox="0 0 16 24"><path d="M0 0v24l16-12z" fill="#dcf8c6"/></svg>
  );

  return (
    <div className={`flex h-screen bg-[#e5ddd5] dark:bg-gray-950 overflow-hidden ${dark ? "dark" : ""}`} style={{ backgroundImage: `url(${bgPattern})` }}>
      {/* Sidebar: Online Users */}
      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 flex md:hidden"
          >
            <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 flex flex-col h-full shadow-xl">
              <SidebarContent
                users={users}
                myId={myId}
                myStatus={myStatus}
                changeStatus={changeStatus}
                onClose={handleSidebarClose}
                dark={dark}
                setDark={setDark}
              />
            </div>
            <div className="flex-1 bg-black/30" onClick={handleSidebarClose} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 bg-white dark:bg-gray-900 border-r border-gray-200 flex-col h-full">
        <SidebarContent users={users} myId={myId} myStatus={myStatus} changeStatus={changeStatus} dark={dark} setDark={setDark} />
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#e5ddd5] dark:bg-gray-950 relative" style={{ backgroundImage: `url(${bgPattern})` }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
          <button className="md:hidden text-gray-500 hover:text-[#25d366] p-2" onClick={handleSidebarToggle} aria-label="Open sidebar">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <img src={users[0].avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[#25d366]" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white text-base md:text-lg tracking-tight">General Chat</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">All online users</div>
          </div>
          <button
            className="ml-2 text-gray-400 hover:text-[#25d366] transition-colors duration-200"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0 1 12.79 3a7 7 0 1 0 8.21 9.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
            )}
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 md:px-8 py-4 md:py-6 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isMe = msg.userId === myId;
              const user = users.find(u => u.id === msg.userId)!;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: idx * 0.03 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2">
                    {!isMe && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`relative group font-["Segoe UI","Roboto","San Francisco",sans-serif] ${isMe ? "ml-8" : "mr-8"}`}
                    >
                      <div className={`relative max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md transition-colors duration-200 ${isMe ? "bg-[#dcf8c6] text-gray-900" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"} ${isMe ? "whatsapp-bubble-right" : "whatsapp-bubble-left"}`}
                        style={{ boxShadow: isMe ? "0 2px 8px 0 #b9f5d8" : "0 2px 8px 0 #e0e0e0" }}>
                        {/* Bubble tail */}
                        {!isMe && <span className="absolute -left-2 bottom-0"><BubbleTailLeft /></span>}
                        {isMe && <span className="absolute -right-2 bottom-0"><BubbleTailRight /></span>}
                        <div className="flex flex-col gap-1">
                          <span className="break-words leading-relaxed text-base">{msg.text}</span>
                          {msg.image && (
                            <img src={msg.image} alt="shared" className="w-40 h-28 object-cover rounded mt-2 border shadow" />
                          )}
                          {msg.file && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/></svg>
                              <span className="underline cursor-pointer hover:text-blue-800">{msg.file}</span>
                            </div>
                          )}
                          {msg.voice && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m9-9H3" stroke="currentColor" strokeWidth="2"/></svg>
                              <span>Voice message</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, ids]) => (
                            <button
                              key={emoji}
                              className={`text-xs px-1.5 py-0.5 rounded-full border ${ids.includes(myId) ? "bg-[#25d366] text-white border-[#25d366]" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white border-gray-200 dark:border-gray-700"} transition-colors duration-200 shadow-sm`}
                              onClick={() => addReaction(msg.id, emoji)}
                            >
                              {emoji} {ids.length}
                            </button>
                          ))}
                        </div>
                        {/* Emoji Picker */}
                        <AnimatePresence>
                          {showEmoji === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute z-10 bottom-12 left-0 bg-white dark:bg-gray-900 border rounded shadow p-2 flex gap-1 animate-pop"
                            >
                              {recentEmojis.length > 0 && (
                                <div className="flex gap-1 border-b pb-1 mb-1">
                                  {recentEmojis.map((emoji) => (
                                    <button
                                      key={emoji}
                                      className="text-xl hover:scale-125 transition-transform"
                                      onClick={() => { addReaction(msg.id, emoji); setShowEmoji(null); }}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {emojiList.map((emoji) => (
                                <button
                                  key={emoji}
                                  className="text-xl hover:scale-125 transition-transform"
                                  onClick={() => { addReaction(msg.id, emoji); setShowEmoji(null); }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-300">{msg.time}</span>
                          {isMe && (
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 13l4 4L15 7" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </div>
                      </div>
                      <button
                        className="absolute -bottom-6 right-0 bg-white dark:bg-gray-900 rounded-full shadow-lg p-1 text-gray-400 hover:text-[#25d366] transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        onClick={() => setShowEmoji(msg.id === showEmoji ? null : msg.id)}
                        aria-label="React with emoji"
                      >
                        😊
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Typing Indicator */}
        <div className="px-4 md:px-8 pb-2 text-xs text-gray-500 dark:text-gray-400 min-h-[20px] flex gap-4 items-center">
          <AnimatePresence>
            {users.filter(u => u.id !== myId && u.typing).map(u => (
              <motion.span
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1"
              >
                <span className="font-medium text-[#25d366]">{u.name}</span>
                <TypingDots />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        {/* Message Input */}
        <div className="px-2 md:px-6 py-3 md:py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 md:gap-3 sticky bottom-0 z-10 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 shadow-lg">
          <label className="cursor-pointer text-gray-400 hover:text-[#25d366] transition-colors duration-200">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10" stroke="currentColor" strokeWidth="2"/><rect x="7" y="13" width="3" height="3" rx="1.5" stroke="currentColor" strokeWidth="2"/><path d="M21 19v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" stroke="currentColor" strokeWidth="2"/></svg>
          </label>
          <label className="cursor-pointer text-gray-400 hover:text-[#25d366] transition-colors duration-200">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 1 0 2.828 2.828l7.071-7.07a4 4 0 1 0-5.657-5.657l-8.485 8.485a6 6 0 1 0 8.485 8.485l1.415-1.414" stroke="currentColor" strokeWidth="2"/></svg>
          </label>
          <button
            className={`text-gray-400 hover:text-[#25d366] transition-colors duration-200 ${isRecording ? "animate-pulse text-red-500" : ""}`}
            onClick={handleVoice}
            aria-label="Record voice message"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 1v14m6-7a6 6 0 1 1-12 0" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          <input
            className="flex-1 rounded-full px-4 py-2 bg-[#f0f2f5] dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25d366] text-sm md:text-base shadow-inner"
            placeholder="Type a message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          />
          <motion.button
            whileTap={{ scale: 0.9, rotate: -10 }}
            className="bg-[#25d366] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#20ba5a] transition-colors duration-200 focus:outline-none shadow-lg border-2 border-white dark:border-gray-900"
            onClick={sendMessage}
            aria-label="Send message"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Sidebar content as a subcomponent for reuse
function SidebarContent({ users, myId, myStatus, changeStatus, onClose, dark, setDark }: {
  users: User[];
  myId: string;
  myStatus: string;
  changeStatus: (s: string) => void;
  onClose?: () => void;
  dark: boolean;
  setDark: (d: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-2xl font-semibold text-[#25d366]">Messenger</span>
        <div className="flex gap-2">
          {statusList.map((s) => (
            <button
              key={s}
              className={`px-2 py-1 rounded text-xs capitalize ${myStatus === s ? "bg-[#25d366] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"} transition-colors duration-200`}
              onClick={() => changeStatus(s)}
            >
              {s}
            </button>
          ))}
          <button
            className="ml-2 text-gray-400 hover:text-[#25d366] transition-colors duration-200"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0 1 12.79 3a7 7 0 1 0 8.21 9.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
            )}
          </button>
        </div>
        {onClose && (
          <button className="ml-2 text-gray-400 hover:text-[#25d366] md:hidden" onClick={onClose} aria-label="Close sidebar">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 text-xs text-gray-400 uppercase tracking-wider">Online Users</div>
        <AnimatePresence>
          {users.filter(u => u.online).map((u, idx) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="flex items-center gap-3 mb-4 group cursor-pointer hover:bg-[#e7f8ef] dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
            >
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#25d366] group-hover:shadow-lg transition-shadow" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                  {u.name}
                  {u.id === myId && <span className="text-xs text-[#25d366]">(You)</span>}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>{u.status}</span>
                  {u.typing && <span className="text-[#25d366] animate-pulse ml-2"><span className="inline-block align-middle"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="4" cy="12" r="2" fill="#25d366" className="animate-bounce"/><circle cx="12" cy="12" r="2" fill="#25d366" className="animate-bounce" style={{ animationDelay: '100ms' }}/><circle cx="20" cy="12" r="2" fill="#25d366" className="animate-bounce" style={{ animationDelay: '200ms' }}/></svg></span> typing...</span>}
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${u.online ? "bg-green-500" : "bg-gray-300"} border-2 border-white dark:border-gray-900`}></span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 