'use strict';

var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');

var keys = Object.keys;
var min = Math.min;

exports.nestedDiff = function nestedDiff(lhs, rhs) {
  var result = [];
  var lkeys = keys(lhs);
  var rkeys = keys(rhs);

  function removeIndexFromRkeys(index) {
    rkeys.splice(index, 1);
  }

  if (isArray(lhs) && isArray(rhs)) {
    var i = 0

    for (; i < min(lhs.length, rhs.length); i++) {
      var lval = lhs[i];
      var rval = rhs[i];

      if (isArray(lval) && isArray(rval)) {
        var differences = nestedDiff(lval, rval);
        if (differences.length) {
          result.push({
            kind: 'A',
            key: i,
            lhs: lval,
            rhs: rval,
            differences,
          });
        }
      } else if (isObject(lval) && isObject(rval)) {
        var differences = nestedDiff(lval, rval);
        if (differences.length) {
          result.push({
            kind: 'E',
            key: i,
            lhs: lval,
            rhs: rval,
            differences,
          });
        }
      } else if (lval !== rval) {
        result.push({
          kind: 'E',
          key: i,
          lhs: lval,
          rhs: rval,
        });
      }
    }

    if (i < lhs.length) {
      for (; i < lhs.length; i++) {
        result.push({
          kind: 'D',
          key: i,
          lhs: lhs[i],
        });
      }
    } else {
      for (; i < rhs.length; i++) {
        result.push({
          kind: 'A',
          key: i,
          lhs: rhs[i],
        });
      }
    }

    return result;
  }

  for (var i = 0; i < lkeys.length; i++) {
    var lkey = lkeys[i];
    var lval = lhs[lkey];
    var rindex = rkeys.indexOf(lkey);

    if (rindex === -1) {
      result.push({
        kind: 'D',
        key: lkey,
        lhs: lval,
      });
    } else if (rindex > -1) {
      var rval = rhs[rkeys[rindex]];

      if (isArray(lval) && isArray(rval)) {
        var differences = nestedDiff(lval, rval);
        if (differences.length) {
          result.push({
            kind: 'A',
            key: lkey,
            lhs: lval,
            rhs: rval,
            differences,
          });
        }
      } else if (isObject(lval) && isObject(rval)) {
        var differences = nestedDiff(lval, rval);
        if (differences.length) {
          result.push({
            kind: 'E',
            key: lkey,
            lhs: lval,
            rhs: rval,
            differences,
          });
        }
      } else if (lval !== rval) {
        result.push({
          kind: 'E',
          key: lkey,
          lhs: lval,
          rhs: rval,
        });
      }

      removeIndexFromRkeys(rindex);
    }
  }

  for (var i = 0; i < rkeys.length; i++) {
    var rkey = rkeys[i];
    result.push({
      kind: 'N',
      key: rkey,
      rhs: rhs[rkey],
    });
  }

  return result;
}
