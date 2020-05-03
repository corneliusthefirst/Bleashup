import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "native-base";
import converToHMS from "../highlights_details/convertToHMS";
import ContentModal from "../event/ContentModal";

export default class VoteOptionPreviwer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    state = {};
    render() {
        return this.props.url ? (
            <View>
                <TouchableOpacity
                    onPress={() =>
                        requestAnimationFrame(() => {
                            this.setState({
                                isContentModalOpened: true,
                            });
                        })
                    }
                >
                    <Text style={{ fontWeight: 'bold', }}>
                        {this.props.url.video
                            ? "Video " +
                            `(${converToHMS(this.props.url.video_duration)})` : this.props.url.photo ? " Photo" : null}
                    </Text>
                </TouchableOpacity>
                <ContentModal
                    title={this.props.optionName}
                    cleanMedia={() => {
                        this.setState({
                            isContentModalOpened: false
                        })
                        this.props.cleanMedia()
                    }}
                    vote={() => {
                        this.setState({ isContentModalOpened: false })
                        this.props.vote()
                    }}
                    isOpen={this.state.isContentModalOpened}
                    content={this.props.url}
                    closed={() => {
                        this.setState({
                            isContentModalOpened: false,
                        });
                    }}
                    trashable={this.props.trashable}
                    votable={this.props.votable}
                ></ContentModal>
            </View>
        ) : null;
    }
}
