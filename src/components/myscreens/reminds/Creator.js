import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import ProfileModal from '../invitations/components/ProfileModal';
import stores from '../../../stores';
import moment from 'moment';
import CreatorModal from './CreatorModal';
import ColorList from '../../colorList';
import rounder from '../../../services/rounder';


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
    infoTextStyle = {
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignSelf: 'center',
        textAlign: 'center',
        color: ColorList.bodyBackground
    }
    render() {
        return !this.state.mounted ? <Text style={{
            ...this.infoTextStyle
        }}>{"i"}</Text> : (
                <TouchableOpacity
                    style={{
                        ...rounder(15, ColorList.bodySubtext),
                    }}
                    onPressIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                    onPress={() => requestAnimationFrame(() => {
                        this.setState({
                            showCreatorModal: true
                        })
                    })}>
                    <Text style={{
                        ...this.infoTextStyle
                    }}>{"i"}</Text>
                    {this.state.showCreatorModal ? <CreatorModal intro={this.props.intro} isOpen={this.state.showCreatorModal} onClosed={() => {
                        this.setState({
                            showCreatorModal: false
                        })
                    }} creator={this.state.creator} created_at={this.props.created_at} color={this.props.color} ></CreatorModal> : null}
                </TouchableOpacity>
            )
    }
}
