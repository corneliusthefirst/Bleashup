import React, { PureComponent } from 'react';
import { Content, Text, Item, View, Button, Left, Right, Icon } from 'native-base';
import Modal from "react-native-modalbox"
import { ScrollView } from 'react-native-gesture-handler';

export default class RemindReportContent extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                backButtonClose={true}
                swipeToClose={true}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                    this.setState({
                        content: null
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content
                        })
                    }, 20)
                }}
                style={{
                    height: "60%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "90%"
                }}
            >
            <View>
                    <View style={{margin: '2%',height:'5%',flexDirection: 'row',}}>
                        <View style={{width:'80%'}}>
                        </View>
                        {this.props.master?<View>
                            <Button style={{flexDirection: 'column',}} onPress={() => {
                                this.props.confirm()
                                this.props.closed()
                            }} transparent>
                                <Icon type="AntDesign" name="checkcircle"></Icon>
                                <Text>Confirm</Text>
                            </Button>
                        </View>:null}
                    </View>
                    <ScrollView style={{ margin: "5%", height: "80%" }}>
                        <Text>{this.props.report}</Text>
                    </ScrollView>
            </View>
            </Modal>
        );
    }
}