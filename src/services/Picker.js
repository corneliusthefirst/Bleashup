
import ImagePicker from 'react-native-customized-image-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';

class Picker {
    constructor() {

    }

    SnapPhoto(crop) {
        return new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                cropping: crop ? true : false,
                isCamera: true,
                //openCameraOnStart: true,
                includeBase64: false,
                returnAfterShot: true,
                title: "Selecet Photo",
                // returnAfterShot:true,
                compressQuality: 50
            }).then(response => {
                this.uploaded = true
                //console.warn("opening camera")
                let temp = response[0].path.split('/');
                resolve({
                    source: response[0].path,
                    filename: temp[temp.length - 1],
                    content_type: response[0].mime,
                    size: response[0].size
                })
            })
        })
    }
    CompressVideo(response) {
        return new Promise((resolve, reject) => {
            let size = 0
            let file = response.source.split('/')
            let temp = file[file.length - 1].split('.')
            let temp2 = file.pop()
            let ext = temp.pop()
            let nameString = temp.join('.')
            let fileinfo = {
                name: nameString,
                ext: ext,
                url: response.source,
                base: file.join('/'),
            }
            fileinfo.response = fileinfo.base +
                "/" + fileinfo.name +
                "_wb_compress." + fileinfo.ext
            RNFFmpeg.executeWithArguments(['-i',
                fileinfo.url.replace('file://', ''), "-c:v", "mpeg4",
                fileinfo.response.replace('file://', '')]).then((result) => {
                    this.uploaded = true
                    //console.warn("opening camera")
                    let temp = response.source.split('/');
                    RNFFmpeg.resetStatistics();
                    resolve({
                        source: fileinfo.response,
                        filename: response.filename,
                        content_type: response.content_type,
                        size: size,
                    })
                })
        })
    }
    CancleCompression(){
        RNFFmpeg.cancel()
    }
    SnapVideo() {
        return new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                cropping: false,
                isCamera: true,
                isVideo: true,
                //openCameraOnStart: true,
                includeBase64: false,
                returnAfterShot: true,
                title: "Select A Video",
                // returnAfterShot:true,
                compressQuality: 50
            }).then(response => {
                //console.warn("opening camera")
                let temp = response[0].path.split('/');
                resolve({
                    source: response[0].path,
                    filename: temp[temp.length - 1],
                    content_type: response[0].mime,
                    size: response[0].size
                })
            })
        })
    }
    TakeManyPhotos() {
        return new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                cropping: false,
                includeBase64: false,
                compressQuality: 50,
                multipleShot: false,
                multiple: true,
                maxSize: 20,
                spanCount: 3,
                title: "Select Photos",
                imageLoader: "PICASSO"
            }).then(resps => {
                this.uploaded = true
                resolve(resps.map(ele => {
                    return {
                        filename: ele.path.split("/")[ele.path.split('/').length - 1],
                        content_type: ele.mime,
                        source: ele.path,
                        size: ele.size,
                    }
                }))
            })
        })
    }
    async TakeAudio() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio]
            });
            return res
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                return null
            } else {
                throw err;
            }
        }
    }
    async TakeFile() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            res.uri.replace('content://', 'file://')
            return res
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                return null
            } else {
                throw err;
            }
        }
    }
    openFile(source) {
        FileViewer.open(source).then(() => {

        }).catch((e) => {
            console.warn(e)
        })
    }
    CleanAll() {
        if (this.uploaded) {
            ImagePicker.clean().then(() => {
                this.uploaded = false
            })
        }
    }
}

export default Pickers = new Picker()