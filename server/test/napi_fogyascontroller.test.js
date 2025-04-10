const napi_fogyasController = require('../Controller/napi_fogyasController');
const napi_fogyas = require('../model/napi_fogyas');
const Termek = require('../model/termek');
const Raktar = require('../model/raktar');


jest.mock('../model/napi_fogyas', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn()
}));

jest.mock('../model/termek', () => ({}));
jest.mock('../model/raktar', () => ({}));

describe('Napi Fogyas Controller Tests', () => {
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

    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllNapiFogyas', () => {
    it('should return all napi_fogyas records with related data', async () => {
      const mockNapiFogyasok = [
        { 
          azonosito: 1, 
          termek: 1, 
          raktar: 1, 
          mennyiseg: 5, 
          datum: new Date('2023-01-01'),
          termekData: { nev: 'Test Product', kiszereles: '500g', kepUrl: 'test.jpg' },
          raktarData: { rendszam: 'ABC-123' }
        },
        { 
          azonosito: 2, 
          termek: 2, 
          raktar: 1, 
          mennyiseg: 3, 
          datum: new Date('2023-01-02'),
          termekData: { nev: 'Another Product', kiszereles: '1kg', kepUrl: 'another.jpg' },
          raktarData: { rendszam: 'ABC-123' }
        }
      ];
      
      napi_fogyas.findAll.mockResolvedValue(mockNapiFogyasok);
      
      await napi_fogyasController.getAllNapiFogyas(req, res);
      
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
      
      await napi_fogyasController.getAllNapiFogyas(req, res);
      
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
        azonosito: napiFogyasId, 
        termek: 1, 
        raktar: 1, 
        mennyiseg: 5, 
        datum: new Date('2023-01-01'),
        termekData: { nev: 'Test Product', kiszereles: '500g', kepUrl: 'test.jpg' },
        raktarData: { rendszam: 'ABC-123' }
      };
      
      req.params.id = napiFogyasId;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await napi_fogyasController.getNapiFogyasById(req, res);
      
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
      
      await napi_fogyasController.getNapiFogyasById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });

  describe('createNapiFogyas', () => {
    it('should create a new napi_fogyas record', async () => {
      const newNapiFogyasData = { 
        termek: 1, 
        raktar: 1, 
        mennyiseg: 5, 
        datum: '2023-01-01'
      };
      
      const mockCreatedNapiFogyas = { 
        azonosito: 3, 
        ...newNapiFogyasData,
        datum: new Date('2023-01-01')
      };
      
      req.body = newNapiFogyasData;
      
      napi_fogyas.create.mockResolvedValue(mockCreatedNapiFogyas);
      
      await napi_fogyasController.createNapiFogyas(req, res);
      
      expect(napi_fogyas.create).toHaveBeenCalledWith(newNapiFogyasData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedNapiFogyas);
    });

    it('should handle errors and return 500', async () => {
      req.body = { termek: 1, mennyiseg: 5 }; 
      
      napi_fogyas.create.mockRejectedValue(new Error('Validation error'));
      
      await napi_fogyasController.createNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Validation error' 
      });
    });
  });

  describe('updateNapiFogyas', () => {
    it('should update an existing napi_fogyas record', async () => {
      const napiFogyasId = 1;
      const updateData = { 
        mennyiseg: 10, 
        datum: '2023-01-02'
      };
      
      const mockNapiFogyas = { 
        azonosito: napiFogyasId, 
        termek: 1, 
        raktar: 1, 
        mennyiseg: 5, 
        datum: new Date('2023-01-01'),
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.id = napiFogyasId;
      req.body = updateData;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await napi_fogyasController.updateNapiFogyas(req, res);
      
      expect(napi_fogyas.findByPk).toHaveBeenCalledWith(napiFogyasId);
      expect(mockNapiFogyas.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        azonosito: napiFogyasId,
        mennyiseg: 10
      }));
    });

    it('should return 404 when napi_fogyas not found', async () => {
      req.params.id = 999;
      req.body = { mennyiseg: 10 };
      
      napi_fogyas.findByPk.mockResolvedValue(null);
      
      await napi_fogyasController.updateNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });

  describe('deleteNapiFogyas', () => {
    it('should delete an existing napi_fogyas record', async () => {
      const napiFogyasId = 1;
      
      const mockNapiFogyas = { 
        azonosito: napiFogyasId, 
        termek: 1,
        raktar: 1,
        mennyiseg: 5,
        datum: new Date('2023-01-01'),
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = napiFogyasId;
      
      napi_fogyas.findByPk.mockResolvedValue(mockNapiFogyas);
      
      await napi_fogyasController.deleteNapiFogyas(req, res);
      
      expect(napi_fogyas.findByPk).toHaveBeenCalledWith(napiFogyasId);
      expect(mockNapiFogyas.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas deleted successfully' });
    });

    it('should return 404 when napi_fogyas not found', async () => {
      req.params.id = 999;
      
      napi_fogyas.findByPk.mockResolvedValue(null);
      
      await napi_fogyasController.deleteNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Napi fogyas not found' });
    });
  });

  describe('uploadNapiFogyas', () => {
    it('should return 400 when no file is uploaded', async () => {
      req.file = null;
      
      await napi_fogyasController.uploadNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nincs feltöltött fájl' });
    });

    it('should process uploaded file and return success message', async () => {
      req.file = { 
        originalname: 'test.csv',
        path: '/tmp/test.csv'
      };
      
      await napi_fogyasController.uploadNapiFogyas(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Fájl sikeresen feltöltve és feldolgozva' });
    });
  });
});
