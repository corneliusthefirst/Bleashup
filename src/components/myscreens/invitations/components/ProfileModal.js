import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';
import PhotoEnlargeModal from './PhotoEnlargeModal';


export default class ProfileModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        enlargeImage: false
        // isOpen: false
    }
    profile = null;
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            profile: nextProps.profile ? nextProps.profile : this.profile,
            // isOpen: nextProps.isOpen
        })

    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.props.profile ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    backgroundColor: this.transparent, justifyContent: 'center', alignItems: 'center',
                    height: "97%", borderRadius: 15, width: "97%"
                }}
                position={'center'}
            >
                <View>
                    <TouchableOpacity style={{ marginTop: -30 }} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', left: -126 }}>{this.props.profile.nickname}</Text>

                <TouchableOpacity onPress={() => { this.setState({ enlargeImage: true }) }
                } >
                    <CacheImages thumbnails source={{ uri: this.props.profile.profile }} square style={{ marginTop: 20, width: 345, borderRadius: 5, height: "80%" }} />
                </TouchableOpacity>

                {this.props.profile.status.length > 35 ? <Text style={{ fontSize: 17, fontWeight: '600', marginLeft: 8, marginTop: -80, color: "#ffebcd" }}>
                    {this.state.profile.status}</Text> :
                    <Text style={{ fontSize: 17, fontWeight: '600', marginLeft: -112, marginTop: -80, color: "#ffebcd" }} >{this.props.profile.status}</Text>}

                {this.props.isJoining ? (this.props.hasJoin ?
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                        <Icon name="comment" type="FontAwesome5" style={{ color: "#1FABAB" }} />
                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                    </View> :

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Button onPress={this.props.onAccept} style={{ alignItems: 'center', marginRight: 70, width: 100, marginTop: 4, borderRadius: 5 }} success ><Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 31 }} onPress={this.props.joined}>Join</Text></Button>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="FontAwesome5" style={{ marginLeft: 70, color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB", marginLeft: 70 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.accept || this.props.deny ?
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                            <Icon name="comment" type="FontAwesome5" style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                        </View> :

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                            <Button onPress={this.props.onAccept} style={{ marginRight: 50, width: "25%" }} success ><Text style={{ marginLeft: 18, borderRadius: 5 }}>Accept</Text></Button>

                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Icon name="comment" type="FontAwesome5" style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                            </View>

                            <Button onPress={this.props.onDenied} style={{ marginLeft: 50, width: "25%" }} danger ><Text style={{ marginLeft: 15, borderRadius: 5 }}>Deny</Text></Button>
                        </View>

                    )
                }

                <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} image={this.props.profile.image} />

            </Modal>
        ) : null
    }
}