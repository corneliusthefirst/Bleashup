import React from "react";
import { View, Dimensions } from "react-native";
import { Text, Spinner } from "native-base";
import Photo from "./PhotoLister";
import Video from "./VideoLister";
import File from "./FileLister";
import TabModal from "../../mainComponents/TabModal";
const screenheight = Math.round(Dimensions.get("window").height);
export default class MediaTabModal extends TabModal {
    initialize() {
        this.state = {
            content: null,
            mounted: false
        };
    }
    onClosedModal() {
        this.props.closed();
        this.setState({
            content: null,
            mounted: false,
        });
    }
    TabHeader() {
        return null
    }
    onOpenModal() {
        setTimeout(() => {
            this.setState({
                content: this.props.content,
                mounted: true,
            });
        }, 100);
    }
    tabs = [
        {
            heading: () => <Text>Photos</Text>,
            body: () => (
                <View style={{ height: "100%" }}>
                    {this.state.mounted ? <Photo photo={this.props.photo}></Photo> :
                        <Spinner size="small"></Spinner>}
                </View>
            ),
        },
        {
            heading: () => <Text>Videos</Text>,
            body: () => (
                <View style={{ height: "100%" }}>
                    <Video video={this.props.video}></Video>
                </View>
            ),
        },
        {
            heading: () => <Text>Files</Text>,
            body: () => (
                <View style={{ height: "100%" }}>
                    <File file={this.props.file}></File>
                </View>
            ),
        },
    ];
}
