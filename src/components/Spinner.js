
import React, { Component } from "react"
import { MaterialIndicator } from "react-native-indicators"
import ColorList from './colorList';
export default class Spinner extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <MaterialIndicator color={this.props.color || ColorList.indicatorColor} size={this.props.size || (this.props.big ? 30 : this.props.small ? 10 : 15)}>
        </MaterialIndicator>
    }
}