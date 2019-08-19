import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text } from "native-base"
import { View } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import { FlatList } from "react-native-gesture-handler";
;
export default class ContactList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            publishers: []
        }
    }
    state = {
        isOpen: false,
        isloaded: false
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isOpen !== this.state.isOpen || nextState.isloaded !== this.state.isloaded ? true : false
    }
    writeDateTime(period) {
        return period.date.year +
            "-" +
            period.date.month +
            "-" +
            period.date.day +
            "    " +
            period.time.hour +
            "-" +
            period.time.mins +
            "-" +
            period.time.secs
    }

    componentDidMount() {
        setTimeout(() => {
            stores.Publishers.getPublishers(this.props.event_id).then(publishers => {
                this.setState({
                    publishers: publishers.publishers,
                    isloaded: true,
                });
            })
        }, 350)
    }
    _keyExtractor = (item, index) => item.phone
    render() {
        return this.state.isloaded ? (
            <View>
                <CardItem>
                    <Text style={{
                        marginLeft: "38%"
                    }}>
                        Publishers List
                        </Text>
                </CardItem>
                <List style={{
                    width: 420
                }}>
                    <FlatList
                        initialNumToRender={15}
                        maxToRenderPerBatch={8}
                        windowSize={20}
                        ref={"cardlist"}
                        onContentSizeChange={() => this.refs.cardlist.scrollToEnd()}
                        updateCellsBatchingPeriod={25}
                        listKey={'publishers'}
                        keyExtractor={this._keyExtractor}
                        data={this.state.publishers}
                        renderItem={({ item, index }) => {
                            return (
                                <ListItem >
                                    <Left>
                                        <ProfileView phone={item.phone}></ProfileView>
                                    </Left>
                                    <Right style={{
                                        marginLeft: "15%",
                                        width: "80%",
                                    }}>
                                        <Text style={{

                                            marginTop: "20%"
                                        }} note>{this.writeDateTime(item.period)}</Text>
                                    </Right>
                                </ListItem>
                            );


                        }}
                    >

                    </FlatList>
                </List>
            </View >

        ) : <ImageActivityIndicator></ImageActivityIndicator>
    }
}