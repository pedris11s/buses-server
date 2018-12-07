let chai = require('chai');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let expect = chai.expect;

describe('Class for some personals test Tests', () => {
  it('the function should work with the callback', (done) => {
    testUndefinedCallback(() => {
      done();
    });
  });

  it('the function should work with Promise', (done) => {
    testUndefinedCallback()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('testing promise.reject', (done) => {
    Promise.resolve('dfgdfg')
      .then(() => {
        return Promise.reject();
      })
      .then(() => {
        expect(true).to.be.false;
      })
      .catch((err) => {
        done(err);
      })
  });

  it('testing jsonwebtoken', () => {
    const token = jwt.sign({id: 'dato'}, 'qwe', {expiresIn: '17d'});
    const result = jwt.verify(token, 'qwe');
  });

  it('check words function', () => {
    console.log(_.words('i\'m, asho? 123 eso'));
  });
});

function testUndefinedCallback(callback){
  if(callback){
    setTimeout(callback, 10);
  }else{
    return new Promise((next) => {
      setTimeout(next, 10);
    });
  }
}
