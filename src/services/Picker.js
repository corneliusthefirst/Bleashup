import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { LogLevel, RNFFmpeg, RNFFprobe } from 'react-native-ffmpeg';
import { PermissionsAndroid } from 'react-native';
import Texts from '../meta/text';
import GState from '../stores/globalState/index';
import Toaster from './Toaster';

class Picker {
  constructor() { }

  SnapPhoto(crop) {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: crop === 'all' ? false : crop ? true : false,
        mediaType: crop == 'all' ? undefined : crop ? 'photo' : "video",
        //openCameraOnStart: true,
        includeBase64: false,
        returnAfterShot: true,
        // returnAfterShot:true,
        compressQuality: 0.5,
      }).then((response) => {
        this.uploaded = true;
        //console.warn("opening camera")
        const resolver = (response) => resolve({
          source: response.path,
          filename: temp[temp.length - 1],
          content_type: response.mime,
          size: response.size,
        });
        let temp = response.path.split('/');
        const size = GState.toMB(response.size)
        console.warn("file size is: ", size)
        if (size > 100) {
          Toaster({ text: Texts.media_too_large })
          reject({ error: 'this file is extra large' })
        } else {
          resolver(response)
        }
      });
    });
  }

  CompressVideo(response) {
    console.warn("response to compress is: ", response)
    return new Promise((resolve, reject) => {
      let size = 0;
      let file = response.path.split('/');
      let temp = file[file.length - 1].split('.');
      let ext = temp.pop();
      let nameString = temp.join('.');
      let fileinfo = {
        name: nameString,
        ext: ext,
        url: response.path,
        base: file.join('/'),
      };
      fileinfo.response =
        fileinfo.base + '/' + fileinfo.name + '_wb_compress.' + fileinfo.ext;
      RNFFprobe.executeWithArguments([
        '-i',
        fileinfo.url.replace('file://', ''),
        '-c:v',
        "mpeg4",
        fileinfo.response.replace('file://', ''),
      ]).then((result) => {
        this.uploaded = true;
        //console.warn("opening camera")
        let temp = response.path.split('/');
        RNFFprobe.resetStatistics && RNFFprobe.resetStatistics();
        resolve({
          source: fileinfo.response,
          filename: response.filename,
          content_type: response.content_type,
          size: size,
        });
      });
    });
  }
  resizePhoto(file) {
    return new Promise((resolve, reject) => {
      let temp = file.split('.');
      temp[temp.length - 2] = temp[temp.length - 2] + '_compress';
      let compressed = temp.join('.');
      RNFFmpeg.executeWithArguments([
        '-i',
        file.replace('file://', ''),
        '-vf',
        'scale=500:-1',
        compressed.replace('file://', ''),
      ]).then(() => {
        resolve(compressed);
      });
    });
  }
  CancleCompression() {
    RNFFmpeg.cancel();
  }
  /**
   * Picks multiple photos from the phone
   */
  TakeManyPhotos() {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: false,
        includeBase64: false,
        compressQuality: 50,
        mediaType: "photo",
        multipleShot: false,
        multiple: true,
        maxSize: 20,
        spanCount: 3,
        title: "Select Photos",
        imageLoader: 'PICASSO',
      }).then((resps) => {
        this.uploaded = true;
        resolve(
          resps.map((ele) => {
            return {
              filename: ele.path.split('/')[ele.path.split('/').length - 1],
              content_type: ele.mime,
              source: ele.path,
              size: ele.size,
            };
          })
        );
      });
    });
  }
  /**
   * Picks audio files from the mobile device
   */
  async TakeAudio() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      return this.concludeSize(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return null;
      } else {
        throw err;
      }
    }
  }
  concludeSize(res) {
    const size = GState.toMB(res.size)
    if (size > 100) {
      Toaster({ text: Texts.file_too_large })
      throw { error: 'file is too large' }
    } else {
      return res;
    }
  }
  /**
   * Picks file from the phone
   */
  async TakeFile() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      return this.concludeSize(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return null;
      } else {
        throw err;
      }
    }
  }
  /**
   * 
   * @param {string} url
   * checks the duration of a media be it locally or web. 
   * But so far, only web is tested and confirmed as working. 
   */
  determineMediaDuration(url) {
    return RNFFprobe.getMediaInformation(url)
  }
  openFile(source) {
    FileViewer.open(source).then((res) => {
        console.warn(res)
      }).catch((e) => {
    })
  }
  CleanAll() {
    if (this.uploaded) {
      ImagePicker.clean().then(() => {
        this.uploaded = false;
      });
    }
  }
}
const Pickers = new Picker();
export default Pickers;
