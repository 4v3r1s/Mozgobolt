const termekController = require('../Controller/termekController');
const Termek = require('../model/termek');
const path = require('path');
const fs = require('fs');


jest.mock('../model/termek', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn()
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn()
}));

describe('Termek Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      file: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTermek', () => {
    it('should return all termekek', async () => {
      const mockTermekek = [
        { 
          azonosito: 1, 
          nev: 'Test Product 1',
          ar: 1000,
          kepUrl: '/termek-kepek/test1.jpg'
        },
        { 
          azonosito: 2, 
          nev: 'Test Product 2',
          ar: 2000,
          kepUrl: '/termek-kepek/test2.jpg'
        }
      ];
      
      Termek.findAll.mockResolvedValue(mockTermekek);
      
      await termekController.getAllTermek(req, res);
      
      expect(Termek.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockTermekek);
    });

    it('should handle errors and return 500', async () => {
      Termek.findAll.mockRejectedValue(new Error('Database error'));
      
      await termekController.getAllTermek(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getTermekById', () => {
    it('should return a specific termek', async () => {
      const termekId = 1;
      const mockTermek = { 
        azonosito: termekId, 
        nev: 'Test Product',
        ar: 1000,
        kepUrl: '/termek-kepek/test.jpg'
      };
      
      req.params.id = termekId;
      
      Termek.findByPk.mockResolvedValue(mockTermek);
      
      await termekController.getTermekById(req, res);
      
      expect(Termek.findByPk).toHaveBeenCalledWith(termekId);
      expect(res.json).toHaveBeenCalledWith(mockTermek);
    });

    it('should return 404 when termek not found', async () => {
      req.params.id = 999;
      
      Termek.findByPk.mockResolvedValue(null);
      
      await termekController.getTermekById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek not found' });
    });
  });

  describe('createTermek', () => {
    it('should create a new termek with image', async () => {
      const newTermekData = { 
        nev: 'New Product',
        ar: 1500,
        vonalkod: '123456789',
        termekleiras: 'Test description'
      };
      
      const mockFile = {
        filename: 'test-image.jpg'
      };
      
      const mockCreatedTermek = {
        azonosito: 1,
        ...newTermekData,
        kepUrl: '/termek-kepek/test-image.jpg'
      };
      
      req.body = newTermekData;
      req.file = mockFile;
      
      Termek.create.mockResolvedValue(mockCreatedTermek);
      
      await termekController.createTermek(req, res);
      
      expect(Termek.create).toHaveBeenCalledWith(expect.objectContaining({
        ...newTermekData,
        kepUrl: '/termek-kepek/test-image.jpg'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedTermek);
    });

    it('should return 400 when vonalkod is missing', async () => {
      req.body = { 
        nev: 'New Product',
        ar: 1500
      };
      
      await termekController.createTermek(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vonalkod is required' });
    });

    it('should handle validation errors', async () => {
      req.body = { 
        nev: 'New Product',
        ar: 1500,
        vonalkod: '123456789'
      };
      
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{ message: 'Field is required' }];
      
      Termek.create.mockRejectedValue(validationError);
      
      await termekController.createTermek(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Validation error', 
        error: 'Field is required' 
      });
    });
  });

  describe('updateTermek', () => {
    it('should update an existing termek', async () => {
      const termekId = 1;
      const updateData = { 
        nev: 'Updated Product',
        ar: 2000,
        vonalkod: '987654321'
      };
      
      const mockTermek = { 
        azonosito: termekId, 
        nev: 'Original Product',
        ar: 1500,
        vonalkod: '123456789',
        kepUrl: '/termek-kepek/original.jpg',
        update: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };
      
      const mockUpdatedTermek = {
        azonosito: termekId,
        nev: 'Updated Product',
        ar: 2000,
        vonalkod: '987654321',
        kepUrl: '/termek-kepek/original.jpg'
      };
      
      req.params.id = termekId;
      req.body = updateData;
      
      Termek.findByPk.mockResolvedValueOnce(mockTermek).mockResolvedValueOnce(mockUpdatedTermek);
      
      await termekController.updateTermek(req, res);
      
      expect(Termek.findByPk).toHaveBeenCalledWith(termekId);
      expect(mockTermek.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTermek);
    });

    it('should update termek with new image and delete old image', async () => {
      const termekId = 1;
      const updateData = { 
        nev: 'Updated Product'
      };
      
      const mockFile = {
        filename: 'new-image.jpg'
      };
      
      const mockTermek = { 
        azonosito: termekId, 
        nev: 'Original Product',
        kepUrl: '/termek-kepek/original.jpg',
        update: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };
      
      const mockUpdatedTermek = {
        azonosito: termekId,
        nev: 'Updated Product',
        kepUrl: '/termek-kepek/new-image.jpg'
      };
      
      req.params.id = termekId;
      req.body = updateData;
      req.file = mockFile;
      
      path.join.mockReturnValue('/path/to/public/termek-kepek/original.jpg');
      fs.existsSync.mockReturnValue(true);
      
      Termek.findByPk.mockResolvedValueOnce(mockTermek).mockResolvedValueOnce(mockUpdatedTermek);
      
      await termekController.updateTermek(req, res);
      
      expect(path.join).toHaveBeenCalled();
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(mockTermek.update).toHaveBeenCalledWith(expect.objectContaining({
        nev: 'Updated Product',
        kepUrl: '/termek-kepek/new-image.jpg'
      }));
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTermek);
    });

    it('should return 404 when termek not found', async () => {
      req.params.id = 999;
      req.body = { nev: 'Updated Product' };
      
      Termek.findByPk.mockResolvedValue(null);
      
      await termekController.updateTermek(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek not found' });
    });
  });

  describe('deleteTermek', () => {
    it('should delete a termek and its image', async () => {
      const termekId = 1;
      const mockTermek = { 
        azonosito: termekId, 
        nev: 'Test Product',
        kepUrl: '/termek-kepek/test.jpg',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = termekId;
      
      path.join.mockReturnValue('/path/to/public/termek-kepek/test.jpg');
      fs.existsSync.mockReturnValue(true);
      
      Termek.findByPk.mockResolvedValue(mockTermek);
      
      await termekController.deleteTermek(req, res);
      
      expect(Termek.findByPk).toHaveBeenCalledWith(termekId);
      expect(path.join).toHaveBeenCalled();
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(mockTermek.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek deleted successfully' });
    });

    it('should return 404 when termek not found', async () => {
      req.params.id = 999;
      
      Termek.findByPk.mockResolvedValue(null);
      
      await termekController.deleteTermek(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek not found' });
    });
  });
});
