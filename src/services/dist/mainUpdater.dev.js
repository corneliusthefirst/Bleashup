"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _stores = _interopRequireDefault(require("../stores"));

var _CalendarService = _interopRequireDefault(require("./CalendarService"));

var _toTitle = _interopRequireDefault(require("./toTitle"));

var _IdMaker = _interopRequireDefault(require("./IdMaker"));

var _Requester = require("../components/myscreens/settings/privacy/Requester");

var _Requester2 = _interopRequireDefault(require("../components/myscreens/eventChat/Requester"));

var _eventEmiter = _interopRequireDefault(require("./eventEmiter"));

var _events = require("../meta/events");

var _text = _interopRequireDefault(require("../meta/text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mainUpdater =
/*#__PURE__*/
function () {
  function mainUpdater() {
    _classCallCheck(this, mainUpdater);
  }

  _createClass(mainUpdater, [{
    key: "addParticipants",
    value: function addParticipants(eventID, participants, updater, updated, date) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Events.addParticipants(eventID, participants, true).then(function (Event) {
          var Change = {
            id: _IdMaker["default"].make(),
            updater: updater,
            updated: updated,
            event_id: eventID,
            title: _text["default"].update_on_main_activity,
            changed: _text["default"].added_members_to_the_activity,
            new_value: {
              data: null,
              new_value: participants
            },
            date: date
          };

          _stores["default"].ChangeLogs.addChanges(Change);

          resolve(Change);
        });
      });
    }
  }, {
    key: "updateRemindLocation",
    value: function updateRemindLocation(eventID, remindID, newLocation, date, updater) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Reminds.updateLocation(eventID, {
          remind_id: remindID,
          location: newLocation
        }, true).then(function (oldRemind) {
          var Change = {
            id: _IdMaker["default"].make(),
            title: "".concat(_text["default"].update_remind, " ").concat(oldRemind.title, " (").concat(_text["default"].remind, ")"),
            updated: "remind_location",
            updater: updater,
            event_id: eventID,
            changed: _text["default"].changed_program_location,
            new_value: {
              data: remindID,
              new_value: newLocation
            },
            date: date,
            time: null
          };
          oldRemind.calendar_id ? _CalendarService["default"].saveEvent(_objectSpread({}, oldRemind, {
            location: newLocation
          }), oldRemind.alarms, 'reminds').then(function () {}) : null;
          resolve(Change);

          _stores["default"].ChangeLogs.addChanges(Change).then(function () {});
        });
      });
    }
  }, {
    key: "updateRemindURL",
    value: function updateRemindURL(eventID, remindID, newURL, date, updater) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Reminds.updateURL(eventID, {
          remind_id: remindID,
          url: newURL
        }, true).then(function (oldRemind) {
          var Change = {
            id: _IdMaker["default"].make(),
            title: "".concat(_text["default"].updates_on, " ").concat(oldRemind.title, " (").concat(_text["default"].remind, ")"),
            updated: "remind_url",
            updater: updater,
            event_id: eventID,
            changed: _text["default"].changed_media_specifications_of_program + (newURL.video ? ": video" : ": photo"),
            new_value: {
              data: remindID,
              new_value: newURL
            },
            date: date,
            time: null
          };
          resolve(Change);

          _stores["default"].ChangeLogs.addChanges(Change).then(function () {});
        });
      });
    }
  }, {
    key: "blocked",
    value: function blocked(updater) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Privacy.blockMe(updater).then(function () {
          resolve();
        });
      });
    }
  }, {
    key: "unBlocked",
    value: function unBlocked(updater) {
      return _stores["default"].Privacy.unblockMe(updater);
    }
  }, {
    key: "muted",
    value: function muted(updater) {
      return _stores["default"].Privacy.muteMe(updater);
    }
  }, {
    key: "unMuted",
    value: function unMuted(updater) {
      return _stores["default"].Privacy.unmuteMe(updater);
    }
  }, {
    key: "choseShareTitle",
    value: function choseShareTitle(type) {
      if (type === _Requester.shared_post) {
        return 'Post';
      } else if (type === _Requester.shared_remind) {
        return 'Remind';
      } else {
        'Vote';
      }
    }
  }, {
    key: "returnItemTitle",
    value: function returnItemTitle(type, itemID, eventID) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _stores["default"].Events.loadCurrentEvent(eventID).then(function (event) {
          if (type == _Requester.shared_remind) {
            _stores["default"].Reminds.loadRemind(eventID, itemID).then(function (remind) {
              resolve({
                item_title: remind && remind.title,
                activity_name: event && event.about && event.about.title
              });
            });
          } else if (type === _Requester.shared_post) {
            _stores["default"].Highlights.loadHighlight(_this.props.event_id, itemID).then(function (post) {
              resolve({
                item_title: post && post.title,
                activity_name: event && event.about && event.about.title
              });
            });
          } else {
            _stores["default"].Votes.loadVote(itemID).then(function (vote) {
              console.warn(vote, itemID);
              resolve({
                item_title: vote && vote.title,
                activity_name: event && event.about && event.about.title
              });
            });
          }
        });
      });
    }
  }, {
    key: "saveShares",
    value: function saveShares(eventID, share, updater, date) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.returnItemTitle(share.type, share.item_id, share.activity_id).then(function (title) {
          console.warn(title, share);

          var shareTitle = _this2.choseShareTitle(share.type);

          var scope = (0, _toTitle["default"])(share.scope);
          var change = {
            id: _IdMaker["default"].make(),
            date: date,
            updated: share.type,
            updater: updater,
            title: _text["default"].update_on_main_activity,
            event_id: eventID,
            changed: _text["default"].shared + (0, _toTitle["default"])(title.item_title) + ' (' + shareTitle + ") ".concat(_text["default"].to_his, " ") + (scope === 'Some' ? 'Contacts' : scope),
            new_value: {
              data: share.id,
              new_value: title.item_title
            }
          };

          _stores["default"].Events.addEvent(share).then(function () {
            resolve(change);

            _stores["default"].ChangeLogs.addChanges(change);
          });
        });
      });
    }
  }, {
    key: "saveMessage",
    value: function saveMessage(message, eventID, committeeID, me) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!me) {
          _stores["default"].Messages.addNewMessage(committeeID, message).then(function () {
            _Requester2["default"].receiveMessage(message.id, eventID, eventID).then(function () {});
          });
        }

        _this3.informCommitteeAndEvent(message, committeeID, eventID).then(function () {
          resolve();
        });
      });
    }
  }, {
    key: "receiveMessage",
    value: function receiveMessage(messageID, commiteeID, receiver) {
      return _stores["default"].Messages.receiveMessage(commiteeID, receiver, messageID);
    }
  }, {
    key: "updateMessage",
    value: function updateMessage(messageID, commiteeID, eventID, text) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Messages.updateMessageText(commiteeID, messageID, text).then(function () {
          resolve();
        });
      });
    }
  }, {
    key: "playedMessage",
    value: function playedMessage(messageID, committeeID, eventID, player) {
      return _stores["default"].Messages.playedMessage(committeeID, messageID, player);
    }
  }, {
    key: "seenMessage",
    value: function seenMessage(messageID, committeeID, eventID, seer) {
      return _stores["default"].Messages.seenMessage(committeeID, messageID, seer);
    }
  }, {
    key: "reactToMessage",
    value: function reactToMessage(messageID, commiteeID, eventID, reaction) {
      return _stores["default"].Messages.reactToMessage(commiteeID, messageID, reaction);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(messageID, commiteeID, eventID) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _stores["default"].Messages.removeMessage(commiteeID, messageID).then(function (mess) {
          var seeer = _this4.isSeeer(mess);

          if (!seeer) {
            _stores["default"].States.removeNewMessage(commiteeID, messageID);
          }

          _stores["default"].Events.changeUpdatedStatus(eventID, true).then(function () {
            resolve();
          });
        });
      });
    }
  }, {
    key: "sayTyping",
    value: function sayTyping(commiteeID, typer, dontEmit) {
      return new Promise(function (resolve, reject) {
        _eventEmiter["default"].emit((0, _events.typing)(typer.isRelation ? typer.phone : commiteeID), typer);

        resolve();
      });
    }
  }, {
    key: "isSeeer",
    value: function isSeeer(message) {
      return message && message.seen && message.seen.find(function (ele) {
        return ele && ele.phone && ele.phone.replace("+", "00") === _stores["default"].LoginStore.user.phone;
      });
    }
  }, {
    key: "informCommitteeAndEvent",
    value: function informCommitteeAndEvent(message, committeeID, eventID) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var seeer = _this5.isSeeer(message);

        if (!seeer) {
          _stores["default"].States.addNewMessage(committeeID, message.id);
        }

        _stores["default"].Events.changeUpdatedStatus(eventID).then(function () {
          resolve();
        });
      });
    }
  }, {
    key: "updateRemindAlarms",
    value: function updateRemindAlarms(eventID, remindID, newAlarms, date, updater) {
      return new Promise(function (resolve, reject) {
        _stores["default"].Reminds.updateAlarmPatern(eventID, remindID, newAlarms.alarms, newAlarms.date).then(function (oldRemind) {
          var change = {
            id: _IdMaker["default"].make(),
            date: date,
            updated: "remind_alarms",
            updater: updater,
            title: "".concat(_text["default"].updates_on, " ").concat(oldRemind.title, " (").concat(_text["default"].remind, ")"),
            event_id: eventID,
            changed: _text["default"].changed_the_default_alarm_settings,
            new_value: {
              data: null,
              new_value: newAlarms
            }
          };
          resolve();

          _stores["default"].ChangeLogs.addChanges(change);
        });
      });
    }
  }]);

  return mainUpdater;
}();

var MainUpdater = new mainUpdater();
var _default = MainUpdater;
exports["default"] = _default;