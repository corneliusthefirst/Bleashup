
import React, { PureComponent } from "react"
import { Platform, LayoutAnimation, UIManager } from 'react-native';
import BePureComponent from './BePureComponent';

export default class AnimatedPureComponent extends BePureComponent {
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
            duration: 250,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleX,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
        //  })
    }
    willUpdatingComponent(){
        
    }
    componentWillUpdate(prevProps, preState, preContext) {
        this.animateUI()
        this.willUpdatingComponent()
    }
}