const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../app');

let newUser = {
  Email: Math.floor(Math.random() * 10000) + '@mail.ee',
  Password: String(Math.floor(Math.random() * 10000)),
  RollID: 1,
  ID: 0,
};

let newCourse = {
  Nimi: 'Rakendusinformaatika',
  Kood: 'RIF',
  Number: 2,
  ID: 0,
}

const patchCourse = {Kood: 'RIFF'};

let token = '';

describe('create user', function() {
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

describe('post', function() {
  it('should return message that the data is incorrect', async function() {
    const response = await request(app).post('/kursused').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(500);
    expect(response.body.Sõnum).to.equal('Viga andmetes');
  });

  it('should return the id of the new Course', async function() {
    const response = await request(app).post('/kursused').send(newCourse).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(201);
    expect(response.body.ID).to.be.a('number');
    newCourse.ID = response.body.ID;
  });
});

describe('getAll', function() {
  it('should return array with length 1 or greater', async function() {
    const response = await request(app).get('/kursused').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.length).to.be.greaterThanOrEqual(1);
  });
});

describe('getByID', function() {
  it('should return new user data', async function() {
    const response = await request(app).get(`/kursused/${newCourse.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.Nimi).to.equal(newCourse.Nimi);
  });
});

describe('patchByID', function() {
  it('should return message that the Course data is patched', async function() {
    const response = await request(app).patch(`/kursused/${newCourse.ID}`).send(patchCourse).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Kursus ID-ga ${newCourse.ID} andmed edukalt uuendatud`);
  });

  it('should return Course with patched data', async function() {
    const response = await request(app).get(`/kursused/${newCourse.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.Kood).to.equal(patchCourse.Kood);
  });
});

describe('deleteByID', function() {
  it('should return 200 and message should be that Course is deleted', async function() {
    const response = await request(app).delete(`/kursused/${newCourse.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Kursus ID-ga ${newCourse.ID} edukalt kustutatud`);
  });
});

describe('delete user', function() {
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