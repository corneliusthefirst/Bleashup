import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Text, Spinner } from "native-base"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import Likers from "./Likers";
import { View } from "react-native"
import { observer } from "mobx-react";
@observer export default class LikerssModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded: false,
            likers: []
        };
    }
    state = {

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
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        loaded: false,
                        likers: []
                    })
                }
                }
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            loaded: true,
                            likers: this.props.likers
                        })
                    }, 100)
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                {this.state.loaded ? <View>
                    <View style={{ width: "95%", margin: 4, height: 44, flexDirection: 'row', }}>
                        <Text style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 'bold', width: "80%", marginLeft: "5%", }}>{"Likers"}</Text>
                        <Text style={{ marginTop: "3%", }} note>{this.state.likers ? this.state.likers.length : 0}{" likers"}</Text>
                    </View>
                    <View style={{}}>
                        <Likers likers={!this.state.likers ? [] : this.state.likers}></Likers>
                    </View>
                </View> : <Spinner size={'small'}></Spinner>}
            </Modal>

        );
    }
}