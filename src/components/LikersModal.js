import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text, Header, Title } from "native-base"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import Likers from "./Likers";
import {View} from  "react-native"
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
                     height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <View>
                <View style={{width:"95%",margin: 4,height:44,flexDirection: 'row',}}>
                <Text style={{fontSize: 22,fontStyle: 'italic',fontWeight: 'bold',width:"80%",marginLeft: "5%",}}>{"Likers"}</Text>
                <Text style={{marginTop: "3%",}} note>{this.props.likers?this.props.likers.length:0 }{" likers"}</Text>
                </View>
                <View style={{}}>
                    <Likers likers={this.props.likers}></Likers>
                </View>
                </View>
            </Modal>

        );
    }
}