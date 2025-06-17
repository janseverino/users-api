const request = require('supertest');
import app from '../app';

describe('Get Users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("paging");
    expect(res.body.paging).toHaveProperty("totalResults");
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');    

    expect(res.body.paging).toEqual(
        expect.objectContaining({
          totalResults: expect.any(Number),
          next: expect.stringContaining('/api/users?page=2&size=1'),
        })
    );    
  });

  it('should not return next property on Paging', async () => {
    const res = await request(app).get('/api/users?page=1&size=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.paging).not.toHaveProperty("next");   
  });

  it('should not return previoues property on Paging', async () => {
    const res = await request(app).get('/api/users?page=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.paging).not.toHaveProperty("previous");   
  });  

})