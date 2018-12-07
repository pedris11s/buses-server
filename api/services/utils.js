import fs from 'fs';
import _ from 'lodash';
import mime from 'mime-types';
let jwt = require('jsonwebtoken');

// eslint-disable-next-line
const EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const USERNAME_REGEX = /^[a-zA-z0-9_]+$/i;

_.merge(exports, {
  /**
   * Validate email
   */
  validateEmail: (str) => {
    return EMAIL_REGEX.test(str);
  },

  /**
   * Validate username
   */
  validateUsername: (str) => {
    return USERNAME_REGEX.test(str);
  },

  getUserQuery: (identifier) => {
    let isEmail = exports.validateEmail(identifier);
    let query = {};

    if (isEmail) {
      query.email = identifier;
    } else {
      query.username = identifier;
    }
    return query;
  },

  /**
   * Remove the extra characters like spaces \\n and others
   * @param {string} text
   * @return {string}
   */
  removeExtraCharacters: (text) => {
    if (text) {
      return text.replace(/\s+/g, ' ').trim();
    }
    return text;
  },

  /**
   * Remove undefined object keys
   * @param object
   */
  removeUndefinedKeys: (object) => {
    return _.fromPairs((_.remove(_.toPairs(object), (value) => {
      return value[1] !== undefined;
    })));
  },

  readDirFiles: (path) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files);
      });
    });
  },

  readJsonFile: (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  },

  writeJsonFile: (path, json) => {
    // noinspection JSCheckFunctionSignatures
    fs.writeFileSync(path, JSON.stringify(exports.sortObj(json), '', 2), 'utf8');
  },

  sortObj: (object) => {
    const keys = Object.keys(object);
    const sortedKeys = _.sortBy(keys);

    return _.fromPairs(
      _.map(sortedKeys, (key) => [key, object[key]])
    );
  },

  imageToBase64: (imgPath) => {
    let imgBuff = fs.readFileSync(imgPath);

    let imgBase64 = imgBuff.toString('base64');
    let imgMimeType = mime.lookup(imgPath);

    return `data:${imgMimeType};base64,${imgBase64}`;
  },

  isMobileDevice: (agent) => {
    const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;
    return regex.exec(agent) !== null;
  },

  manageSocialResponse: (user, req, res) => {
    user['autologinToken'] = module.exports.generateToken(user.id);
    const usr = JSON.stringify(sails.services.repository.user.cleanUser(user));
    const usrScript = encodeURI(usr);
    const script = '<script> window.opener.postMessage(' + '"' + `${usrScript}` + '"' + ', "*"); window.close(); </script>';
    // todo descomentariar esto para produccion y tambien en el cliente Oreste
    // const script = '<script> window.opener.postMessage(' + '"' + `${usr}` + '"' + ', "https://wankar.com"); window.close(); </script>';
    const isDevice = module.exports.isMobileDevice(req.headers['user-agent']);
    console.log(script);
    // res.send('<script> window.location.href = ' + '"OAuthLogin://login?user=' + `${usrScript}` + '"' + '; </script>');
    isDevice ? res.redirect('OAuthLogin://login?user=' + usr) : res.send(script);
	console.log('enviando script');
  },

  generateToken: (id) => {
    return jwt.sign(
      {id},
      sails.config.globals.genTokenForAutologin,
      {expiresIn: '367d'});
  }
});
