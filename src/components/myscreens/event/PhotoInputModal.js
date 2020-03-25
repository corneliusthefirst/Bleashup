import React, { PureComponent } from 'react';
import { Content, Text, Button, Icon } from 'native-base';
import { View } from "react-native"
import Modal from "react-native-modalbox"
import AreYouSure from './AreYouSureModal';
import CacheImages from '../../CacheImages';
import shadower from '../../shadower';
import { CardItem } from 'native-base';

export default class PhotoInputModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                coverScreen={true}
                //animationDuration={0}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                    this.setState({
                        message: null,
                        title: null,
                        callback: null,
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content
                        })
                    }, 20)
                }}
                style={{
                    height: 300,
                    borderRadius: 5, 
                    backgroundColor: 'transparent',
                    width: 300
                }}
            >
                <Content style={{  flexDirection: 'column',margin: '2%', }}>
                    <Button onPress={() => this.props.showActivityPhoto()}  style={{
                        backgroundColor: '#1FABAB',
                        ...shadower(2),
                        margin: '3%', 
                        alignSelf: 'center',
                        borderRadius: 5,
                        height:200
                    }}>
                    <CacheImages source={{uri:this.props.photo}} style={{
                        width:180,
                        height:190,
                        borderRadius:5
                    }} thumbnails square></CacheImages>
                    </Button>
                    <View style={{ margin: '2%',flexDirection: 'row', alignSelf: 'center',backgroundColor: '#FEFFDE',borderRadius: 4,}}>
                        <Button onPress={() => this.props.openCamera()} transparent><Icon type={"MaterialIcons"} name={"insert-photo"}></Icon></Button>
                        <Button onPress={() => this.props.openInternet()} transparent><Icon type={"Foundation"} name={"web"}></Icon></Button>
                        {this.props.photo ? <Button danger onPress={() => this.props.removePhoto()}
                            transparent><Icon style={{ color: 'red' }}
                                name="trash" transparent type="EvilIcons"></Icon></Button> : null}
                    </View>
                </Content>
            </Modal>
        );
    }
}