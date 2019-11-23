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
            loaded:false,
            participants: [],
            event_id: null
        };
    }
    state = {}
    componentDidMount() {
       setTimeout(()=>{
           
       },20)
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
                        participants:[],
                        loaded:false,
                        event_id:null
                    })
                }}
                onOpened={() => {
                    setTimeout(()=>{
                        this.setState({
                            participants: this.props.participants,
                            event_id: this.props.event_id,
                            loaded:true
                        })
                    },20)
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <Content>{this.state.loaded?
                    <ParticipantList participants={this.state.participants} title={"Participants List"}
                        event_id={this.state.event_id}></ParticipantList>:<Text style={{padding:"15%"}} note> loading participants</Text>}
                </Content>
            </Modal>

        );
    }
}