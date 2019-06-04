import Storage from "react-native-storage";
import AsyncStorage from "@react-native-community/async-storage";

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 100 * 3600 * 24,
    enableCache: true,
    sync: {}
});


export default storage
