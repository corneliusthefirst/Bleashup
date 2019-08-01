import React, { Component } from "react"
import { Content, List, ListItem, Body, Left, Right, Text } from "native-base"
import CacheImages from "./CacheImages";
import ImageActivityIndicator from "./myscreens/currentevents/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
export default class ContactList extends Component {

    constructor(props) {
        super(props)
    }
    state = {
        isOpen: false,
        isloaded: false
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isloaded: true,
            });
        }, 350)
    }

    render() {
        return this.state.isloaded ? (
            <List style={{
                width: 420
            }}>
                <ListItem avatar>
                    <Left>
                        <CacheImages thumbnails source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg' }} />
                    </Left>
                    <Body>
                        <Text>Kumar Pratik</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                    </Right>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <CacheImages thumbnails source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg' }} />
                    </Left>
                    <Body>
                        <Text>Kumar Pratik</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                    </Right>
                </ListItem>
            </List>
        ) : <ImageActivityIndicator></ImageActivityIndicator>
    }
}