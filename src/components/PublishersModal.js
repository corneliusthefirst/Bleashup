import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text, Container,Spinner } from 'native-base';
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import ContactList from "./ContactList";
//import { observer } from "mobx-react";
/*@observer*/ export default class PublishersModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded:false
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
                onClosed={() =>{
                    this.props.onClosed()
                    this.setState({
                        event_id:null,
                        loaded:false
                    })
                }
                }
                onOpened={() =>{
                    setTimeout(() => {
                        this.setState({
                            loaded:true,
                            event_id:this.props.event_id
                        })
                    },50)
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>{this.state.loaded?
                <Container>
                    <ContactList title={"Publishers List"} event_id={this.state.event_id}></ContactList>
                </Container>:<Spinner size={"small"}></Spinner>}
            </Modal>

        );
    }
}