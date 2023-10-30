import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export type UsersForList = {
  id: string;
  username: string;
  name: string;
};

export type UserSession = {
  id: string;
  username: string;
  sessionCreatedAt: number;
};
