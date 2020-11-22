"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sayTyping = sayTyping;
exports.checkUserOnlineStatus = checkUserOnlineStatus;
exports.copyText = copyText;
exports.constructActivityLink = constructActivityLink;
exports.constructProgramLink = constructProgramLink;
exports.constructStarLink = constructStarLink;

var _Requester = require("../settings/privacy/Requester");

var _moment = _interopRequireDefault(require("moment"));

var _reactNative = require("react-native");

var _Vibrator = _interopRequireDefault(require("../../../services/Vibrator"));

var _Toaster = _interopRequireDefault(require("../../../services/Toaster"));

var _text = _interopRequireDefault(require("../../../meta/text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function sayTyping(typer) {
  var _this = this;

  var user = typer;
  this.typingTimeout && clearTimeout(this.typingTimeout);
  this.setStatePure({
    typing: true,
    recording: user && user.recording,
    typer: user && user.name
  });
  this.typingTimeout = setTimeout(function () {
    _this.setStatePure({
      typing: false,
      recording: user && user.recording,
      typer: user && user.name
    });

    clearTimeout(_this.typingTimeout);
    _this.typingTimeout = null;
  }, 1000);
}

function checkUserOnlineStatus(phone, curentRef, refManager) {
  var _this2 = this;

  console.warn("current check user online status ref is: ", curentRef);

  if (!curentRef) {
    var fun = function fun() {
      _Requester.PrivacyRequester.checkUserStatus(phone).then(function (status) {
        var isOnline = status.status == "online";
        var hasEverConnected = status.last_seen && status.last_seen !== "undefined" ? true : false;

        _this2.setStatePure({
          last_seen: isOnline ? "Online" : hasEverConnected ? (0, _moment["default"])(status.last_seen).calendar() : _text["default"].years_ago,
          is_online: isOnline
        });
      });
    };

    fun();
    var setIntervalRef = setInterval(function () {
      fun();
    }, 4000);
    refManager(setIntervalRef);
  }
}

function copyText(text) {
  _reactNative.Clipboard.setString(text);

  _Vibrator["default"].vibrateShort();

  (0, _Toaster["default"])({
    text: _text["default"].copied,
    type: 'success'
  });
}

var base = "https://bleashup.com/event/";

function constructActivityLink(activity_id) {
  return base + activity_id;
}

function constructProgramLink(activity_id, program_id) {
  return base + activity_id + '/reminds/' + program_id;
}

function constructStarLink(activity_id, star_id) {
  return base + activity_id + '/stars/' + star_id;
}