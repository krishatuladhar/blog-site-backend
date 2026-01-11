export enum RoleEnum {
  USER = "user",
  AUTHOR = "author",
}

export type AuthorBase = {
  email: string;
  password?: string;
  name: string;
  profile?: string | null;
  role: RoleEnum;
};

export type registerUserInput = AuthorBase;
export type updateUserInput = Partial<AuthorBase>;

export type userType = AuthorBase & {
  id: number;
  created_at: string;
};
