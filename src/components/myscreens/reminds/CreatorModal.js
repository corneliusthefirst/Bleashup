import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import ProfileModal from '../invitations/components/ProfileModal';
import moment from 'moment';
import  ModalBox  from 'react-native-modalbox';
import { format } from '../../../services/recurrenceConfigs';

export default class CreatorModal extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    state = {}
    render(){
        return <ModalBox
        coverScreen={true}
        position={"bottom"}
        entry={'bottom'}
        isOpen={this.props.isOpen}
        onClosed={() => {
            this.props.onClosed()
        }}
        style={{
            width:'100%',
            height:76,
            backgroundColor: this.props.color?this.props.color:'#FEFFDE',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        }}
        >
        <View>
            <View><TouchableOpacity onPress={() => {
                this.setState({
                    showProfileModal:true
                })
            }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 11, margin: 1, }} note></Text>
                    {this.props.creator.nickname ? <Text style={{ margin: "1%", fontSize: 11, fontStyle: 'normal', }} note>by {this.props.creator.nickname} </Text> : null}
                    <Text style={{ margin: "1%", fontSize: 11, color: "gray" }} >{"On "}{moment(this.props.created_at).format(format)}</Text>
                </TouchableOpacity>
                {this.state.showProfileModal && this.props.creator.profile ? <ProfileModal isOpen={this.state.showProfileModal} onClosed={() => {
                    this.setState({
                        showProfileModal: false
                    })
                }} profile={this.props.creator} color={this.props.color} ></ProfileModal> : null}
            </View>
        </View>
        </ModalBox>
    }
}