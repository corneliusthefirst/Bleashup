import React, { PureComponent } from 'react';
import { Content, Text, Item, View, Button } from 'native-base';
import { map } from "lodash"
import Modal from "react-native-modalbox"
import { Icon } from 'native-base';
import moment from 'moment';
import { format } from '../../../services/recurrenceConfigs';
import MediaPreviewer from './createEvent/components/MediaPeviewer';
import ColorList from '../../colorList';

export default class ContentModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    renderContentItems(content) {
        return content.map(ele => <Item>
            <Text>ele</Text>
        </Item>)
    }
    renderObject(content) {
        return map(content, (value, key) => <Item>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', }}>{key}{": "}</Text>
                <Text>{Array.isArray(value) ? value.join(',') : key === 'recurrence' ? moment(value).format(format) : value}</Text>
            </View>
        </Item>)
    }
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
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
                    height: "60%",
                    borderRadius: 8, width: "90%"
                }}
            >
                {/*</View><Icon name={"close"} onPress={() => {
                    this.props.closed()
                }} type={"EvilIcons"}></Icon></View>*/}
                <Content style={{ margin: "5%" }}>
                {this.props.title?<Text style={{margin: '5%',}}>{this.props.title}</Text>:null}
                    {this.state.content && (this.state.content.photo || this.state.content.video) ?
                        <View style={{width:'90%',alignSelf: 'center',}}><MediaPreviewer
                            height={280}
                            cleanMedia={this.props.closed}
                            url={this.state.content}
                        ></MediaPreviewer></View> :
                        typeof this.state.content === 'object' ?
                            this.renderObject(this.state.content) : Array.isArray(this.state.content) ?
                                this.renderContentItems(this.state.content) :
                                <Text>{this.state.content}</Text>}
                    {this.props.votable ? <Button onPress={this.props.vote} style={{alignSelf: 'flex-end',margin:'5%',
                    borderRadius: 5,height:30}}><Text style={{marginBottom: 'auto',color:ColorList.bodyBackground}}>Vote</Text></Button> :this.props.trashable?<Icon onPress={this.props.cleanMedia} style={{color:ColorList.redIcon,alignSelf: 'flex-end',margin: '5%',}} name={'trash'} type="EvilIcons"></Icon> :null}
                </Content>
            </Modal>
        );
    }
}