import React, { PureComponent } from "react"
import { Left, Right, Icon, CardItem, Text, List, ListItem, Button } from "native-base"
import { View } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import { observer } from "mobx-react";
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import BleashupFlatList from './BleashupFlatList';
import stores from "../stores";
import ColorList from './colorList';

@observer export default class Likers extends PureComponent {

    constructor(props) {
        super(props)
    }
    state = {
        isOpen: false,
        isloaded: false,
        likers: []
    }
    navigateToChat() {
        console.warn('navigating to chats')
    }
    loadLikes(start,end){
        stores.Likes.getLikesFromRemote(this.props.id, "likes", start, end).then((likers) => {
            this.setState({
                likers: this.state.likers.concat(likers),
                isloaded: true,
            });
        }).catch(() => {
            this.setState({
                isloaded:true
            })
        })
    }
    addMoreLikers(){
        this.loadLikes(this.state.likers.length, this.state.likers.length + 50)
    }
    componentDidMount() {
        setTimeout(() => {
           this.addMoreLikers()
        }, 60)
    }
    delay = 0
    _keyExtractor = (item, index) => item
    render() {
        return this.state.isloaded ? (
            <BleashupFlatList
                firstIndex={0}
                renderPerBatch={7}
                initialRender={15}
                loadMoreFromRemote={() => {
                    this.addMoreLikers()
                }}
                numberOfItems={this.state.likers.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.state.likers}
                renderItem={(item, index) => {
                    this.delay = this.delay >= 15 ? 0 : this.delay + 1
                    return (<View>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                            <View style={{ margin: '2%', width: "70%" }}><ProfileView delay={this.delay} phone={item}></ProfileView>
                            </View>
                            <Button style={{ flexDirection: 'column',alignSelf: 'center', }} onPress={() => this.navigateToChat()} transparent>
                                <Icon type="MaterialIcons" style={{color:ColorList.headerIcon}}
                                    name="chat-bubble">
                                </Icon><Text style={{color:ColorList.headerIcon}}>Chat</Text></Button>
                        </View>
                        <MenuDivider color={ColorList.headerIcon} />
                    </View>)
                }}
            >
            </BleashupFlatList>

        ) :<Text style={{margin: '20%',}} note>{"loading likers from remote ..."}</Text>
    }
}