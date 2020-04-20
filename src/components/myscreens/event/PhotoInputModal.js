import React, { PureComponent } from 'react';
import { Content, Text, Button, Icon } from 'native-base';
import { View } from "react-native"
import AreYouSure from './AreYouSureModal';
import CacheImages from '../../CacheImages';
import shadower from '../../shadower';
import { CardItem } from 'native-base';
import BleashupModal from '../../mainComponents/BleashupModal';
import PickersUpload from './createEvent/components/PickerUpload';

export default class PhotoInputModal extends BleashupModal {
    initialize() {
        this.state = {
        }
    }
    onClosedModal() {
        this.props.closed()
        this.setState({
            message: null,
            title: null,
            callback: null,
        })
    }
    modalHeight = 340
    modalWidth = 300
    borderRadius = 5
    position = "center"
    modalBody() {
        return (
            <Content showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', }}>
                <Button onPress={() => this.props.showActivityPhoto()} style={{
                    backgroundColor: '#1FABAB',
                    ...shadower(2),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    width:300,
                    height: 300
                }}>
                    <CacheImages source={{ uri: this.props.photo }} style={{
                        width: 300,
                        height: 290,
                        borderRadius: 5
                    }} thumbnails square></CacheImages>
                </Button>
                <View style={{ margin: '2%', flexDirection: 'row', alignSelf: 'center', borderRadius: 4, }}>
                    <PickersUpload currentURL={{ photo:this.props.photo }} saveMedia={(url) => this.props.saveBackground(url.photo)} creating={false} notVideo notAudio></PickersUpload>
                    {this.props.photo ? <Button danger onPress={() => this.props.removePhoto()}
                        transparent><Icon style={{ color: 'red',marginBottom: '30%', }}
                            name="trash" transparent type="EvilIcons"></Icon></Button> : null}
                </View>
            </Content>
        );
    }
}