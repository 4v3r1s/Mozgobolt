const userController = require('../Controller/userController');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


jest.mock('../model/user', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: {
        userId: 1,
        email: 'test@example.com'
      },
      cookies: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'new@example.com',
        jelszo: 'password123',
        felhasznalonev: 'newuser',
        hirlevel: true
      };
      
      const hashedPassword = 'hashedpassword123';
      const mockCreatedUser = {
        id: 1,
        email: userData.email,
        felhasznalonev: userData.felhasznalonev,
        hirlevel: userData.hirlevel
      };
      
      req.body = userData;
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockCreatedUser);
      
      await userController.createUser(req, res);
      
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.jelszo, 10);
      expect(User.create).toHaveBeenCalledWith({
        email: userData.email,
        jelszo: hashedPassword,
        felhasznalonev: userData.felhasznalonev,
        hirlevel: userData.hirlevel
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Felhasználó sikeresen létrehozva!',
        user: mockCreatedUser
      });
    });

    it('should return 400 when required fields are missing', async () => {
      req.body = {
        email: 'new@example.com',
        
      };
      
      await userController.createUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hiányzó kötelező mezők!' });
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user and return a token', async () => {
      const loginData = {
        email: 'test@example.com',
        jelszo: 'password123'
      };
      
      const mockUser = {
        id: 1,
        email: loginData.email,
        jelszo: 'hashedpassword123',
        szerep: 'user'
      };
      
      const mockToken = 'jwt-token-123';
      
      req.body = loginData;
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);
      
      await userController.authenticateUser(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.jelszo, mockUser.jelszo);
      expect(jwt.sign).toHaveBeenCalledWith(
        { 
          userId: mockUser.id, 
          email: mockUser.email,
          role: mockUser.szerep 
        },
        "secretkey",
        { expiresIn: "1h" }
      );
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        message: 'Sikeres bejelentkezés!',
        token: mockToken
      });
    });

    it('should return 400 when login data is missing', async () => {
      req.body = {
        email: 'test@example.com'
        
      };
      
      await userController.authenticateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hiányzó bejelentkezési adatok!' });
    });

    it('should return 401 when user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        jelszo: 'password123'
      };
      
      User.findOne.mockResolvedValue(null);
      
      await userController.authenticateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Érvénytelen email vagy jelszó!' });
    });

    it('should return 401 when password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        jelszo: 'wrongpassword'
      };
      
      const mockUser = {
        id: 1,
        email: loginData.email,
        jelszo: 'hashedpassword123'
      };
      
      req.body = loginData;
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      
      await userController.authenticateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Érvénytelen email vagy jelszó!' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', felhasznalonev: 'user1' },
        { id: 2, email: 'user2@example.com', felhasznalonev: 'user2' }
      ];
      
      User.findAll.mockResolvedValue(mockUsers);
      
      await userController.getAllUsers(req, res);
      
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ["jelszo"] }
      });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getUser', () => {
    it('should return a specific user', async () => {
      const userId = 1;
      const mockUser = { 
        id: userId, 
        email: 'user@example.com',
        felhasznalonev: 'username'
      };
      
      req.params.id = userId;
      
      User.findByPk.mockResolvedValue(mockUser);
      
      await userController.getUser(req, res);
      
      expect(User.findByPk).toHaveBeenCalledWith(userId, { 
        attributes: { exclude: ["password"] } 
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 999;
      
      User.findByPk.mockResolvedValue(null);
      
      await userController.getUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateData = {
        felhasznalonev: 'updateduser',
        vezeteknev: 'Updated',
        keresztnev: 'User',
        szuletesidatum: '1990-01-01'
      };
      
      req.params.id = userId;
      req.body = updateData;
      
      User.update.mockResolvedValue([1]); 
      
      await userController.updateUser(req, res);
      
      expect(User.update).toHaveBeenCalledWith(
        expect.objectContaining({
          felhasznalonev: 'updateduser',
          vezeteknev: 'Updated',
          keresztnev: 'User',
          szuletesidatum: expect.any(Date)
        }),
        { 
          where: { id: userId },
          returning: true
        }
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó sikeresen frissítve!' });
    });

    it('should hash password if provided', async () => {
      const userId = 1;
      const updateData = {
        felhasznalonev: 'updateduser',
        jelszo: 'newpassword123'
      };
      
      const hashedPassword = 'newhashed123';
      
      req.params.id = userId;
      req.body = updateData;
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.update.mockResolvedValue([1]); 
      
      await userController.updateUser(req, res);
      
      expect(bcrypt.hash).toHaveBeenCalledWith(updateData.jelszo, 10);
      expect(User.update).toHaveBeenCalledWith(
        expect.objectContaining({
          felhasznalonev: 'updateduser',
          jelszo: hashedPassword
        }),
        expect.any(Object)
      );
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 999;
      req.body = { felhasznalonev: 'updateduser' };
      
      User.update.mockResolvedValue([0]); 
      
      await userController.updateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található!' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;
      
      req.params.id = userId;
      
      User.destroy.mockResolvedValue(1); 
      
      await userController.deleteUser(req, res);
      
      expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully!' });
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 999;
      
      User.destroy.mockResolvedValue(0); 
      
      await userController.deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });

  describe('getUserProfile', () => {
    it('should return the logged in user profile', async () => {
      const userId = 1;
      const mockUser = { 
        id: userId, 
        email: 'user@example.com',
        felhasznalonev: 'username',
        vezeteknev: 'Test',
        keresztnev: 'User'
      };
      
      req.user = { userId };
      
      User.findByPk.mockResolvedValue(mockUser);
      
      await userController.getUserProfile(req, res);
      
      expect(User.findByPk).toHaveBeenCalledWith(userId, { 
        attributes: { exclude: ["jelszo"] } 
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 when userId is missing', async () => {
      req.user = {}; 
      
      await userController.getUserProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hiányzó felhasználói azonosító' });
    });

    it('should return 404 when user not found', async () => {
      req.user = { userId: 999 };
      
      User.findByPk.mockResolvedValue(null);
      
      await userController.getUserProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található!' });
    });
  });
});
