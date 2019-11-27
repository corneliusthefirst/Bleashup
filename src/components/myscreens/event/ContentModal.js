import React, { PureComponent } from 'react';
import { Content, Text } from 'native-base';
import Modal from "react-native-modalbox"

export default class ContentModal extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                }}
                style={{
                    height: "60%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "90%"
                }}
            >
                <Content style={{margin:"5%"}}><Text>
                    {this.props.content}
                </Text></Content>
            </Modal>
        );
    }
}