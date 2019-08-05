import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, TouchableOpacity } from 'react-native'
import { Button, Text, Icon } from 'native-base'
import CacheImages from './CacheImages'

export default class ProfileModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        profile: undefined,
        isOpen: false
    }
    profile = null;
    componentDidMount() {
        this.setState({
            profile: this.props.profile ? this.props.profile : this.profile,
            isOpen: this.props.isOpen
        })
        this.profile = this.props.profile ? this.props.profile : this.profile
    }
    /* shouldComponentUpdate(nextProps) {
         return (this.props.profile.name !== nextProps.profile.name)
             || (this.props.profile.image !== nextProps.profile.image)
             || (this.props.isOpen !== nextProps.isOpen) ? true : false;
     }
     componentDidUpdate(PreviousProp) {
         this.setState({
             profile: this.props.profile.name,
             isOpen: this.props.isOpen
         })
 
     }*/
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isOpen !== this.state.isOpen) return true
        else return false
    }
    componentDidUpdate(PreviousProps) {
        if (this.props.isOpen !== this.state.isOpen) {
            this.setState({
                profile: this.props.profile,
                isOpen: this.props.isOpen
            })
        }


    }
    render() {
        return this.state.isOpen ? (
            <Modal
                coverScreen={true}
                backButtonClose={true}
                isOpen={this.state.isOpen}
                onClosed={() => {
                    //this.setState({ isOpen: false })
                    return this.props.onClosed()
                }
                }
                style={{
                    backgroundColor: this.transparent, justifyContent: 'center', alignItems: 'center',
                    height: 380, borderRadius: 15, backgroundColor: '#FEFFDE', width: 350
                }}
                position={'center'}
            >
                <View>
                    <TouchableOpacity style={{}} onPress={() =>
                        requestAnimationFrame(() => {
                            this.props.parent.setState({ isProfileModalOpened: false })
                        })
                    } transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: -220 }}>{this.state.profile.name}</Text>

                <TouchableOpacity onPress={() =>
                    this.props.onClosed()
                } >
                    <CacheImages thumbnails source={{ uri: this.state.profile.image }}
                        square style={{ marginTop: 20, width: 350, height: 200 }} />
                </TouchableOpacity>
                {this.state.profile.status.length > 35 ?
                    <Text style={{
                        fontSize: 17, fontWeight: '600',
                        marginLeft: 14, marginTop: 10
                    }} note>
                        {this.state.profile.status}</Text> :
                    <Text style={{
                        fontSize: 17, fontWeight: '600',
                        marginLeft: -104, marginTop: 10
                    }} >{this.state.profile.status}</Text>}

            </Modal>
        ) : null
    }
}