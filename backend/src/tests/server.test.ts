import request from 'supertest';
import express from 'express';

// This is a simple test to ensure the test setup works
// In a real application, you would have more comprehensive tests

describe('Server', () => {
  const app = express();
  
  app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route works' });
  });

  it('should respond to the test route', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test route works');
  });
}); 