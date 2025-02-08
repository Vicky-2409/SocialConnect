interface IAccountType {
  isProfessional: boolean;
  category?: "celebrity" | "company";
  hasWeNetTick?: boolean;
}

export interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  isRestricted?: boolean;
  restrictedFromPostingUntil?: Date;
  bio?: string;
  profilePicUrl: string;
  coverPicUrl?: string;
  followers?: following[];
  following?: following[];
  postsCount?: number;
  likesReceivedCount?: number;
  isPrivate?: boolean;
  accountType: IAccountType;
  blockedByUsers?: string[];
  blockedUsers?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  JWT?: string;
  iat?: Number;
  exp?: Number;
  location?: string;
}

export interface IPost {
  _id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl: string;
  caption: string;
  imageUrls: string[];
  time: Date;
  likedBy: LikedUser[];
  comments: string[];
  updatedAt: string;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  fromAdsService?: boolean;
}

interface LikedUser {
  _id: string; // User ID
  username: string; // User's username
  profilePicUrl?: string; // Optional profile picture URL
}

interface following {
  _id: string; // User ID
  username: string; // User's username
  firstName: string;
  lastName: string;
  profilePicUrl?: string; // Optional profile picture URL
}

export interface IComment {
  _id: string;
  userId: string;
  username: string;
  profilePicUrl: string;
  comment: string;
  replies:IComment[]
  likedBy?: string[];
  updatedAt: string;
  createdAt: string;
  isLiked?: boolean;
}

export interface CallSignalData {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  convoId: string;
  caller?: string;
}
