export type DealType = 'gift' | 'exchange' | 'symbolic';

export type ItemCondition = 'like_new' | 'good' | 'fair' | 'repair';

export type Category =
  | 'tech'
  | 'clothes'
  | 'furniture'
  | 'books'
  | 'gaming'
  | 'sports'
  | 'kids'
  | 'other';

export type ItemStatus = 'active' | 'reserved' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  district?: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  rating: number;
  tradesCompleted: number;
}

export interface Comment {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  replyToId?: string;
  isAuthor?: boolean;
}

export interface TradeOffer {
  id: string;
  offeredByUserId: string;
  offeredByUserName: string;
  offeredItemTitle: string;
  offeredItemPhoto?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  dealType: DealType;
  condition: ItemCondition;
  wantInExchange?: string; // What the user wants in exchange (if dealType is exchange)
  photos: string[];
  city: string;
  district?: string;
  phone?: string;
  userId: string;
  user: User;
  status: ItemStatus;
  createdAt: string;
  views: number;
  commentsCount: number;
  isFeatured?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
  tradeProposal?: {
    offeredItemTitle: string;
    offeredItemPhoto?: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPhoto: string;
  itemDealType: DealType;
  participantIds: string[];
  participants: Record<string, User>;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}
