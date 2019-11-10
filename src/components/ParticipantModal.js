import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text } from "native-base"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import { observer } from "mobx-react";
import ParticipantList from "./ParticipantList";
@observer export default class ParticipantModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
        };
    }

    componentDidMount() {

    }
    render() {
        return (
            <Modal
                // backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={0.7}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() =>
                    this.props.onClosed()

                }
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <Content>
                    <ParticipantList participants={this.props.participants ? 
                        this.props.participants : undefined} title={"Participants List"} 
                        event_id={this.props.event_id}></ParticipantList>
                </Content>
            </Modal>

        );
    }
}