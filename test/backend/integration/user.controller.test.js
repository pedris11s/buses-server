let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User Controller client', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('After login (admin)', () => {
    let token;
    before((done) => {
      agent
        .post('/api/auth/local')
        .send({password: 'admin1234'})
        .send({identifier: 'admin'})
        .expect(200)
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should return the current user', function (done) {
      agent
        .get('/api/user/current_user')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('roles');
          expect(res.body).to.have.property('imageRealName');
          expect(res.body).to.have.property('pageLanguage');
          done();
        })
        .catch((err) => {
          done(err);
        })
    });
  });

  describe('After login (user)', () => {
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'testQuestion',
          email: 'testQuestion@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890', identifier: 'testQuestion'})
            .expect(200);
        })
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

  });

  describe('Before login', () => {
    // it('Try create a new question should return status 203', (done) => {
    //   agent.post('/api/question/addQuestion')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Try update a question should return status 203', (done) => {
    //   agent.post('/api/question/updateQuestion')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Try to remove a question should return status 203', (done) => {
    //   agent.post('/api/question/deleteQuestion')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done()
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Try return the list of questions should return status 203', (done) => {
    //   agent.get('/api/question/list')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Should return status 203', (done) => {
    //   agent.post('/api/question/listQuestionSelectedByQuiz')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Try to obtain question status should return status 203', (done) => {
    //   agent.post('/api/question/statusQuestion')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
    // it('Try to evaluate a question should return status 203', (done) => {
    //   agent.post('/api/question/evaluateQuestion')
    //     .expect(302)
    //     .then((res) => {
    //       expect(res.header.location).to.equal('/');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });
  });
})
;
