import React, { Component } from "react";
import { View } from "react-native";
import ActivityProfile from "../myscreens/currentevents/components/ActivityProfile";
import PhotoViewer from "../myscreens/event/PhotoViewer";
import DetailsModal from "../myscreens/invitations/components/DetailsModal";
import ColorList from "../colorList";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon, Text, CardItem, Card } from "native-base";
import moment from 'moment';
import { format } from '../../services/recurrenceConfigs';
import Creator from "../myscreens/reminds/Creator";
import ProfileView from "../myscreens/invitations/components/ProfileView";
import request from '../../services/requestObjects';
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
        this.setState({
            showDetails: true,
        });
    }
    render() {
        return <View>
            <Card style={{ flexDirection: "column", width: '100%',alignSelf:'flex-start',alignItems: 'flex-start', }}>
                <CardItem>
                    <ProfileView phone={this.props.sharer}></ProfileView>
                </CardItem>
                <CardItem
                    style={{
                        width: "90%",
                        alignSelf: "center",
                        alignItems: "flex-start",
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        minHeight: 58,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: '1%',
                        paddingRight: '1%',
                        borderWidth: 0.2,
                        borderBottomWidth: 0,
                        borderColor: ColorList.bodySubtext,
                    }}
                >
                    <View style={{}}>
                        <ActivityProfile
                            Event={this.props.share && !Array.isArray(this.props.share.event) ?
                                this.props.share.event :
                                request.Event()}
                            showPhoto={this.showPhoto.bind(this)}
                            openDetails={this.openDetails.bind(this)}
                        ></ActivityProfile>
                    </View>
                    <View style={{ marginTop: 'auto', marginBottom: 'auto', }}>
                        <TouchableOpacity>
                            <Icon
                                name={"share-outline"}
                                type={"MaterialCommunityIcons"}
                                style={{ color: ColorList.bodyIcon }}
                            >
                            </Icon>
                        </TouchableOpacity>
                    </View>
                </CardItem>
                <CardItem style={{ width: '100%' }}>
                    {this.props.content && this.props.content()}
                </CardItem>
                <CardItem style={{
                    height: 20,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 2,
                    borderColor: ColorList.bodySubtext,
                    borderWidth: .2,
                    borderTopWidth: 0,
                    flexDirection: 'column',
                    width: '90%',
                    alignSelf: 'center',
                    paddingLeft: 2,
                    paddingTop: 3,
                }}>
                </CardItem>
            </Card>
            <PhotoViewer
                open={this.state.showPhoto}
                hidePhoto={() => {
                    this.setState({
                        showPhoto: false,
                    });
                }}
                photo={this.state.photo}
            ></PhotoViewer>
            <DetailsModal
                isToBeJoint
                event={this.props.share && this.props.share.activity}
            ></DetailsModal>
        </View>;
    }
}
