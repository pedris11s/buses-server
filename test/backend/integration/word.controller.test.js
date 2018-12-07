let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Word controller', function () {
  let agent;

  this.timeout(0);

  before((done) => {
    agent = request.agent(sails.hooks.http.app);
    done();
  });

  describe("after login (admin)", () => {
    let token;

    before((done) => {
      agent.post('/api/auth/local').send({password: 'admin1234'}).send({identifier: 'admin'}).expect(200)
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return the list of work groups', (done) => {
      sails.services.repository.language.getLanguajes()
        .then((languages) => {
          let promises = [];
          let groups = ['aaaaaaa', 'bbbbbbb', 'ccccccc', 'ddddddddd'];
          languages.forEach((language) => {
            groups.forEach((group, index) => {
              promises.push(sails.services.repository.word.create(
                {
                  word: `${group}-${language.code}-${index}`,
                  group, description: '',
                  language: language.id
                }))
            });
          });
          return Promise.all(promises);
        })
        .then(() => {
          return agent.get('/api/word')
            .set('token', token)
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.length(4);
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('should update a work group', function (done) {
      sails.services.repository.word.createGroup(
        [
          {word: 'as11', description: ''},
          {word: 'as22', description: ''},
          {word: 'as33', description: ''},
          {word: 'as44', description: ''}
        ])
        .then((list) => {
          let groupId = list[0].group;
          let group = list.map((word) => {
            return {id: word.id, description: `test-${word.word}`};
          });
          return agent.put(`/api/word/${groupId}`)
            .send({group})
            .set('token', token)
            .expect(200)
        })
        .then((res) => {
          expect(res.body).to.be.an('array');
          let promises = [];
          res.body.forEach((word) => {
            expect(word.description).to.equal(`test-${word.word}`);
            promises.push(sails.models.word.findOne({id: word.id}));
          });
          return Promise.all(promises);
        })
        .then((group) => {
          expect(group).to.be.an('array');
          group.forEach((word) => {
            expect(word.description).to.equal(`test-${word.word}`);
          });
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('should return a group by id', function (done) {
      sails.services.repository.word.createGroup(
        [
          {word: 'asbbvn11', description: '', language: 'es'},
          {word: 'asdfgs22', description: '', language: 'en'},
          {word: 'ascvbn33', description: '', language: 'fr'}
        ])
        .then((list) => {
          let groupId = list[0].group;
          return agent.get(`/api/word/findOneDictionary?id=${groupId}`)
            .set('token', token)
            .expect(200)
        })
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('should add a work group', (done) => {
      agent.post('/api/word')
        .send(
          {
            group:
              [
                {word: 'as1', description: '', language: 'es'},
                {word: 'as2', description: '', language: 'en'},
                {word: 'as3', description: '', language: 'fr'}
              ]
          })
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          return Promise.all(
            [
              sails.models.word.find({word: 'as1'}),
              sails.models.word.find({word: 'as2'}),
              sails.models.word.find({word: 'as3'}),
            ])
        })
        .then((group) => {
          for (let i = 0; i < group.length; i++) {
            expect(group[i]).to.be.not.null;
            expect(group[i].group).to.equal(group[0].group);
          }
          done();
        })
        .catch((err) => {
          done(err);
        })
    });
    it('should delete a work group', (done) => {
      sails.services.repository.word.createGroup(
        [
          {word: 'asw1', description: ''},
          {word: 'asw2', description: ''},
          {word: 'asw3', description: ''},
          {word: 'asw4', description: ''}
        ])
        .then((group) => {
          let groupId = group[0].group;
          return agent.delete(`/api/word/${groupId}`)
            .set('token', token)
            .expect(200)
        })
        .then((res) => {
          expect(res.body).to.be.an('array');
          return sails.models.word.find({group: res.body[0].group});
        })
        .then((emptyGroup) => {
          expect(emptyGroup).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

  });

  describe("after login (ordinary user)", () => {
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'groupp123',
          email: 'groupsadfasf@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then((user) => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890'})
            .send({identifier: user.username})
            .expect(200);
        })
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to get a list of group should return a permission error', (done) => {
      agent.get('/api/word')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try update a work group should return a permission error', (done) => {
      agent.put('/api/word/1')
        .expect(200)
        .set('token', token)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try add a work group should return a permission error', (done) => {
      agent.post('/api/word')
        .expect(200)
        .set('token', token)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try delete a work group should return a permission error', (done) => {
      agent.delete('/api/word')
        .expect(200)
        .set('token', token)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("before login", () => {
    it('try to get a list of group should return status 203', (done) => {
      agent.get('/api/word').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try update a work group should return status 203', (done) => {
      agent.put('/api/word/1').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try add a work group should return status 203', (done) => {
      agent.post('/api/word').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('try delete a work group should return status 203', (done) => {
      agent.delete('/api/word').expect(203)
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
