import { observable } from 'mobx'
import storage from './Storage'
import { orderBy, filter ,reject} from "lodash"
import autobind from 'autobind-decorator'
class ChatStore {
    constructor() {
        this.readFromStore().then(data => {
            this.setProperties(data)
        })
    }
    @observable messages = [{
        id: 0,
        source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total: 0,
        received: 0,
        user: 2,
        creator: 2,
        type: 'audio',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: 1,
        source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total: 0,
        received: 0,
        user: 1,
        creator: 2,
        type: 'text',
        text: `hello `,
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: 2,
        sender: {
            phone: 2,
            nickname: "Sokeng Kamga"
        },
        user: 1,
        reply: {
            id: 3,
            user: 2,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        creator: 3,
        type: "photo",
        photo: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg",
        file_name: 'bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg',
        created_at: "2014-03-30 12:32",
        text: `Hello!`
    }, {
        id: 3,
        source: 'http://192.168.43.32:8555/video/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0.mp4',
        file_name: 'bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 3,
        type: "video",
        received: 0,
        total: 0,
        reply: {
            id: 2,
            user: 3,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: 4,
        source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        file_name: 'Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 2,
        type: "attachement",
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    },
        , {
        id: 5,
        source: 'http://192.168.43.32:8555/video/get/Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        type: "video",
        user: 3,
        creator: 2,
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-0s3-30 12:32",
    }]
    storeAccessKey = {
        key: "Chats",
        autoSync: true
    };
    saveKey = {
        key: "Chats",
        data: []
    };
    @observable Chats = [
        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ]
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load(this.storeAccessKey)
                .then(chats => {
                    resolve(chats);
                })
                .catch(error => {
                    resolve([]);
                });
        });
    }
    setProperties(chats) {
        chats = orderBy(chats, ["updated_at"], ["desc"]);
        this.Chats = filter(chats, chat => !chat.hidden && !chat.deleted);
    }
    addDuration(duration, chatID) {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }
    addVideoProperties(path,totalSize,receivedSize){
        return new Promise((resolve,reject) => {
            resolve()
        })
    }
   @autobind addMessage(message){
        return new Promise((resolve,reject)=>{
            this.messages.unshift(message)
            resolve()
        })
    }
    @autobind removeMessage(id){
        return new Promise((resolve, reject) => {
            this.messages = reject(this.messages,mes => this.messages.id == id)
            resolve()
        })
    }
    addVideoSizeProperties(total,recieved){
        return new Promise((resolve,reject)=>{
            resolve()
        })
    }
    AddAudioSizePropperties(total,recieved){
        return new Promise((resolve,reject) =>{
            resolve()
        })
    }
    addAudioSizeProperties(){
        return new Promise((resolve,reject)=>{

        })
    }
    SetCancledState(){
        return new Promise((resolve,reject)=>{
            resolve()
        })
    }
    addStaticFilePath(url, chatID) {
        return new Promise((resolve, reject) => {
            resolve("ok");
        })
    }
}

export default ChatStore;
