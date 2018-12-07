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
    before(() => {
      return agent.post('/api/auth/local').send({password: 'admin1234', identifier: 'admin'}).expect(200)
        .then((res) => {
          token = res.body.autologinToken;
        });
    });

    it('Should update the teacher version in all the course tree', () => {
      let self = {};
      return sails.services.repository.course.create({name: "algo", language: "es"})
        .fetch()
        .then((course) => {
          self.course = course;
          return sails.services.repository.level.create({name: "asdfsadf", course: course.id});
        })
        .then((level) => {
          self.level = level;
          return sails.services.repository.sublevel.create({
            name: "axcvswqf",
            namePlace: "asdfdsafw",
            place: "sdavcqwer",
            description: "sdvqwyd dsg sfd",
            level: level.id
          });
        })
        .then((sublevel) => {
          self.sublevel = sublevel;
          return sails.services.repository.quiz.create({
            name: "asdfgvbsd",
            namePlace: "asdfcxv",
            image: "sadfasdf",
            level: self.level.id,
            course: self.course.id,
            sublevel: sublevel.id
          });
        })
        .then((quiz) => {
          self.quiz = quiz;
          return sails.services.repository.question.create(
            {
              name: 'bwhjdfg',
              text: 'gkjfsghhh',
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
          self.question = question;
          return Promise.all([
            sails.models.level.findOne(self.level.id).populate('teacherVersion'),
            sails.models.sublevel.findOne(self.sublevel.id).populate('teacherVersion'),
            sails.models.quiz.findOne(self.quiz.id).populate('teacherVersion'),
            sails.models.question.findOne(self.question.id).populate('teacherVersion'),
          ]);
        })
        .then((data) => {
          self.firstVersion = {
            level: data[0].teacherVersion[0].version,
            sublevel: data[1].teacherVersion[0].version,
            quiz: data[2].teacherVersion[0].version,
            question: data[3].teacherVersion[0].version
          };

          expect(self.firstVersion).to.deep.include({quiz: 0, level: 1, sublevel: 0, question: 0});
        })
        .then(() => {
          return Quiz.addToCollection(self.quiz.id, 'questions').members(self.question.id);
        })
        .then(() => {
          return sails.models.quizversion.findOne({quiz: self.quiz.id});
        })
        .then((quizversion) => {
          return QuizVersion.update(quizversion.id, {version: quizversion.version + 1});
        })
        .then(() => {
          return Promise.all([
            sails.models.level.findOne(self.level.id).populate('teacherVersion'),
            sails.models.sublevel.findOne(self.sublevel.id).populate('teacherVersion'),
            sails.models.quiz.findOne(self.quiz.id).populate('teacherVersion'),
            sails.models.question.findOne(self.question.id).populate('teacherVersion'),
          ]);
        })
        .then((data) => {
          self.secondVersion = {
            level: data[0].teacherVersion[0].version,
            sublevel: data[1].teacherVersion[0].version,
            quiz: data[2].teacherVersion[0].version,
            question: data[3].teacherVersion[0].version
          };
          expect(self.secondVersion).to.deep.include({quiz: 1, level: 2, sublevel: 1, question: 0});
          console.log('second', self.secondVersion);

          return sails.models.sublevel.update({id: self.sublevel.id}, {name: "asdfgvAAbsd"});
        })
        .then(() => {
          return Promise.all([
            sails.models.level.findOne(self.level.id).populate('teacherVersion'),
            sails.models.sublevel.findOne(self.sublevel.id).populate('teacherVersion'),
            sails.models.quiz.findOne(self.quiz.id).populate('teacherVersion'),
            sails.models.question.findOne(self.question.id).populate('teacherVersion'),
          ]);
        })
        .then((data) => {
          self.threeVersion = {
            level: data[0].teacherVersion[0].version,
            sublevel: data[1].teacherVersion[0].version,
            quiz: data[2].teacherVersion[0].version,
            question: data[3].teacherVersion[0].version
          };
          expect(self.threeVersion).to.deep.include({quiz: 1, level: 3, sublevel: 2, question: 0});
          return sails.models.question.update({id: self.question.id}, {name: "question222"});
        })
        .then(() => {
          return Promise.all([
            sails.models.level.findOne(self.level.id).populate('teacherVersion'),
            sails.models.sublevel.findOne(self.sublevel.id).populate('teacherVersion'),
            sails.models.quiz.findOne(self.quiz.id).populate('teacherVersion'),
            sails.models.question.findOne(self.question.id).populate('teacherVersion'),
          ]);
        })
        .then((data) => {
          self.fourVersion = {
            level: data[0].teacherVersion[0].version,
            sublevel: data[1].teacherVersion[0].version,
            quiz: data[2].teacherVersion[0].version,
            question: data[3].teacherVersion[0].version
          };
          expect(self.fourVersion).to.deep.include({quiz: 2, level: 4, sublevel: 3, question: 1});
        });
    });
  });
});
