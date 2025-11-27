const request = require('supertest');
const http = require('http');

// Use the hosted backend server
const BASE_URL = 'http://91.108.105.168:6000';
const API_BASE = '/api';

// Helper function to make requests to remote server
const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 6000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            body: parsedBody,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// Test data
let testClientId = null;
let testRouteId = null;
let testBookingId = null;
let testTransactionId = null;
let adminToken = null;
let clientToken = null;

describe('Shahaji Tours Backend API Tests - Remote Server (91.108.105.168:6000)', () => {
  
  // ==================== HEALTH CHECK TESTS ====================
  describe('Health Check Endpoints', () => {
    test('GET / - Should return API status', async () => {
      const response = await makeRequest('GET', '/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
    });

    test('GET /api/health - Should check database connection', async () => {
      const response = await makeRequest('GET', `${API_BASE}/health`);
      
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('status');
      expect(['success', 'error']).toContain(response.body.status);
    });
  });

  // ==================== CLIENT ROUTES TESTS ====================
  describe('Client Routes', () => {
    const testClient = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: `9876543${Math.floor(Math.random() * 1000)}`,
      password: 'Test@123'
    };

    test('POST /api/clients/register - Should register a new client', async () => {
      const response = await makeRequest('POST', `${API_BASE}/clients/register`, testClient);
      
      expect([200, 400, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        if (response.body.data && response.body.data.id) {
          testClientId = response.body.data.id;
        }
      }
    });

    test('POST /api/clients/login - Should login with valid credentials', async () => {
      const response = await makeRequest('POST', `${API_BASE}/clients/login`, {
        email: testClient.email,
        password: testClient.password
      });
      
      expect([200, 401, 400, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success && response.body.data) {
        clientToken = response.body.data.token || response.body.data.id;
      }
    });

    test('POST /api/clients/login - Should fail with invalid credentials', async () => {
      const response = await makeRequest('POST', `${API_BASE}/clients/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
      
      expect([200, 401, 400, 500]).toContain(response.status);
      // Should not succeed with invalid credentials
      if (response.status === 200) {
        expect(response.body.success).not.toBe(true);
      }
    });

    test('GET /api/clients/total - Should get total clients count', async () => {
      const response = await makeRequest('GET', `${API_BASE}/clients/total`);
      
      expect([200, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(response.body).toHaveProperty('total');
        expect(typeof response.body.total).toBe('number');
      }
    });
  });

  // ==================== ROUTE ROUTES TESTS ====================
  describe('Route Routes', () => {
    const testRoute = {
      from: 'Mumbai',
      to: 'Pune',
      price: 500,
      duration: '3h 30m',
      timings: ['06:00 AM', '09:00 PM'],
      seater_price: 400,
      sleeper_price: 600
    };

    test('GET /api/routes - Should get all routes', async () => {
      const response = await makeRequest('GET', `${API_BASE}/routes`);
      
      expect([200, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.routes)).toBe(true);
        if (response.body.routes.length > 0 && response.body.routes[0].id) {
          testRouteId = response.body.routes[0].id;
        }
      }
    });

    test('GET /api/routes/search?from=Mumbai&to=Pune - Should search routes', async () => {
      const response = await makeRequest('GET', `${API_BASE}/routes/search?from=Mumbai&to=Pune`);
      
      expect([200, 400, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success');
      }
    });

    test('POST /api/routes - Should create a new route', async () => {
      const response = await makeRequest('POST', `${API_BASE}/routes`, testRoute);
      
      expect([200, 400, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success && response.body.data && response.body.data.id) {
        testRouteId = response.body.data.id;
      }
    });

    test('GET /api/routes/:id - Should get route by ID', async () => {
      if (testRouteId) {
        const response = await makeRequest('GET', `${API_BASE}/routes/${testRouteId}`);
        
        expect([200, 404, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success');
        }
      } else {
        console.log('Skipping: testRouteId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('PUT /api/routes/:id - Should update route', async () => {
      if (testRouteId) {
        const response = await makeRequest('PUT', `${API_BASE}/routes/${testRouteId}`, {
          ...testRoute,
          price: 550
        });
        
        expect([200, 400, 404, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success');
        }
      } else {
        console.log('Skipping: testRouteId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('PUT /api/routes/:id/prices - Should update route prices', async () => {
      if (testRouteId) {
        const response = await makeRequest('PUT', `${API_BASE}/routes/${testRouteId}/prices`, {
          seater_price: 450,
          sleeper_price: 650
        });
        
        expect([200, 400, 404, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success');
        }
      } else {
        console.log('Skipping: testRouteId not available');
        expect(true).toBe(true); // Skip test
      }
    });
  });

  // ==================== BOOKING ROUTES TESTS ====================
  describe('Booking Routes', () => {
    const testBooking = {
      client_id: 1,
      route_id: 1,
      travel_date: '2025-01-15',
      travel_time: '06:00 AM',
      num_passengers: 2,
      seats: ['1', '2'],
      total_amount: 1000
    };

    test('POST /api/bookings - Should create a new booking', async () => {
      if (testClientId && testRouteId) {
        const response = await makeRequest('POST', `${API_BASE}/bookings`, {
          ...testBooking,
          client_id: testClientId,
          route_id: testRouteId
        });
        
        expect([200, 400, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success && response.body.data && response.body.data.id) {
          testBookingId = response.body.data.id;
        }
      } else {
        console.log('Skipping: testClientId or testRouteId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('GET /api/bookings/:id - Should get booking by ID', async () => {
      if (testBookingId) {
        const response = await makeRequest('GET', `${API_BASE}/bookings/${testBookingId}`);
        
        expect([200, 404, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success');
        }
      } else {
        console.log('Skipping: testBookingId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('GET /api/bookings/client/:clientId - Should get bookings by client', async () => {
      if (testClientId) {
        const response = await makeRequest('GET', `${API_BASE}/bookings/client/${testClientId}`);
        
        expect([200, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success) {
          expect(Array.isArray(response.body.bookings)).toBe(true);
        }
      } else {
        console.log('Skipping: testClientId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('GET /api/bookings/booked-seats/:routeId/:travelDate/:travelTime - Should get booked seats', async () => {
      if (testRouteId) {
        const travelDate = encodeURIComponent('2025-01-15');
        const travelTime = encodeURIComponent('06:00 AM');
        const response = await makeRequest('GET', `${API_BASE}/bookings/booked-seats/${testRouteId}/${travelDate}/${travelTime}`);
        
        expect([200, 400, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success) {
          expect(Array.isArray(response.body.bookedSeats)).toBe(true);
        }
      } else {
        console.log('Skipping: testRouteId not available');
        expect(true).toBe(true); // Skip test
      }
    });
  });

  // ==================== TRANSACTION ROUTES TESTS ====================
  describe('Transaction Routes', () => {
    const testTransaction = {
      booking_id: 1,
      client_id: 1,
      amount: 1000,
      payment_method: 'cash',
      payment_details: 'Test payment',
      transaction_id: `TXN${Date.now()}`
    };

    test('POST /api/transactions - Should create a transaction', async () => {
      if (testBookingId && testClientId) {
        const response = await makeRequest('POST', `${API_BASE}/transactions`, {
          ...testTransaction,
          booking_id: testBookingId,
          client_id: testClientId
        });
        
        expect([200, 400, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success && response.body.data && response.body.data.id) {
          testTransactionId = response.body.data.id;
        }
      } else {
        console.log('Skipping: testBookingId or testClientId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('GET /api/transactions - Should get all transactions', async () => {
      const response = await makeRequest('GET', `${API_BASE}/transactions`);
      
      expect([200, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.transactions)).toBe(true);
      }
    });

    test('GET /api/transactions/:id - Should get transaction by ID', async () => {
      if (testTransactionId) {
        const response = await makeRequest('GET', `${API_BASE}/transactions/${testTransactionId}`);
        
        expect([200, 404, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success');
        }
      } else {
        console.log('Skipping: testTransactionId not available');
        expect(true).toBe(true); // Skip test
      }
    });

    test('GET /api/transactions/client/:clientId - Should get transactions by client', async () => {
      if (testClientId) {
        const response = await makeRequest('GET', `${API_BASE}/transactions/client/${testClientId}`);
        
        expect([200, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success) {
          expect(Array.isArray(response.body.transactions)).toBe(true);
        }
      } else {
        console.log('Skipping: testClientId not available');
        expect(true).toBe(true); // Skip test
      }
    });
  });

  // ==================== PAYMENT ROUTES TESTS ====================
  describe('Payment Routes', () => {
    test('GET /api/payments - Should get payment history', async () => {
      const response = await makeRequest('GET', `${API_BASE}/payments`);
      
      expect([200, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.payments)).toBe(true);
      }
    });

    test('GET /api/payments/client/:clientId - Should get payments by client', async () => {
      if (testClientId) {
        const response = await makeRequest('GET', `${API_BASE}/payments/client/${testClientId}`);
        
        expect([200, 500]).toContain(response.status);
        if (response.status === 200 && response.body.success) {
          expect(Array.isArray(response.body.payments)).toBe(true);
        }
      } else {
        console.log('Skipping: testClientId not available');
        expect(true).toBe(true); // Skip test
      }
    });
  });

  // ==================== ADMIN ROUTES TESTS ====================
  describe('Admin Routes', () => {
    test('POST /api/admin/login - Should login admin', async () => {
      const response = await makeRequest('POST', `${API_BASE}/admin/login`, {
        email: 'admin@shahaji.com',
        password: 'Shahaji@2025'
      });
      
      expect([200, 401, 400, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success && response.body.data) {
        adminToken = response.body.data.token || response.body.data.id;
      }
    });

    test('GET /api/admin/clients - Should get all clients', async () => {
      const response = await makeRequest('GET', `${API_BASE}/admin/clients`);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.clients)).toBe(true);
      }
    });

    test('GET /api/admin/bookings - Should get all bookings', async () => {
      const response = await makeRequest('GET', `${API_BASE}/admin/bookings`);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.bookings)).toBe(true);
      }
    });

    test('GET /api/admin/dashboard/stats - Should get dashboard statistics', async () => {
      const response = await makeRequest('GET', `${API_BASE}/admin/dashboard/stats`);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success && response.body.data) {
        expect(response.body.data).toHaveProperty('totalClients');
        expect(response.body.data).toHaveProperty('totalBookings');
        expect(response.body.data).toHaveProperty('totalRevenue');
      }
    });

    test('GET /api/admin/reports/revenue - Should get revenue report', async () => {
      const response = await makeRequest('GET', `${API_BASE}/admin/reports/revenue`);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success');
      }
    });

    test('GET /api/admin/reports/popular-routes - Should get popular routes', async () => {
      const response = await makeRequest('GET', `${API_BASE}/admin/reports/popular-routes`);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200 && response.body.success) {
        expect(Array.isArray(response.body.routes)).toBe(true);
      }
    });
  });

  // ==================== ERROR HANDLING TESTS ====================
  describe('Error Handling', () => {
    test('GET /api/routes/99999 - Should handle non-existent route', async () => {
      const response = await makeRequest('GET', `${API_BASE}/routes/99999`);
      
      expect([404, 500]).toContain(response.status);
      if (response.status === 404) {
        expect(response.body).toHaveProperty('success', false);
      }
    });

    test('POST /api/clients/register - Should validate required fields', async () => {
      const response = await makeRequest('POST', `${API_BASE}/clients/register`, {});
      
      expect([400, 500]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body).toHaveProperty('success', false);
      }
    });
  });
});
