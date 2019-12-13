import React, { PureComponent } from "react"
import { Left, Right, Icon, CardItem, Text, List, ListItem, Button } from "native-base"
import { View } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import { FlatList, TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { observer } from "mobx-react";
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import BleashupFlatList from './BleashupFlatList';

@observer export default class Likers extends PureComponent {

    constructor(props) {
        super(props)
    }
    state = {
        isOpen: false,
        isloaded: false,
        likers: []
    }
    navigateToChat(){
        console.warn('navigating to chats')
    }
    componentDidMount() {
        setTimeout(() => {
            likers = this.props.likers
            this.setState({
                isloaded: true,
            });
        }, 0)
    }
    _keyExtractor = (item, index) => item
    render() {
        return this.state.isloaded ? (
            <BleashupFlatList
                firstIndex={0}
                renderPerBatch={7}
                initialRender={15}
                numberOfItems={this.props.likers.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.props.likers}
                renderItem={(item, index) =>
                    <View>
                    <View style={{ display: 'flex', flexDirection: 'row',width:"100%" }}>
                        <View style={{ margin: '2%',width:"70%" }}><TouchableOpacity ><ProfileView phone={item}></ProfileView>
                        </TouchableOpacity></View>
                        <Button onPress={() => this.navigateToChat()} transparent><Icon type="EvilIcons" style={{ fontSize: 23,color:'black' }}
                            name="comment"></Icon></Button>
                    </View>
                    <MenuDivider color="#1FABAB" />
                    </View>
                }
            >
            </BleashupFlatList>

        ) : <ImageActivityIndicator></ImageActivityIndicator>
    }
}