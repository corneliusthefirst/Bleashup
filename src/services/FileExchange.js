
import rnFetchBlob from 'rn-fetch-blob';
import * as configs from "../config/bleashup-server-config.json"
import Toaster from './Toaster';
import GState from '../stores/globalState/index';
import Texts from '../meta/text';
const { fs, config } = rnFetchBlob
let dirs = fs.dirs
const AppDir = fs.dirs.SDCardDir + '/Bleashup'
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
        if (dir && url) {
            let splitedDir = dir.split('/')
            let name_from_dir = splitedDir.pop()
            let extention = name_from_dir.split('.').pop()
            splitedDir = splitedDir.join('/') + "/" + url.split('/').pop()
            this.url = url
            this.path = AppDir + splitedDir
            this.base = dir
        }
        this.tempPath = this.path + '.download'
        this.uploadURL = GState.baseURL + baseurl + "/save"
        this.baseURL = GState.baseURL + baseurl + '/get/'
        this.content_type = content_type
        this.filename = filename
        this.store = store
    }
    appDir = AppDir
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
    startDownload(received, total) {
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
                console.warn("size from temp path is ", this.received)
                res.info().headers.Duration ? this.duration = Math.floor(res.info().headers.Duration) : null
                this.total = this.total || 0
                this.received = this.received || 0
                temp1 = this.received / 1000
                temp2 = this.total / 1000
                temper1 = temp2 / 1000
                temper2 = temp1 / 1000
                temp1 = Math.floor(temper1)
                temp2 = Math.floor(temper2)
                temp3 = Math.ceil(temper2)
                if (temp1 == temp2 || temp1 == temp3) {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        const conclude = () => {
                            fs.appendFile(this.path, this.tempPath, 'uri').then(() => {
                                fs.unlink(this.tempPath).then(() => {
                                    fs.unlink(res.path()).then(() => {
                                        this.successFunc ? this.successFunc(this.path, temper1, temper2) : null
                                    })
                                })
                            })
                        }
                        fs.exists(this.path).then((status) => {
                            if (status) fs.unlink(this.path).then(() => {
                                conclude()
                            })
                            else {
                                conclude()
                            }
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
    download(received, total) {
        fs.exists(this.path).then((state) => {
            if (state) {

                this.successFunc(this.path, 
                    total ? total / 1000000 : 0, 
                    received ? received / 1000000 : 0)
            } else {
                this.startDownload(received, total)
            }
        })
    }
    upload(written, total) {
        this.written = written
        this.total = total
        fs.exists(this.url).then(state => {
            console.warn("does file exists? ", state)
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
                    console.warn(this.url, response.data)
                    let newDir = `file://` + AppDir + this.base + this.filename
                    //!this.store ? fs.writeFile(newDir.split(`file://`)[1], this.url.split(`file://`)[1], 'uri').then((status) => {
                    this.successFunc ? this.successFunc(this.url, this.baseURL + response.data, response.data, this.baseURL) : null
                    // }) : this.successFunc(newDir, this.baseURL + response.data, response.data, this.baseURL)
                }
            })
            this.task.catch((error) => {
                this.errorHandlerFunc ? this.errorHandlerFunc(error) : null
            })
        })
    }

    deleteFile(source, notCallSuccss) {
        let temp = source.split('/')
        let filename = temp[temp.length - 1];
        return new Promise((resolve, reject) => {
            this.deleteURL = configs.file_server.protocol +
                "://" + configs.file_server.host + ":" +
                configs.file_server.port + '/delete/' + filename
            rnFetchBlob.fetch('POST', this.deleteURL).then(res => {
                console.warn(res)
                this.successFunc && !notCallSuccss ? this.successFunc() : null
                resolve()
            }).catch(error => {
                console.warn(error)
                this.errorHandlerFunc ? this.errorHandlerFunc() : null
                reject()
            })
        })
    }
    cachFile(source,back) {
        return new Promise((resolve, reject) => {
            this.appdir = this.appDir + '/cache/'
            this.tempDir = this.appdir + source.split('/').pop()
            fs.exists(source).then((state) => {
                console.warn("existence state ", state)
                if (state) {
                    fs.exists(this.appdir).then(() => {
                        if (!state) {
                            fs.mkdir(this.appdir).then(() => {
                                fs.cp(source, this.tempDir).then(() => {
                                    resolve(this.tempDir)
                                })
                            })
                        } else {
                            fs.cp(source, this.tempDir).then(() => {
                                resolve(this.tempDir)
                            })
                        }
                    })
                } else {
                    Toaster({ text: Texts.audio_picking_failed, duration: 4000 })
                }
            })
        })
    }
    formCacheURL(source) {
        let appdir = this.appDir + '/cache/'
        return this.appdir + source.split('/').pop()
    }
    clearCache(url) {
        fs.unlink(this.formCacheURL(url))
    }
    doFileExists(url) {
        return fs.exists(url)
    }

} 