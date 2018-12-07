/* eslint-disable quotes */
const chai = require('chai');

const expect = chai.expect;

describe('UtilsClass Tests', () => {

  it('removeExtraCharacters test', () => {
    expect(sails.services.utils.removeExtraCharacters('sfgsfsd    sdfsdfsdf')).to.equal('sfgsfsd sdfsdfsdf');
    expect(sails.services.utils.removeExtraCharacters(' sfgsfsd    sdfsdfsdf ')).to.equal('sfgsfsd sdfsdfsdf');
    expect(sails.services.utils.removeExtraCharacters('    sfgsfsd    sdfsdfsdf')).to.equal('sfgsfsd sdfsdfsdf');
    expect(sails.services.utils.removeExtraCharacters('sfgsfsd    sdfsdfsdf        ')).to.equal('sfgsfsd sdfsdfsdf');
    expect(sails.services.utils.removeExtraCharacters('        ')).to.equal('');
  });

  it('sortObj test', () => {
    let obj = {'ffdfs': 543, 'bvs': 545, 'zdfsf': 'sdfd', '23432': 'sdfgdsfg'};
    let value = JSON.stringify(sails.services.utils.sortObj(obj));
    expect(value).to.equal('{"23432":"sdfgdsfg","bvs":545,"ffdfs":543,"zdfsf":"sdfd"}');
  });

  it('validateUsername test (valid)', () => {
    let value = JSON.stringify(sails.services.utils.validateUsername('asdfasSdfs'));
    expect(value).to.equal('true');
  });

  it('validateUsername test (invalid)', () => {
    let value = JSON.stringify(sails.services.utils.validateUsername(''));
    expect(value).to.equal('false');
  });

  it('', () => {
    let object = {a: 'asdf', b: undefined, c: false, d: true, g: 24324, e: undefined};
    object = sails.services.utils.removeUndefinedKeys(object);

    expect(object).to.have.all.keys('a', 'c', 'd',  'g');
  })
});
