import React, { Component } from "react";
import { View } from "react-native";
import ActivityProfile from "../myscreens/currentevents/components/ActivityProfile";
import PhotoViewer from "../myscreens/event/PhotoViewer";
import DetailsModal from "../myscreens/invitations/components/DetailsModal";
import ColorList from "../colorList";
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
        <View>
            <View style={{ flexDirection: "row" }}>
                <View
                    style={{
                        width: "90%",
                        alignSelf: "center",
                        alignItems: "flex-start",
                        borderRadius: 2,
                        borderWidth: 0.5,
                        height: 70,
                        borderBottomWidth: 0,
                        borderColor: ColorList.darkGrayText,
                    }}
                >
                    <View style={{ marginBottom: "auto", marginTop: "auto" }}>
                        <ActivityProfile
                            Event={this.props.share.activity && this.props.share.activity}
                            showPhoto={this.showPhoto.bind(this)}
                            openDetails={this.openDetails.bind(this)}
                        ></ActivityProfile>
                    </View>
                </View>
            </View>
            <PhotoViewer
                open={this.state.showPhoto}
                hideMe={() => {
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
