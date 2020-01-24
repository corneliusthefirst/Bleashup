import React, { PureComponent } from 'react';
import {View,Dimensions} from "react-native"
import { Content, Text, Item, Container,Tabs,Tab, TabHeading } from 'native-base';
import { map } from "lodash"
import Modal from "react-native-modalbox"
import shadower from '../../shadower';
const screenheight = Math.round(Dimensions.get('window').height);
export default class TabModal extends PureComponent {
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
                position='bottom'
                backButtonClose={true}
                swipeToClose={false}
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
                    height:screenheight * .9 ,
                    borderTopLeftRadius: 5,borderTopRightRadius: 5, backgroundColor: '#FEFFDE', width: "100%"
                }}
            >
                <Container style={{ margin: "1%" }}>
                   <Tabs tabContainerStyle={{borderRadius:8,...shadower(6)}}>
                   <Tab heading={
                       <TabHeading>
                       <Text>Photos</Text>
                       </TabHeading>
                   }>
                            <View style={{ backgroundColor: '#FEFFDE', }}>
                            </View>
                   </Tab>
                        <Tab tabStyle={{
                            borderRadius:8
                        }} heading={
                            <TabHeading>
                                <Text>Videos</Text>
                            </TabHeading>
                        }>
                        <View style={{backgroundColor: '#FEFFDE',}}>
                        </View>
                   </Tab>
                        <Tab heading={
                            <TabHeading>
                                <Text>Files</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE', }}>
                            </View></Tab>
                   </Tabs>
                </Container>
            </Modal>
        );
    }
}