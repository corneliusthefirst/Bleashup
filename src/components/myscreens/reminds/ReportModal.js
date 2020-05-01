import React, { PureComponent } from 'react';
import { Content, Text, Item, View, Button, Left, Right, Icon } from 'native-base';
import Modal from "react-native-modalbox"
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { Root } from 'native-base';
import ColorList from '../../colorList';

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
                    height: "50%",
                    borderRadius: 8, width: "75%"
                }}
            >
                <Root>
                    <View>
                        <View style={{ margin: '2%', height: '5%', flexDirection: 'row', }}>
                            <View style={{ width: '80%' }}>
                            </View>
                            {this.props.master ? <View>
                                <Button style={{ flexDirection: 'column', backgroundColor: ColorList.indicatorColor,justifyContent: 'center',height:35}} onPress={() => {
                                    this.props.confirm()
                                    this.props.closed()
                                }}>
                                    <Icon style={{ color: ColorList.bodyBackground, fontSize: 26 }} type="AntDesign" name="checkcircle"></Icon>
                                </Button>
                            </View> : null}
                        </View>
                        <ScrollView style={{ margin: "5%", height: "75%" }}>
                            <Text>{this.props.report.report}</Text>
                        </ScrollView>
                        <View style={{ margin: '2%' }}><Text note>{moment(this.props.report.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text></View>
                    </View>
                </Root>
            </Modal>
        );
    }
}