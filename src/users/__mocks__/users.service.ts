import {
  updatedUserStub,
  userStubWithPassword,
  userStubWithoutPassword,
} from '../test/stubs';

export const UsersService = jest.fn().mockReturnValue({
  currentUser: jest.fn().mockResolvedValue(userStubWithoutPassword()),
  getUserByUsername: jest.fn().mockResolvedValue(userStubWithoutPassword()),
  getUsers: jest.fn().mockResolvedValue([userStubWithoutPassword()]),
  createUser: jest.fn().mockResolvedValue(userStubWithoutPassword()),
  updateUser: jest.fn().mockResolvedValue(updatedUserStub()),
  validateUser: jest.fn().mockResolvedValue(userStubWithPassword()),
});
