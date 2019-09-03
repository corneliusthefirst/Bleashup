import React, { PureComponent } from "react"
import { Left, Right, Icon, CardItem, Text, List, ListItem } from "native-base"
import { View } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import { FlatList, TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { observer } from "mobx-react";
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
                renderItem={(item, index ) =>
                    <TouchableOpacity opPress={() => {
                        console.warn("pressed")
                    }}><View style={{ display: 'flex', flexDirection: 'row', }}>
                            <View><TouchableOpacity ><ProfileView phone={item}></ProfileView>
                            </TouchableOpacity></View>
                            <View style={{ marginLeft: "50%", marginTop: "5%", }}><TouchableOpacity><Icon type="EvilIcons" style={{ fontSize: 23 }}
                                name="comment"></Icon></TouchableOpacity></View>
                        </View></TouchableOpacity>

                }
            >
            </BleashupFlatList>

        ) : <ImageActivityIndicator></ImageActivityIndicator>
    }
}