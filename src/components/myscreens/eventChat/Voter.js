import React, { Component } from 'react';
import { View } from 'react-native';
import TextContent from './TextContent';

export default class Voter extends Component {
    constructor(props) {
        super(props)
    }
    renderOptions(){
        
    }
    render() {
        return <View style={{ margin: '1%', }}>
            <View style={{ alignSelf: 'center', margin: '2%', }}>
                <Text style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: '21',
                }}>{this.props.vote.title}</Text>
            </View>
            <View style={{ margin: '2%', }}>
                <TextContent
                    handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                    pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                    text={this.props.vote.description}></TextContent>
            </View>
            <View>
            {this.renderOptions()}
            </View>
        </View>
    }
}