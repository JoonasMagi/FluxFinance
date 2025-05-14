/**
 * @jest-environment node
 */
import request from 'supertest';
import app from '../app.js';

// Mock TextEncoder and TextDecoder for Node.js environment
global.TextEncoder = class TextEncoder {
  encode(text) {
    return Buffer.from(text);
  }
};
global.TextDecoder = class TextDecoder {
  decode(buffer) {
    return Buffer.from(buffer).toString();
  }
};

describe('Authentication', () => {
  describe('POST /auth/signin', () => {
    it('shows error on invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'wrong@example.com', password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Email or password is incorrect');
    });
  });
});
