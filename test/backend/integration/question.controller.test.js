let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Question Controller', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('After login (admin)', () => {
    let token;
    let newQuestion;
    let deleteQuestion;
    before((done) => {
      sails.services.repository.question.create({
        name: 'ddfdf',
        text: 'fgafg',
        imageResponse: 'dfgdsf',
        textResponse: 'fgsdg',
        typeResponse: 'Text',
        imageSolved: 'sfgfd',
        imageQuestion: 'fgdhwe',
        typeQuestion: 'Image',
        courseOrientation: false
      })
        .then((question) => {
          newQuestion = question;
          return sails.services.repository.question.create({
            name: 'ddfdf',
            text: 'fgafg',
            imageResponse: 'dfgdsf',
            textResponse: 'fgsdg',
            typeResponse: 'Text',
            imageSolved: 'sfgfd',
            imageQuestion: 'fgdhwe',
            typeQuestion: 'Image',
            courseOrientation: false
          });
        })
        .then((question) => {
          deleteQuestion = question;
          return agent
            .post('/api/auth/local')
            .send({password: 'admin1234'})
            .send({identifier: 'admin'})
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

    it('Should create a new question', (done) => {
      agent.post('/api/question/addQuestion')
        .set('token', token)
        .send({name: 'name test'})
        .send({text: 'text test'})
        .send({textResponse: 'text response'})
        .send({typeResponse: 'Text'})
        .send({imageSolved: ''})
        .send({imageQuestion: ''})
        .send({typeQuestion: 'Text'})
        .send({courseOrientation: true})
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('idQuestion');
          expect(res.body).to.have.property('success');
          if (res.body.success) {
            return sails.models.question.findOne({id: res.body.idQuestion});
          } else {
            done();
            return Promise.break();
          }
        })
        .then((question) => {
          expect(question.name).to.equal('name test');
          expect(question.text).to.equal('text test');
          expect(question.textResponse).to.equal('text response');
          expect(question.typeResponse).to.equal('Text');
          expect(question.imageSolved).to.equal('');
          expect(question.imageQuestion).to.equal('');
          expect(question.typeQuestion).to.equal('Text');
          expect(question.courseOrientation).to.equal(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should update a question', (done) => {
      agent.post('/api/question/updateQuestion')
        .set('token', token)
        .send({id: newQuestion.id})
        .send({name: 'name test'})
        .send({text: 'text test'})
        .send({textResponse: 'text response'})
        .send({typeResponse: 'Text'})
        .send({imageSolved: ''})
        .send({imageQuestion: ''})
        .send({courseOrientation: true})
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('msg');
          if (res.body.success) {
            return sails.models.question.findOne({id: newQuestion.id});
          } else {
            done();
            return Promise.break();
          }
        })
        .then((question) => {
          expect(question).to.not.be.undefined;
          if (question) {
            expect(question.name).to.equal('name test');
            expect(question.text).to.equal('text test');
            expect(question.textResponse).to.equal('text response');
            expect(question.typeResponse).to.equal('Text');
            expect(question.imageSolved).to.equal('');
            expect(question.imageQuestion).to.equal('');
            expect(question.typeQuestion).to.equal('Image');
            expect(question.courseOrientation).to.equal(true);
          }
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should delete a questions', (done) => {
      agent.post('/api/question/deleteQuestion')
        .set('token', token)
        .send({idQuestion: deleteQuestion.id})
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.true;
          if (res.body.success) {
            return sails.models.question.findOne({id: deleteQuestion.id});
          } else {
            done();
            return Promise.break();
          }
        })
        .then((question) => {
          expect(question).to.be.undefined;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should return the list of questions', (done) => {
      agent.get('/api/question/list')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('questions');
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.true;
          expect(res.body.questions).to.be.an('array');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should return the list of questions by some quiz id', (done) => {
      let newQuiz;
      let newQuestion;
      sails.services.repository.quiz.create({name: '', namePlace: '', image: ''})
        .then((quiz) => {
          newQuiz = quiz;
          return sails.services.repository.question.create({
            name: 'ddfdf',
            text: 'fgafg',
            imageResponse: 'dfgdsf',
            textResponse: 'fgsdg',
            typeResponse: 'Text',
            imageSolved: 'sfgfd',
            imageQuestion: 'fgdhwe',
            typeQuestion: 'Image',
            courseOrientation: false
          }).fetch();
        })
        .then((question) => {
          newQuestion = question;
          return Quiz.addToCollection(newQuiz.id, 'questions').members(question.id);
        })
        .then(() => {
          return agent.post('/api/question/listQuestionSelectedByQuiz')
            .set('token', token)
            .send({idQuiz: newQuiz.id})
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.have.property('available');
          expect(res.body).to.have.property('selected');
          expect(res.body).to.have.property('success');
          expect(res.body.available).to.be.an('array');
          expect(res.body.selected).to.be.an('array');
          expect(res.body.success).to.be.true;
          expect(res.body.selected).to.have.length(1);
          if (res.body.success) {
            expect(res.body.selected[0].id).to.equal(newQuestion.id);
          }
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should return a list of parent error on delete a question');
    it('Should return question status');
    it('Should evaluate a question');
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

    it('Try create a new question should return a permission error', (done) => {
      agent.post('/api/question/addQuestion')
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
    it('Try update a question should return a permission error', (done) => {
      agent.post('/api/question/updateQuestion')
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
    it('Try to remove a question should return a permission error', (done) => {
      agent.post('/api/question/deleteQuestion')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done()
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try return the list of questions should return a permission error', (done) => {
      agent.get('/api/question/list')
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
    it('Should return the list of questions by some quiz id', (done) => {
      agent.post('/api/question/listQuestionSelectedByQuiz')
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
    it('Should return question status');
    it('Should evaluate a question');
  });

  describe('Before login', () => {
    it('Try create a new question should return status 203', (done) => {
      agent.post('/api/question/addQuestion')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try update a question should return status 203', (done) => {
      agent.post('/api/question/updateQuestion')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try to remove a question should return status 203', (done) => {
      agent.post('/api/question/deleteQuestion')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done()
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try return the list of questions should return status 203', (done) => {
      agent.get('/api/question/list')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Should redirect return status 203', (done) => {
      agent.post('/api/question/listQuestionSelectedByQuiz')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try to obtain question status should return status 203', (done) => {
      agent.post('/api/question/statusQuestion')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('Try to evaluate a question should return status 203', (done) => {
      agent.post('/api/question/evaluateQuestion')
        .expect(203)
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
