import stores from "../../../stores";
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import Texts from "../../../meta/text";
import XLSX from 'xlsx';
import replies from '../eventChat/reply_extern';
import {
  getTypeTextFromURL,
  getURLfromType
} from "../event/createEvent/components/mediaTypes.service";
import Pickers from "../../../services/Picker";

function getDateKey(type) {
  return {
    [replies.done]: Texts.reported_at,
    [replies.confirmed]: Texts.confirmed_at,
    [replies.member]: ''
  }[type] || ""
}
function computeIntervalRows(reports,type) {
  const getUserName = (phone) =>
    stores.TemporalUsersStore.Users[phone] &&
    stores.TemporalUsersStore.Users[phone].nickname;
  const getReport = (item) =>
    item.status && item.status.report && item.status.report;
  const getDate = (item) => item.status && item.status.date && moment(item.status.date).format(dateFormat);
  const getLatestDate = (item) => item.status && item.status.latest_edit &&
    moment(item.status.latest_edit).format(dateFormat);
  const getURLKey = (ele) => ele.status && ele.status.url && getTypeTextFromURL(ele.status.url)
  const getURL = (ele) => ele.status && ele.status.url && getURLfromType(ele.status.url)
  const getUserPhone = (ele) => ele && ele.phone && ele.phone.replace("00", "+")
  return reports &&
    reports
      .map(
        (ele) => {
          const userName = getUserName(ele.phone)
          const report = getReport(ele)
          const userPhone = getUserPhone(ele)
          const date = getDate(ele)
          const dateKey = getDateKey(type)
          const latestUpdate = getLatestDate(ele)
          const urlTypeKey = getURLKey(ele)
          const URL = getURL(ele)
          return {
            ...userName ? {
              [Texts.name]: userName
            } : {},
            ...userPhone ? {
              [Texts.phone_number]: userPhone
            } : {},
            ...report ? {
              [Texts.report]: report
            } : {},
            ...(urlTypeKey && URL) ? {
              [urlTypeKey]: URL
            } : {},
            ...date ? {
              [dateKey]: getDate(ele)
            } : {},
            ...latestUpdate ? {
              [Texts.last_upate]: latestUpdate
            } : {},
          }
        }
      );
}

const dateFormat = 'YYYY-MM-DD HH:mm'
const formInterval = (interval) => Texts.from + ' ' +
  moment(interval.start).format(dateFormat) + ' ' + Texts.to + ' ' +
  moment(interval.end).format(dateFormat)

function formExportabledData(reports, intervals, type, currentIndex,
  get_report_func, exportable, callback) {
  let interval = intervals && intervals[currentIndex]
  const intervalString = interval && formInterval(interval)
  const reportsXLSX = computeIntervalRows(reports,type)
  const tobeSaveInterval = [{
    [Texts.name]: ''
  }, intervalString ? {
    [Texts.name]: intervalString
  } : {}]
  const XLSXData = [...tobeSaveInterval, ...reportsXLSX]
  exportable = [...(exportable || []), ...XLSXData]
  currentIndex = currentIndex + 1
  if ((intervals &&
    currentIndex >= intervals.length) || 
    !get_report_func) {
    callback(exportable)
  } else {
    formExportabledData(get_report_func(intervals[currentIndex]),
      intervals, type,
      currentIndex, get_report_func, exportable, callback)
  }
}

function saveToFile(XLSXData, program_name, type, interval, fileType) {
  const intervalString = interval && formInterval(interval)
  const filename = program_name + (intervalString ?
    ('(' + intervalString + ')') : '') + (type) + '.' + fileType
  const ws = XLSX.utils.json_to_sheet(XLSXData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, Texts.program_report);
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: fileType
  });
  const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/BeUp/${filename}`;
  return RNFetchBlob.fs
    .writeFile(pathToWrite, wbout, 'base64')
    .then((path) => {
      Pickers.openFile(pathToWrite)
      Promise.resolve(pathToWrite)
    })
    .catch(error => {
      console.error(error,"error")
      Promise.reject(error)
    });
}

export function calculateAndExportReport(reports, intervals,
  program_name, type, get_report_func) {
  return new Promise((resolve, reject) => {
    formExportabledData(reports || get_report_func(intervals[0]),
      intervals, type,
      0,
      get_report_func,
      [], (data) => {
        saveToFile(data, 
          program_name,
          type, 
          intervals && intervals.length <= 1 && intervals[0]).then((path) => {
          resolve(path)
        })
      })
  })
}
