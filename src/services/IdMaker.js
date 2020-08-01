
import uuid  from 'react-native-uuid';
class ID {
    make(){
        return uuid.v1({
            node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
            clockseq: 0x1234,
            msecs: new Date().getTime(),
            nsecs: Math.floor(Math.random() * 5678) + 50
        });
    }
}

const IDMaker = new ID()
export default IDMaker
