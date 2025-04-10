const cartController = require('../Controller/cartController');
const Termek = require('../model/termek');


jest.mock('../model/termek', () => ({
  findByPk: jest.fn()
}));

describe('Cart Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    
    req = {
      session: {},
      body: {},
      params: {}
    };
    
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should initialize empty cart if none exists', async () => {
      await cartController.getCart(req, res);
      
      expect(req.session.cart).toEqual([]);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return existing cart', async () => {
      const mockCart = [
        { id: 1, name: 'Test Product', price: 100, quantity: 2 }
      ];
      req.session.cart = mockCart;
      
      await cartController.getCart(req, res);
      
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });
  });

  describe('addToCart', () => {
    it('should add a new product to cart', async () => {
      const termekId = 1;
      const quantity = 2;
      
      const mockTermek = {
        azonosito: termekId,
        nev: 'Test Product',
        ar: 100,
        akciosar: null,
        kepUrl: 'test.jpg',
        kiszereles: '500g'
      };
      
      req.body = { termekId, quantity };
      Termek.findByPk.mockResolvedValue(mockTermek);
      
      await cartController.addToCart(req, res);
      
      expect(Termek.findByPk).toHaveBeenCalledWith(termekId);
      expect(req.session.cart).toHaveLength(1);
      expect(req.session.cart[0]).toEqual({
        id: termekId,
        name: 'Test Product',
        price: 100,
        discountPrice: null,
        quantity: 2,
        image: 'test.jpg',
        unit: '500g'
      });
      expect(res.json).toHaveBeenCalledWith(req.session.cart);
    });

    it('should increase quantity if product already in cart', async () => {
      const termekId = 1;
      const quantity = 2;
      
      const mockTermek = {
        azonosito: termekId,
        nev: 'Test Product',
        ar: 100,
        akciosar: null,
        kepUrl: 'test.jpg',
        kiszereles: '500g'
      };
      
      req.session.cart = [{
        id: termekId,
        name: 'Test Product',
        price: 100,
        discountPrice: null,
        quantity: 1,
        image: 'test.jpg',
        unit: '500g'
      }];
      
      req.body = { termekId, quantity };
      Termek.findByPk.mockResolvedValue(mockTermek);
      
      await cartController.addToCart(req, res);
      
      expect(req.session.cart[0].quantity).toBe(3);
      expect(res.json).toHaveBeenCalledWith(req.session.cart);
    });

    it('should return 404 if product not found', async () => {
      req.body = { termekId: 999, quantity: 1 };
      Termek.findByPk.mockResolvedValue(null);
      
      await cartController.addToCart(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termék nem található' });
    });
  });

  describe('updateCartItem', () => {
    it('should update quantity of existing cart item', async () => {
      const termekId = 1;
      const newQuantity = 5;
      
      req.session.cart = [{
        id: termekId,
        name: 'Test Product',
        price: 100,
        quantity: 2
      }];
      
      req.body = { termekId, quantity: newQuantity };
      
      await cartController.updateCartItem(req, res);
      
      expect(req.session.cart[0].quantity).toBe(newQuantity);
      expect(res.json).toHaveBeenCalledWith(req.session.cart);
    });

    it('should remove item if quantity is 0 or less', async () => {
      const termekId = 1;
      
      req.session.cart = [{
        id: termekId,
        name: 'Test Product',
        price: 100,
        quantity: 2
      }];
      
      req.body = { termekId, quantity: 0 };
      
      await cartController.updateCartItem(req, res);
      
      expect(req.session.cart).toHaveLength(0);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 404 if item not in cart', async () => {
      req.session.cart = [];
      req.body = { termekId: 1, quantity: 5 };
      
      await cartController.updateCartItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Termék nem található a kosárban' });
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const termekId = '1';
      
      req.session.cart = [
        { id: '1', name: 'Product 1', price: 100, quantity: 1 },
        { id: '2', name: 'Product 2', price: 200, quantity: 2 }
      ];
      
      req.params.id = termekId;
      
      await cartController.removeFromCart(req, res);
      
      expect(req.session.cart).toHaveLength(1);
      expect(req.session.cart[0].id).toBe('2');
      expect(res.json).toHaveBeenCalledWith(req.session.cart);
    });

    it('should not change cart if item not found', async () => {
      const initialCart = [
        { id: '1', name: 'Product 1', price: 100, quantity: 1 }
      ];
      
      req.session.cart = [...initialCart];
      req.params.id = '999';
      
      await cartController.removeFromCart(req, res);
      
      expect(req.session.cart).toEqual(initialCart);
      expect(res.json).toHaveBeenCalledWith(initialCart);
    });
  });

  describe('clearCart', () => {
    it('should empty the cart', async () => {
      req.session.cart = [
        { id: '1', name: 'Product 1', price: 100, quantity: 1 },
        { id: '2', name: 'Product 2', price: 200, quantity: 2 }
      ];
      
      await cartController.clearCart(req, res);
      
      expect(req.session.cart).toEqual([]);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});
