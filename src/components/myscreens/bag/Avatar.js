import * as React from "react";
import {Component} from "react";
import {Image, StyleSheet} from "react-native";

import Images from "../images/Images";

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size:20,
            id: 0,
            style:''
    
        }

    }

    render() {
      //  const {size, id, style} = this.props;
        let source;
        if (id === 1) {
            source = Images.avatar1;
        } else if (id === 2) {
            source = Images.avatar2;
        } else if (id === 3) {
            source = Images.avatar3;
        } else {
            source = Images.defaultAvatar;
        }
        return <Image {...{source}} style={[style, { width: size, height: size, borderRadius: size / 2 }]} />;
    }
}