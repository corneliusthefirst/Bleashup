import React, { Component } from 'react';
import { View, Vibration, TouchableOpacity } from 'react-native';
import { Title, Text, Icon } from 'native-base';
import HighlightContent from './HighlightContent';
import moment from 'moment';
import stores from '../../../stores';
import Creator from '../reminds/Creator';


export default class HighLight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showProfile: false
        }
    } 
    renderContent(highlight) {
        return <HighlightContent modal={this.props.modal} showVideo={(url) => this.props.showVideo(url)} showPhoto={(uri) => this.props.showPhoto(uri)} PressingIn={() => {
            this.replying = true
        }} highlight={highlight}></HighlightContent>


    }
    state = {

    }
    componentDidMount() {

    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false
    }
    handleReply() {
        console.warn('handling reply .....')
    }
    duration = 9
    textColor = "#FEFEDE"
    openingSwipeout() {
        this.closing = this.closing + 1
        if (!this.slept) {
            setTimeout(() => {

            }, 1000)
            this.slept = true
        } else {

        }
        if (this.replying) {
            if (!this.closed) {
                this.closing++
                this.closed = true
                this.closing = 0
                this.quickMention()
                setTimeout(() => {
                    this.closed = false
                }, 1000)
            }
            this.replying = false
        }
    }
    quickMention() {
        Vibration.vibrate(this.duration)
        this.props.showInput(this.props.highlight)
    }
    closingSwipeout() {
        /* if (this.replying) {
              if(!this.closed){
                  this.closing++
                  this.closed = true
  
                  this.closing = 0
                  Vibration.vibrate(this.duration)
                  setTimeout(() => {
                      this.closed = false
                  }, 1000)
              }
              this.replying = false
          }*/
    }
    showCreator() {
        this.setState({
            showProfile: true
        })
    }
    render() {
        return (
            <View style={{
                marginTop: '2%',width:'100%'
            }}>
           
                    <View style={{
                        /*maxWidth: "90%", minWidth: 120,*/ width:'90%',
                        minHeight: 10, overflow: 'hidden', borderRadius: 10,
                        alignSelf: 'center', margin: '1%',
                        backgroundColor: this.props.background ? this.props.background : "#9EEDD3",
                    }}>
                        <View style={{ height: 50, opacity: 0.8, borderRadius: 8, }}>
                            <Text style={{
                                alignSelf: 'center',
                                margin: '3%', fontWeight: 'bold', fontSize: 22,
                            }}>
                                {this.props.highlight.title}
                            </Text>
                        </View>
                        <View style={{width:'100%'}}>
                            {this.renderContent(this.props.highlight)}
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", bottom: 0, margin: 3, width: "98%" }}>

                        {!this.props.shouldNotMention && <View style={{}}>
                            { <Icon name="reply" onPress={() => this.props.mention?this.props.mention():this.quickMention()} type="Entypo" style={{ color: '#555756', fontSize:35 }}></Icon>}
                        </View>}
                            <Creator creator={this.props.highlight.creator} created_at={this.props.highlight.created_at} color={this.props.color ? this.props.color : "#9EEDD3"}></Creator>
                        </View>
                    </View>
              
            </View>
        );
    }
}