let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Post Like Controller', function () {
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

    it('should add a like to a post', () => {
      let data = {};
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          data.user = user;
          return sails.models.post.create({
            title: "Post Test 1",
            topic: "Topic Test 1",
            user: user.id
          }).fetch();
        })
        .then((post) => {
          data.post = post;
          return agent.post('/api/postlike')
            .set('token', token)
            .send({postId: post.id})
            .expect(200)
        })
        .then((res) => {
          expect(res.body).to.have.keys('post', 'user', 'createdAt', 'updatedAt', 'id');
          expect(res.body.post).to.equal(data.post.id);
          expect(res.body.user).to.equal(data.user.id);
        });
    });

    it('should delete a post like', () => {
      let data = {};
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          return sails.models.post.create({
            title: "Post Test 2",
            topic: "Topic Test 2",
            user: user.id
          }).fetch();
        })
        .then((post) => {
          data.post = post;
          return agent.post('/api/postlike')
            .set('token', token)
            .send({postId: post.id})
            .expect(200)
        })
        .then(() => {
          return agent.delete('/api/postlike')
            .send({postId: data.post.id})
            .set('token', token)
            .expect(200)
        })
        .then((res) => {
          return sails.models.postlike.findOne({postId: data.post.id});
        })
        .then((post) => {
          expect(post).to.be.undefined;
        });
    });
  });

  describe('after login (user)', () => {
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'testPostLike',
          email: 'testPostLike@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890', identifier: 'testPostLike'})
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

  describe('before login', () => {
    it('try to add a post like should return status 203', (done) => {
      agent.post('/api/postlike').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to get the list of post likes should return status 203', (done) => {
      agent.post('/api/postlike').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to delete a post like should return status 203', (done) => {
      agent.post('/api/postlike').expect(203)
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
