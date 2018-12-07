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

    it.skip('Should update the teacher version in all the course tree', () => {
      let self = {};
      return sails.services.repository.course.create({name: "algo", language: "es"})
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
          return Quiz.addToCollection(self.quiz.id, 'questions').members(question.id);
        })
        .then(() => {
          self.firstVersion = {
            quiz: self.quiz.teacherVersion,
            question: self.question.teacherVersion,
            level: self.level.teacherVersion,
            sublevel: self.sublevel.teacherVersion
          };

          expect(self.firstVersion).to.deep.include({quiz: 0, level: 0, sublevel: 0, question: 0});
          console.log('first', self.firstVersion);

          return Promise.all([
            sails.models.level.findOne(self.level.id),
            sails.models.sublevel.findOne(self.sublevel.id),
            sails.models.quiz.findOne(self.quiz.id),
            sails.models.question.findOne(self.question.id),
          ]);
        })
        .then((data) => {
          self.secondVersion = {
            level: data[0].teacherVersion,
            sublevel: data[1].teacherVersion,
            quiz: data[2].teacherVersion,
            question: data[3].teacherVersion
          };
          expect(self.secondVersion).to.deep.include({quiz: 0, level: 1, sublevel: 0, question: 0});
          console.log('second', self.secondVersion);

          return sails.models.sublevel.update({id: self.sublevel.id}, {name: "asdfgvAAbsd"});
        })
        .then((sublevel) => {
          return Promise.all([
            sails.models.level.findOne(self.level.id),
            sails.models.sublevel.findOne(self.sublevel.id),
            sails.models.quiz.findOne(self.quiz.id),
            sails.models.question.findOne(self.question.id),
          ]);
        })
        .then((data) => {
          self.threeVersion = {
            level: data[0].teacherVersion,
            sublevel: data[1].teacherVersion,
            quiz: data[2].teacherVersion,
            question: data[3].teacherVersion
          };
          // expect(self.threeVersion).to.deep.include({quiz: 0, level: 1, sublevel: 0, question: 0});
          console.log('three', self.threeVersion);
        });
    });
  });
});
