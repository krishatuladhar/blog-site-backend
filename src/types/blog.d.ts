export type BlogBase = {
  title: string;
  description: string;
  image?: string | null;
};

export type CreateBlogInput = BlogBase & {
  author_id: number;
};

export type UpdateBlogInput = Partial<BlogBase>;
