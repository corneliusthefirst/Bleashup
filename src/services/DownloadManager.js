import emitter from "./eventEmiter"

class DownloadManager {
    constructor(){
        emitter.on("add-to-download",this.addToDownloads)
        emitter.on("end-download",this.endDownload)
    }
    downloads = []
    addToDownloads(id){
        this.downloads[this.downloads.length-1] = id
    }
    removeFromDownloads(id){
      this.downloads =  this.downloads.map(el => el !== id)
    }
    startDownload(){
    let element =  this.downloads.reverse().pop()
    emitter.emit("sart-download-"+element)
    }
    endDownload(){
        this.startDownload()
    }

}