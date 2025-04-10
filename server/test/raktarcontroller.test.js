const raktarController = require('../Controller/raktarController');
const Raktar = require('../model/raktar');


jest.mock('../model/raktar', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn()
}));

describe('Raktar Controller Tests', () => {
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

  describe('getAllRaktar', () => {
    it('should return all raktarak', async () => {
      const mockRaktarak = [
        { azonosito: 1, rendszam: 'ABC-123', max_kapacitas: 1000 },
        { azonosito: 2, rendszam: 'DEF-456', max_kapacitas: 1500 }
      ];
      
      Raktar.findAll.mockResolvedValue(mockRaktarak);
      
      await raktarController.getAllRaktar(req, res);
      
      expect(Raktar.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockRaktarak);
    });

    it('should handle errors and return 500', async () => {
      Raktar.findAll.mockRejectedValue(new Error('Database error'));
      
      await raktarController.getAllRaktar(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getRaktarById', () => {
    it('should return a specific raktar', async () => {
      const raktarId = 1;
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123', 
        max_kapacitas: 1000 
      };
      
      req.params.id = raktarId;
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      
      await raktarController.getRaktarById(req, res);
      
      expect(Raktar.findByPk).toHaveBeenCalledWith(raktarId);
      expect(res.json).toHaveBeenCalledWith(mockRaktar);
    });

    it('should return 404 when raktar not found', async () => {
      req.params.id = 999;
      
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarController.getRaktarById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });
  });

  describe('getRaktarByRendszam', () => {
    it('should return a raktar by rendszam', async () => {
      const rendszam = 'ABC-123';
      const mockRaktar = { 
        azonosito: 1, 
        rendszam: rendszam, 
        max_kapacitas: 1000 
      };
      
      req.params.rendszam = rendszam;
      
      Raktar.findOne.mockResolvedValue(mockRaktar);
      
      await raktarController.getRaktarByRendszam(req, res);
      
      expect(Raktar.findOne).toHaveBeenCalledWith({
        where: { rendszam: rendszam }
      });
      expect(res.json).toHaveBeenCalledWith(mockRaktar);
    });

    it('should return 404 when raktar not found with rendszam', async () => {
      req.params.rendszam = 'XXX-999';
      
      Raktar.findOne.mockResolvedValue(null);
      
      await raktarController.getRaktarByRendszam(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found with this rendszam' });
    });
  });

  describe('createRaktar', () => {
    it('should create a new raktar', async () => {
      const newRaktarData = { 
        rendszam: 'GHI-789', 
        max_kapacitas: 2000 
      };
      
      const mockCreatedRaktar = { 
        azonosito: 3, 
        ...newRaktarData 
      };
      
      req.body = newRaktarData;
      
      Raktar.findOne.mockResolvedValue(null);
      Raktar.create.mockResolvedValue(mockCreatedRaktar);
      
      await raktarController.createRaktar(req, res);
      
      expect(Raktar.findOne).toHaveBeenCalledWith({
        where: { rendszam: newRaktarData.rendszam }
      });
      expect(Raktar.create).toHaveBeenCalledWith(newRaktarData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedRaktar);
    });

    it('should return 400 when raktar with rendszam already exists', async () => {
      const existingRaktarData = { 
        rendszam: 'ABC-123', 
        max_kapacitas: 1000 
      };
      
      const existingRaktar = { 
        azonosito: 1, 
        ...existingRaktarData 
      };
      
      req.body = existingRaktarData;
      
      Raktar.findOne.mockResolvedValue(existingRaktar);
      
      await raktarController.createRaktar(req, res);
      
      expect(Raktar.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Már létezik mozgóbolt ezzel a rendszámmal',
        existing: existingRaktar
      });
    });
  });

  describe('updateRaktar', () => {
    it('should update an existing raktar', async () => {
      const raktarId = 1;
      const updateData = { 
        max_kapacitas: 1200 
      };
      
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123', 
        max_kapacitas: 1000,
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.id = raktarId;
      req.body = updateData;
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      
      await raktarController.updateRaktar(req, res);
      
      expect(Raktar.findByPk).toHaveBeenCalledWith(raktarId);
      expect(mockRaktar.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        azonosito: raktarId,
        rendszam: 'ABC-123',
        max_kapacitas: 1200
      }));
    });

    it('should check for duplicate rendszam when updating', async () => {
      const raktarId = 1;
      const updateData = { 
        rendszam: 'DEF-456' 
      };
      
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123', 
        max_kapacitas: 1000
      };
      
      const existingRaktar = {
        azonosito: 2,
        rendszam: 'DEF-456',
        max_kapacitas: 1500
      };
      
      req.params.id = raktarId;
      req.body = updateData;
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      Raktar.findOne.mockResolvedValue(existingRaktar);
      
      await raktarController.updateRaktar(req, res);
      
      expect(Raktar.findOne).toHaveBeenCalledWith({
        where: { rendszam: updateData.rendszam }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Már létezik mozgóbolt ezzel a rendszámmal',
        existing: existingRaktar
      });
    });

    it('should return 404 when raktar not found', async () => {
      req.params.id = 999;
      req.body = { max_kapacitas: 1200 };
      
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarController.updateRaktar(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });
  });

  describe('deleteRaktar', () => {
    it('should delete an existing raktar', async () => {
      const raktarId = 1;
      
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123',
        max_kapacitas: 1000,
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = raktarId;
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      
      await raktarController.deleteRaktar(req, res);
      
      expect(Raktar.findByPk).toHaveBeenCalledWith(raktarId);
      expect(mockRaktar.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar deleted successfully' });
    });

    it('should return 404 when raktar not found', async () => {
      req.params.id = 999;
      
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarController.deleteRaktar(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });
  });

  describe('updateMaxKapacitas', () => {
    it('should update max_kapacitas of a raktar', async () => {
      const raktarId = 1;
      const newMaxKapacitas = 1500;
      
      const mockRaktar = { 
        azonosito: raktarId, 
        rendszam: 'ABC-123', 
        max_kapacitas: 1000,
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.id = raktarId;
      req.body = { max_kapacitas: newMaxKapacitas };
      
      Raktar.findByPk.mockResolvedValue(mockRaktar);
      
      await raktarController.updateMaxKapacitas(req, res);
      
      expect(Raktar.findByPk).toHaveBeenCalledWith(raktarId);
      expect(mockRaktar.update).toHaveBeenCalledWith({ max_kapacitas: newMaxKapacitas });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        azonosito: raktarId,
        rendszam: 'ABC-123',
        max_kapacitas: newMaxKapacitas
      }));
    });

    it('should return 400 when max_kapacitas is invalid', async () => {
      req.params.id = 1;
      req.body = { max_kapacitas: -100 };
      
      await raktarController.updateMaxKapacitas(req, res);
      
      expect(Raktar.findByPk).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid max_kapacitas value' });
    });

    it('should return 404 when raktar not found', async () => {
      req.params.id = 999;
      req.body = { max_kapacitas: 1500 };
      
      Raktar.findByPk.mockResolvedValue(null);
      
      await raktarController.updateMaxKapacitas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Raktar not found' });
    });
  });
});
