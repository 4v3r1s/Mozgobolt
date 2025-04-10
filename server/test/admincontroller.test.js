const adminController = require('../Controller/adminController');
const { User, Termek, Raktar, napi_fogyas } = require('../model');


jest.mock('../model', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Termek: {},
  Raktar: {},
  napi_fogyas: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Admin Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    req = {
      user: { szerep: 'admin' },
      params: {},
      body: {}
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users when admin is authenticated', async () => {
      const mockUsers = [
        { id: 1, email: 'test@test.com', felhasznalonev: 'test1', szerep: 'user' },
        { id: 2, email: 'admin@test.com', felhasznalonev: 'admin', szerep: 'admin' }
      ];
      
      User.findAll.mockResolvedValue(mockUsers);
      
      await adminController.getAllUsers(req, res);
      
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'email', 'felhasznalonev', 'telefonszam', 'vezeteknev', 'keresztnev', 'szuletesidatum', 'szerep', 'hirlevel']
      });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 403 when non-admin tries to access users', async () => {
      req.user.szerep = 'user';
      
      await adminController.getAllUsers(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nincs jogosultsága ehhez a művelethez' });
    });

    it('should handle errors and return 500', async () => {
      User.findAll.mockRejectedValue(new Error('Database error'));
      
      await adminController.getAllUsers(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szerver hiba történt' });
    });
  });

  describe('updateUser', () => {
    it('should update a user when admin is authenticated', async () => {
      const userId = 1;
      const updatedData = {
        felhasznalonev: 'updatedUser',
        email: 'updated@test.com',
        szerep: 'user',
        hirlevel: true
      };
      
      const mockUser = {
        id: userId,
        felhasznalonev: 'oldUsername',
        email: 'old@test.com',
        szerep: 'user',
        hirlevel: false,
        save: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = userId;
      req.body = updatedData;
      
      User.findByPk.mockResolvedValue(mockUser);
      
      await adminController.updateUser(req, res);
      
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(mockUser.felhasznalonev).toBe(updatedData.felhasznalonev);
      expect(mockUser.email).toBe(updatedData.email);
      expect(mockUser.szerep).toBe(updatedData.szerep);
      expect(mockUser.hirlevel).toBe(updatedData.hirlevel);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Felhasználó sikeresen frissítve', 
        user: mockUser 
      });
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 999;
      
      User.findByPk.mockResolvedValue(null);
      
      await adminController.updateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található' });
    });

    it('should return 403 when non-admin tries to update a user', async () => {
      req.user.szerep = 'user';
      
      await adminController.updateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nincs jogosultsága ehhez a művelethez' });
    });

    it('should handle errors and return 500', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));
      
      await adminController.updateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szerver hiba történt' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when admin is authenticated', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = userId;
      
      User.findByPk.mockResolvedValue(mockUser);
      
      await adminController.deleteUser(req, res);
      
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó sikeresen törölve' });
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 999;
      
      User.findByPk.mockResolvedValue(null);
      
      await adminController.deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található' });
    });

    it('should return 403 when non-admin tries to delete a user', async () => {
      req.user.szerep = 'user';
      
      await adminController.deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nincs jogosultsága ehhez a művelethez' });
    });
  });

  describe('getAllNapiFogyas', () => {
    it('should return all napi_fogyas records with related data', async () => {
      const mockNapiFogyasok = [
        { 
          id: 1, 
          termek_id: 1, 
          mennyiseg: 5, 
          datum: new Date(),
          termekData: { nev: 'Test Product', kiszereles: '500g', kepUrl: 'test.jpg' },
          raktarData: { rendszam: 'ABC-123' }
        }
      ];
      
      napi_fogyas.findAll.mockResolvedValue(mockNapiFogyasok);
      
      await adminController.getAllNapiFogyas(req, res);
      
      expect(napi_fogyas.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Termek,
            attributes: ['nev', 'kiszereles', 'kepUrl'],
            as: 'termekData'
          }, 
          {
            model: Raktar,
            attributes: ['rendszam'],
            as: 'raktarData'
          }
        ],
        order: [['datum', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(mockNapiFogyasok);
    });

    it('should handle errors and return 500', async () => {
      napi_fogyas.findAll.mockRejectedValue(new Error('Database error'));
      
      await adminController.getAllNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getNapiFogyasById', () => {
    it('should return a specific napi_fogyas record', async () => {
      const napiFogyasId = 1;
      const mockNapiFogyas = { 
        id: napiFogyasId, 
        termek_id: 1, 
        mennyiseg: 5,
        termekData: { nev: 'Test Product' },
        raktarData: { rendszam: 'ABC-123' }
      };
      
      req.params.id = napiFogyasId;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await adminController.getNapiFogyasById(req, res);
      
      expect(napi_fogyas.findByPk).toHaveBeenCalledWith(napiFogyasId, {
        include: [
          {
            model: Termek,
            attributes: ['nev', 'kiszereles', 'kepUrl'],
            as: 'termekData'
          }, 
          {
            model: Raktar,
            attributes: ['rendszam'],
            as: 'raktarData'
          }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockNapiFogyas);
    });

    it('should return 404 when napi_fogyas not found', async () => {
      req.params.id = 999;
      
      napi_fogyas.findByPk.mockResolvedValue(null);
      
      await adminController.getNapiFogyasById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });

  describe('updateNapiFogyas', () => {
    it('should update a napi_fogyas record', async () => {
      const napiFogyasId = 1;
      const updatedData = { mennyiseg: 10 };
      
      const mockNapiFogyas = {
        id: napiFogyasId,
        mennyiseg: 5,
        update: jest.fn().mockResolvedValue({ id: napiFogyasId, mennyiseg: 10 })
      };
      
      req.params.id = napiFogyasId;
      req.body = updatedData;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await adminController.updateNapiFogyas(req, res);
      
      expect(napi_fogyas.findByPk).toHaveBeenCalledWith(napiFogyasId);
      expect(mockNapiFogyas.update).toHaveBeenCalledWith(updatedData);
      expect(res.json).toHaveBeenCalledWith(mockNapiFogyas);
    });

    it('should return 404 when napi_fogyas not found', async () => {
      req.params.id = 999;
      
      napi_fogyas.findByPk.mockResolvedValue(null);
      
      await adminController.updateNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });

  describe('deleteNapiFogyas', () => {
    it('should delete a napi_fogyas record', async () => {
      const napiFogyasId = 1;
      const mockNapiFogyas = {
        id: napiFogyasId,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = napiFogyasId;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await adminController.deleteNapiFogyas(req, res);
      
      expect(napi_fogyas.findByPk).toHaveBeenCalledWith(napiFogyasId);
      expect(mockNapiFogyas.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas deleted successfully' });
    });

    it('should return 404 when napi_fogyas not found', async () => {
      req.params.id = 999;
      
      napi_fogyas.findByPk.mockResolvedValue(null);
      
      await adminController.deleteNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });
});
