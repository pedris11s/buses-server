let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Comment Controller', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('after login (admin)', () => {
    let token;
    before(() => {
      return agent.post('/api/auth/local').send({password: 'admin1234', identifier: 'admin'}).expect(200)
        .then((res) => {
          token = res.body.autologinToken;
        });
    });

    it('should add a post comment', () => {
      let query;
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          query = {
            title: 'Add a Comment Test 2',
            topic: 'Topic Comment 2',
            user: user.id
          };
          return sails.models.post.create(query).fetch();
        })
        .then((post) => {
          return agent.post('/api/comment')
            .set('token', token)
            .send({comment: "Comment 1", postId: post.id})
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.not.an('undefined');
          expect(res.body.comment).to.equal('Comment 1');
        });
    });
  });

  describe('before login', () => {
    it('try to add a comment should return status 203', () => {
      return agent.post('/api/comment').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
        });
    });
  });

});
