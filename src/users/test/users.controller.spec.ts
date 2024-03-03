import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import {
  updatedUserStub,
  userStubWithPassword,
  userStubWithoutPassword,
} from './stubs';
import { UserWithoutPassword, UsersForList } from '../../../types';

jest.mock('../users.service.ts');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(UsersController).toBeDefined();
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      const createUserDto = userStubWithPassword();
      let user: UserWithoutPassword;

      beforeEach(async () => {
        user = await usersController.createUser(createUserDto);
      });

      test('then it should call usersService', () => {
        expect(usersService.createUser).toHaveBeenCalledWith(
          userStubWithPassword(),
        );
      });

      test('then it should return the created user without a password', () => {
        expect(user).toEqual(userStubWithoutPassword());
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: UserWithoutPassword;
      const { username, id } = userStubWithoutPassword();
      const updateUserDto = updatedUserStub();

      beforeEach(async () => {
        user = await usersController.updateUser(username, updateUserDto);
      });

      test('then it should call usersService', () => {
        expect(usersService.updateUser).toHaveBeenCalledWith(
          username,
          updateUserDto,
        );
      });

      test('then it should return the updated user without a password', () => {
        expect(user).toEqual({ id, ...updateUserDto });
      });
    });
  });

  describe('getUserByUsername', () => {
    describe('when getUserByUsername is called', () => {
      let user: UserWithoutPassword;

      beforeEach(async () => {
        user = await usersController.getUserByUsername(
          userStubWithoutPassword().username,
        );
      });

      test('then it should call usersService', () => {
        expect(usersService.getUserByUsername).toBeCalledWith(
          userStubWithoutPassword().username,
        );
      });

      test('then it should return a user without a password', () => {
        expect(user).toEqual(userStubWithoutPassword());
      });
    });
  });

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: UsersForList[] = [];

      beforeEach(async () => {
        users = await usersController.getUsers();
      });

      test('then it should call usersService', () => {
        expect(usersService.getUsers).toHaveBeenCalled();
      });

      test('then it should return an array of users without passwords', () => {
        expect(users).toEqual([userStubWithoutPassword()]);
      });
    });
  });
});
