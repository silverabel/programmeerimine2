const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../app');

let newUser = {
  Email: Math.floor(Math.random() * 10000) + '@mail.ee',
  Password: String(Math.floor(Math.random() * 10000)),
  RollID: 1,
  ID: 0,
};

let newTeacher = {
  Nimi: 'Mati Maasikas',
  ID: 0,
}

let newSubject = {
  Nimi: 'Programmeerimine',
  Kood: 'PRG',
  Maht: '4',
  ÕppejõudID: 0,
  ID: 0,
}

const patchSubject = {Kood: 'PROG'};

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

describe('post teacher', function() {
  it('should return the id of the new teacher', async function() {
    const response = await request(app).post('/oppejoud').send(newTeacher).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(201);
    expect(response.body.ID).to.be.a('number');
    newTeacher.ID = response.body.ID;
    newSubject.ÕppejõudID = newTeacher.ID;
  });
});

describe('post', function() {
  it('should return message that the data is incorrect', async function() {
    const response = await request(app).post('/oppeained').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(500);
    expect(response.body.Sõnum).to.equal('Viga andmetes');
  });

  it('should return the id of the new Subject', async function() {
    const response = await request(app).post('/oppeained').send(newSubject).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(201);
    expect(response.body.ID).to.be.a('number');
    newSubject.ID = response.body.ID;
  });
});

describe('getAll', function() {
  it('should return array with length 1 or greater', async function() {
    const response = await request(app).get('/oppeained').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.length).to.be.greaterThanOrEqual(1);
  });
});

describe('getByID', function() {
  it('should return new user data', async function() {
    const response = await request(app).get(`/oppeained/${newSubject.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.Nimi).to.equal(newSubject.Nimi);
  });
});

describe('patchByID', function() {
  it('should return message that the Subject data is patched', async function() {
    const response = await request(app).patch(`/oppeained/${newSubject.ID}`).send(patchSubject).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Õppeaine ID-ga ${newSubject.ID} andmed edukalt uuendatud`);
  });

  it('should return Subject with patched data', async function() {
    const response = await request(app).get(`/oppeained/${newSubject.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.Kood).to.equal(patchSubject.Kood);
  });
});

describe('deleteByID', function() {
  it('should return 200 and message should be that Subject is deleted', async function() {
    const response = await request(app).delete(`/oppeained/${newSubject.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Õppeaine ID-ga ${newSubject.ID} edukalt kustutatud`);
  });
});

describe('delete teacher', function() {
  it('should return 200 and message should be that teacher is deleted', async function() {
    const response = await request(app).delete(`/oppejoud/${newTeacher.ID}`).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).to.equal(200);
    expect(response.body.Sõnum).to.equal(`Õppejõud ID-ga ${newTeacher.ID} edukalt kustutatud`);
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