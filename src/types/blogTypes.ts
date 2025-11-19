export type BlogBase = {
  title: string;
  description: string;
  image?: string | null;
};

export type CreateBlogInput = BlogBase & {
  author_id: number;
};

export type UpdateBlogInput = Partial<BlogBase>;

export type Blog = BlogBase & {
  id: number;
  author_id: number;
  created_at: string;                   
  slug: string;
};

export type PaginatedBlogs = {
  blogs: Blog[];                      
  total: number;
  page: number;
  limit: number;
  offset: number;
};
