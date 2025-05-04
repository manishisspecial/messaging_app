export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  reactions: Record<string, string[]>;
  isEdited?: boolean;
  isDeleted?: boolean;
  replyTo?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  chats: Chat[];
  users: Record<string, User>;
  currentUserId: string;
  selectedChatId?: string;
  searchQuery: string;
  filter: 'all' | 'unread' | 'pinned';
}

export interface ChatActions {
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  searchChats: (query: string) => void;
  filterChats: (filter: 'all' | 'unread' | 'pinned') => void;
  togglePin: (chatId: string) => void;
  toggleMute: (chatId: string) => void;
  markAsRead: (chatId: string) => void;
  addReaction: (messageId: string, reaction: string) => void;
  removeReaction: (messageId: string, reaction: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  replyToMessage: (messageId: string) => void;
}

export interface Notification {
  id: string;
  type: 'message' | 'reaction' | 'mention' | 'system';
  userId: string;
  messageId?: string;
  chatId?: string;
  text: string;
  timestamp: number;
  isRead: boolean;
} 