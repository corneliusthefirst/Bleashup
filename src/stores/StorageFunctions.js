import storage from './Storage';

class StorageFunctions {

    //load data function
    loadData(key, id) {

        return storage.load({
            key: key,
            id: id,
            autoSync: true,
            syncInBackground: true,
            syncParams: {
                extraFetchOptions: {
                    // blahblah
                },
                someFlag: true
            }
        })


    }


    //save data  function
    saveData(datakey, dataId, data, expireTime) {
        storage.save({
            key: datakey,
            id: dataId,
            data: data,
            expires: expireTime
        })

    }

    //remove data functions
    // remove a single record
    removeByKey(datakey) {
        storage.remove({
            key: datakey
        });
    }

    removeByKeyAndId(datakey, dataId) {
        storage.remove({
            key: datakey,
            id: dataId
        });
    }
    //clear all data by key-id pair
    clearAllKeyIdData() {
        storage.clearMap();
    }




}

const functions = new StorageFunctions()

export default functions
