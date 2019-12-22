import React, { Component } from 'react';
import { View, Vibration, } from 'react-native';
import { Title, Text } from 'native-base';
import Swipeout from '../../SwipeOut';
import HighlightContent from './HighlightContent';
import moment from 'moment';

export default class HighLight extends Component {
    constructor(props) {
        super(props)
    }
    renderContent(highlight) {
        return <HighlightContent showVideo={(url) => this.props.showVideo(url)} showPhoto={(uri) => this.props.showPhoto(uri)} PressingIn={() => {
            this.replying = true
        }} highlight={highlight}></HighlightContent>


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
                Vibration.vibrate(this.duration)
                this.props.showInput(this.props.highlight)
                setTimeout(() => {
                    this.closed = false
                }, 1000)
            }
            this.replying = false
        }
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
    render() {
        return (
            <View style={{
            }}>
                <Swipeout 
                    ref={'chatSwipeOut'} onOpen={() => { this.openingSwipeout() }}
                    onClose={() => { this.closingSwipeout() }} autoClose={true} close={true}
                    left={[{ color: '#04FFB6', type: 'default', backgroundColor: "transparent", text: 'react' }]}
                    style={{ backgroundColor: 'transparent', width: "100%" }}>
                    <View style={{
                        maxWidth: "90%", minWidth: 120,
                        minHeight: 10, overflow: 'hidden', borderRadius: 10,
                        alignSelf: 'center', margin: '1%',
                        backgroundColor: "#9EEDD3",
                    }}>
                        <Text note style={{color:'#1FABAB',fontWeight: 'bold',marginLeft: '2%',}}>{moment(this.props.highlight.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</Text>
                        <View style={{ height: 50, opacity: 0.8, borderRadius: 8, }}>
                            <Text style={{
                                 alignSelf: 'center',
                                margin: '3%', fontWeight: 'bold', fontSize: 22,
                            }}>
                                {this.props.highlight.title}
                            </Text>
                        </View>
                        <View>
                            {this.renderContent(this.props.highlight)}
                        </View>
                    </View>
                </Swipeout>
            </View>
        );
    }
}