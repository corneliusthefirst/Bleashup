import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text, Header, Title } from "native-base"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import Likers from "./Likers";
import { observer } from "mobx-react";

@observer export default class LikerssModal extends PureComponent {
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
                    justifyContent: 'center', alignItems: 'center', height: "97%", display: 'flex', flexDirection: 'column',
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <Text>Likers List</Text>
                <Content>
                    <Likers likers={this.props.likers}></Likers>
                </Content>
            </Modal>

        );
    }
}