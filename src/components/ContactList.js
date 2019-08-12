import React, { Component } from "react"
import { Content, List, ListItem, Body, Left, Right, Text, Card, CardItem } from "native-base"
import CacheImages from "./CacheImages";
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
            contacts: stores.Publishers.Publishers
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

            this.setState({
                isloaded: true,
            });
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
                        data={stores.Publishers.Publishers}
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