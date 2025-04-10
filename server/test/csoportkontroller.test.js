const csoportController = require('../Controller/csoportController');
const Csoport = require('../model/csoport');
const sequelize = require('../config/config');


jest.mock('../model/csoport', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../config/config', () => ({
  literal: jest.fn()
}));

describe('Csoport Controller Tests', () => {
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

  describe('getAllCsoport', () => {
    it('should return all csoportok', async () => {
      const mockCsoportok = [
        { azonosito: 1, nev: 'Csoport 1', csoport: 'csoport1', hivatkozas: 'link1', tizennyolc: false },
        { azonosito: 2, nev: 'Csoport 2', csoport: 'csoport2', hivatkozas: 'link2', tizennyolc: true }
      ];
      
      Csoport.findAll.mockResolvedValue(mockCsoportok);
      
      await csoportController.getAllCsoport(req, res);
      
      expect(Csoport.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCsoportok);
    });

    it('should handle errors and return 500', async () => {
      Csoport.findAll.mockRejectedValue(new Error('Database error'));
      
      await csoportController.getAllCsoport(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getCsoportById', () => {
    it('should return a specific csoport', async () => {
      const csoportId = 1;
      const mockCsoport = { 
        azonosito: csoportId, 
        nev: 'Csoport 1', 
        csoport: 'csoport1', 
        hivatkozas: 'link1', 
        tizennyolc: false 
      };
      
      req.params.id = csoportId;
      
      Csoport.findByPk.mockResolvedValue(mockCsoport);
      
      await csoportController.getCsoportById(req, res);
      
      expect(Csoport.findByPk).toHaveBeenCalledWith(csoportId);
      expect(res.json).toHaveBeenCalledWith(mockCsoport);
    });

    it('should return 404 when csoport not found', async () => {
      req.params.id = 999;
      
      Csoport.findByPk.mockResolvedValue(null);
      
      await csoportController.getCsoportById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Csoport not found' });
    });
  });

  describe('createCsoport', () => {
    it('should create a new csoport', async () => {
      const newCsoportData = { 
        nev: 'Új Csoport', 
        csoport: 'ujcsoport', 
        hivatkozas: 'ujlink', 
        tizennyolc: false 
      };
      
      const mockCreatedCsoport = { 
        azonosito: 3, 
        ...newCsoportData 
      };
      
      req.body = newCsoportData;
      
      Csoport.create.mockResolvedValue(mockCreatedCsoport);
      
      await csoportController.createCsoport(req, res);
      
      expect(Csoport.create).toHaveBeenCalledWith(newCsoportData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedCsoport);
    });

    it('should handle errors and return 500', async () => {
      req.body = { nev: 'Hibás Csoport' };
      
      Csoport.create.mockRejectedValue(new Error('Validation error'));
      
      await csoportController.createCsoport(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Validation error' 
      });
    });
  });

  describe('updateCsoport', () => {
    it('should update an existing csoport', async () => {
      const csoportId = 1;
      const updateData = { 
        nev: 'Frissített Csoport', 
        hivatkozas: 'ujlink' 
      };
      
      const mockCsoport = { 
        azonosito: csoportId, 
        nev: 'Régi Név', 
        csoport: 'csoport1', 
        hivatkozas: 'regi_link', 
        tizennyolc: false,
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.id = csoportId;
      req.body = updateData;
      
      Csoport.findByPk.mockResolvedValue(mockCsoport);
      
      await csoportController.updateCsoport(req, res);
      
      expect(Csoport.findByPk).toHaveBeenCalledWith(csoportId);
      expect(mockCsoport.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        azonosito: csoportId,
        nev: 'Frissített Csoport',
        hivatkozas: 'ujlink'
      }));
    });

    it('should return 404 when csoport not found', async () => {
      req.params.id = 999;
      req.body = { nev: 'Frissített Név' };
      
      Csoport.findByPk.mockResolvedValue(null);
      
      await csoportController.updateCsoport(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Csoport not found' });
    });
  });

  describe('deleteCsoport', () => {
    it('should delete an existing csoport', async () => {
      const csoportId = 1;
      
      const mockCsoport = { 
        azonosito: csoportId, 
        nev: 'Törlendő Csoport',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = csoportId;
      
      Csoport.findByPk.mockResolvedValue(mockCsoport);
      
      await csoportController.deleteCsoport(req, res);
      
      expect(Csoport.findByPk).toHaveBeenCalledWith(csoportId);
      expect(mockCsoport.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Csoport deleted successfully' });
    });

    it('should return 404 when csoport not found', async () => {
      req.params.id = 999;
      
      Csoport.findByPk.mockResolvedValue(null);
      
      await csoportController.deleteCsoport(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Csoport not found' });
    });
  });

  describe('getAllCsoportWithCounts', () => {
    it('should return all csoportok with termek counts', async () => {
      sequelize.literal.mockReturnValue('COUNT_EXPRESSION');
      
      const mockCsoportokWithCounts = [
        { 
          azonosito: 1, 
          nev: 'Csoport 1', 
          csoport: 'csoport1', 
          hivatkozas: 'link1', 
          tizennyolc: false,
          termekCount: 5
        },
        { 
          azonosito: 2, 
          nev: 'Csoport 2', 
          csoport: 'csoport2', 
          hivatkozas: 'link2', 
          tizennyolc: true,
          termekCount: 3
        }
      ];
      
      Csoport.findAll.mockResolvedValue(mockCsoportokWithCounts);
      
      await csoportController.getAllCsoportWithCounts(req, res);
      
      expect(sequelize.literal).toHaveBeenCalledWith(
        '(SELECT COUNT(*) FROM termek WHERE termek.csoport = Csoport.csoport)'
      );
      
      expect(Csoport.findAll).toHaveBeenCalledWith({
        attributes: [
          'azonosito',
          'nev',
          'csoport',
          'hivatkozas',
          'tizennyolc',
          ['COUNT_EXPRESSION', 'termekCount']
        ],
        order: [['nev', 'ASC']]
      });
      
      expect(res.json).toHaveBeenCalledWith(mockCsoportokWithCounts);
    });

    it('should handle errors and return 500', async () => {
      sequelize.literal.mockReturnValue('COUNT_EXPRESSION');
      Csoport.findAll.mockRejectedValue(new Error('Database error'));
      
      await csoportController.getAllCsoportWithCounts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });
});
