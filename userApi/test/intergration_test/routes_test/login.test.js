const request = require('supertest');

const User = require('../../../src/model/user.model');
let server;

describe('/api/user/login', ()=>{

  beforeEach(async()=>{
    server = require('../../../src/app');
    const user = new User({firstName: 'Paul', lastName: 'Sanga', email: 'paulvasgit99@gmail.com', password: 'pajoy9903'});
    await user.save();
  });

  afterEach(async()=>{
    await server.close();
    await User.deleteMany({});
  })

  it('should return authenticated user details', async()=>{
    const user = await User.findOne({email: 'paulvasgit99@gmail.com'});
    const response = await request(server)
    .post('/api/user/login')
    .send({email: 'paulvasgit99@gmail.com', password: 'pajoy9903'})
    .expect(200)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user.firstName).toBe('Paul');
    expect(response.body.user.lastName).toBe('Sanga');
    expect(response.body.user.email).toBe('paulvasgit99@gmail.com');
  });

  it('should return status 400 and invalid credentials message when given invalid email', async()=>{
    const response = await request(server)
    .post('/api/user/login')
    .send({email: 'paul@gmail.com', password: 'pajoy9903'})
    .expect(400)
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid login credentials')
  });

  it('should return status 400 and invalid credentials message when given invalid password', async()=>{
    const response = await request(server)
    .post('/api/user/login')
    .send({email: 'paulvasgit99@gmail.com', password: 'dsfghjkl'})
    .expect(400)
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid login credentials')
  });

})
