let request = require('supertest');
let utils = require('./quizUtils');
let chai = require('chai');

let expect = chai.expect;

describe('Test evaluate quiz by id (client side)', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('After login (admin)', () => {
    let token;
    let tmp = {}, groupsToErase = [];
    before((done) => {
      utils.generateCourseRandom(
        {
          questions: [
            {
              name: 'sdf1',
              text: [{name: "I'm a big dog", code: "en"}],
              imageResponse: '',
              textResponse: 'xzcv',
              typeResponse: 'Text',
              imageSolved: '',
              imageQuestion: '',
              typeQuestion: 'Text',
              courseOrientation: true
            },
            {
              name: 'sdf2',
              text: [{name: "word test", code: "en"}],
              imageResponse: '',
              textResponse: 'xzcv',
              typeResponse: 'Text',
              imageSolved: '',
              imageQuestion: '',
              typeQuestion: 'Text',
              courseOrientation: true
            }
          ]
        })
        .then(({quiz, course, sublevel, level, questions}) => {
          tmp = _.merge(tmp, {quiz, course, sublevel, level, questions});
          return sails.services.repository.word.createGroup(
            [
              {word: 'perror', description: 'es', language: 'es'},
              {word: 'dog', description: 'en', language: 'en'},
              {word: 'deog', description: 'fr', language: 'fr'}
            ])
        })
        .then((group) => {
          groupsToErase.push(group[0].group);
          return sails.services.repository.word.createGroup(
            [
              {word: 'soy', description: 'es', language: 'es'},
              {word: 'i\'m', description: 'en', language: 'en'},
            ])
        })
        .then((group) => {
          groupsToErase.push(group[0].group);
          return sails.services.repository.word.createGroup(
            [
              {word: 'palabra', description: 'es', language: 'es'},
              {word: 'word', description: 'en', language: 'en'},
              {word: 'algo', description: 'fr', language: 'fr'}
            ])
        })
        .then((group) => {
          groupsToErase.push(group[0].group);
          return sails.services.repository.word.createGroup(
            [
              {word: 'prueba', description: 'es', language: 'es'},
              {word: 'test', description: 'en', language: 'en'},
              {word: 'algo', description: 'fr', language: 'fr'}
            ])
        })
        .then((group) => {
          groupsToErase.push(group[0].group);
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

    after((done) => {
      Promise.all(groupsToErase.map((id) => {
        return sails.services.repository.word.destroyGroup(id);
      }))
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should return a quiz to evaluate', function (done) {
      agent.get(`/api/quiz/evaluate/${tmp.course.id}/${tmp.quiz.id}`)
        .set('token', token)
        .expect(200)
        .then((res) => {
          res.body.questions.forEach((question) => {
            expect(question).to.have.property('dictionary');
          });
          expect(res.body).to.have.property('questions');
          expect(res.body).to.have.property('currentQuestion');
          expect(res.body).to.have.property('numberOfQuestions');
          expect(res.body).to.have.property('idAttempt');
          done();
        })
        .catch((err) => {
          done(err);
        });
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
    it('Try create to get a quiz for evaluate should return status 203', (done) => {
      agent.get(`/api/quiz/evaluate/asdfcxvs34/asfd234asd`)
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
})
;
