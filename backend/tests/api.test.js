const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_campus_carpool_2026';
process.env.JWT_EXPIRE = '1d';

jest.setTimeout(60000);

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  app = require('../src/server');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Campus Carpool Finder - Automated Integration Test Suite', () => {
  let driverToken, driverId;
  let riderToken, riderId;
  let rideId, requestId;

  // 1. Health Check
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  // 2. Authentication & User Accounts
  describe('Authentication Module', () => {
    it('should register a new student driver successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Kabir Driver',
          email: 'kabir@college.edu',
          password: 'password123',
          phone: '9876543210',
          collegeId: '21BCSE001',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      driverToken = res.body.token;
      driverId = res.body.user.id;
    });

    it('should register a new student rider successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Ananya Rider',
          email: 'ananya@college.edu',
          password: 'password123',
          phone: '9876543211',
          collegeId: '21BCSE002',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      riderToken = res.body.token;
      riderId = res.body.user.id;
    });

    it('should reject registration when email is duplicated', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Fake Kabir',
          email: 'kabir@college.edu',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should log in student driver with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'kabir@college.edu',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'kabir@college.edu',
          password: 'wrong_password',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access to protected route without JWT token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('should allow access to /api/auth/me with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${driverToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe('kabir@college.edu');
    });

    it('should update driver vehicle details', async () => {
      const res = await request(app)
        .put('/api/users/vehicle')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          make: 'Maruti',
          model: 'Swift',
          licensePlate: 'DL 01 AB 1234',
          color: 'Red',
          capacity: 3,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.vehicleDetails.model).toBe('Swift');
    });
  });

  // 3. Carpool Rides & Search
  describe('Ride Management & Search Module', () => {
    it('should allow driver to post a new ride', async () => {
      const res = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          origin: 'Sector 18 Metro',
          destination: 'Campus Gate 1',
          departureDate: '2026-11-25',
          departureTime: '08:30 AM',
          totalSeats: 3,
          pricePerSeat: 50,
          notes: 'AC enabled',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.ride.availableSeats).toBe(3);
      rideId = res.body.ride._id;
    });

    it('should search rides by origin', async () => {
      const res = await request(app).get('/api/rides?origin=Sector');
      expect(res.statusCode).toBe(200);
      expect(res.body.rides.length).toBeGreaterThan(0);
      expect(res.body.rides[0].origin).toMatch(/Sector 18/i);
    });

    it('should get single ride details by ID', async () => {
      const res = await request(app).get(`/api/rides/${rideId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.ride._id).toBe(rideId);
    });
  });

  // 4. Ride Requests & Concurrency Safety
  describe('Ride Requests & Atomic Booking Module', () => {
    it('should prevent driver from requesting to join their own ride', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          rideId,
          seatsRequested: 1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/own ride/i);
    });

    it('should allow rider to submit a join request', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${riderToken}`)
        .send({
          rideId,
          seatsRequested: 1,
          message: 'Waiting near exit gate',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.request.status).toBe('pending');
      requestId = res.body.request._id;
    });

    it('should strictly prevent duplicate requests for the same ride', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${riderToken}`)
        .send({
          rideId,
          seatsRequested: 1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already have a/i);
    });

    it('should allow driver to accept request and atomically decrement seat count', async () => {
      const res = await request(app)
        .put(`/api/requests/${requestId}/status`)
        .set('Authorization', `Bearer ${driverToken}`)
        .send({ status: 'accepted' });

      expect(res.statusCode).toBe(200);
      expect(res.body.request.status).toBe('accepted');
      expect(res.body.updatedRide.availableSeats).toBe(2); // Reduced from 3 to 2
    });
  });

  // 5. Notifications
  describe('Notification System', () => {
    it('should show notifications generated for the rider', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${riderToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.notifications.length).toBeGreaterThan(0);
      expect(res.body.notifications[0].type).toBe('REQUEST_ACCEPTED');
    });
  });

  // 6. Ratings & Reviews
  describe('Ratings & Reputation Module', () => {
    it('should allow passenger to rate the driver after the ride', async () => {
      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${riderToken}`)
        .send({
          rideId,
          toUserId: driverId,
          rating: 5,
          review: 'Very punctual and polite driver!',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.rating.rating).toBe(5);
    });

    it('should prevent duplicate ratings for the same participant on the same journey', async () => {
      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${riderToken}`)
        .send({
          rideId,
          toUserId: driverId,
          rating: 4,
          review: 'Trying to rate again',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already submitted a rating/i);
    });
  });
});
