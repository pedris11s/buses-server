let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Post Controller', function () {
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
        })
    });

    it('should create a post', () => {
      let query = {
        title: "Post Test 1 dfgd fg",
        topic: "Topic Test 1 dgf gdfg"
      };
      agent.post('/api/post')
        .set('token', token)
        .send(query)
        .expect(200)
        .then((res) => {
          expect(res.body).to.deep.include(query);
          expect(res.body).to.have.keys('comment', 'postlike', 'view', 'user', 'id', 'title', 'topic', 'createdAt', 'updatedAt');
        });
    });

    it('should get a post given the id', () => {
      let query;
      let data = {};
      return sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          query = {
            title: 'Post Test sdfsfsdfdsf',
            topic: 'Topic Test 1 sd fsdfa sfs',
            user: user.id
          };
          return sails.models.post.create(JSON.parse(JSON.stringify(query))).fetch();
        })
        .then((post) => {
          data.post = post;
          return agent.post('/api/postlike')
            .set('token', token)
            .send({postId: data.post.id})
            .expect(200);
        })
        .then(() => {
          return agent.post('/api/comment')
            .set('token', token)
            .send({postId: data.post.id, comment: 'this is a test'});
        })
        .then((res) => {
          return agent.post('/api/commentlike')
            .set('token', token)
            .send({commentId: res.body.id});
        })
        .then(() => {
          return agent.get(`/api/post/${data.post.id}`)
            .set('token', token)
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.not.an('undefined');
          expect(res.body.myLike).to.be.true;
          expect(res.body.comment).to.be.an('array');
          expect(res.body.comment).to.length(1);
          expect(res.body.title).to.equal('Post Test sdfsfsdfdsf');
          expect(res.body.topic).to.equal('Topic Test 1 sd fsdfa sfs');
        })
        .then(() => {
          return sails.models.post.findOne({id: data.post.id});
        })
        .then((post) => {
          expect(post.title).to.be.equal(query.title);
          expect(post).to.deep.include(query);
        });
    });

    it('should return a list of post', (done) => {
      let query;
      sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          query = {
            title: "Post Test 1",
            topic: "Topic Test 1",
            user: user.id
          };
          return sails.models.post.create(query);
        })
        .then(() => {
          return agent.get('/api/post')
            .set('token', token)
            .expect(200)
        })
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.above(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should get a post creator given the id of the post', (done) => {
      let query;
      sails.services.repository.user.getUserByUsername('admin')
        .then((user) => {
          query = {
            title: "Post Test 1",
            topic: "Topic Test 1",
            user: user.id
          };
          return sails.models.post.create(query).then();
        })
        .then((post) => {
          expect(post.user).to.be.equal(query.user);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  });

  describe('after login (user)', () => {
    let token;
    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'testPost',
          email: 'testPost@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890', identifier: 'testPost'})
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
    it('try to create a post should return status 203', (done) => {
      agent.post('/api/post').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to get a post given an id should return status 203', (done) => {
      agent.post('/api/post').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to get a list of post should return status 203', (done) => {
      agent.post('/api/post').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to get the post creator should return status 203', (done) => {
      agent.post('/api/post/getPostCreator').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to delete all post should return status 203', (done) => {
      agent.post('/api/post').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
})
;
