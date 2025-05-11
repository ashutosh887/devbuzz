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
