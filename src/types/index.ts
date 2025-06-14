export type Post = {
  id: number;
  title: string;
  content: string;
  points: number;
  author: string;
  commentsCount: number;
  createdAt: string;
  status?: "pending" | "approved";
};

export type UserData = {
  id: number;
  email: string;
  name: string | null;
  username: string;
  posts: Post[];
  upvotedPosts: Post[];
  downvotedPosts: Post[];
};

export type FullPost = {
  id: number;
  title: string;
  content: string;
  points: number;
  author: {
    username: string;
  };
  commentsCount: number;
  createdAt: string;
};

export type CommentNode = {
  id: number;
  content: string;
  postId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  author: { username: string };
  replies: CommentNode[];
};
