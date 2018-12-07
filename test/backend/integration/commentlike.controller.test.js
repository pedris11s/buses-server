let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Comment Like Controller', function () {
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

    it('should add a post comment like', () => {
      let query;
      let data = {};
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          data.user = user;
          query = {
            title: "Add a Comment Like Test 1",
            topic: "Topic Comment Like 1",
            user: user.id
          };
          return sails.models.post.create(query).fetch();
        })
        .then((post) => {
          return sails.models.comment.create({comment: "Comment 1", postId: post.id, userId: post.user}).fetch();
        })
        .then((comment) => {
          data.commentRepeatId = comment.id;
          return agent.post('/api/commentlike')
            .set('token', token)
            .send({userId: query.user, commentId: comment.id})
            .expect(200)
        })
        .then((res) => {
          expect(res.body.user).to.equal(data.user.id);
          expect(res.body.comment).to.equal(data.commentRepeatId);
          return agent.post('/api/commentlike')
            .set('token', token)
            .send({userId: query.user, commentId: data.commentRepeatId})
            .expect(200)
        })
        .then((res) => {
          expect(res.body.user).to.equal(data.user.id);
          expect(res.body.comment).to.equal(data.commentRepeatId);
        });
    });

    it('should delete a post comment like', () => {
      let data = {};
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          data.userId = user.id;
          return sails.models.post.create({
            title: "Add a Comment Like Test 1",
            topic: "Topic Comment Like 1",
            user: user.id
          }).fetch();
        })
        .then((post) => {
          return sails.models.comment.create({comment: "Comment 1", postId: post.id, userId: post.user}).fetch();
        })
        .then((comment) => {
          data.commentId = comment.id;
          return sails.models.commentlike.create({
            user: data.userId,
            comment: comment.id
          });
        })
        .then(() => {
          return agent.delete('/api/commentlike')
            .set('token', token)
            .send({userId: data.userId, commentId: data.commentId})
            .expect(200);
        })
        .then(() => {
          return sails.models.commentlike.findOne({user: data.userId, comment: data.commentId});
        })
        .then((undefinedValue) => {
          expect(undefinedValue).to.be.undefined;
        });
    });
  });

  describe('before login', () => {
    it('try to add a post comment like should return status 203', (done) => {
      agent.post('/api/commentlike').expect(203)
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
