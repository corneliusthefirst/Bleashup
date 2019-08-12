import React, { Component } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text } from "native-base"
import CacheImages from "./CacheImages";
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import ContactList from "./ContactList";
export default class PublishersModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isOpen: false,
        isloaded: false
    }
    componentDidMount() {
        this.setState({
            isOpen: false,
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isOpen !== this.state.isOpen) return true
        else return false
    }
    componentDidUpdate(PreviousProps) {
        if (this.props.isOpen !== this.state.isOpen) {
            this.setState({
                isOpen: this.props.isOpen
            })
        }
    }
    render() {
        return (
            <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.7}
                animationDuration={100}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.state.isOpen}
                onClosed={() =>
                    this.props.onClosed()

                }
                style={{
                    justifyContent: 'center', alignItems: 'center', height: 620, display: 'flex', flexDirection: 'column',
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: 420
                }}>
                <Content>
                    <ContactList></ContactList>
                </Content>
            </Modal>

        );
    }
}