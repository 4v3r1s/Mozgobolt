const raktarKeszlet2Controller = require('../Controller/raktarKeszlet2Controller');
const RaktarKeszlet2 = require('../model/raktarKeszlet2');
const Termek = require('../model/termek');
const Raktar = require('../model/raktar');


jest.mock('../model/raktarKeszlet2', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('../model/termek', () => ({
  findByPk: jest.fn()
}));

jest.mock('../model/raktar', () => ({
  findByPk: jest.fn()
}));

describe('RaktarKeszlet2 Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRaktarKeszlet2', () => {
    it('should return all raktarKeszlet2 records with related data', async () => {
      const mockKeszletek = [
        { 
          raktarId: 1, 
          termekId: 1, 
          mennyiseg: 50,
          termek: { nev: 'Test Product', kiszereles: '500g' },
          raktar: { rendszam: 'ABC-123' }
        },
        { 
          raktarId: 1, 
          termekId: 2, 
          mennyiseg: 30,
          termek: { nev: 'Another Product', kiszereles: '1kg' },
          raktar: { rendszam: 'ABC-123' }
        }
      ];
      
      RaktarKeszlet2.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszlet2Controller.getAllRaktarKeszlet2(req, res);
      
      expect(RaktarKeszlet2.findAll).toHaveBeenCalledWith({
        include: [
          { model: Termek, as: 'termek' },
          { model: Raktar, as: 'raktar' }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });

    it('should handle errors and return 500', async () => {
      RaktarKeszlet2.findAll.mockRejectedValue(new Error('Database error'));
      
      await raktarKeszlet2Controller.getAllRaktarKeszlet2(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getByRaktarId', () => {
    it('should return keszlet records for a specific raktar', async () => {
      const raktarId = 1;
      const mockKeszletek = [
        { 
          raktarId: raktarId, 
          termekId: 1, 
          mennyiseg: 50,
          termek: { nev: 'Test Product', kiszereles: '500g' },
          raktar: { rendszam: 'ABC-123' }
        },
        { 
          raktarId: raktarId, 
          termekId: 2, 
          mennyiseg: 30,
          termek: { nev: 'Another Product', kiszereles: '1kg' },
          raktar: { rendszam: 'ABC-123' }
        }
      ];
      
      req.params.id = raktarId;
      
      RaktarKeszlet2.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszlet2Controller.getByRaktarId(req, res);
      
      expect(RaktarKeszlet2.findAll).toHaveBeenCalledWith({
        where: { raktarId: raktarId },
        include: [
          { model: Termek, as: 'termek' },
          { model: Raktar, as: 'raktar' }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });
  });

  describe('getByTermekId', () => {
    it('should return keszlet records for a specific termek', async () => {
      const termekId = 1;
      const mockKeszletek = [
        { 
          raktarId: 1, 
          termekId: termekId, 
          mennyiseg: 50,
          termek: { nev: 'Test Product', kiszereles: '500g' },
          raktar: { rendszam: 'ABC-123' }
        },
        { 
          raktarId: 2, 
          termekId: termekId, 
          mennyiseg: 30,
          termek: { nev: 'Test Product', kiszereles: '500g' },
          raktar: { rendszam: 'DEF-456' }
        }
      ];
      
      req.params.id = termekId;
      
      RaktarKeszlet2.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszlet2Controller.getByTermekId(req, res);
      
      expect(RaktarKeszlet2.findAll).toHaveBeenCalledWith({
        where: { termekId: termekId },
        include: [
          { model: Termek, as: 'termek' },
          { model: Raktar, as: 'raktar' }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });
  });

  describe('getSpecificKeszlet', () => {
    it('should return a specific keszlet record', async () => {
      const raktarId = 1;
      const termekId = 1;
      const mockKeszlet = { 
        raktarId: raktarId, 
        termekId: termekId, 
        mennyiseg: 50,
        termek: { nev: 'Test Product', kiszereles: '500g' },
        raktar: { rendszam: 'ABC-123' }
      };
      
      req.params.raktarId = raktarId;
      req.params.termekId = termekId;
      
      RaktarKeszlet2.findOne.mockResolvedValue(mockKeszlet);
      
      await raktarKeszlet2Controller.getSpecificKeszlet(req, res);
      
      expect(RaktarKeszlet2.findOne).toHaveBeenCalledWith({
        where: { 
          raktarId: raktarId,
          termekId: termekId
        },
        include: [
          { model: Termek, as: 'termek' },
          { model: Raktar, as: 'raktar' }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszlet);
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.raktarId = 999;
      req.params.termekId = 999;
      
      RaktarKeszlet2.findOne.mockResolvedValue(null);
      
      await raktarKeszlet2Controller.getSpecificKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Készlet not found' });
    });
  });

  describe('createRaktarKeszlet2', () => {
    it('should create a new keszlet record', async () => {
      const newKeszletData = { 
        raktarId: 1, 
        termekId: 1, 
        mennyiseg: 50 
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123' 
      };
      
      const mockTermek = { 
        azonosito: 1, 
        nev: 'Test Product' 
      };
      
      const mockCreatedKeszlet = { 
        ...newKeszletData
      };
      
      req.body = newKeszletData;
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      Termek.findByPk.mockResolvedValue(mockTermek);
      RaktarKeszlet2.create.mockResolvedValue(mockCreatedKeszlet);
      
      await raktarKeszlet2Controller.createRaktarKeszlet2(req, res);
      
      expect(Raktar.findByPk).toHaveBeenCalledWith(newKeszletData.raktarId);
      expect(Termek.findByPk).toHaveBeenCalledWith(newKeszletData.termekId);
      expect(RaktarKeszlet2.create).toHaveBeenCalledWith(newKeszletData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedKeszlet);
    });

    it('should return 404 when raktar not found', async () => {
      req.body = { 
        raktarId: 999, 
        termekId: 1, 
        mennyiseg: 50 
      };
      
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarKeszlet2Controller.createRaktarKeszlet2(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });

    it('should return 404 when termek not found', async () => {
      req.body = { 
        raktarId: 1, 
        termekId: 999, 
        mennyiseg: 50 
      };
      
      Raktar.findByPk.mockResolvedValue({ azonosito: 1 });
      Termek.findByPk.mockResolvedValue(null);
      
      await raktarKeszlet2Controller.createRaktarKeszlet2(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek not found' });
    });
  });

  describe('updateRaktarKeszlet2', () => {
    it('should update an existing keszlet record', async () => {
      const raktarId = 1;
      const termekId = 1;
      const updateData = { 
        mennyiseg: 75 
      };
      
      const mockKeszlet = { 
        raktarId: raktarId, 
        termekId: termekId, 
        mennyiseg: 50,
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.raktarId = raktarId;
      req.params.termekId = termekId;
      req.body = updateData;
      
      RaktarKeszlet2.findOne.mockResolvedValue(mockKeszlet);
      
      await raktarKeszlet2Controller.updateRaktarKeszlet2(req, res);
      
      expect(RaktarKeszlet2.findOne).toHaveBeenCalledWith({
        where: { 
          raktarId: raktarId,
          termekId: termekId
        }
      });
      expect(mockKeszlet.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        raktarId: raktarId,
        termekId: termekId,
        mennyiseg: 75
      }));
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.raktarId = 999;
      req.params.termekId = 999;
      req.body = { mennyiseg: 75 };
      
      RaktarKeszlet2.findOne.mockResolvedValue(null);
      
      await raktarKeszlet2Controller.updateRaktarKeszlet2(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Készlet not found' });
    });
  });

  describe('deleteRaktarKeszlet2', () => {
    it('should delete an existing keszlet record', async () => {
      const raktarId = 1;
      const termekId = 1;
      
      const mockKeszlet = { 
        raktarId: raktarId, 
        termekId: termekId, 
        mennyiseg: 50,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.raktarId = raktarId;
      req.params.termekId = termekId;
      
      RaktarKeszlet2.findOne.mockResolvedValue(mockKeszlet);
      
      await raktarKeszlet2Controller.deleteRaktarKeszlet2(req, res);
      
      expect(RaktarKeszlet2.findOne).toHaveBeenCalledWith({
        where: { 
          raktarId: raktarId,
          termekId: termekId
        }
      });
      expect(mockKeszlet.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Készlet deleted successfully' });
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.raktarId = 999;
      req.params.termekId = 999;
      
      RaktarKeszlet2.findOne.mockResolvedValue(null);
      
      await raktarKeszlet2Controller.deleteRaktarKeszlet2(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Készlet not found' });
    });
  });
});
