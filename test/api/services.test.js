const { expect } = require('chai');
const services = require('../../api/services');

let newUser = {
  Email: Math.floor(Math.random() * 10000) + '@mail.ee',
  Password: String(Math.floor(Math.random() * 10000)),
  RollID: 1,
  ID: 0,
};

let req = {
  body: newUser,
  params: {
    id: newUser.ID,
  }
};

describe('create user', function() {
  it('should return user id', async function() {
    let request = {body: JSON.parse(JSON.stringify(newUser))};
    const result = await services.create('Kasutaja', request);
    expect(result.insertId).to.be.a('number');
    newUser.ID = result.insertId;
    req.params.id = newUser.ID;
  });

  it('should throw error that email already exists', async function() {
    try {
      await services.create('Kasutaja', req);
    }
    catch(error) {
      expect(error).to.equal('Sellise emailiga kasutaja on juba olemas');
    }
  });
});

describe('login', function() {
  it('should throw error that user with this email could not be found', async function() {
    let reqBody = {Email: 'wrong@email.com'};
    try {
      await services.login('Kasutaja', reqBody);
    }
    catch(error) {
      expect(error).to.equal('Sellise emailiga kasutajat ei leitud');
    }
  });

  it('should throw error that the password is wrong', async function() {
    let reqBody = {
      Email: newUser.Email,
      Password: 'wrong',
    };
    try {
      await services.login('Kasutaja', reqBody);
    }
    catch(error) {
      expect(error).to.equal('Vale parool');
    }
  });

  it('should return json web token', async function() {
    const token = await services.login('Kasutaja', newUser);
    expect(token).to.be.a('string');
  });
});

describe('getAll', function() {
  it('should return an array with length greater than 0', async function() {
    const result = await services.getAll('Kasutaja', {query: {}});
    expect(result.length).to.be.greaterThanOrEqual(1);
  });
});

describe('getById', function() {
  it('should return correct user data', async function() {
    const result = await services.getByID('Kasutaja', req);
    expect(result.length).to.equal(1);
    expect(result[0].Email).to.equal(newUser.Email);
  });  
});

describe('patchByID', function() {
  const patchUser = {
    Email: 'patch@email.com'
  };

  it('should affect 1 row', async function() {
    const result = await services.patchByID('Kasutaja', newUser.ID, patchUser);
    expect(result.affectedRows).to.equal(1);
  });

  it('should return user with patched email', async function() {
    const result = await services.getByID('Kasutaja', req);
    expect(result[0].Email).to.equal(patchUser.Email);
  });
});

describe('deleteByID', function() {
  it('should affect 1 row', async function() {
    const result = await services.deleteByID('Kasutaja', req);
    expect(result.affectedRows).to.equal(1);
  });

  it('should have deleted user and return empty array', async function() {
    const result = await services.getByID('Kasutaja', req);
    expect(result.length).to.equal(0);
  });
});