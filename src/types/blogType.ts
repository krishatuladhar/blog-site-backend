// Before the blog is created in the database
export type BlogBase = {
  category: string;
  title: string;
  description: string;
  image?: string | null;
};

export type createBlogInput = BlogBase & {
  author_id: number;
  isFeatured?: boolean;
};

export type updateBlogInput = Partial<BlogBase> & {
  isFeatured?: boolean; 
};

// After the blog is created in the database
export type Blog = BlogBase & {
  id: number;
  author_id: number;
  created_at: string;
  slug: string;
  isFeatured: boolean;
};

export type Pagination = {
  total: number | null;
  page: number;
  limit: number;
  totalPage: number;
};

// Reusable Pagination block
export type ApiResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type FilterQuery = {
  sort?: string;
  search?: string;
  isFeatured?: boolean;
  page: number;
  limit: number;
};
