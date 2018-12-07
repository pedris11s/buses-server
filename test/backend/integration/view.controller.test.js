let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('View Controller', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('after login (admin)', () => {
    let token;

    before((done) => {
      agent.post('/api/auth/local').send({password: 'admin1234', identifier: 'admin'}).expect(200)
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should add a view to a post', (done) => {
      let query;
      sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          query = {
            title: "Post Test View",
            topic: "Topic Test View",
            user: user.id
          };
          return sails.models.post.create(query).fetch();
        })
        .then((post) => {
          return agent.post('/api/view/addView')
            .set('token', token)
            .send({postId: post.id, userId: query.user})
            .expect(200)
        })
        .then((res) => {
          expect(res.body.view).to.be.not.an('undefined');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('before login', () => {
    it('try to add a post view should return status 203', (done) => {
      agent.post('/api/view/addView').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

});
