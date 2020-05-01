import storage from './Storage';
export default class Share {
    constructor(key){
        this.saveKey.key = key
        this.storeAccessKey = key
    }
    saveKey = {
        key: "shares",
        data: []
    };
    share={}
    storeAccessKey = {
        key: "shares",
        autoSync: true
    };
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load(this.storeAccessKey)
                .then(share => {
                    this.share = share
                    resolve(share);
                })
                .catch(error => {
                    resolve(this.share);
                });
        });
    }
    saveCurrentState(newState){
        this.share = newState
         return  storage.save({...this.saveKey,data:newState})
    }
}

