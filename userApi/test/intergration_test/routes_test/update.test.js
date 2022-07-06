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

  it('should update user account details', async()=>{
    const user = await User.findOne({email: 'paulvasgit99@gmail.com'});
    const response = await request(server)
    .put(`/api/user/${user._id}`)
    .send({firstName: 'Phantom', lastName: 'Vasploit', email: 'phantom@gmail.com'})
    .expect(200);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Account updated successfully');
  });

})
