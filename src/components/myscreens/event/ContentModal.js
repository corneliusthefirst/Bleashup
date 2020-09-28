import React, { PureComponent } from 'react';
import {View, ScrollView, Text,TouchableOpacity,StyleSheet} from "react-native"
import { map } from "lodash"
import Modal from "react-native-modalbox"
import moment from 'moment';
import { format } from '../../../services/recurrenceConfigs';
import MediaPreviewer from './createEvent/components/MediaPeviewer';
import ColorList from '../../colorList';
import  EvilIcons from 'react-native-vector-icons/EvilIcons';
import GState from '../../../stores/globalState';
import TextContent from '../eventChat/TextContent';
import BePureComponent from '../../BePureComponent';

export default class ContentModal extends BePureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    renderContentItems(content) {
        return content.map(ele => <Text style={{...GState.defaultTextStyle}}>ele</Text>)
    }
    renderObject(content) {
        return map(content, (value, key) => 
            <View style={{ flexDirection: 'row', }}>
                <Text style={{...GState.defaultTextStyle, fontWeight: 'bold', fontStyle: 'italic', }}>{key}{": "}</Text>
                <Text style={{...GState.defaultTextStyle}}>{Array.isArray(value) ? value.join(',') : key === 'recurrence' ? moment(value).format(format) : value}</Text>
            </View>)
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
                    this.setStatePure({
                        content: null
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setStatePure({
                            content: this.props.content
                        })
                    }, 20)
                }}
                style={{
                    height: "60%",
                    borderRadius: 8, width: "90%"
                }}
            >
                <ScrollView style={{ margin: "5%" }}>
                {this.props.title?<Text style={{...GState.defaultTextStyle,margin: '5%',}}>{this.props.title}</Text>:null}
                    {this.state.content && (this.state.content.photo || this.state.content.video) ?
                        <View style={{width:'90%',alignSelf: 'center',}}><MediaPreviewer
                            height={280}
                            cleanMedia={this.props.closed}
                            url={this.state.content}
                        ></MediaPreviewer></View> :
                        typeof this.state.content === 'object' ?
                            this.renderObject(this.state.content) : Array.isArray(this.state.content) ?
                                this.renderContentItems(this.state.content) :
                                <TextContent style={{...GState.defaultTextStyle,}}>{this.state.content}</TextContent>}
                    {this.props.votable ? <TouchableOpacity onPress={this.props.vote} style={styles.voteButton}><Text style={{marginBottom: 'auto',color:ColorList.bodyBackground}}>Vote</Text>
                    </TouchableOpacity> :
                    this.props.trashable?<EvilIcons
                    onPress={this.props.cleanMedia} 
                    style={{color:ColorList.redIcon,alignSelf: 'flex-end',margin: '5%',}} 
                    name={'trash'} type="EvilIcons"></EvilIcons> 
                    :null}
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    voteButton:{
        alignSelf: 'flex-end', margin: '5%',
        backgroundColor: ColorList.indicatorColor,
        borderRadius: 5, height: 30
    }
})