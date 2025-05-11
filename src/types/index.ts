export type Post = {
  id: number;
  title: string;
  points: number;
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
};
