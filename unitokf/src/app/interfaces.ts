// auth interfaces
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface GenericResponse {
    message: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    password: string;
}

export interface Profile {
    id?: string;
    name: string;
    email: string;
    institutionId: string;
    academicLevel: string;
    skills: string[];
    bio: string;
    course: string;
    interests: string[];
    profileImage?: string;
    coverImage?: string | null;

    followersCount?: number;
    followingCount?: number;
    viewsCount?: number;
    createdAt?: string;
    userId: string;

    institution?: {
        id: string;
        name: string;
    };

    showFullBio?: boolean;
}

export interface ProfileView {
    id: string;
    viewer: {
        profile: Profile;
    };
    createdAt: string;
}

export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    follower?: {
        profile: Profile;
    };
    following?: {
        profile: Profile;
    };
}

export interface Author {
    id: string;
    name: string;
    profileImage?: string | null;
    academicLevel?: string;
}






// Video interfaces
export interface CreateVideoDto {
  title: string;
  description: string;
  tags: string[];
  videourl: string;
}

export interface UpdateVideoDto {
  title?: string;
  description?: string;
  tags?: string[];
  videoUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  profileImage?: string | null;
  institution?: {name: string} | null;
  academicLevel?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  comments?: Comment[];
}

export interface VideoLikeResponse {
  id: string;
  videoId: string;
  createdAt: string;
}

export interface LikeStatusResponse {
  hasLiked: boolean;
}

export interface VideoComment {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    profileImage?: string | null;
    institution?: {
      name: string;
    } | null;
  };
}

export interface VideoCommentResponse {
  total: number;
  comments: VideoComment[];
}

export interface CreateVideoCommentRequest {
  content: string;
}

export interface UpdateVideoCommentRequest {
  content: string;
}

export interface GlobalSearchResult {
  profiles: Profile[];
  videos: Video[];
}

// UniTok Request interfaces

export interface CreateRequestDto {
  title: string;
  details: string;
  targetInstitution?: string;
}

export interface UpdateRequestDto {
  title?: string;
  details?: string;
  targetInstitution?: string;
}

export interface RequestUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  institution?: string | null;
}

export interface UniTokRequest {
  id: string;
  title: string;
  details: string;
  targetInstitution?: string | null;
  createdAt: string;
  requester: RequestUser;
}