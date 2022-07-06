const request = require('supertest');

const User = require('../../../src/model/user.model');
let server;

describe('/api/user/userId', ()=>{

  beforeEach(async()=>{
    server = require('../../../src/app');
    const user = new User({firstName: 'Paul', lastName: 'Sanga', email: 'paulvasgit99@gmail.com', password: 'pajoy9903'});
    await user.save();
  });

  afterEach(async()=>{
    await server.close();
    await User.deleteMany({});
  });

  it('should delete user account', async()=>{
    const user = await User.findOne({email: 'paulvasgit99@gmail.com'});
    const response = await request(server)
    .delete(`/api/user/${user._id}`)
    .expect(200);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User account deleted successfully');
    expect(response.body.user.firstName).toBe('Paul');
    expect(response.body.user.lastName).toBe('Sanga');
    expect(response.body.user.email).toBe('paulvasgit99@gmail.com');
  });

})
