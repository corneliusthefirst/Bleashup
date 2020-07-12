
import React, { PureComponent } from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Swipeout extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return <SwipeRow disableRightSwipe={this.props.disabled} disableLeftSwipe={this.props.disabled} swipeGestureEnded={(key, data) => {
            if (data.translateX >= 50) {
                this.props.swipeRight()
            } else if (data.translateX <= -50) {
               this.props.swipeLeft()
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
            <TouchableOpacity onPressIn={this.props.onPressIn} onLongPress={this.props.onLongPress}>
            <View>
            {this.props.children}
            </View>
            </TouchableOpacity>
        </SwipeRow>
    }
}