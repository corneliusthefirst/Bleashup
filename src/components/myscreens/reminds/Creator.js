import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import ProfileModal from '../invitations/components/ProfileModal';
import stores from '../../../stores';
import moment from 'moment';


export default class Creator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mounted:false
        }
    }
    state = {

    }
    componentDidMount() {
        setTimeout(() => {
            stores.TemporalUsersStore.getUser(this.props.creator).then(creator => {
                console.warn(creator)
                this.setState({
                    mounted: true,
                    creator: creator
                })
            })
        },10)
    }
    render() {
        return !this.state.mounted ? null : (
            <View>
                <TouchableOpacity onPress={ () => requestAnimationFrame(() => {
                    this.setState({
                        showProfileModal:true
                    })
                })}>
                    <Text style={{ fontWeight: 'bold', fontSize: 11, margin: 1, }} note>Created </Text>
                    {this.state.creator.nickname ? <Text style={{ margin: "1%", fontSize: 11, fontStyle: 'normal', }} note>by {this.state.creator.nickname} </Text> : null}
                    <Text style={{ margin: "1%", fontSize: 11, color: "gray" }} >{"On "}{moment(this.props.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>
                </TouchableOpacity>
                {this.state.showProfileModal && this.state.creator.profile ? <ProfileModal isOpen={this.state.showProfileModal} onClosed={() => {
                    this.setState({
                        showProfileModal: false
                    })
                }} profile={this.state.creator} color={this.props.color} ></ProfileModal> : null}
            </View>
        )
    }
}
