"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tcpRequestData = _interopRequireDefault(require("../../../services/tcpRequestData"));

var _severEventListener = _interopRequireDefault(require("../../../services/severEventListener"));

var _stores = _interopRequireDefault(require("../../../stores"));

var _requestObjects = _interopRequireDefault(require("../../../services/requestObjects"));

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _CalendarService = _interopRequireDefault(require("../../../services/CalendarService"));

var _mainUpdater = _interopRequireDefault(require("../../../services/mainUpdater"));

var _toTitle = _interopRequireDefault(require("../../../services/toTitle"));

var _Toaster = _interopRequireDefault(require("../../../services/Toaster"));

var _IdMaker = _interopRequireDefault(require("../../../services/IdMaker"));

var _text = _interopRequireDefault(require("../../../meta/text"));

var _notifications_channels = _interopRequireDefault(require("../eventChat/notifications_channels"));

var _updatesDispatcher = _interopRequireDefault(require("../../../services/updatesDispatcher"));

var _updatesPosibilites = _interopRequireDefault(require("../../../services/updates-posibilites"));

var _reply_extern = _interopRequireDefault(require("../eventChat/reply_extern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Requester =
/*#__PURE__*/
function () {
  function Requester() {
    _classCallCheck(this, Requester);

    this.notif_channel = _notifications_channels["default"].reminds;
  }

  _createClass(Requester, [{
    key: "saveToCanlendar",
    value: function saveToCanlendar(eventID, remind, alarms, newRemindName) {
      console.warn("remind members is: ", remind.members);
      return new Promise(function (resolve, reject) {
        if ((0, _lodash.findIndex)(remind.members, {
          phone: _stores["default"].LoginStore.user.phone
        }) >= 0) {
          _CalendarService["default"].saveEvent(remind, alarms, "reminds", newRemindName).then(function (calendar_id) {
            _stores["default"].Reminds.updateCalendarID(eventID, {
              remind_id: remind.id,
              calendar_id: calendar_id
            }, alarms).then(function () {
              resolve(calendar_id);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "CreateRemind",
    value: function CreateRemind(Remind, activityName) {
      return new Promise(function (resolve, reject) {
        _tcpRequestData["default"].addRemind(Remind, Remind.event_id + "_currence").then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, Remind.event_id + "_currence").then(function (response) {
            _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(Remind.event_id, Remind, null, _updatesPosibilites["default"].possibilites.remind_added)).then(function () {
              resolve("ok");
            });
          })["catch"](function () {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            reject();
          });
        });
      });
    }
  }, {
    key: "updateRemindName",
    value: function updateRemindName(newName, oldName, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newName !== oldName) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "title";
          newRemindName.data = newName;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_name").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_name").then(function (response) {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                title: newName
              }, null, _updatesPosibilites["default"].possibilites.remind_title_updated)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              console.warn(error);
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateRemindDescription",
    value: function updateRemindDescription(newDescription, oldDesc, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newDescription !== oldDesc) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "description";
          newRemindName.data = newDescription;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;
          var id = remindID + "_description";

          _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, id).then(function () {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                description: newDescription
              }, null, _updatesPosibilites["default"].possibilites.remind_description_updated)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              console.warn(error);
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "confirm",
    value: function confirm(Member, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        var newRemindName = _requestObjects["default"].RemindUdate();

        newRemindName.action = "confirm";
        newRemindName.data = Member;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        var id = remindID + "_confirm";

        _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, id).then(function () {
            _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
              remind_id: remindID,
              confirmed: Member
            }, null, _updatesPosibilites["default"].possibilites.confirm)).then(function () {
              resolve("ok");
            });
          })["catch"](function (error) {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            console.warn(error);
            reject(error);
          });
        });
      });
    }
  }, {
    key: "updateRemindRecurrentcyConfig",
    value: function updateRemindRecurrentcyConfig(newConfigs, oldConfig, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (typeof newConfigs === "string" && newConfigs !== oldConfig || _typeof(newConfigs) === "object" && !(0, _lodash.isEqual)(newConfigs, oldConfig)) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "recurrence";
          newRemindName.data = newConfigs;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_recurrence").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_recurrence").then(function (reponse) {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                recursive_frequency: newConfigs
              }, null, _updatesPosibilites["default"].possibilites.remind_recurrence)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              console.warn(error);
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateRemindPublicState",
    value: function updateRemindPublicState(newState, oldState, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newState !== oldState) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "public_state";
          newRemindName.data = newState;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_public_state").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_public_state").then(function (response) {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                status: newState
              }, null, _updatesPosibilites["default"].possibilites.remind_public_state)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              console.warn(error);
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateMustRepot",
    value: function updateMustRepot(newMustReport, oldMust, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newMustReport !== oldMust) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "must_report";
          newRemindName.data = newMustReport;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_must_report").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_must_report").then(function (response) {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                must_report: newMustReport
              }, null, _updatesPosibilites["default"].possibilites.must_report)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              console.warn(error);
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updatePeriod",
    value: function updatePeriod(newPeriod, oldPer, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newPeriod !== oldPer) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "period";
          newRemindName.data = newPeriod;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_period").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_period").then(function (response) {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                period: newPeriod
              }, null, _updatesPosibilites["default"].possibilites.remind_period_updated)).then(function () {
                resolve("ok");
              });
            })["catch"](function (error) {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              reject(error);
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateRemindAlarms",
    value: function updateRemindAlarms(newExtra, oldExtra, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newExtra && oldExtra && (0, _lodash.differenceWith)(newExtra.alarms, oldExtra.alarms, _lodash.isEqual).length !== (0, _lodash.differenceWith)(oldExtra.alarms, newExtra.alarms, _lodash.isEqual).length) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "remind_alarms";
          newRemindName.data = {
            alarms: newExtra.alarms,
            date: newExtra.date
          };
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;

          _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_alarms").then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, remindID + "_alarms").then(function (response) {
              newRemindName.alarms = newRemindName.data;

              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, newRemindName, null, _updatesPosibilites["default"].possibilites.remind_alarms)).then(function () {
                resolve("ok");
              });
            });
          })["catch"](function (e) {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            reject();
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateRemindLocation",
    value: function updateRemindLocation(newLocation, oldLocation, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (newLocation !== oldLocation) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "location";
          newRemindName.data = newLocation;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;
          var id = remindID + "_location";

          _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, id).then(function () {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                remind_id: remindID,
                location: newLocation
              }, null, _updatesPosibilites["default"].possibilites.remind_location)).then(function () {
                resolve("ok");
              });
            })["catch"](function () {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              reject();
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "updateRemindURL",
    value: function updateRemindURL(newURL, oldULR, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        if (!(0, _lodash.isEqual)(newURL, oldULR)) {
          var newRemindName = _requestObjects["default"].RemindUdate();

          newRemindName.action = "remind_url";
          newRemindName.data = newURL;
          newRemindName.event_id = eventID;
          newRemindName.remind_id = remindID;
          var id = remindID + "_remind_url";

          _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
            _severEventListener["default"].sendRequest(JSONData, id).then(function () {
              _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
                url: newURL,
                remind_id: remindID
              }, null, _updatesPosibilites["default"].possibilites.remind_url)).then(function () {
                resolve("ok");
              });
            })["catch"](function () {
              (0, _Toaster["default"])({
                text: _text["default"].unable_to_perform_request
              });
              reject();
            });
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "addMembersToRemote",
    value: function addMembersToRemote(remind, activity_name, persist) {
      var _this = this;

      this.yourName = (0, _toTitle["default"])(_stores["default"].LoginStore.user.nickname);
      this.shortName = this.yourName.split(" ")[0];
      return new Promise(function (resolve, reject) {
        var newRemindName = _requestObjects["default"].RemindUdate();

        var notif = _requestObjects["default"].Notification();

        notif.notification.body = activity_name ? "".concat(_this.shortName, " @ ").concat(activity_name, " ").concat(_text["default"].have_add_members_to_the_program) : "".concat(_this.yourName, " ").concat(_text["default"].added_members);
        notif.notification.android_channel_id = _this.notif_channel;
        notif.notification.title = "".concat(_text["default"].new_members_in, " ").concat(remind.title, " ").concat(_text["default"].program);
        notif.data.activity_id = remind.event_id;
        notif.data.reply = _defineProperty({
          type: _reply_extern["default"].member
        }, _reply_extern["default"].member, {
          phone: remind.members[0].phone
        });
        notif.data.remind_id = remind.id;
        newRemindName.action = "add_members";
        var id = remind.id + "_add_members";

        if (_stores["default"].States.requestExists(id) && persist) {
          var data = _severEventListener["default"].returnRequestData(_stores["default"].States.getRequest(id)).data;

          remind.members = (0, _lodash.uniqBy)([].concat(_toConsumableArray(data), _toConsumableArray(remind.members)), "phone");
        }

        newRemindName.data = remind.members;
        newRemindName.event_id = remind.event_id;
        newRemindName.remind_id = remind.id;
        newRemindName.notif = notif;

        _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, id, persist).then(function (response) {
            resolve();
          })["catch"](function (err) {
            return reject(err);
          });
        });
      });
    }
  }, {
    key: "concludeAddMembers",
    value: function concludeAddMembers(remind, alarms) {
      return new Promise(function (resolve, reject) {
        _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(remind.event_id, {
          members: remind.members,
          remind_id: remind.id,
          alarms: alarms
        }, null, _updatesPosibilites["default"].possibilites.members_added_to_remind)).then(function () {
          resolve("ok");
        });
      });
    }
  }, {
    key: "addMembers",
    value: function addMembers(remind, alarms, activity_name) {
      var _this2 = this;

      this.yourName = (0, _toTitle["default"])(_stores["default"].LoginStore.user.nickname);
      this.shortName = this.yourName.split(" ")[0];
      return new Promise(function (resolve, reject) {
        var canPersistRequest = remind.members.length == 1 && remind.members[0].phone == _stores["default"].LoginStore.user.phone;

        if (canPersistRequest) {
          _this2.addMembersToRemote(remind, activity_name, true);

          _this2.concludeAddMembers(remind, alarms).then(function () {
            resolve();
          });
        } else {
          _this2.addMembersToRemote(remind, alarms, activity_name, false).then(function () {
            _this2.concludeAddMembers(remind, alarms).then(function () {
              resolve();
            });
          })["catch"](function (error) {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            console.warn(error);
            reject(error);
          });
        }
      });
    }
  }, {
    key: "removeMembersRemote",
    value: function removeMembersRemote(members, remindID, eventID, perist) {
      return new Promise(function (resolve, reject) {
        var id = remindID + "_remove_members";

        if (_stores["default"].States.requestExists(id)) {
          console.warn("concatinating members to be removed");

          var oldMembers = _severEventListener["default"].returnRequestData(_stores["default"].States.states.requests[id]).data;

          members = uniq([].concat(_toConsumableArray(oldMembers), _toConsumableArray(members)));
          console.warn(members);
        }

        var newRemindName = _requestObjects["default"].RemindUdate();

        newRemindName.action = "remove_members";
        newRemindName.data = members;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;

        _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, id, perist).then(function () {
            resolve();
          })["catch"](function (err) {
            reject(err);
          });
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "concludeRemoveMembers",
    value: function concludeRemoveMembers(members, remindID, eventID) {
      return new Promise(function (resolve, reject) {
        _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, {
          members: members,
          remind_id: remindID
        }, null, _updatesPosibilites["default"].possibilites.members_removed_from_remind)).then(function () {
          resolve("ok");
        });
      });
    }
  }, {
    key: "removeMembers",
    value: function removeMembers(members, remindID, eventID) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var canPersistRequest = members.length == 1 && members[0] === _stores["default"].LoginStore.user.phone;

        if (canPersistRequest) {
          _this3.removeMembersRemote(members, remindID, eventID, true);

          _this3.concludeRemoveMembers(members, remindID, eventID).then(function () {
            resolve();
          });
        } else {
          _this3.removeMembersRemote(members, remindID, eventID, false).then(function () {
            _this3.concludeRemoveMembers(members, remindID, eventID).then(function () {
              resolve();
            });
          })["catch"](function (error) {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            console.warn(error);
            reject(error);
          });
        }
      });
    }
  }, {
    key: "performAllUpdates",
    value: function performAllUpdates(previousRemind, newRemind) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.updateRemindName(newRemind.title, JSON.parse(previousRemind).title, newRemind.id, newRemind.event_id).then(function (t1) {
          _this4.updateRemindDescription(newRemind.description, JSON.parse(previousRemind).description, newRemind.id, newRemind.event_id).then(function (t2) {
            _this4.updatePeriod(newRemind.period, JSON.parse(previousRemind).period, newRemind.id, newRemind.event_id).then(function (t3) {
              _this4.updateRemindPublicState(newRemind.status, JSON.parse(previousRemind).status, newRemind.id, newRemind.event_id).then(function (t4) {
                _this4.updateRemindRecurrentcyConfig(newRemind.recursive_frequency, JSON.parse(previousRemind).recursive_frequency, newRemind.id, newRemind.event_id).then(function (t5) {
                  _this4.updateRemindLocation(newRemind.location, JSON.parse(previousRemind).location, newRemind.id, newRemind.event_id).then(function (t6) {
                    _this4.updateRemindURL(newRemind.remind_url, JSON.parse(previousRemind).remind_url, newRemind.id, newRemind.event_id).then(function (t7) {
                      _this4.updateMustRepot(newRemind.must_report, JSON.parse(previousRemind).must_report, newRemind.id, newRemind.event_id).then(function (t8) {
                        _this4.updateRemindAlarms(newRemind.extra, JSON.parse(previousRemind).extra, newRemind.id, newRemind.event_id).then(function (t9) {
                          resolve(t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9);
                        })["catch"](function (r) {
                          reject(r);
                        });
                      })["catch"](function (r) {
                        reject(r);
                      });
                    })["catch"](function () {
                      reject(r);
                    });
                  })["catch"](function (r) {
                    reject(r);
                  });
                })["catch"](function (r) {
                  reject(r);
                });
              })["catch"](function (r) {
                reject(r);
              });
            })["catch"](function (r) {
              reject(r);
            });
          })["catch"](function (r) {
            reject(r);
          });
        })["catch"](function (r) {
          reject(r);
        });
      });
    }
  }, {
    key: "markAsDoneRemote",
    value: function markAsDoneRemote(member, remind, activity_name) {
      var _this5 = this;

      this.yourName = (0, _toTitle["default"])(_stores["default"].LoginStore.user.nickname);
      this.shortName = this.yourName.split(" ")[0];
      return new Promise(function (resolve, reject) {
        var newRemindName = _requestObjects["default"].RemindUdate();

        var notif = _requestObjects["default"].Notification();

        notif.notification.title = "".concat(remind.title, "; ").concat(_text["default"].completed_program), notif.notification.body = activity_name ? "".concat(_this5.shortName, " @ ").concat(activity_name, " ").concat(_text["default"].have_completed_the_program) : "".concat(_this5.yourName, " ").concat(_text["default"].have_completed_the_program);
        notif.notification.android_channel_id = _this5.notif_channel;
        notif.data.activity_id = remind.event_id;
        notif.data.reply = _defineProperty({
          type: _reply_extern["default"].done
        }, _reply_extern["default"].done, {
          phone: member[0].phone,
          status: {
            date: member[0].status.date
          }
        });
        notif.data.remind_id = remind.id;
        newRemindName.action = "mark_as_done";
        newRemindName.data = member;
        newRemindName.event_id = remind.event_id;
        newRemindName.remind_id = remind.id;
        newRemindName.notif = notif;
        var id = remind.id + '_' + member[0].status.date + '_' + "_mark_as_done";

        _tcpRequestData["default"].updateRemind(newRemindName, id).then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, id, true).then(function (response) {
            resolve("ok");
          })["catch"](function (error) {
            reject(error);
          });
        });
      });
    }
  }, {
    key: "markAsDone",
    value: function markAsDone(member, remind, alams, activity_name) {
      var _this6 = this;

      this.yourName = (0, _toTitle["default"])(_stores["default"].LoginStore.user.nickname);
      this.shortName = this.yourName.split(" ")[0];
      return new Promise(function (resolve, reject) {
        _this6.markAsDoneRemote(member, remind, activity_name);

        _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(remind.event_id, {
          donners: member,
          remind_id: remind.id
        }, null, _updatesPosibilites["default"].possibilites.mark_as_done)).then(function () {
          resolve("ok");
        });
      })["catch"](function (e) {
        (0, _Toaster["default"])({
          text: _text["default"].unable_to_perform_request
        });
        reject();
      });
    }
  }, {
    key: "deleteRemind",
    value: function deleteRemind(remindID, eventID) {
      return new Promise(function (resolve, reject) {
        var newRemindName = _requestObjects["default"].RemindUdate();

        newRemindName.action = "delete";
        newRemindName.data = null;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;

        _tcpRequestData["default"].updateRemind(newRemindName, remindID + "_delete").then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, remindID + "_delete").then(function (response) {
            _updatesDispatcher["default"].dispatchUpdate(_requestObjects["default"].Updated(eventID, remindID, null, _updatesPosibilites["default"].possibilites.remind_deleted)).then(function () {
              resolve("ok");
            });
          })["catch"](function () {
            (0, _Toaster["default"])({
              text: _text["default"].unable_to_perform_request
            });
            reject("delete remind error");
          });
        });
      });
    }
  }, {
    key: "restoreRemind",
    value: function restoreRemind(remind) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        var newRemindName = _requestObjects["default"].RemindUdate();

        newRemindName.action = "restore";
        newRemindName.data = _objectSpread({}, remind, {
          alams: undefined
        });
        newRemindName.event_id = remind.event_id;
        newRemindName.remind_id = remind.id;

        _tcpRequestData["default"].updateRemind(newRemindName, remind.id + "_restore").then(function (JSONData) {
          _severEventListener["default"].sendRequest(JSONData, remind.id + "_restore").then(function (response) {
            _stores["default"].Reminds.addReminds(remind.event_id, remind).then(function () {
              _stores["default"].Events.addRemind(remind.event_id, remind.id).then(function () {
                var Change = {
                  id: _IdMaker["default"].make(),
                  title: "Updates On ".concat(remind.title, " Remind"),
                  updated: "restored_remind",
                  updater: _stores["default"].LoginStore.user.phone,
                  event_id: remind.event_id,
                  changed: "Restored  ".concat(remind.title, " Remind"),
                  new_value: {
                    data: remind.id,
                    new_value: remind
                  },
                  date: (0, _moment["default"])().format(),
                  time: null
                };

                _this7.saveToCanlendar(remind.event_id, remind, null);

                _stores["default"].ChangeLogs.addChanges(Change).then(function () {});

                resolve("ok");
              });
            });
          })["catch"](function (er) {
            reject(er);
          });
        });
      });
    }
  }]);

  return Requester;
}();

var RemindRequest = new Requester();
var _default = RemindRequest;
exports["default"] = _default;