import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';
import PhotoEnlargeModal from './PhotoEnlargeModal';

export default class PhotoModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        image: null,
        enlargeImage: false
    }
<<<<<<< HEAD
    image = null
    componentDidMount() {
        this.setState({
            image: this.props.image ? this.props.image : this.image,
            //isOpen: this.props.isOpen
        })
        this.image = this.props.image ? this.props.image : this.image
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            image: nextProps.image ? nextProps.image : this.image,
            //isOpen: nextProps.isOpen
        })
    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.state.image ? (
=======
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.props.image ? (
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
<<<<<<< HEAD
                    justifyContent: 'center',
                    alignItems: 'center', height: "80%", borderRadius: 15,
                    backgroundColor: this.transparent, width: "95%"
                }}
                position={'center'}
            >
                <View>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                    <CacheImages thumbnails source={{ uri: this.state.image }} style={{ width: 340, height: 420, marginTop: 14 }} square />
                </TouchableOpacity>

                {this.props.isJoining ? (this.props.hasJoin ?
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                        <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                    </View> :

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Button onPress={this.props.onAccept} style={{ alignItems: 'center', marginRight: 70, width: 100, marginTop: 4, borderRadius: 5 }} success ><Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 31 }} onPress={this.props.joined}>Join</Text></Button>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ marginLeft: 70, color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB", marginLeft: 70 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.accept || this.props.deny ?
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                        </View> :

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                            <Button onPress={this.props.onAccept} style={{ marginRight: 50, width: "25%" }} success ><Text style={{ marginLeft: 18, borderRadius: 5 }}>Accept</Text></Button>

=======
                    height: "90%", borderRadius: 15,
                    backgroundColor: this.transparent, width: 410
                }}
                position={'center'}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 6, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <CacheImages thumbnails source={{ uri: this.props.image }} style={{
                            height: "100%",
                            width: "100%", marginTop: 14, borderWidth: 1, borderColor: "#1FABAB", borderRadius: 3
                        }} square />
                    </TouchableOpacity>
                </View>

                {this.props.isToBeJoin ? (this.props.hasJoin ?
                    <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginTop: "10%" }}>
                            <Icon name="comment" type="EvilIcons" onPress={{}} style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 2, color: "#1FABAB" }}>chat</Text>
                    </View>
                    </View> :

                    <View style={{ flex: 2, flexDirection: 'row', marginTop: "15%", justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Button onPress={this.props.joined} style={{ justifyContent: 'center', marginLeft: 40, width: 100, borderRadius: 3 }} success ><Text style={{ fontWeight: "500", fontSize: 18 }}>Join</Text></Button>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="EvilIcons" onPress={{}}
                                style={{ marginRight: 40, color: "#1FABAB" }} />
                            <Text style={{ marginTop: 2, color: "#1FABAB", marginRight: 40 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.reacted ? <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginTop: "10%" }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 2, color: "#1FABAB" }}>chat</Text>
                        </View>
                    </View> : this.props.accept || this.props.deny ?
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{marginTop:"10%"}}>
                                <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 2, color: "#1FABAB" }}>chat</Text>
                        </View>
                        </View> :

                        <View style={{ marginTop: "13%",flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Button onPress={this.props.onAccept} style={{ width: 100, justifyContent: 'center', borderRadius: 2, marginLeft: 20 }} success ><Text>Accept</Text></Button>
                            </View>
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                            </View>
<<<<<<< HEAD

                            <Button onPress={this.props.onDenied} style={{ marginLeft: 50, width: "25%" }} danger ><Text style={{ marginLeft: 15, borderRadius: 5 }}>Deny</Text></Button>
=======
                            <View>
                                <Button onPress={this.props.onDenied} style={{ width: 100, justifyContent: 'center', borderRadius: 2, marginRight: 20 }} danger ><Text>Deny</Text></Button>
                            </View>
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
                        </View>

                    )
                }


<<<<<<< HEAD
                <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} image={this.state.image} />
=======
                <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} image={this.props.image} />
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a

            </Modal>
        ) : null
    }

}