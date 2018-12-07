import _ from 'lodash';

module.exports = {
  unique: (data) => {
    let r = [];
    let mapa = {};
    for (let it of data) {
      if (!mapa[it.id]) {
        r.push(it);
        mapa[it.id] = true;
      }
    }
    return r;
  },
  getCourseLanguage: (data, next) => {
    sails.models.course.findOne({
      id: data.idModel
    }).exec((err, course) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      next(course.language);
    });
  },
  getCourseLanguageLevel: (data, next) => {
    sails.models.level.findOne({
      id: data.idModel
    }).populate('course').exec((err, level) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (level.course === undefined || level.course === null) {
        next('not found');
      } else {
        next(level.course.language);
      }
    });
  },
  getCourseLanguageSublevel: (data, next) => {
    sails.models.sublevel.findOne({
      id: data.idModel
    }).populate('level').exec((err, sublevel) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (sublevel.level === undefined || sublevel.level === null) {
        next('not found');
      } else {
        module.exports.getCourseLanguageLevel({idModel: sublevel.level.id}, (language) => {
          next(language);
        });
      }
    });
  },
  getCourseLanguageQuiz: (data, next) => {
    sails.models.quiz.findOne({
      id: data.idModel
    }).populate('sublevel').exec((err, quiz) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (quiz.sublevel === undefined || quiz.sublevel === null) {
        next('not found');
      } else {
        module.exports.getCourseLanguageSublevel({idModel: quiz.sublevel.id}, (language) => {
          next(language);
        });
      }
    });
  },
  getCourseLanguageByModelId: (data, next) => {
    if (data.typeModel === 'sublevel') {
      module.exports.getCourseLanguageSublevel(data, (language) => {
        next(language);
      });
    }
    if (data.typeModel === 'level') {
      module.exports.getCourseLanguageLevel(data, (language) => {
        next(language);
      });
    }
    if (data.typeModel === 'course') {
      module.exports.getCourseLanguage(data, (language) => {
        next(language);
      });
    }
    if (data.typeModel === 'quiz') {
      module.exports.getCourseLanguageQuiz(data, (language) => {
        next(language);
      });
    }
  },
  findQuestionGiveCourse: (data, next) => {
    sails.models.course.findOne({
      id: data.idModel
    }).populate('levels').exec((err, course) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      let arrPromise = [];
      for (let level of course.levels) {
        arrPromise.push(new Promise((question) => {
          module.exports.findQuestionGivenLevel({idModel: level.id, language: data.language}, (idQuestion) => {
            question(idQuestion);
          });
        }));
      }
      Promise.all(arrPromise).then((result) => {
        next(result);
      });
    });
  },
  findQuestionGivenLevel: (data, next) => {
    sails.models.level.findOne({
      id: data.idModel
    }).populate('sublevels').exec((err, level) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      let arrPromise = [];
      for (let sublevel of level.sublevels) {
        arrPromise.push(new Promise((question) => {
          module.exports.findQuestionGivenSublevel({idModel: sublevel.id, language: data.language}, (idQuestion) => {
            question(idQuestion);
          });
        }));
      }
      Promise.all(arrPromise).then((result) => {
        next(result);
      });
    });
  },
  findQuestionGivenSublevel: (data, next) => {
    sails.models.sublevel.findOne({
      id: data.idModel
    }).populate('quiz').exec((err, sublevel) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      let arrPromise = [];
      for (let quiz of sublevel.quiz) {
        arrPromise.push(new Promise((question) => {
          module.exports.findQuestionGivenQuiz({idModel: quiz.id, language: data.language}, (idQuestion) => {
            // [[1,2,3], [4,5,6]], [[1,2,3], [4,5,6]]]
            question(idQuestion);
          });
        }));
      }
      Promise.all(arrPromise).then((result) => {
        next(result);
      });
    });
  },
  findQuestionGivenQuiz: (data, next) => {
    sails.models.quiz.findOne({
      id: data.idModel
    }).populate('questions').exec((err, quiz) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      module.exports.findQuestionGivenQuestions(data, quiz.questions, (result) => {
        // [[1,2,3], [4,5,6]]
        next(result);
      });
    });
  },
  findQuestionGivenQuestions: (data, questions, next) => {
    let idQuestions = [];
    for (let question of questions) {
      if (question.courseOrientation) {
        let band = 0;
        for (let text of question.text) {
          if (text.code === data.language) {
            if (question.typeQuestion === 'Text' && text.name.length > 0) {
              band = 1;
              break;
            }
            if (question.typeQuestion === 'Audio' && ((text.url && text.url.length > 0) || (text.name && text.name.length > 0))) {
              band = 1;
              break;
            }
            if (question.typeQuestion === 'Image') {
              band = 1;
              break;
            }
          }
        }
        if (band === 0) {
          idQuestions.push({id: question.id, name: question.name, type: 'question'});
        }
      } else if (question.typeResponse === 'Text') {
        let band = 0;
        for (let response of question.textResponse) {
          if (response.language === data.language) {
            if (response.name.length > 0) {
              band = 1;
              break;
            }
          }
        }
        if (band === 0) {
          idQuestions.push({id: question.id, name: question.name, type: 'response'});
        }
      }
    }
    next(idQuestions);
  },
  getIdQuestionsGivenModelId: (data, next) => {
    if (data.typeModel === 'quiz') {
      module.exports.findQuestionGivenQuiz(data, (idQuestions) => {
        next(_.flatMapDeep(idQuestions));
      });
    }
    if (data.typeModel === 'sublevel') {
      module.exports.findQuestionGivenSublevel(data, (idQuestions) => {
        next(_.flatMapDeep(idQuestions));
      });
    }
    if (data.typeModel === 'level') {
      module.exports.findQuestionGivenLevel(data, (idQuestions) => {
        next(_.flatMapDeep(idQuestions));
      });
    }
    if (data.typeModel === 'course') {
      module.exports.findQuestionGiveCourse(data, (idQuestions) => {
        next(_.flatMapDeep(idQuestions));
      });
    }
    if (data.typeModel === 'question') {
      sails.models.question.findOne({
        id: data.idModel
      }).exec((err, question) => {
        if (err) {
          return sails.log.error('Util.js', err);
        }
        module.exports.findQuestionGivenQuestions(data, [question], (idQuestions) => {
          next(_.flatMapDeep(idQuestions));
        });
      });
    }
  },
  // funcion principal
  addNodeValidation: (data, next) => {
    module.exports.getIdQuestionsGivenModelId({
      idModel: data.childId,
      typeModel: data.childTypeModel,
      language: data.language}, (ids) => {
      next(ids);
    });
  },
  findDataGivenLanguage: (data, next) => {
    let childs = [];
    for (let it of data.childs) {
      childs.push({childId: it, childTypeModel: data.childTypeModel});
    }
    let arrPromise = [];
    for (let child of childs) {
      arrPromise.push(new Promise((value) => {
        module.exports.addNodeValidation({
          parentId: data.parentId,
          parentTypeModel: data.parentTypeModel,
          childId: child.childId,
          childTypeModel: child.childTypeModel,
          language: data.language
        }, (result) => {
          value(result);
        });
      }));
    }
    let invalid = [];
    Promise.all(arrPromise).then((values) => {
      for (let value of values) {
        if (value.length > 0) {
          invalid.push(value);
        }
      }
      invalid = _.flatMapDeep(invalid);
      next(invalid);
    }).catch((err) => {
      sails.log.error(err);
    });
  },
  addNodes: (data) => {
    return new Promise((next) => {
      if (data.language) {
        module.exports.findDataGivenLanguage(data, (next2) => {
          let arrQuestions = [];
          let arrResponses = [];
          for (let question of next2) {
            if (question.type === 'question') {
              arrQuestions.push(question);
            } else {
              arrResponses.push(question);
            }
          }
          next({language: data.language, invalidQuestions: module.exports.unique(arrQuestions), invalidResponses: module.exports.unique(arrResponses)});
        });
      } else {
        module.exports.getCourseLanguageByModelId({idModel: data.parentId, typeModel: data.parentTypeModel}, (language) => {
          if (language === 'not found') {
            next({language: '', invalidQuestions: [], invalidResponses: []});
          } else {
            data.language = language;
            module.exports.findDataGivenLanguage(data, (next2) => {
              let arrQuestions = [];
              let arrResponses = [];
              for (let question of next2) {
                if (question.type === 'question') {
                  arrQuestions.push(question);
                } else {
                  arrResponses.push(question);
                }
              }
              next({language: data.language, invalidQuestions: module.exports.unique(arrQuestions), invalidResponses: module.exports.unique(arrResponses)});
            });
          }
        });
      }
    });
  },
  canDeleteCourse: (data, next) => {
    sails.models.course.findOne({
      id: data.modelId
    }).populate('levels').exec((err, course) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (course.levels.length > data.numberOfChildrens) {
        next(true);
      } else {
        next(false);
      }
    });
  },
  canDeleteLevel: (data, next) => {
    sails.models.level.findOne({
      id: data.modelId
    }).populate('sublevels').exec((err, level) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (level.sublevels.length > data.numberOfChildrens) {
        next(true);
      } else {
        next(false);
      }
    });
  },
  canDeleteSublevel: (data, next) => {
    sails.models.sublevel.findOne({
      id: data.modelId
    }).populate('quiz').exec((err, sublevel) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (sublevel.quiz.length > data.numberOfChildrens) {
        next(true);
      } else {
        next(false);
      }
    });
  },
  canDeleteQuiz: (data, next) => {
    sails.models.quiz.findOne({
      id: data.idModel
    }).populate('questions').exec((err, quiz) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (quiz.questions.length > data.numberOfChildrens) {
        next(true);
      } else {
        next(false);
      }
    });
  },
  numberOfChildsOfCourse: (data, next) => {
    sails.models.course.findOne({
      id: data.idModel
    }).populate('levels').exec((err, course) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      next(course.levels.length);
    });
  },
  numberOfChildsOfLevel: (data, next) => {
    sails.models.level.findOne({
      id: data.idModel
    }).populate('sublevels').exec((err, level) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      next(level.sublevels.length);
    });
  },
  numberOfChildsOfSublevel: (data, next) => {
    sails.models.sublevel.findOne({
      id: data.idModel
    }).populate('quiz').exec((err, sublevel) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      next(sublevel.quiz.length);
    });
  },
  numberOfChildsOfQuiz: (data, next) => {
    sails.models.quiz.findOne({
      id: data.idModel
    }).populate('questions').exec((err, quiz) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      next(quiz.questions.length);
    });
  },
  canDeleteChildModelLevel: (data, next) => {
    sails.models.level.findOne({
      id: data.idModel
    }).populate('course').exec((err, level) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (level.course) {
        module.exports.numberOfChildsOfCourse({
          idModel: level.course.id
        }, (numberOfChilds) => {
          if (numberOfChilds > 1) {
            next([]);
          } else {
            next([{id: level.course.id, name: level.course.name}]);
          }
        });
      } else {
        next([]);
      }
    });
  },
  canDeleteChildModelSublevel: (data, next) => {
    sails.models.sublevel.findOne({
      id: data.idModel
    }).populate('level').exec((err, sublevel) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (sublevel.level) {
        module.exports.numberOfChildsOfLevel({
          idModel: sublevel.level.id
        }, (numberOfChilds) => {
          if (numberOfChilds > 1) {
            next([]);
          } else {
            next([{id: sublevel.level.id, name: sublevel.level.name}]);
          }
        });
      } else {
        next([]);
      }
    });
  },
  canDeleteChildModelQuiz: (data, next) => {
    sails.models.quiz.findOne({
      id: data.idModel
    }).populate('sublevel').exec((err, quiz) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if (quiz.sublevel) {
        module.exports.numberOfChildsOfSublevel({
          idModel: quiz.sublevel.id
        }, (numberOfChilds) => {
          if (numberOfChilds > 1) {
            next([]);
          } else {
            next([{id: quiz.sublevel.id, name: quiz.sublevel.name}]);
          }
        });
      } else {
        next([]);
      }
    });
  },
  canDeleteChildModelQuestion: (data, next) => {
    sails.models.question.findOne({
      id: data.idModel
    }).populate('quiz').exec((err, question) => {
      if (err) {
        return sails.log.error('Util.js', err);
      }
      if(!question){
        return next(new Error(`No question with the ${data.idModel} id`));
      }
      let modelIds = [];
      let arrPromise = [];
      for (let quiz of question.quiz) {
        arrPromise.push(new Promise((result) => {
          module.exports.numberOfChildsOfQuiz({idModel: quiz.id}, (numberOfChilds) => {
            result({id: quiz.id, numberOfChilds: numberOfChilds, name: quiz.name});
          });
        }));
      }
      Promise.all(arrPromise).then((result) => {
        for (let quiz of result) {
          if (quiz.numberOfChilds <= 1) {
            modelIds.push({id: quiz.id, name: quiz.name});
          }
        }
        next(modelIds);
      });
    });
  },
  canDeleteChildModel: (data, next) => {
    if (data.typeModel === 'question') {
      module.exports.canDeleteChildModelQuestion(data, (result) => {
        next(result);
      });
    } else if (data.typeModel === 'quiz') {
      module.exports.canDeleteChildModelQuiz(data, (result) => {
        next(result);
      });
    } else if (data.typeModel === 'sublevel') {
      module.exports.canDeleteChildModelSublevel(data, (result) => {
        next(result);
      });
    } else {
      module.exports.canDeleteChildModelLevel(data, (result) => {
        next(result);
      });
    }
  },
  canDeleteModel: (data, next) => {
    if (data.typeModel === 'quiz') {
      module.exports.canDeleteQuiz(data, (result) => {
        next(result);
      });
    } else if (data.typeModel === 'sublevel') {
      module.exports.canDeleteSublevel(data, (result) => {
        next(result);
      });
    } else if (data.typeModel === 'level') {
      module.exports.canDeleteLevel(data, (result) => {
        next(result);
      });
    } else {
      module.exports.canDeleteCourse(data, (result) => {
        next(result);
      });
    }
  },
  addOldChildstoCourse: (data) => {
    return new Promise((next) => {
      sails.models.course.findOne({
        id: data.parentId
      }).populate('levels').exec((err, course) => {
        if (err) {
          return sails.log.error('Util.js', err);
        }
        for (let level of course.levels) {
          data.childs.push(level.id);
        }
        next(module.exports.addNodes(data));
      });
    });
  }
};
