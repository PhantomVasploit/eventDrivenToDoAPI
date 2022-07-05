const request = require('supertest');

const User = require('../../../src/model/user.model');
let server;

describe('/api/user/regsiter', ()=>{

  beforeEach(async()=>{
    server = require('../../../src/app');
    await User.deleteMany({});
  });

  afterEach(async()=>{
    await server.close();
    await User.deleteMany({});
  });

  it('should create a new user account', async()=>{
    const response = await request(server)
    .post('/api/user/register')
    .send({firstName: 'Paul', lastName: 'Sanga', email: 'paulvasgit99@gmail.com', password: 'pajoy9903'})
    .expect(201);
    const user = await User.findOne({email: 'paulvasgit99@gmail.com'});
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User account created successfully');
    expect(response.body.user.firstName).toBe('Paul');
    expect(response.body.user.lastName).toBe('Sanga');
    expect(response.body.user.email).toBe('paulvasgit99@gmail.com');
  });

});
