import React, { Component } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text } from "native-base"
import CacheImages from "./CacheImages";
export default class PublishersModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isOpen: false
    }
    componentDidMount() {
        this.setState({
            isOpen: this.props.isOpen
        })
    }
    componentWillReceiveProps(nextProps) {

        this.setState({
            isOpen: nextProps.isOpen
        })
    }

    render() {
        return (
            <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.7}
                animationDuration={100}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.state.isOpen}
                onClosed={() => {
                    this.props.onClosed
                }
                }
                style={{
                    justifyContent: 'center', alignItems: 'center', height: 620, display: 'flex', flexDirection: 'column',
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: 420
                }}>
                <Content>
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
                </Content>
            </Modal>

        );
    }
}