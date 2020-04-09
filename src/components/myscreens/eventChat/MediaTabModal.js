import React, { PureComponent } from 'react';
import { View, Dimensions } from "react-native"
import { Content, Text, Item, Container, Tabs, Tab, TabHeading, Spinner } from 'native-base';
import { map } from "lodash"
import Modal from "react-native-modalbox"
import shadower from '../../shadower';
import Photo from './PhotoLister';
import Video from './VideoLister';
import File from './FileLister';
const screenheight = Math.round(Dimensions.get('window').height);
export default class MediaTabModal extends PureComponent {
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
                        content: null,
                        mounted:false
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content,
                            mounted:true
                        })
                    }, 100)
                }}
                style={{
                    height: screenheight*.95,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#FEFFDE', width: "100%"
                }}
            >
                <Container style={{ margin: "1%" }}>
                    {this.state.mounted?<Tabs tabContainerStyle={{ borderRadius: 8, ...shadower(6) }}>
                        <Tab heading={
                            <TabHeading>
                                <Text>Photos</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE',height:'100%' }}>
                            <Photo photo={this.props.photo}></Photo>
                            </View>
                        </Tab>
                        <Tab tabStyle={{
                            borderRadius: 8
                        }} heading={
                            <TabHeading>
                                <Text>Videos</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE',height:'100%' }}>
                            <Video video={this.props.video}></Video>
                            </View>
                        </Tab>
                        <Tab heading={
                            <TabHeading>
                                <Text>Files</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE',height:'100%' }}>
                            <File file={this.props.file}></File>
                            </View></Tab>
                    </Tabs>:<Spinner size={'small'}></Spinner>}
                </Container>
            </Modal>
        );
    }
}