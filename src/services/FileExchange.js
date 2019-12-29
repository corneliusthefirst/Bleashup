
import rnFetchBlob from 'rn-fetch-blob';
import * as configs from "../config/bleashup-server-config.json"

let dirs = rnFetchBlob.fs.dirs
const { fs, config } = rnFetchBlob
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'
export default class FileExachange {
    constructor(url, dir, total, received, progressFunc,
        onSuccess, onFail, onError, content_type,
        filename, baseurl, store) {
        this.progressFunc = progressFunc
        this.errorHandlerFunc = onError
        this.successFunc = onSuccess
        this.total = total
        this.failHandleFunc = onFail
        this.received = received
        this.url = url
        this.path = AppDir + dir
        this.base = dir
        this.tempPath = this.path + '.download'
        this.uploadURL = configs.file_server.protocol +
            "://" + configs.file_server.host + ":" + configs.file_server.port + baseurl + "/save"
        this.baseURL = configs.file_server.protocol +
            "://" + configs.file_server.host + ":" + configs.file_server.port + baseurl + '/get/'
        this.content_type = content_type
        this.filename = filename
        this.store = store
    }
    DetemineRange(path) {
        return new Promise((resolve, reject) => {
            fs.exists(path).then(ext => {
                if (ext) {
                    //   console.warn("exists")
                    fs.stat(path).then(stat => resolve(stat.size))
                } else {
                    resolve(0)
                }
            })
        })
    }
    task = null
    received = 0
    total = 0
    download(received, total) {
        received ? this.received = received : null
        total ? this.total = total : null
        this.DetemineRange(this.tempPath).then(size => {
            this.task = rnFetchBlob.config({
                fileCache: true
            }).fetch('GET', this.url, {
                Range: `bytes=${size}-`,
                From: `${size}`
            })
            this.task.progress((received, total) => {
                let newReceived = parseInt(size) + parseInt(received);
                let newTotal = this.total > 0 ? this.total : total
                newTotal = parseInt(newTotal)
                this.progressFunc ? this.progressFunc(newReceived, newTotal, size) : null
                this.total = newTotal;
                this.received = newReceived

            })
            this.task.catch(error => {
                this.errorHandlerFunc ? this.errorHandlerFunc(error) : null
            })
            this.task.then((res) => {
                console.warn(res)
                res.info().headers.Duration ? this.duration = Math.floor(res.info().headers.Duration) : null
                temp1 = this.received / 1000
                temp2 = this.total / 1000
                temper1 = temp2 / 1000
                temper2 = temp1 / 1000
                temp1 = Math.floor(temper1)
                temp2 = Math.floor(temper2)
                temp3 = Math.ceil(temper2)
                if (temp1 == temp2 || temp1 == temp3) {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(this.path)
                        fs.appendFile(this.path, this.tempPath, 'uri').then(() => {
                            fs.unlink(this.tempPath)
                            fs.unlink(res.path())
                            this.successFunc ? this.successFunc(this.path, temper1, temper2) : null
                        })
                    })
                } else {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(res.path())
                        //fs.unlink(this.tempPath)
                        this.failHandleFunc ? this.failHandleFunc(this.received, this.total) : null
                    })
                }
            })
        })
    }

    upload(written, total) {
        this.written = written
        this.total = total
        fs.exists(this.url).then(state => {
            /*if (state) {
                fs.unlink(this.url).then(() => {

                })
            }*/
            this.task = rnFetchBlob.fetch("POST", this.uploadURL, {
                'content-type': 'multipart/form-data',
            }, [{
                name: "file",
                filename: this.filename,
                type: this.content_type,
                data: rnFetchBlob.wrap(this.url)
            }])
            this.task.uploadProgress((writen, total) => {
                this.written = writen
                this.total = total
                this.progressFunc ? this.progressFunc(writen, total) : null
            })
            this.task.then(response => {
                if (response.data) {
                    temper1 = this.total / 1000000
                    temper2 = this.written / 1000000
                    temp1 = Math.floor(temper1)
                    temp2 = Math.floor(temper2)
                    temp3 = Math.ceil(temper2)
                    newDir = `file://` + AppDir + this.base + response.data
                    !this.store ? fs.writeFile(newDir.split(`file://`)[1], this.url.split(`file://`)[1], 'uri').then(() => {
                        this.successFunc ? this.successFunc(newDir, this.baseURL + response.data, response.data, this.baseURL) : null
                    }) : this.successFunc(newDir, this.baseURL + response.data, response.data, this.baseURL)
                }
            })
            this.task.catch((error) => {
                this.errorHandlerFunc ? this.errorHandlerFunc(error) : null
            })
        })
    }

    deleteFile(source) {
        let temp = source.split('/')
        let filename = temp[temp.length - 1];
        this.deleteURL = configs.file_server.protocol +
            "://" + configs.file_server.host + ":" +
            configs.file_server.port + '/delete/' + filename
        rnFetchBlob.fetch('POST',this.deleteURL).then(res => {
            console.warn(response)
        })
    }

} 