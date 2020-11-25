"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.returnStoredIntervalsKey = returnStoredIntervalsKey;
exports.returnCurrentPatterns = returnCurrentPatterns;
exports.loadStates = loadStates;
exports.loadIntervals = loadIntervals;
exports.calculateCurrentStates = calculateCurrentStates;
exports.returnActualDatesIntervals = returnActualDatesIntervals;
exports.returnRealActualIntervals = returnRealActualIntervals;
exports.sendRemindAsMessage = sendRemindAsMessage;
exports.intervalFilterFunc = intervalFilterFunc;
exports.returnActualDonners = returnActualDonners;

var _recurrenceConfigs = require("../../../services/recurrenceConfigs");

var _getCurrentDateInterval = require("../../../services/getCurrentDateInterval");

var _stores = _interopRequireDefault(require("../../../stores"));

var _datesWriter = require("../../../services/datesWriter");

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _mapper = require("../../../services/mapper");

var _messagePreparer = _interopRequireDefault(require("../eventChat/messagePreparer"));

var _Requester = _interopRequireDefault(require("../eventChat/Requester"));

var _text = _interopRequireDefault(require("../../../meta/text"));

var _public_states = _interopRequireDefault(require("./public_states"));

var _index = _interopRequireDefault(require("../../../stores/globalState/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function returnStoredIntervalsKey(key) {
  this.item = this.item || this.props.item;
  return _stores["default"].Reminds.remindsIntervals && _stores["default"].Reminds.remindsIntervals[this.item.event_id] && _stores["default"].Reminds.remindsIntervals[this.item.event_id][this.item.id] && _stores["default"].Reminds.remindsIntervals[this.item.event_id][this.item.id][key];
}

function returnCurrentPatterns(remind) {
  return remind && remind.extra && remind.extra.alarms ? [].concat(_toConsumableArray((0, _recurrenceConfigs.AlarmPatterns)().map(function (ele) {
    return _objectSpread({}, ele, {
      autoselected: false
    });
  }).filter(function (ele) {
    return remind.extra.alarms.findIndex(function (e) {
      return e.id == ele.id;
    }) < 0;
  })), _toConsumableArray(remind.extra.alarms.map(function (ele) {
    return _objectSpread({}, ele, {
      autoselected: true
    });
  }))) : (0, _recurrenceConfigs.AlarmPatterns)();
}

function loadStates(isThisProgram, fresh) {
  var _this = this;

  this.loadIntervals(isThisProgram, fresh).then(function (_ref) {
    var currentDateIntervals = _ref.currentDateIntervals,
        correspondingDateInterval = _ref.correspondingDateInterval;

    _this.calculateCurrentStates(currentDateIntervals, correspondingDateInterval).then(function () {
      _this.currentDateIntervals = currentDateIntervals;
      _this.correspondingDateInterval = correspondingDateInterval;

      _this.setStatePure({
        mounted: true,
        newing: !_this.state.newing
      });
    });
  });
}

function loadIntervals(canCheck, fresh) {
  var _this2 = this;

  this.item = this.item || this.props.item;
  return new Promise(function (resolve, reject) {
    var callback = function callback(currentDateIntervals, correspondingDateInterval) {
      canCheck && _this2.showActions && _this2.showActions(currentDateIntervals, correspondingDateInterval, true);
      canCheck && _this2.showReport && _this2.showReport(currentDateIntervals, correspondingDateInterval);
      resolve({
        currentDateIntervals: currentDateIntervals,
        correspondingDateInterval: correspondingDateInterval
      });
    };

    _stores["default"].Reminds.getRemindsIntervals(_this2.item, fresh).then(function (_ref2) {
      var currentDateIntervals = _ref2.currentDateIntervals,
          correspondingDateInterval = _ref2.correspondingDateInterval;

      if (correspondingDateInterval) {
        callback(currentDateIntervals, correspondingDateInterval);
      } else {
        _stores["default"].Reminds.getCurrentInterval(_this2.item, currentDateIntervals).then(function (_ref3) {
          var correspondingDateInterval = _ref3.correspondingDateInterval;
          callback(currentDateIntervals, correspondingDateInterval);
        });
      }
    });
  });
}

function calculateCurrentStates(currentDateIntervals, correspondingDateInterval) {
  var _this3 = this;

  return new Promise(function (resolve) {
    _this3.item = _this3.props.item || _this3.item;
    _this3.hasDoneForThisInterval = (0, _lodash.find)(_this3.item.donners, function (ele) {
      return ele.status.date && correspondingDateInterval && (0, _moment["default"])(ele.status.date).format("x") > (0, _moment["default"])(correspondingDateInterval.start, _recurrenceConfigs.format).format("x") && (0, _moment["default"])(ele.status.date).format("x") <= (0, _moment["default"])(correspondingDateInterval.end, _recurrenceConfigs.format).format("x") && ele.phone === _stores["default"].LoginStore.user.phone;
    }) ? true : false;
    _this3.actualInterval = _this3.returnActualDatesIntervals(currentDateIntervals, correspondingDateInterval);

    if (!(0, _moment["default"])(_this3.actualInterval.period).isValid() || !(0, _moment["default"])(_this3.actualInterval.recurrence).isValid()) {
      _this3.loadIntervals(false, true);
    }

    _this3.realActualIntervals = _this3.returnRealActualIntervals(currentDateIntervals, correspondingDateInterval);
    _this3.dateDiff = (0, _datesWriter.dateDiff)({
      recurrence: correspondingDateInterval ? (0, _moment["default"])(correspondingDateInterval.end, _recurrenceConfigs.format).format() : _this3.item.recursive_frequency.recurrence || _this3.item.period
    });
    _this3.lastIndex = 0;
    _this3.lastInterval = {};
    _this3.isLastInterval = false;

    if (currentDateIntervals && currentDateIntervals.length > 0) {
      _this3.lastIndex = currentDateIntervals.length - 1;
      _this3.lastInterval = currentDateIntervals[_this3.lastIndex];
      _this3.isLastInterval = _this3.realActualIntervals.start == _this3.lastInterval.start && _this3.realActualIntervals.end == _this3.lastInterval.end && !_this3.notYetStarted;
    }

    _this3.canBeDone = correspondingDateInterval ? true : false;
    _this3.missed = (0, _datesWriter.dateDiff)({
      recurrence: correspondingDateInterval ? (0, _moment["default"])(correspondingDateInterval.end, _recurrenceConfigs.format).format() : _this3.item.recursive_frequency.recurrence || _this3.item.period
    }) > 0 && !_this3.hasDoneForThisInterval;
    _this3.status = _this3.item.confirmed && correspondingDateInterval && (0, _lodash.findIndex)(_this3.item.confirmed, function (ele) {
      return (0, _mapper.confirmedChecker)(ele, _stores["default"].LoginStore.user.phone, correspondingDateInterval);
    }) >= 0;
    _this3.cannotAssign = (0, _datesWriter.dateDiff)({
      recurrence: correspondingDateInterval ? (0, _moment["default"])(correspondingDateInterval.end, _recurrenceConfigs.format).format() : _this3.item.recursive_frequency.recurrence || _this3.item.period
    }) > 0 || _this3.item.status === _public_states["default"].private_;
    _this3.member = (0, _lodash.findIndex)(_this3.item.members, {
      phone: _stores["default"].LoginStore.user.phone
    }) >= 0;
    _this3.membersCount = (_this3.item.members && _this3.item.members.length) > 0 ? "".concat(_this3.item.members.length, " ").concat(_text["default"].members) : "";
    _this3.remindTimeDetails = "".concat(sayInitialDate(_this3.item.period), ".\n").concat(returnFrequency(_this3.item.recursive_frequency.frequency, _this3.item.recursive_frequency.days_of_week, _this3.item.period, _this3.item.recursive_frequency.recurrence, _this3.item.recursive_frequency.interval));
    _this3.canShare = _this3.item.status == _public_states["default"].public_;
    _this3.isEvent = _index["default"].calculateRemindType(_this3.item);
    resolve();
  });
}

function returnFrequency(frequency, dayOfWeek, date, enddate, interval) {
  var returnDays = function returnDays() {
    return dayOfWeek.reduce(function (prev, day) {
      return prev + _recurrenceConfigs.daysOfWeeksDefault.find(function (ele) {
        return ele.code == day;
      }).day + ", ";
    }, "");
  };

  var occursOnce = frequency == _recurrenceConfigs.frequencies['yearly'] && interval == 1;
  var hasPassed = (0, _moment["default"])(enddate).format("x") < (0, _moment["default"])().format("x");

  var _final = "".concat(occursOnce ? hasPassed ? _text["default"].past_since : _text["default"].ends : ' ' + _text["default"].until, " ").concat((0, _moment["default"])(enddate).calendar());

  var getFrequency = function getFrequency() {
    switch (frequency) {
      case _recurrenceConfigs.frequencies.daily:
        return "".concat(_text["default"].every_day_at, " ").concat((0, _moment["default"])(date).format(_recurrenceConfigs.timeFormat));

      case _recurrenceConfigs.frequencies.monthly:
        return "".concat(_text["default"].every_month_on_the, " ").concat((0, _datesWriter.getDayMonth)(date));

      case _recurrenceConfigs.frequencies.weekly:
        return "".concat(_text["default"].every, " ").concat(returnDays(), " ").concat(_text["default"].at, " ").concat((0, _moment["default"])(date).format(_recurrenceConfigs.timeFormat));

      case _recurrenceConfigs.frequencies.yearly:
        return occursOnce ? "" : "".concat(_text["default"].yearly_on, " ").concat((0, _datesWriter.getMonthDay)(date));
    }
  };

  return getFrequency() + _final;
}

function sayInitialDate(date) {
  var isPast = (0, _moment["default"])(date).format("x") < (0, _moment["default"])().format("x");
  var calendarDate = (0, _moment["default"])(date).calendar();
  return isPast ? "".concat(_text["default"].started, " ").concat(calendarDate) : "".concat(_text["default"].starts, " ").concat(calendarDate);
}

function returnActualDatesIntervals(currentDateIntervals, correspondingDateInterval) {
  this.item = this.props.item || this.item;

  if (correspondingDateInterval) {
    var correspondingStartDate = (0, _moment["default"])(correspondingDateInterval.start, _recurrenceConfigs.format).format();
    var correspondingEndDate = (0, _moment["default"])(correspondingDateInterval.end, _recurrenceConfigs.format).format();
    var fistIntervalStart = (0, _moment["default"])(currentDateIntervals[0].start, _recurrenceConfigs.format).format();

    if (fistIntervalStart == correspondingStartDate) {
      correspondingStartDate = (0, _moment["default"])(correspondingStartDate).add(1, 'year');
    }

    this.notYetStarted = (0, _moment["default"])(correspondingStartDate).isAfter((0, _moment["default"])().format());
    var date = this.notYetStarted ? correspondingStartDate : correspondingEndDate;
    return {
      period: date,
      recurrence: date,
      title: this.item.title
    };
  } else {
    var currentEndDate = (0, _moment["default"])(currentDateIntervals[currentDateIntervals.length - 1].end, _recurrenceConfigs.format).format();
    var currentStartDate = (0, _moment["default"])(currentDateIntervals[currentDateIntervals.length - 1].start, _recurrenceConfigs.format).format();
    var isAboveStart = (0, _moment["default"])().format("x") > (0, _moment["default"])(currentStartDate).format("x");

    var _date = isAboveStart ? currentEndDate : currentStartDate;

    return {
      period: _date,
      recurrence: _date,
      title: this.item.title
    };
  }
}

function returnRealActualIntervals(currentDateIntervals, correspondingDateInterval) {
  return correspondingDateInterval ? {
    start: correspondingDateInterval.start,
    end: correspondingDateInterval.end
  } : {
    period: currentDateIntervals[currentDateIntervals.length - 1].start,
    recurrence: currentDateIntervals[currentDateIntervals.length - 1].end
  };
}

function sendRemindAsMessage(remind, activity_name) {
  var message = _messagePreparer["default"].formMessageFromRemind(remind);

  return _Requester["default"].sendMessage(message, remind.event_id, remind.event_id, true, activity_name);
}

function intervalFilterFunc(el, ele) {
  return (0, _moment["default"])(el.status.date).format("x") > (ele && (0, _moment["default"])(ele.start, _recurrenceConfigs.format).format("x")) && (0, _moment["default"])(el.status.date).format("x") <= (ele && (0, _moment["default"])(ele.end, _recurrenceConfigs.format).format("x"));
}

function returnActualDonners(member, report, url) {
  return _objectSpread({}, this.state.currentDonner || member, {
    status: _objectSpread({
      date: (0, _moment["default"])().format(),
      status: member.status
    }, this.state.currentDonner && this.state.currentDonner.status, {
      latest_edit: this.state.currentDonner && (0, _moment["default"])().format(),
      report: report,
      url: url
    })
  });
}