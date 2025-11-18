export type AuthorBase = {
  name: string;
  profile?: string | null;
};

export type CreateAuthorInput = AuthorBase;
export type UpdateAuthorInput = Partial<AuthorBase>;

export type Author = AuthorBase & {
  id: number;
  created_at: string;
  slug: string;
};
