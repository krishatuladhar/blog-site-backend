export type AuthorBase = {
  email: string;
  password?: string;
  name: string;
  profile?: string | null;
  role: "user" | "author";
};

export type CreateAuthorInput = AuthorBase;
export type UpdateAuthorInput = Partial<AuthorBase>;

export type Author = AuthorBase & {
  id: number;
  created_at: string;
};
