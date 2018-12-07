/* eslint-disable quotes */
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');

chai.use(chaiHttp);

describe('UserModel', () => {
  it('createVerifyToken: Checking length of the token generator', (done) => {
    let token = sails.services.repository.user.createVerifyToken(20);
    assert.equal(token.length, 20, "Problems with the token generator length");
    done();
  });
  it('createVerifyToken: Checking negative length', (done) => {
    let token = sails.services.repository.user.createVerifyToken(-1);
    assert.equal(token.length, 40, "Return a value not by default");
    done();
  });
  it('createVerifyToken: Checking null value', (done) => {
    let token = sails.services.repository.user.createVerifyToken(null);
    assert.equal(token.length, 40, "Return a value not by default");
    done();
  });
  it('createVerifyToken: Checking without value', (done) => {
    let token = sails.services.repository.user.createVerifyToken();
    assert.equal(token.length, 40, "Return a value not by default");
    done();
  });
});
