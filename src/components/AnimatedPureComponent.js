
import React, { PureComponent } from "react"
import { Platform, LayoutAnimation, UIManager } from 'react-native';

export default class AnimatedPureComponent extends PureComponent {
    constructor(props) {
        super(props)
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.initialize()
    }
    initialize() {

    }
    animateUI() {
        //if(this.animationTimeout) clearTimeout(this.animationTimeout)
        //this.animationTimeout = setTimeout(() => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleX,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
        //  })
    }
    componentWillUpdate(prevProps, preState, preContext) {
        this.animateUI()
    }
}