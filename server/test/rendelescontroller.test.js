const rendelesController = require('../Controller/rendelesController');
const Rendeles = require('../model/rendeles');
const RendelesTetelek = require('../model/rendelesTetelek');
const Termek = require('../model/termek');
const sequelize = require('../config/config');
const emailService = require('../services/emailService');


jest.mock('../model/rendeles', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn()
}));

jest.mock('../model/rendelesTetelek', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('../model/termek', () => ({}));

jest.mock('../config/config', () => ({
  transaction: jest.fn()
}));

jest.mock('../services/emailService', () => ({
  sendOrderConfirmation: jest.fn().mockResolvedValue({}),
  sendOrderCancellationEmail: jest.fn().mockResolvedValue({})
}));

describe('Rendeles Controller Tests', () => {
  let req, res, mockTransaction;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    };
    
    sequelize.transaction.mockResolvedValue(mockTransaction);
    
    req = {
      params: {},
      body: {},
      user: {
        userId: 1
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRendeles', () => {
    it('should return all rendelesek', async () => {
      const mockRendelesek = [
        { 
          azonosito: 1, 
          rendelesAzonosito: 'R-123456',
          vevoNev: 'Test User',
          rendelesIdeje: new Date()
        },
        { 
          azonosito: 2, 
          rendelesAzonosito: 'R-234567',
          vevoNev: 'Another User',
          rendelesIdeje: new Date()
        }
      ];
      
      Rendeles.findAll.mockResolvedValue(mockRendelesek);
      
      await rendelesController.getAllRendeles(req, res);
      
      expect(Rendeles.findAll).toHaveBeenCalledWith({
        order: [['rendelesIdeje', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(mockRendelesek);
    });
  });

  describe('getRendelesById', () => {
    it('should return a specific rendeles with tetelek', async () => {
      const rendelesId = 1;
      const mockRendeles = { 
        azonosito: rendelesId, 
        rendelesAzonosito: 'R-123456',
        vevoNev: 'Test User',
        tetelek: [
          { 
            termekId: 1, 
            termekNev: 'Test Product', 
            mennyiseg: 2,
            Termek: { nev: 'Test Product', kepUrl: 'test.jpg' }
          }
        ]
      };
      
      req.params.id = rendelesId;
      
      Rendeles.findByPk.mockResolvedValue(mockRendeles);
      
      await rendelesController.getRendelesById(req, res);
      
      expect(Rendeles.findByPk).toHaveBeenCalledWith(rendelesId, {
        include: [{
          model: RendelesTetelek,
          as: 'tetelek',
          include: [{
            model: Termek,
            attributes: ['nev', 'kepUrl']
          }]
        }]
      });
      expect(res.json).toHaveBeenCalledWith(mockRendeles);
    });

    it('should return 404 when rendeles not found', async () => {
      req.params.id = 999;
      
      Rendeles.findByPk.mockResolvedValue(null);
      
      await rendelesController.getRendelesById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rendeles not found' });
    });
  });

  describe('createRendeles', () => {
    it('should create a new rendeles with tetelek', async () => {
      const orderData = {
        vevoAdatok: {
          lastName: 'Teszt',
          firstName: 'Elek',
          email: 'teszt.elek@example.com',
          phone: '123456789'
        },
        szallitasiAdatok: {
          address: 'Test Street 1',
          city: 'Test City',
          zipCode: '1234'
        },
        fizetesiMod: 'utánvét',
        osszegek: {
          subtotal: 5000,
          shipping: 1000,
          discount: 500,
          total: 5500
        },
        tetelek: [
          {
            id: 1,
            name: 'Test Product',
            price: 2500,
            discountPrice: null,
            quantity: 2
          }
        ]
      };
      
      const mockCreatedRendeles = {
        azonosito: 1,
        rendelesAzonosito: 'R-123456',
        felhasznaloId: 1,
        vevoNev: 'Teszt Elek',
        vevoEmail: 'teszt.elek@example.com',
        allapot: 'feldolgozás alatt'
      };
      
      req.body = orderData;
      
      Rendeles.create.mockResolvedValue(mockCreatedRendeles);
      
      await rendelesController.createRendeles(req, res);
      
      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Rendeles.create).toHaveBeenCalledWith(expect.objectContaining({
        rendelesAzonosito: expect.any(String),
        felhasznaloId: 1,
        vevoNev: 'Teszt Elek',
        vevoEmail: 'teszt.elek@example.com',
        vevoTelefon: '123456789',
        szallitasiCim: 'Test Street 1',
        szallitasiVaros: 'Test City',
        szallitasiIrsz: '1234',
        fizetesiMod: 'utánvét',
        osszeg: 5000,
        szallitasiDij: 1000,
        kedvezmeny: 500,
        vegosszeg: 5500,
        allapot: 'feldolgozás alatt',
        rendelesIdeje: expect.any(Date)
      }), { transaction: mockTransaction });
      
      expect(RendelesTetelek.create).toHaveBeenCalledWith(expect.objectContaining({
        rendelesId: mockCreatedRendeles.azonosito,
        termekId: 1,
        termekNev: 'Test Product',
        mennyiseg: 2,
        egysegAr: 2500,
        osszAr: 5000
      }), { transaction: mockTransaction });
      
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        rendelesAzonosito: expect.any(String),
        rendeles: mockCreatedRendeles
      }));
      expect(emailService.sendOrderConfirmation).toHaveBeenCalled();
    });

    it('should handle errors and rollback transaction', async () => {
      req.body = {
        vevoAdatok: {},
        szallitasiAdatok: {},
        fizetesiMod: '',
        osszegek: {},
        tetelek: []
      };
      
      Rendeles.create.mockRejectedValue(new Error('Database error'));
      
      await rendelesController.createRendeles(req, res);
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('updateRendeles', () => {
    it('should update rendeles status', async () => {
      const rendelesId = 1;
      const mockRendeles = { 
        azonosito: rendelesId, 
        rendelesAzonosito: 'R-123456',
        allapot: 'feldolgozás alatt',
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.params.id = rendelesId;
      req.body = { allapot: 'kiszállítás alatt' };
      
      Rendeles.findByPk.mockResolvedValue(mockRendeles);
      
      await rendelesController.updateRendeles(req, res);
      
      expect(Rendeles.findByPk).toHaveBeenCalledWith(rendelesId);
      expect(mockRendeles.update).toHaveBeenCalledWith({
        allapot: 'kiszállítás alatt'
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Rendelés állapota frissítve',
        rendeles: expect.objectContaining({
          azonosito: rendelesId,
          allapot: 'kiszállítás alatt'
        })
      });
    });

    it('should return 404 when rendeles not found', async () => {
      req.params.id = 999;
      req.body = { allapot: 'kiszállítás alatt' };
      
      Rendeles.findByPk.mockResolvedValue(null);
      
      await rendelesController.updateRendeles(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rendeles not found' });
    });
  });

  describe('getUserOrders', () => {
    it('should return orders for the logged in user', async () => {
      const userId = 1;
      const mockRendelesek = [
        { 
          azonosito: 1, 
          rendelesAzonosito: 'R-123456',
          felhasznaloId: userId,
          vevoNev: 'Test User',
          allapot: 'feldolgozás alatt',
          rendelesIdeje: new Date(),
          vegosszeg: 5500,
          szallitasiIrsz: '1234',
          szallitasiVaros: 'Test City',
          szallitasiCim: 'Test Street 1',
          fizetesiMod: 'utánvét',
          tetelek: [
            { 
              termekNev: 'Test Product', 
              mennyiseg: 2,
              egysegAr: 2500,
              Termek: { nev: 'Test Product', kepUrl: 'test.jpg' }
            }
          ],
          toJSON: function() { return this; }
        }
      ];
      
      req.user = { userId };
      
      Rendeles.findAll.mockResolvedValue(mockRendelesek);
      
      await rendelesController.getUserOrders(req, res);
      
      expect(Rendeles.findAll).toHaveBeenCalledWith({
        where: { felhasznaloId: userId },
        order: [['rendelesIdeje', 'DESC']],
        include: [{
          model: RendelesTetelek,
          as: 'tetelek',
          include: [{
            model: Termek,
            attributes: ['nev', 'kepUrl']
          }]
        }]
      });
      
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          id: 'R-123456',
          status: 'feldolgozás alatt',
          total_price: 5500,
          shipping_address: '1234 Test City, Test Street 1',
          payment_method: 'utánvét',
          items: expect.arrayContaining([
            expect.objectContaining({
              product_name: 'Test Product',
              quantity: 2,
              price: 2500
            })
          ])
        })
      ]));
    });
  });

  describe('cancelOrder', () => {
    it('should cancel a user order', async () => {
      const userId = 1;
      const orderId = 'R-123456';
      
      const mockRendeles = { 
        azonosito: 1, 
        rendelesAzonosito: orderId,
        felhasznaloId: userId,
        allapot: 'feldolgozás alatt',
        update: jest.fn().mockImplementation(function(data) {
          Object.assign(this, data);
          return Promise.resolve(this);
        })
      };
      
      req.user = { userId };
      req.params.id = orderId;
      
      Rendeles.findOne.mockResolvedValue(mockRendeles);
      
      await rendelesController.cancelOrder(req, res);
      
      expect(Rendeles.findOne).toHaveBeenCalledWith({
        where: { 
          rendelesAzonosito: orderId,
          felhasznaloId: userId  
        }
      });
      expect(mockRendeles.update).toHaveBeenCalledWith({ allapot: 'törölve' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Rendelés sikeresen törölve',
        rendeles: expect.objectContaining({
          azonosito: 1,
          rendelesAzonosito: orderId,
          allapot: 'törölve'
        })
      });
      expect(emailService.sendOrderCancellationEmail).toHaveBeenCalled();
    });

    it('should return 404 when order not found', async () => {
      req.user = { userId: 1 };
      req.params.id = 'R-999999';
      
      Rendeles.findOne.mockResolvedValue(null);
      
      await rendelesController.cancelOrder(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Rendelés nem található vagy nem a felhasználóhoz tartozik' 
      });
    });

    it('should return 400 when order cannot be cancelled', async () => {
      const userId = 1;
      const orderId = 'R-123456';
      
      const mockRendeles = { 
        azonosito: 1, 
        rendelesAzonosito: orderId,
        felhasznaloId: userId,
        allapot: 'kiszállítás alatt' 
      };
      
      req.user = { userId };
      req.params.id = orderId;
      
      Rendeles.findOne.mockResolvedValue(mockRendeles);
      
      await rendelesController.cancelOrder(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'A rendelés nem törölhető, mert már feldolgozás alatt van vagy már kiszállították' 
      });
    });
  });

  describe('getOrderStats', () => {
    it('should return order statistics', async () => {
      const mockAllOrders = [
        { azonosito: 1, allapot: 'feldolgozás alatt', vegosszeg: '1000' },
        { azonosito: 2, allapot: 'kiszállítás alatt', vegosszeg: '2000' },
        { azonosito: 3, allapot: 'teljesítve', vegosszeg: '3000' },
        { azonosito: 4, allapot: 'teljesítve', vegosszeg: '4000' },
        { azonosito: 5, allapot: 'törölve', vegosszeg: '5000' }
      ];
      
      const mockRecentOrders = [
        { 
          azonosito: 1, 
          allapot: 'feldolgozás alatt', 
          vegosszeg: '1000',
          rendelesIdeje: new Date(),
          tetelek: []
        }
      ];
      
      Rendeles.findAll.mockResolvedValueOnce(mockAllOrders).mockResolvedValueOnce(mockRecentOrders);
      
      await rendelesController.getOrderStats(req, res);
      
      expect(Rendeles.findAll).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({
        totalOrders: 5,
        pendingOrders: 1,
        shippingOrders: 1,
        completedOrders: 2,
        cancelledOrders: 1,
        recentOrders: mockRecentOrders,
        totalRevenue: 10000 
      });
    });
  });

  describe('deleteRendeles', () => {
    it('should delete a rendeles and its tetelek', async () => {
      const rendelesId = 1;
      const mockRendeles = { 
        azonosito: rendelesId, 
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = rendelesId;
      
      Rendeles.findByPk.mockResolvedValue(mockRendeles);
      RendelesTetelek.destroy.mockResolvedValue(true);
      
      await rendelesController.deleteRendeles(req, res);
      
      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Rendeles.findByPk).toHaveBeenCalledWith(rendelesId);
      expect(RendelesTetelek.destroy).toHaveBeenCalledWith({
        where: { rendelesId: rendelesId },
        transaction: mockTransaction
      });
      expect(mockRendeles.destroy).toHaveBeenCalledWith({ transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        success: true,
        message: 'Rendeles deleted successfully' 
      });
    });

    it('should return 404 when rendeles not found', async () => {
      req.params.id = 999;
      
      Rendeles.findByPk.mockResolvedValue(null);
      
      await rendelesController.deleteRendeles(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rendeles not found' });
    });

    it('should handle errors and rollback transaction', async () => {
      const rendelesId = 1;
      
      req.params.id = rendelesId;
      
      Rendeles.findByPk.mockResolvedValue({ azonosito: rendelesId });
      RendelesTetelek.destroy.mockRejectedValue(new Error('Database error'));
      
      await rendelesController.deleteRendeles(req, res);
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Server error', 
        error: 'Database error' 
      });
    });
  });

  describe('getRendelesTetelek', () => {
    it('should return tetelek for a specific rendeles', async () => {
      const rendelesId = 1;
      const mockTetelek = [
        { 
          rendelesId: rendelesId, 
          termekId: 1, 
          termekNev: 'Test Product',
          mennyiseg: 2,
          egysegAr: 2500,
          osszAr: 5000,
          Termek: { nev: 'Test Product', kepUrl: 'test.jpg' }
        }
      ];
      
      req.params.id = rendelesId;
      
      RendelesTetelek.findAll.mockResolvedValue(mockTetelek);
      
      await rendelesController.getRendelesTetelek(req, res);
      
      expect(RendelesTetelek.findAll).toHaveBeenCalledWith({
        where: { rendelesId: rendelesId },
        include: [{
          model: Termek,
          attributes: ['nev', 'kepUrl']
        }]
      });
      expect(res.json).toHaveBeenCalledWith(mockTetelek);
    });
  });
});

        
