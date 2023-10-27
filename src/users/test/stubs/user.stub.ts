import { User } from '@prisma/client';

export const userStubWithPassword = (): User => {
  return {
    id: 'random-id',
    email: 'test@mail.com',
    username: 'test',
    password: 'password',
    name: 'Test User',
  };
};

export const userStubWithoutPassword = () => {
  return {
    id: 'random-id',
    email: 'test@mail.com',
    username: 'test',
    name: 'Test User',
  };
};

export const updatedUserStub = () => {
  return {
    id: 'random-id',
    email: 'updated@mail.com',
    username: 'updated',
    name: 'Updated User',
  };
};
