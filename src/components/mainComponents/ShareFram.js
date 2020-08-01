import React, { Component } from "react";
import { View, TouchableOpacity, Text,} from "react-native";
import ActivityProfile from "../myscreens/currentevents/components/ActivityProfile";
import PhotoViewer from "../myscreens/event/PhotoViewer";
import DetailsModal from "../myscreens/invitations/components/DetailsModal";
import ColorList from "../colorList";
import moment from 'moment';
import { format } from '../../services/recurrenceConfigs';
import Creator from "../myscreens/reminds/Creator";
import ProfileView from "../myscreens/invitations/components/ProfileView";
import request from '../../services/requestObjects';
import BeNavigator from '../../services/navigationServices';
import GState from "../../stores/globalState";
export default class ShareFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    state = {};
    showPhoto(photo) {
        this.setState({
            photo: photo,
            showPhoto: photo,
        });
    }
    openDetails(event) {
        console.warn("showing details")
        this.setState({
            showDetails: true,
        });
    }
    render() {
        return <View>
            <View style={{ 
                flexDirection: "column", 
                width: '100%', 
                alignSelf: 'center', 
            alignItems: 'flex-start', }}>
                <View
                    style={{
                        width: "90%",
                        alignSelf: "center",
                        alignItems: "flex-start",
                         flexDirection: 'row',
                        paddingLeft: '1%',
                        paddingRight: '1%',
                    }}
                >
                    {this.props.share && this.props.share.event && this.props.share.event.about && <TouchableOpacity style={{flexDirection: 'row',}} onPress={() => requestAnimationFrame(this.openDetails.bind(this))}>
                        <View style={{marginTop: 'auto',marginBottom: 'auto',}}><Text style={{...GState.defaultTextStyle,
                            fontStyle: 'italic',fontSize: 12,}} note>{'from: '}</Text></View>
                        <View><Text style={{ ...GState.defaultTextStyle,fontWeight: '500',fontSize: 13, }} >{this.props.share.event.about.title}</Text></View><View 
                        style={{
                            marginTop: 'auto',
                            marginLeft: '2%',
                            marginBottom: 'auto',
                        }} ><Text style={{
                            ...GState.defaultTextStyle,
                            fontStyle: 'italic',
                        }} note>{"(activity)"}</Text></View>
                    </TouchableOpacity>}
                </View>
                <View style={{ width: '100%',alignSelf: 'center',alignItems: 'center', }}>
                    {this.props.content && this.props.content()}
                </View>
            </View>
            <PhotoViewer
                open={this.state.showPhoto}
                hidePhoto={() => {
                    this.setState({
                        showPhoto: false,
                    });
                }}
                photo={this.state.photo}
            ></PhotoViewer>
            {this.state.showDetails ? <DetailsModal
                goToActivity={
                    () => BeNavigator.pushActivity(this.props.share.event, 'EventDetails')
                }
                isOpen={this.state.showDetails}
                onClosed={() => {
                    this.setState({
                        showDetails: false
                    })
                }}
                isToBeJoint
                event={this.props.share && this.props.share.event}
            ></DetailsModal> : null}
        </View>;
    }
}
