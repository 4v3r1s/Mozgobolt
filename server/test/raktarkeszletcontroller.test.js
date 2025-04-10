const raktarKeszletController = require('../Controller/raktarKeszletController');
const RaktarKeszlet = require('../model/raktarKeszlet');
const Termek = require('../model/termek');
const Raktar = require('../model/raktar');
const { Op } = require('sequelize');


jest.mock('../model/raktarKeszlet', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  sum: jest.fn()
}));

jest.mock('../model/termek', () => ({
  findByPk: jest.fn()
}));

jest.mock('../model/raktar', () => ({
  findByPk: jest.fn()
}));

jest.mock('sequelize', () => ({
  Op: {
    ne: 'ne'
  }
}));

describe('RaktarKeszlet Controller Tests', () => {
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

  describe('getAllRaktarKeszlet', () => {
    it('should return all raktarKeszlet records with related data', async () => {
      const mockKeszletek = [
        { 
          azonosito: 1,
          raktarId: 1, 
          termekId: 1, 
          keszlet: 50,
          termek: { azonosito: 1, nev: 'Test Product', vonalkod: '123', egysegnyiar: 100, kiszereles: '500g' },
          raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
        },
        { 
          azonosito: 2,
          raktarId: 1, 
          termekId: 2, 
          keszlet: 30,
          termek: { azonosito: 2, nev: 'Another Product', vonalkod: '456', egysegnyiar: 200, kiszereles: '1kg' },
          raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
        }
      ];
      
      RaktarKeszlet.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszletController.getAllRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Termek,
            as: 'termek',
            attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
          },
          {
            model: Raktar,
            as: 'raktar',
            attributes: ['azonosito', 'rendszam', 'max_kapacitas']
          }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });

    it('should handle errors and return 500', async () => {
      RaktarKeszlet.findAll.mockRejectedValue(new Error('Database error'));
      
      await raktarKeszletController.getAllRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getRaktarKeszletById', () => {
    it('should return a specific keszlet record', async () => {
      const keszletId = 1;
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50,
        termek: { azonosito: 1, nev: 'Test Product', vonalkod: '123', egysegnyiar: 100, kiszereles: '500g' },
        raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
      };
      
      req.params.id = keszletId;
      
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszlet);
      
      await raktarKeszletController.getRaktarKeszletById(req, res);
      
      expect(RaktarKeszlet.findByPk).toHaveBeenCalledWith(keszletId, {
        include: [
          {
            model: Termek,
            as: 'termek',
            attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
          },
          {
            model: Raktar,
            as: 'raktar',
            attributes: ['azonosito', 'rendszam', 'max_kapacitas']
          }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszlet);
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.id = 999;
      
      RaktarKeszlet.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.getRaktarKeszletById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet not found' });
    });
  });

  describe('getKeszletByRaktarId', () => {
    it('should return keszlet records for a specific raktar', async () => {
      const raktarId = 1;
      const mockKeszletek = [
        { 
          azonosito: 1,
          raktarId: raktarId, 
          termekId: 1, 
          keszlet: 50,
          termek: { azonosito: 1, nev: 'Test Product', vonalkod: '123', egysegnyiar: 100, kiszereles: '500g' },
          raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
        },
        { 
          azonosito: 2,
          raktarId: raktarId, 
          termekId: 2, 
          keszlet: 30,
          termek: { azonosito: 2, nev: 'Another Product', vonalkod: '456', egysegnyiar: 200, kiszereles: '1kg' },
          raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
        }
      ];
      
      req.params.raktarId = raktarId;
      
      RaktarKeszlet.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszletController.getKeszletByRaktarId(req, res);
      
      expect(RaktarKeszlet.findAll).toHaveBeenCalledWith({
        where: { raktarId: raktarId },
        include: [
          {
            model: Termek,
            as: 'termek',
            attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
          },
          {
            model: Raktar,
            as: 'raktar',
            attributes: ['azonosito', 'rendszam', 'max_kapacitas']
          }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });
  });

  describe('getKeszletByTermekId', () => {
    it('should return keszlet records for a specific termek', async () => {
      const termekId = 1;
      const mockKeszletek = [
        { 
          azonosito: 1,
          raktarId: 1, 
          termekId: termekId, 
          keszlet: 50,
          termek: { azonosito: 1, nev: 'Test Product', vonalkod: '123', egysegnyiar: 100, kiszereles: '500g' },
          raktar: { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 }
        },
        { 
          azonosito: 3,
          raktarId: 2, 
          termekId: termekId, 
          keszlet: 25,
          termek: { azonosito: 1, nev: 'Test Product', vonalkod: '123', egysegnyiar: 100, kiszereles: '500g' },
          raktar: { azonosito: 2, rendszam: 'DEF-456', max_kapacitas: 1500 }
        }
      ];
      
      req.params.termekId = termekId;
      
      RaktarKeszlet.findAll.mockResolvedValue(mockKeszletek);
      
      await raktarKeszletController.getKeszletByTermekId(req, res);
      
      expect(RaktarKeszlet.findAll).toHaveBeenCalledWith({
        where: { termekId: termekId },
        include: [
          {
            model: Termek,
            as: 'termek',
            attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
          },
          {
            model: Raktar,
            as: 'raktar',
            attributes: ['azonosito', 'rendszam', 'max_kapacitas']
          }
        ]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockKeszletek);
    });
  });

  describe('createRaktarKeszlet', () => {
    it('should create a new keszlet record', async () => {
      const newKeszletData = { 
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50,
        megjegyzes: 'Test note'
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      const mockTermek = { 
        azonosito: 1, 
        nev: 'Test Product' 
      };
      
      const mockCreatedKeszlet = { 
        azonosito: 1,
        ...newKeszletData,
        utolso_frissites: new Date()
      };
      
      const mockKeszletWithRelations = {
        ...mockCreatedKeszlet,
        termek: mockTermek,
        raktar: mockRaktar
      };
      
      req.body = newKeszletData;
      
      RaktarKeszlet.findOne.mockResolvedValue(null);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      Termek.findByPk.mockResolvedValue(mockTermek);
      RaktarKeszlet.sum.mockResolvedValue(0);
      RaktarKeszlet.create.mockResolvedValue(mockCreatedKeszlet);
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszletWithRelations);
      
      await raktarKeszletController.createRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.findOne).toHaveBeenCalledWith({
        where: {
          raktarId: newKeszletData.raktarId,
          termekId: newKeszletData.termekId
        }
      });
      expect(Raktar.findByPk).toHaveBeenCalledWith(newKeszletData.raktarId);
      expect(Termek.findByPk).toHaveBeenCalledWith(newKeszletData.termekId);
      expect(RaktarKeszlet.sum).toHaveBeenCalledWith('keszlet', {
        where: { raktarId: newKeszletData.raktarId }
      });
      expect(RaktarKeszlet.create).toHaveBeenCalledWith(expect.objectContaining({
        ...newKeszletData,
        utolso_frissites: expect.any(Date)
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockKeszletWithRelations);
    });

    it('should return 400 when keszlet already exists', async () => {
      const existingKeszlet = { 
        azonosito: 1,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50 
      };
      
      req.body = { 
        raktarId: 1, 
        termekId: 1, 
        keszlet: 30 
      };
      
      RaktarKeszlet.findOne.mockResolvedValue(existingKeszlet);
      
      await raktarKeszletController.createRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Ez a termék már szerepel ezen a mozgóbolton',
        existing: existingKeszlet
      });
    });

    it('should return 404 when raktar not found', async () => {
      req.body = { 
        raktarId: 999, 
        termekId: 1, 
        keszlet: 50 
      };
      
      RaktarKeszlet.findOne.mockResolvedValue(null);
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.createRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });

    it('should return 404 when termek not found', async () => {
      req.body = { 
        raktarId: 1, 
        termekId: 999, 
        keszlet: 50 
      };
      
      RaktarKeszlet.findOne.mockResolvedValue(null);
      Raktar.findByPk.mockResolvedValue({ azonosito: 1, max_kapacitas: 1000 });
      Termek.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.createRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termek not found' });
    });

    it('should return 400 when exceeding raktar capacity', async () => {
      const raktarId = 1;
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      const mockTermek = { 
        azonosito: 1, 
        nev: 'Test Product' 
      };
      
      req.body = { 
        raktarId: raktarId, 
        termekId: 1, 
        keszlet: 600 
      };
      
      RaktarKeszlet.findOne.mockResolvedValue(null);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      Termek.findByPk.mockResolvedValue(mockTermek);
      RaktarKeszlet.sum.mockResolvedValue(500); 
      
      await raktarKeszletController.createRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'A mozgóbolt kapacitása nem elegendő',
        currentCapacity: 500,
        maxCapacity: 1000,
        requested: 600
      });
    });
  });

  describe('updateRaktarKeszlet', () => {
    it('should update an existing keszlet record', async () => {
      const keszletId = 1;
      const updateData = { 
        keszlet: 75,
        megjegyzes: 'Updated note'
      };
      
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50,
        megjegyzes: 'Original note',
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      const mockUpdatedKeszlet = {
        azonosito: keszletId,
        raktarId: 1,
        termekId: 1,
        keszlet: 75,
        megjegyzes: 'Updated note',
        termek: { azonosito: 1, nev: 'Test Product' },
        raktar: mockRaktar
      };
      
      req.params.id = keszletId;
      req.body = updateData;
      
      RaktarKeszlet.findByPk.mockResolvedValueOnce(mockKeszlet).mockResolvedValueOnce(mockUpdatedKeszlet);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      RaktarKeszlet.sum.mockResolvedValue(100); 
      
      await raktarKeszletController.updateRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.findByPk).toHaveBeenCalledWith(keszletId);
      expect(mockKeszlet.update).toHaveBeenCalledWith(expect.objectContaining({
        ...updateData,
        utolso_frissites: expect.any(Date)
      }));
      expect(res.json).toHaveBeenCalledWith(mockUpdatedKeszlet);
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.id = 999;
      req.body = { keszlet: 75 };
      
      RaktarKeszlet.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.updateRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet not found' });
    });

    it('should check for duplicate when changing raktarId or termekId', async () => {
      const keszletId = 1;
      const updateData = { 
        raktarId: 2,
        termekId: 1
      };
      
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50
      };
      
      const existingKeszlet = {
        azonosito: 2,
        raktarId: 2,
        termekId: 1,
        keszlet: 30
      };
      
      req.params.id = keszletId;
      req.body = updateData;
      
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszlet);
      RaktarKeszlet.findOne.mockResolvedValue(existingKeszlet);
      
      await raktarKeszletController.updateRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.findOne).toHaveBeenCalledWith({
        where: {
          raktarId: updateData.raktarId,
          termekId: updateData.termekId,
          azonosito: { [Op.ne]: keszletId }
        }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Ez a termék már szerepel ezen a mozgóbolton',
        existing: existingKeszlet
      });
    });

    it('should check capacity when increasing keszlet', async () => {
      const keszletId = 1;
      const updateData = { 
        keszlet: 600 
      };
      
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      req.params.id = keszletId;
      req.body = updateData;
      
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszlet);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      RaktarKeszlet.sum.mockResolvedValue(500); 
      
      await raktarKeszletController.updateRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.sum).toHaveBeenCalledWith('keszlet', {
        where: { 
          raktarId: mockKeszlet.raktarId,
          azonosito: { [Op.ne]: keszletId } 
        }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'A mozgóbolt kapacitása nem elegendő',
        currentCapacity: 500,
        maxCapacity: 1000,
        requested: 600
      });
    });
  });

  describe('deleteRaktarKeszlet', () => {
    it('should delete an existing keszlet record', async () => {
      const keszletId = 1;
      
      const mockKeszlet = { 
        azonosito: keszletId, 
        raktarId: 1,
        termekId: 1,
        keszlet: 50,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = keszletId;
      
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszlet);
      
      await raktarKeszletController.deleteRaktarKeszlet(req, res);
      
      expect(RaktarKeszlet.findByPk).toHaveBeenCalledWith(keszletId);
      expect(mockKeszlet.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet deleted successfully' });
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.id = 999;
      
      RaktarKeszlet.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.deleteRaktarKeszlet(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet not found' });
    });
  });

  describe('updateKeszletOnly', () => {
    it('should update only the keszlet and megjegyzes fields', async () => {
      const keszletId = 1;
      const updateData = { 
        keszlet: 75,
        megjegyzes: 'Updated note'
      };
      
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50,
        megjegyzes: 'Original note',
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      const mockUpdatedKeszlet = {
        azonosito: keszletId,
        raktarId: 1,
        termekId: 1,
        keszlet: 75,
        megjegyzes: 'Updated note',
        termek: { azonosito: 1, nev: 'Test Product' },
        raktar: mockRaktar
      };
      
      req.params.id = keszletId;
      req.body = updateData;
      
      RaktarKeszlet.findByPk.mockResolvedValueOnce(mockKeszlet).mockResolvedValueOnce(mockUpdatedKeszlet);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      RaktarKeszlet.sum.mockResolvedValue(100); 
      
      await raktarKeszletController.updateKeszletOnly(req, res);
      
      expect(RaktarKeszlet.findByPk).toHaveBeenCalledWith(keszletId);
      expect(mockKeszlet.update).toHaveBeenCalledWith({
        keszlet: updateData.keszlet,
        megjegyzes: updateData.megjegyzes,
        utolso_frissites: expect.any(Date)
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedKeszlet);
    });

    it('should return 400 when keszlet value is missing', async () => {
      req.params.id = 1;
      req.body = { megjegyzes: 'Updated note' }; 
      
      await raktarKeszletController.updateKeszletOnly(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet value is required' });
    });

    it('should return 404 when keszlet not found', async () => {
      req.params.id = 999;
      req.body = { keszlet: 75 };
      
      RaktarKeszlet.findByPk.mockResolvedValue(null);
      
      await raktarKeszletController.updateKeszletOnly(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Keszlet not found' });
    });

    it('should check capacity when updating keszlet', async () => {
      const keszletId = 1;
      const updateData = { 
        keszlet: 600 
      };
      
      const mockKeszlet = { 
        azonosito: keszletId,
        raktarId: 1, 
        termekId: 1, 
        keszlet: 50
      };
      
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000
      };
      
      req.params.id = keszletId;
      req.body = updateData;
      
      RaktarKeszlet.findByPk.mockResolvedValue(mockKeszlet);
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      RaktarKeszlet.sum.mockResolvedValue(500); 
      
      await raktarKeszletController.updateKeszletOnly(req, res);
      
      expect(RaktarKeszlet.sum).toHaveBeenCalledWith('keszlet', {
        where: { 
          raktarId: mockKeszlet.raktarId,
          azonosito: { [Op.ne]: keszletId } 
        }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'A mozgóbolt kapacitása nem elegendő',
        currentCapacity: 500,
        maxCapacity: 1000,
        requested: 600
      });
    });
  });
});

      
