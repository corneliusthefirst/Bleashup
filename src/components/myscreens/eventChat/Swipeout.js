
import React, { PureComponent } from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Swipeout extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return <SwipeRow 
        disableRightSwipe={this.props.disabled} 
        disableLeftSwipe={this.props.disableLeftSwipe} 
        swipeGestureEnded={(key, data) => {
            if (data.translateX >= 3) {
                this.props.swipeRight && this.props.swipeRight()
            } else if (data.translateX <= -2) {
               this.props.onLongPress && this.props.onLongPress()
            }
        }}
            leftOpenValue={0}
            rightOpenValue={0}
            swipeToClosePercent={50}
            style={{ backgroundColor: "transparent", width: "100%" }}
        >
            <View
                style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: "90%",
                }}>
            </View>
            <View>
            {this.props.children}
            </View>
        </SwipeRow>
    }
}