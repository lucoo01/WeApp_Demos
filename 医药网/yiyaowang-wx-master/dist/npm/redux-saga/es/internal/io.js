"use strict";var exports=module.exports={};"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asEffect = undefined;

var _defineProperty2 = require('../../../babel-runtime/core-js/object/define-property.js');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _isIterable2 = require('../../../babel-runtime/core-js/is-iterable.js');

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require('../../../babel-runtime/core-js/get-iterator.js');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.take = take;
exports.takem = takem;
exports.put = put;
exports.race = race;
exports.call = call;
exports.apply = apply;
exports.cps = cps;
exports.fork = fork;
exports.spawn = spawn;
exports.join = join;
exports.cancel = cancel;
exports.select = select;
exports.actionChannel = actionChannel;
exports.cancelled = cancelled;
exports.flush = flush;

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

var IO = (0, _utils.sym)('IO');
var TAKE = 'TAKE';
var PUT = 'PUT';
var RACE = 'RACE';
var CALL = 'CALL';
var CPS = 'CPS';
var FORK = 'FORK';
var JOIN = 'JOIN';
var CANCEL = 'CANCEL';
var SELECT = 'SELECT';
var ACTION_CHANNEL = 'ACTION_CHANNEL';
var CANCELLED = 'CANCELLED';
var FLUSH = 'FLUSH';

var effect = function effect(type, payload) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, IO, true), _defineProperty(_ref, type, payload), _ref;
};

function take() {
  var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

  if (arguments.length) {
    (0, _utils.check)(arguments[0], _utils.is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }
  if (_utils.is.pattern(patternOrChannel)) {
    return effect(TAKE, { pattern: patternOrChannel });
  }
  if (_utils.is.channel(patternOrChannel)) {
    return effect(TAKE, { channel: patternOrChannel });
  }
  throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
}

function takem() {
  var eff = take.apply(undefined, arguments);
  eff[TAKE].maybe = true;
  return eff;
}

function put(channel, action) {
  if (arguments.length > 1) {
    (0, _utils.check)(channel, _utils.is.notUndef, 'put(channel, action): argument channel is undefined');
    (0, _utils.check)(channel, _utils.is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
    (0, _utils.check)(action, _utils.is.notUndef, 'put(channel, action): argument action is undefined');
  } else {
    (0, _utils.check)(channel, _utils.is.notUndef, 'put(action): argument action is undefined');
    action = channel;
    channel = null;
  }
  return effect(PUT, { channel: channel, action: action });
}

put.sync = function () {
  var eff = put.apply(undefined, arguments);
  eff[PUT].sync = true;
  return eff;
};

function race(effects) {
  return effect(RACE, effects);
}

function getFnCallDesc(meth, fn, args) {
  (0, _utils.check)(fn, _utils.is.notUndef, meth + ': argument fn is undefined');

  var context = null;
  if (_utils.is.array(fn)) {
    var _fn = fn;

    var _fn2 = _slicedToArray(_fn, 2);

    context = _fn2[0];
    fn = _fn2[1];
  } else if (fn.fn) {
    var _fn3 = fn;
    context = _fn3.context;
    fn = _fn3.fn;
  }
  (0, _utils.check)(fn, _utils.is.func, meth + ': argument ' + fn + ' is not a function');

  return { context: context, fn: fn, args: args };
}

function call(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return effect(CALL, getFnCallDesc('call', fn, args));
}

function apply(context, fn) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return effect(CALL, getFnCallDesc('apply', { context: context, fn: fn }, args));
}

function cps(fn) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return effect(CPS, getFnCallDesc('cps', fn, args));
}

function fork(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return effect(FORK, getFnCallDesc('fork', fn, args));
}

function spawn(fn) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  var eff = fork.apply(undefined, [fn].concat(args));
  eff[FORK].detached = true;
  return eff;
}

var isForkedTask = function isForkedTask(task) {
  return task[_utils.TASK];
};

function join(task) {
  (0, _utils.check)(task, _utils.is.notUndef, 'join(task): argument task is undefined');
  if (!isForkedTask(task)) {
    throw new Error('join(task): argument ' + task + ' is not a valid Task object \n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)');
  }

  return effect(JOIN, task);
}

function cancel(task) {
  (0, _utils.check)(task, _utils.is.notUndef, 'cancel(task): argument task is undefined');
  if (!isForkedTask(task)) {
    throw new Error('cancel(task): argument ' + task + ' is not a valid Task object \n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)');
  }

  return effect(CANCEL, task);
}

function select(selector) {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if (arguments.length === 0) {
    selector = _utils.ident;
  } else {
    (0, _utils.check)(selector, _utils.is.notUndef, 'select(selector,[...]): argument selector is undefined');
    (0, _utils.check)(selector, _utils.is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
  }
  return effect(SELECT, { selector: selector, args: args });
}

/**
  channel(pattern, [buffer])    => creates an event channel for store actions
**/
function actionChannel(pattern, buffer) {
  (0, _utils.check)(pattern, _utils.is.notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
  if (arguments.length > 1) {
    (0, _utils.check)(buffer, _utils.is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
    (0, _utils.check)(buffer, _utils.is.notUndef, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
  }
  return effect(ACTION_CHANNEL, { pattern: pattern, buffer: buffer });
}

function cancelled() {
  return effect(CANCELLED, {});
}

function flush(channel) {
  (0, _utils.check)(channel, _utils.is.channel, 'flush(channel): argument ' + channel + ' is not valid channel');
  return effect(FLUSH, channel);
}

var asEffect = exports.asEffect = {
  take: function take(effect) {
    return effect && effect[IO] && effect[TAKE];
  },
  put: function put(effect) {
    return effect && effect[IO] && effect[PUT];
  },
  race: function race(effect) {
    return effect && effect[IO] && effect[RACE];
  },
  call: function call(effect) {
    return effect && effect[IO] && effect[CALL];
  },
  cps: function cps(effect) {
    return effect && effect[IO] && effect[CPS];
  },
  fork: function fork(effect) {
    return effect && effect[IO] && effect[FORK];
  },
  join: function join(effect) {
    return effect && effect[IO] && effect[JOIN];
  },
  cancel: function cancel(effect) {
    return effect && effect[IO] && effect[CANCEL];
  },
  select: function select(effect) {
    return effect && effect[IO] && effect[SELECT];
  },
  actionChannel: function actionChannel(effect) {
    return effect && effect[IO] && effect[ACTION_CHANNEL];
  },
  cancelled: function cancelled(effect) {
    return effect && effect[IO] && effect[CANCELLED];
  },
  flush: function flush(effect) {
    return effect && effect[IO] && effect[FLUSH];
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvLmpzIl0sIm5hbWVzIjpbInRha2UiLCJ0YWtlbSIsInB1dCIsInJhY2UiLCJjYWxsIiwiYXBwbHkiLCJjcHMiLCJmb3JrIiwic3Bhd24iLCJqb2luIiwiY2FuY2VsIiwic2VsZWN0IiwiYWN0aW9uQ2hhbm5lbCIsImNhbmNlbGxlZCIsImZsdXNoIiwiX3NsaWNlZFRvQXJyYXkiLCJzbGljZUl0ZXJhdG9yIiwiYXJyIiwiaSIsIl9hcnIiLCJfbiIsIl9kIiwiX2UiLCJ1bmRlZmluZWQiLCJfaSIsIl9zIiwibmV4dCIsImRvbmUiLCJwdXNoIiwidmFsdWUiLCJsZW5ndGgiLCJlcnIiLCJBcnJheSIsImlzQXJyYXkiLCJPYmplY3QiLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydHkiLCJvYmoiLCJrZXkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJJTyIsIlRBS0UiLCJQVVQiLCJSQUNFIiwiQ0FMTCIsIkNQUyIsIkZPUksiLCJKT0lOIiwiQ0FOQ0VMIiwiU0VMRUNUIiwiQUNUSU9OX0NIQU5ORUwiLCJDQU5DRUxMRUQiLCJGTFVTSCIsImVmZmVjdCIsInR5cGUiLCJwYXlsb2FkIiwiX3JlZiIsInBhdHRlcm5PckNoYW5uZWwiLCJhcmd1bWVudHMiLCJub3RVbmRlZiIsInBhdHRlcm4iLCJjaGFubmVsIiwiRXJyb3IiLCJTdHJpbmciLCJlZmYiLCJtYXliZSIsImFjdGlvbiIsInN5bmMiLCJlZmZlY3RzIiwiZ2V0Rm5DYWxsRGVzYyIsIm1ldGgiLCJmbiIsImFyZ3MiLCJjb250ZXh0IiwiYXJyYXkiLCJfZm4iLCJfZm4yIiwiX2ZuMyIsImZ1bmMiLCJfbGVuIiwiX2tleSIsIl9sZW4yIiwiX2tleTIiLCJfbGVuMyIsIl9rZXkzIiwiX2xlbjQiLCJfa2V5NCIsImNvbmNhdCIsImRldGFjaGVkIiwiaXNGb3JrZWRUYXNrIiwidGFzayIsInNlbGVjdG9yIiwiX2xlbjUiLCJfa2V5NSIsImJ1ZmZlciIsImFzRWZmZWN0Il0sIm1h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QUF3QmEsT0FBT0wsTUFBUCxDQUEvQjtBQUNELEdBeEJtQjtBQXlCcEJ2QyxVQUFRLFNBQVNBLE1BQVQsQ0FBZ0I0QyxNQUFoQixFQUF3QjtBQUM5QixXQUFPQSxVQUFVQSxPQUFPYixFQUFQLENBQVYsSUFBd0JhLE9BQU9KLE1BQVAsQ0FBL0I7QUFDRCxHQTNCbUI7QUE0QnBCdkMsaUJBQWUsU0FBU0EsYUFBVCxDQUF1QjJDLE1BQXZCLEVBQStCO0FBQzVDLFdBQU9BLFVBQVVBLE9BQU9iLEVBQVAsQ0FBVixJQUF3QmEsT0FBT0gsY0FBUCxDQUEvQjtBQUNELEdBOUJtQjtBQStCcEJ2QyxhQUFXLFNBQVNBLFNBQVQsQ0FBbUIwQyxNQUFuQixFQUEyQjtBQUNwQyxXQUFPQSxVQUFVQSxPQUFPYixFQUFQLENBQVYsSUFBd0JhLE9BQU9GLFNBQVAsQ0FBL0I7QUFDRCxHQWpDbUI7QUFrQ3BCdkMsU0FBTyxTQUFTQSxLQUFULENBQWV5QyxNQUFmLEVBQXVCO0FBQzVCLFdBQU9BLFVBQVVBLE9BQU9iLEVBQVAsQ0FBVixJQUF3QmEsT0FBT0QsS0FBUCxDQUEvQjtBQUNEO0FBcENtQixDQUFmIiwiZmlsZSI6InVua25vd24iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX3NsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfSB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmltcG9ydCB7IHN5bSwgaXMsIGlkZW50LCBjaGVjaywgVEFTSyB9IGZyb20gJy4vdXRpbHMnO1xuXG52YXIgSU8gPSBzeW0oJ0lPJyk7XG52YXIgVEFLRSA9ICdUQUtFJztcbnZhciBQVVQgPSAnUFVUJztcbnZhciBSQUNFID0gJ1JBQ0UnO1xudmFyIENBTEwgPSAnQ0FMTCc7XG52YXIgQ1BTID0gJ0NQUyc7XG52YXIgRk9SSyA9ICdGT1JLJztcbnZhciBKT0lOID0gJ0pPSU4nO1xudmFyIENBTkNFTCA9ICdDQU5DRUwnO1xudmFyIFNFTEVDVCA9ICdTRUxFQ1QnO1xudmFyIEFDVElPTl9DSEFOTkVMID0gJ0FDVElPTl9DSEFOTkVMJztcbnZhciBDQU5DRUxMRUQgPSAnQ0FOQ0VMTEVEJztcbnZhciBGTFVTSCA9ICdGTFVTSCc7XG5cbnZhciBlZmZlY3QgPSBmdW5jdGlvbiBlZmZlY3QodHlwZSwgcGF5bG9hZCkge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfZGVmaW5lUHJvcGVydHkoX3JlZiwgSU8sIHRydWUpLCBfZGVmaW5lUHJvcGVydHkoX3JlZiwgdHlwZSwgcGF5bG9hZCksIF9yZWY7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdGFrZSgpIHtcbiAgdmFyIHBhdHRlcm5PckNoYW5uZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcqJztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNoZWNrKGFyZ3VtZW50c1swXSwgaXMubm90VW5kZWYsICd0YWtlKHBhdHRlcm5PckNoYW5uZWwpOiBwYXR0ZXJuT3JDaGFubmVsIGlzIHVuZGVmaW5lZCcpO1xuICB9XG4gIGlmIChpcy5wYXR0ZXJuKHBhdHRlcm5PckNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIGVmZmVjdChUQUtFLCB7IHBhdHRlcm46IHBhdHRlcm5PckNoYW5uZWwgfSk7XG4gIH1cbiAgaWYgKGlzLmNoYW5uZWwocGF0dGVybk9yQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gZWZmZWN0KFRBS0UsIHsgY2hhbm5lbDogcGF0dGVybk9yQ2hhbm5lbCB9KTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ3Rha2UocGF0dGVybk9yQ2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBTdHJpbmcocGF0dGVybk9yQ2hhbm5lbCkgKyAnIGlzIG5vdCB2YWxpZCBjaGFubmVsIG9yIGEgdmFsaWQgcGF0dGVybicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGFrZW0oKSB7XG4gIHZhciBlZmYgPSB0YWtlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1RBS0VdLm1heWJlID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1dChjaGFubmVsLCBhY3Rpb24pIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgY2hlY2soY2hhbm5lbCwgaXMubm90VW5kZWYsICdwdXQoY2hhbm5lbCwgYWN0aW9uKTogYXJndW1lbnQgY2hhbm5lbCBpcyB1bmRlZmluZWQnKTtcbiAgICBjaGVjayhjaGFubmVsLCBpcy5jaGFubmVsLCAncHV0KGNoYW5uZWwsIGFjdGlvbik6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgYSB2YWxpZCBjaGFubmVsJyk7XG4gICAgY2hlY2soYWN0aW9uLCBpcy5ub3RVbmRlZiwgJ3B1dChjaGFubmVsLCBhY3Rpb24pOiBhcmd1bWVudCBhY3Rpb24gaXMgdW5kZWZpbmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2soY2hhbm5lbCwgaXMubm90VW5kZWYsICdwdXQoYWN0aW9uKTogYXJndW1lbnQgYWN0aW9uIGlzIHVuZGVmaW5lZCcpO1xuICAgIGFjdGlvbiA9IGNoYW5uZWw7XG4gICAgY2hhbm5lbCA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdChQVVQsIHsgY2hhbm5lbDogY2hhbm5lbCwgYWN0aW9uOiBhY3Rpb24gfSk7XG59XG5cbnB1dC5zeW5jID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWZmID0gcHV0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgZWZmW1BVVF0uc3luYyA9IHRydWU7XG4gIHJldHVybiBlZmY7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmFjZShlZmZlY3RzKSB7XG4gIHJldHVybiBlZmZlY3QoUkFDRSwgZWZmZWN0cyk7XG59XG5cbmZ1bmN0aW9uIGdldEZuQ2FsbERlc2MobWV0aCwgZm4sIGFyZ3MpIHtcbiAgY2hlY2soZm4sIGlzLm5vdFVuZGVmLCBtZXRoICsgJzogYXJndW1lbnQgZm4gaXMgdW5kZWZpbmVkJyk7XG5cbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuICBpZiAoaXMuYXJyYXkoZm4pKSB7XG4gICAgdmFyIF9mbiA9IGZuO1xuXG4gICAgdmFyIF9mbjIgPSBfc2xpY2VkVG9BcnJheShfZm4sIDIpO1xuXG4gICAgY29udGV4dCA9IF9mbjJbMF07XG4gICAgZm4gPSBfZm4yWzFdO1xuICB9IGVsc2UgaWYgKGZuLmZuKSB7XG4gICAgdmFyIF9mbjMgPSBmbjtcbiAgICBjb250ZXh0ID0gX2ZuMy5jb250ZXh0O1xuICAgIGZuID0gX2ZuMy5mbjtcbiAgfVxuICBjaGVjayhmbiwgaXMuZnVuYywgbWV0aCArICc6IGFyZ3VtZW50ICcgKyBmbiArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcblxuICByZXR1cm4geyBjb250ZXh0OiBjb250ZXh0LCBmbjogZm4sIGFyZ3M6IGFyZ3MgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGwoZm4pIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENBTEwsIGdldEZuQ2FsbERlc2MoJ2NhbGwnLCBmbiwgYXJncykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHkoY29udGV4dCwgZm4pIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gIHJldHVybiBlZmZlY3QoQ0FMTCwgZ2V0Rm5DYWxsRGVzYygnYXBwbHknLCB7IGNvbnRleHQ6IGNvbnRleHQsIGZuOiBmbiB9LCBhcmdzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcHMoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KENQUywgZ2V0Rm5DYWxsRGVzYygnY3BzJywgZm4sIGFyZ3MpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmsoZm4pIHtcbiAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICByZXR1cm4gZWZmZWN0KEZPUkssIGdldEZuQ2FsbERlc2MoJ2ZvcmsnLCBmbiwgYXJncykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Bhd24oZm4pIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICB2YXIgZWZmID0gZm9yay5hcHBseSh1bmRlZmluZWQsIFtmbl0uY29uY2F0KGFyZ3MpKTtcbiAgZWZmW0ZPUktdLmRldGFjaGVkID0gdHJ1ZTtcbiAgcmV0dXJuIGVmZjtcbn1cblxudmFyIGlzRm9ya2VkVGFzayA9IGZ1bmN0aW9uIGlzRm9ya2VkVGFzayh0YXNrKSB7XG4gIHJldHVybiB0YXNrW1RBU0tdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGpvaW4odGFzaykge1xuICBjaGVjayh0YXNrLCBpcy5ub3RVbmRlZiwgJ2pvaW4odGFzayk6IGFyZ3VtZW50IHRhc2sgaXMgdW5kZWZpbmVkJyk7XG4gIGlmICghaXNGb3JrZWRUYXNrKHRhc2spKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdqb2luKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKScpO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChKT0lOLCB0YXNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbmNlbCh0YXNrKSB7XG4gIGNoZWNrKHRhc2ssIGlzLm5vdFVuZGVmLCAnY2FuY2VsKHRhc2spOiBhcmd1bWVudCB0YXNrIGlzIHVuZGVmaW5lZCcpO1xuICBpZiAoIWlzRm9ya2VkVGFzayh0YXNrKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2FuY2VsKHRhc2spOiBhcmd1bWVudCAnICsgdGFzayArICcgaXMgbm90IGEgdmFsaWQgVGFzayBvYmplY3QgXFxuKEhJTlQ6IGlmIHlvdSBhcmUgZ2V0dGluZyB0aGlzIGVycm9ycyBpbiB0ZXN0cywgY29uc2lkZXIgdXNpbmcgY3JlYXRlTW9ja1Rhc2sgZnJvbSByZWR1eC1zYWdhL3V0aWxzKScpO1xuICB9XG5cbiAgcmV0dXJuIGVmZmVjdChDQU5DRUwsIHRhc2spO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0KHNlbGVjdG9yKSB7XG4gIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW41ID4gMSA/IF9sZW41IC0gMSA6IDApLCBfa2V5NSA9IDE7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICBhcmdzW19rZXk1IC0gMV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvciA9IGlkZW50O1xuICB9IGVsc2Uge1xuICAgIGNoZWNrKHNlbGVjdG9yLCBpcy5ub3RVbmRlZiwgJ3NlbGVjdChzZWxlY3RvcixbLi4uXSk6IGFyZ3VtZW50IHNlbGVjdG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgIGNoZWNrKHNlbGVjdG9yLCBpcy5mdW5jLCAnc2VsZWN0KHNlbGVjdG9yLFsuLi5dKTogYXJndW1lbnQgJyArIHNlbGVjdG9yICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiBlZmZlY3QoU0VMRUNULCB7IHNlbGVjdG9yOiBzZWxlY3RvciwgYXJnczogYXJncyB9KTtcbn1cblxuLyoqXHJcbiAgY2hhbm5lbChwYXR0ZXJuLCBbYnVmZmVyXSkgICAgPT4gY3JlYXRlcyBhbiBldmVudCBjaGFubmVsIGZvciBzdG9yZSBhY3Rpb25zXHJcbioqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGlvbkNoYW5uZWwocGF0dGVybiwgYnVmZmVyKSB7XG4gIGNoZWNrKHBhdHRlcm4sIGlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLC4uLik6IGFyZ3VtZW50IHBhdHRlcm4gaXMgdW5kZWZpbmVkJyk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIGNoZWNrKGJ1ZmZlciwgaXMubm90VW5kZWYsICdhY3Rpb25DaGFubmVsKHBhdHRlcm4sIGJ1ZmZlcik6IGFyZ3VtZW50IGJ1ZmZlciBpcyB1bmRlZmluZWQnKTtcbiAgICBjaGVjayhidWZmZXIsIGlzLm5vdFVuZGVmLCAnYWN0aW9uQ2hhbm5lbChwYXR0ZXJuLCBidWZmZXIpOiBhcmd1bWVudCAnICsgYnVmZmVyICsgJyBpcyBub3QgYSB2YWxpZCBidWZmZXInKTtcbiAgfVxuICByZXR1cm4gZWZmZWN0KEFDVElPTl9DSEFOTkVMLCB7IHBhdHRlcm46IHBhdHRlcm4sIGJ1ZmZlcjogYnVmZmVyIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuY2VsbGVkKCkge1xuICByZXR1cm4gZWZmZWN0KENBTkNFTExFRCwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmx1c2goY2hhbm5lbCkge1xuICBjaGVjayhjaGFubmVsLCBpcy5jaGFubmVsLCAnZmx1c2goY2hhbm5lbCk6IGFyZ3VtZW50ICcgKyBjaGFubmVsICsgJyBpcyBub3QgdmFsaWQgY2hhbm5lbCcpO1xuICByZXR1cm4gZWZmZWN0KEZMVVNILCBjaGFubmVsKTtcbn1cblxuZXhwb3J0IHZhciBhc0VmZmVjdCA9IHtcbiAgdGFrZTogZnVuY3Rpb24gdGFrZShlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W1RBS0VdO1xuICB9LFxuICBwdXQ6IGZ1bmN0aW9uIHB1dChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W1BVVF07XG4gIH0sXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoZWZmZWN0KSB7XG4gICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFtSQUNFXTtcbiAgfSxcbiAgY2FsbDogZnVuY3Rpb24gY2FsbChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W0NBTExdO1xuICB9LFxuICBjcHM6IGZ1bmN0aW9uIGNwcyhlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W0NQU107XG4gIH0sXG4gIGZvcms6IGZ1bmN0aW9uIGZvcmsoZWZmZWN0KSB7XG4gICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFtGT1JLXTtcbiAgfSxcbiAgam9pbjogZnVuY3Rpb24gam9pbihlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W0pPSU5dO1xuICB9LFxuICBjYW5jZWw6IGZ1bmN0aW9uIGNhbmNlbChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W0NBTkNFTF07XG4gIH0sXG4gIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGVmZmVjdCkge1xuICAgIHJldHVybiBlZmZlY3QgJiYgZWZmZWN0W0lPXSAmJiBlZmZlY3RbU0VMRUNUXTtcbiAgfSxcbiAgYWN0aW9uQ2hhbm5lbDogZnVuY3Rpb24gYWN0aW9uQ2hhbm5lbChlZmZlY3QpIHtcbiAgICByZXR1cm4gZWZmZWN0ICYmIGVmZmVjdFtJT10gJiYgZWZmZWN0W0FDVElPTl9DSEFOTkVMXTtcbiAgfSxcbiAgY2FuY2VsbGVkOiBmdW5jdGlvbiBjYW5jZWxsZWQoZWZmZWN0KSB7XG4gICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFtDQU5DRUxMRURdO1xuICB9LFxuICBmbHVzaDogZnVuY3Rpb24gZmx1c2goZWZmZWN0KSB7XG4gICAgcmV0dXJuIGVmZmVjdCAmJiBlZmZlY3RbSU9dICYmIGVmZmVjdFtGTFVTSF07XG4gIH1cbn07Il19