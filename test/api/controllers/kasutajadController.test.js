const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../app');

let newUser = {
  Email: Math.floor(Math.random() * 10000) + '@mail.ee',
  Password: String(Math.floor(Math.random() * 10000)),
  RollID: 1,
  ID: 0,
};

let token = '';

describe('create', function() {
  it('should return 500 and message should say that the data is wrong', async function() {
    const response = await request(app).post('/kasutajad');
    expect(response.statusCode).to.equal(500);
    expect(response.body.Sõnum).to.equal('Viga andmetes');
  });

  it('should return 201 and the id of the new user', async function() {
    const response = await request(app).post('/kasutajad').send(newUser);
    expect(response.statusCode).to.equal(201);
    expect(response.body.ID).to.be.a('number');
    newUser.ID = response.body.ID;
  });
});


describe('login', function() {
  it('should return token', async function() {
    const response = await request(app).post('/kasutajad/login').send(newUser);
    expect(response.statusCode).to.equal(200);
    expect(response.body.token).to.be.a('string');
    token = response.body.token;
  });
});

describe('getAll', function() {
  it('should return array with length 1 or greater', async function() {
    const response = await request(app).get('/kasutajad').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.length).to.be.greaterThanOrEqual(1);
  });
});

describe('getByID', function() {
  it('should return new user data', async function() {
    const response = await request(app).get(`/kasutajad/${newUser.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.Email).to.equal(newUser.Email);
  });
});

describe('patchByID', function() {
  it('should return message that user is patched', async function() {
    const patchUser = {Email: 'patch@mail.ee'};
    const response = await request(app).patch(`/kasutajad/${newUser.ID}`).send(patchUser).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Kasutaja ID-ga ${newUser.ID} andmed edukalt uuendatud`);
  });

  it('should not find user with pre-patch email', async function() {
    const response = await request(app).post('/kasutajad/login').send(newUser);
    expect(response.statusCode).to.equal(500);
    expect(response.body.error).to.be.a('string');
  });
});

describe('deleteByID', function() {
  it('should return 200 and message should be that user is deleted', async function() {
    const response = await request(app).delete(`/kasutajad/${newUser.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Kasutaja ID-ga ${newUser.ID} edukalt kustutatud`);
  });
});




// describe('', function() {
//   it('', async function() {
//     const response = await request(app).post('').send(newUser).set('Authorization', `Bearer ${token}`);
//     expect(response.statusCode).to.equal();
//     expect(response.body).to.be.a('');
//   });
// });