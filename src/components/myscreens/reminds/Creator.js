import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import ProfileModal from '../invitations/components/ProfileModal';
import stores from '../../../stores';
import moment from 'moment';
import CreatorModal from './CreatorModal';


export default class Creator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mounted: false
        }
    }
    state = {

    }
    componentDidMount() {
        setTimeout(() => {
            stores.TemporalUsersStore.getUser(this.props.creator).then(creator => {
                this.setState({
                    mounted: true,
                    creator: creator
                })
                this.props.giveCreator ? this.props.giveCreator(creator) : null
            })
        }, 10)
    }
    render() {
        return !this.state.mounted ? <Icon name={"info-with-circle"} type={"Entypo"} style={{ color: 'gray', fontSize: 12, }}></Icon> : (
            <View>
                <TouchableOpacity onPressIn={() => this.props.pressingIn ? this.props.pressingIn() : null} onPress={() => requestAnimationFrame(() => {
                    this.setState({
                        showCreatorModal: true
                    })
                })}>
                    <View style={{width:40,alignItems:"center"}}>
                    <Icon name={"info-with-circle"} type={"Entypo"} style={{color:'gray',fontSize: 12}}></Icon>
                    </View>
                 </TouchableOpacity>
                {this.state.showCreatorModal ? <CreatorModal isOpen={this.state.showCreatorModal} onClosed={() => {
                    this.setState({
                        showCreatorModal: false
                    })
                }} creator={this.state.creator} created_at={this.props.created_at} color={this.props.color} ></CreatorModal> : null}
            </View>
        )
    }
}
