import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";

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
            stores.Publishers.getPublishers(this.props.event_id).then(publisher => {
                if(publisher=='empty'){
                    this.setState({
                        isEmpty :true,
                        isloaded:true
                    })
                }else{
                    this.setState({
                        publishers: publisher,
                        isloaded: true,
                    });
                }
            })
        }, 3)
    }
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View>
                <Header>
                    <Title>
                        Publishers List
                        </Title>
                </Header>
                {this.state.isloaded ? (
                <View>
                    {this.state.isEmpty ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! there's no connction to the server"}</Text> : <FlatList
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
                                <View style={{ display: 'flex', flexDirection: 'row', }} >
                                    <View>
                                        <ProfileView phone={item.phone}></ProfileView>
                                    </View>
                                    <View style={{
                                        marginLeft: "40%",
                                        marginTop: "5%",
                                    }}>
                                        <Text style={{
                                        }} note>{this.writeDateTime(item.period)}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    ></FlatList>}
                   
            </View>):<ImageActivityIndicator></ImageActivityIndicator>}
            </View>
       
    }
}