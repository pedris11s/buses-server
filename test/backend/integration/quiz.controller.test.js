let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Quiz Controller', function () {
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

    it('should create a quiz', (done) => {
      let query = {
        name: 'bdghwsgn',
        text: 'xcvbnhdh',
        imageResponse: 'weywsdfg',
        textResponse: 'trjrghj',
        typeResponse: 'Text',
        imageSolved: 'sfgfd',
        imageQuestion: 'fgdhwe',
        typeQuestion: 'Image',
        courseOrientation: false
      };
      sails.services.repository.question.create(query)
        .then((question) => {
          let add = [question.id];
          return agent.post('/api/quiz/addQuiz')
            .set('token', token)
            .expect(200)
            .send({name: 'asdfasdf', add, erase: []});
        })
        .then((res) => {
          expect(res.body).to.have.property('idQuiz');
          if (!res.body.idQuiz) {
            return Promise.reject(null);
          }
          return sails.models.quiz.findOne({id: res.body.idQuiz}).populate('questions');
        })
        .then((quiz) => {
          expect(quiz.name).to.equal('asdfasdf');
          expect(quiz.namePlace).to.equal('asdfasdf');
          expect(quiz.questions).to.length(1);
          if (quiz.questions.length === 1) {
            expect(quiz.questions[0]).to.deep.include(query);
          }
          done();
        })
        .catch((err) => {
          done(err);
        })

    }) ;

    it('should update a quiz', (done) => {
      let newQuestion1;
      let newQuestion2;
      let newQuiz;
      let question2Query = {
        name: 'bdghwsgn',
        text: 'xcvbnhdh',
        imageResponse: 'weywsdfg',
        textResponse: 'trjrghj',
        typeResponse: 'Text',
        imageSolved: 'sfgfd',
        imageQuestion: 'fgdhwe',
        typeQuestion: 'Image',
        courseOrientation: false
      };
      sails.services.repository.question.create(
        {
          name: 'bdghwsgn',
          text: 'xcvbnhdh',
          imageResponse: 'weywsdfg',
          textResponse: 'trjrghj',
          typeResponse: 'Text',
          imageSolved: 'sfgfd',
          imageQuestion: 'fgdhwe',
          typeQuestion: 'Image',
          courseOrientation: false
        })
        .then((question) => {
          newQuestion1 = question;
          return sails.services.repository.question.create(question2Query)
        })
        .then((question) => {
          newQuestion2 = question;
          return sails.services.repository.quiz.create(
            {
              name: 'asdfasdf sadfsadf',
              namePlace: 'asdfasdf sadfsadf',
              image: '',
              questions: []
            });
        })
        .then((quiz) => {
          newQuiz = quiz;
          return Quiz.addToCollection(quiz.id, 'questions').members(newQuestion1.id);
        })
        .then(() => {
          return agent
            .post('/api/quiz/updateQuiz')
            .expect(200)
            .set('token', token)
            .send({id: newQuiz.id, name: 'assfsdadf', image: '', add: [newQuestion2.id], erase: [newQuestion1.id]})
        })
        .then((res) => {
          expect(res.body.success).to.be.true;
          return sails.models.quiz.findOne({id: newQuiz.id}).populate('questions');
        })
        .then((quiz) => {
          expect(quiz).to.deep.include({name: 'assfsdadf', image: ''});
          expect(quiz.questions).to.length(1);
          if (quiz.questions === 1) {
            expect(quiz.questions[0]).to.deep.include(question2Query);
          }
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('should delete a quiz', ((done) => {
      let newQuestion;
      let newQuiz;
      sails.services.repository.question.create(
        {
          name: 'bdghwsgn',
          text: 'xcvbnhdh',
          imageResponse: 'weywsdfg',
          textResponse: 'trjrghj',
          typeResponse: 'Text',
          imageSolved: 'sfgfd',
          imageQuestion: 'fgdhwe',
          typeQuestion: 'Image',
          courseOrientation: false
        })
        .then((question) => {
          newQuestion = question;
          return sails.services.repository.quiz.create(
            {
              name: 'asdfasdf sadfsadf',
              namePlace: 'asdfasdf sadfsadf',
              image: ''
            });
        })
        .then((quiz) => {
          newQuiz = quiz;
          return Quiz.addToCollection(quiz.id, 'questions').members(newQuestion.id);
        })
        .then(() => {
          return agent
            .post('/api/quiz/deleteQuiz')
            .set('token', token)
            .expect(200)
            .send({idQuiz: newQuiz.id})
        })
        .then(() => {
          return sails.models.quiz.findOne({id: newQuiz.id});
        })
        .then((quiz) => {
          expect(quiz).to.be.undefined;
          return sails.models.question.findOne({id: newQuestion.id}).populate('quiz');
        })
        .then((question) => {
          expect(question.quiz).to.length(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    }));

    it('should return a list of quiz', (done) => {
      let query = {
        name: 'bdghwsgn',
        text: 'xcvbnhdh',
        imageResponse: 'weywsdfg',
        textResponse: 'trjrghj',
        typeResponse: 'Text',
        imageSolved: 'sfgfd',
        imageQuestion: 'fgdhwe',
        typeQuestion: 'Image',
        courseOrientation: false
      };
      sails.services.repository.question.create(query)
        .then((question) => {
          let add = [question.id];
          return agent.post('/api/quiz/addQuiz')
            .set('token', token)
            .expect(200)
            .send({name: 'asdfasdf', add});
        })
        .then((res) => {
          expect(res.body).to.have.property('idQuiz');
          if (!res.body.idQuiz) {
            return Promise.reject(new Error('problems with addQuiz'));
          }
          return sails.models.quiz.findOne({id: res.body.idQuiz}).populate('questions');
        })
        .then((quiz) => {
          expect(quiz).to.deep.include({name: 'asdfasdf'});
          return agent.post('/api/quiz/list')
            .set('token', token)
            .expect(200);
        })
        .then((res) => {
          expect(res.body.quiz).to.be.an('array');
          expect(res.body.quiz).to.length.greaterThan(1);
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('should return a list of quiz by some sublevel id');

    it('should return a quiz for evaluate');

    it('should return a quiz by id');

    it('should create a random quiz');

    it('should finish the active quiz');

    it('should evaluate a single quiz');

    it('should evaluate a quiz');

    it('should return the active quiz');

    it('should load a simple quiz');

    it('should load a quiz');
  });

  describe('after login (user)', () => {
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'testQuiz',
          email: 'testQuiz@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890', identifier: 'testQuiz'})
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

    it('try to create a quiz should return a permission error', (done) => {
      agent.post('/api/quiz/addQuiz')
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

    it('try to update a quiz should return a permission error', (done) => {
      agent.post('/api/quiz/updateQuiz')
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

    it('try to delete a quiz should return a permission error', (done) => {
      agent.post('/api/quiz/deleteQuiz')
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

    it('try to return a list of quiz should return a permission error', (done) => {
      agent.post('/api/quiz/list')
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

    it('should return a list of quiz by some sublevel id');

    it('should return a quiz for evaluate');

    it('should return a quiz by id');

    it('should create a random quiz');

    it('should finish the active quiz');

    it('should evaluate a single quiz');

    it('should evaluate a quiz');

    it('should return the active quiz');

    it('should load a simple quiz');

    it('should load a quiz');
  });

  describe('before login', () => {
    it('try to create a quiz should return status 203', (done) => {
      agent.post('/api/quiz/addQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to update a quiz should return status 203', (done) => {
      agent.post('/api/quiz/updateQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to delete a quiz should return status 203', (done) => {
      agent.post('/api/quiz/deleteQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to return a list of quiz should return status 203', (done) => {
      agent.post('/api/quiz/list').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to return a list of quiz by some sublevel id should return status 203', (done) => {
      agent.post('/api/quiz/listQuizSelectedBySublevel').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to return a quiz for evaluate should return status 203', (done) => {
      agent.post('/api/quiz/getQuizByIdToEvaluate').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to return a quiz by id should return status 203', (done) => {
      agent.post('/api/quiz/getQuizById').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to create a random quiz should return status 203', (done) => {
      agent.post('/api/quiz/createRandomQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to finish the active quiz should return status 203', (done) => {
      agent.post('/api/quiz/getOutOfQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to evaluate a single quiz should return status 203', (done) => {
      agent.post('/api/quiz/evaluateSingleQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to evaluate a quiz should return status 203', (done) => {
      agent.post('/api/quiz/evaluateQuiz').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to load a simple quiz should return status 203', (done) => {
      agent.post('/api/quiz/quizLoadSimple').expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try to load a quiz should return status 203', (done) => {
      agent.post('/api/quiz/quizLoad').expect(203)
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
