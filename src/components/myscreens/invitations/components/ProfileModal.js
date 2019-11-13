import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';
import PhotoEnlargeModal from './PhotoEnlargeModal';


export default class ProfileModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            enlargeImage: false
        }
    }

    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.props.profile ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    backgroundColor: this.transparent,
                    height: "97%", borderRadius: 15, width: 410
                }}
                position={'center'}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 3, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffebcd' }}>{this.props.profile.nickname}</Text>
                </View>

                <View style={{ flex: 5, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => { this.setState({ enlargeImage: true }) }} >
                        <CacheImages thumbnails source={{ uri: this.props.profile.profile }}
                            square style={{ height: "100%", width: "100%", borderWidth: 1, borderColor: "#1FABAB", borderRadius: 3 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 10, marginLeft: 3 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: "#ffebcd" }} >{this.props.profile.status}</Text>
                </View>



                {this.props.isToBeJoint ? (this.props.hasJoin ?
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                        <Icon name="comment" type="EvilIcons" style={{ color: "#1FABAB" }} />
                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                    </View> :

                    <View style={{ marginTop: "-5%", flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Button onPress={this.props.joined} style={{ justifyContent: 'center',  marginLeft: 40, width: 100, borderRadius: 3 }} success ><Text style={{ fontWeight: "500", fontSize: 18 }}>Join</Text></Button>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="EvilIcons" onPress={{}} style={{ marginRight: 40, color: "#1FABAB" }} />
                            <Text style={{  color: "#1FABAB", marginRight: 40 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.accept || this.props.deny ?
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', }}>
                            <Icon name="comment" type="EvilIcons" style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                        </View> :

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: "5%" }}>
                            <Button onPress={ () => this.props.onAccept()} style={{ marginLeft: 20, width: "25%", justifyContent: 'center' }} success ><Text>Accept</Text></Button>

                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Icon name="comment" type="FontAwesome5" style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                            </View>

                            <Button onPress={()=> this.props.onDenied()} style={{ marginRight: 20, width: "25%", justifyContent: 'center' }} danger ><Text>Deny</Text></Button>
                        </View>

                    )
                }

                <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} image={this.props.profile.profile} />

            </Modal>
        ) : null
    }
}