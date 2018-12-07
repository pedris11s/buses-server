import _ from 'lodash';

_.merge(exports, {
  user: require('./repository/user'),
  util: require('./repository/util'),
  role: require('./repository/role')
});
