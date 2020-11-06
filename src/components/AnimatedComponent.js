
import React,{Component} from "react"
import { Platform, LayoutAnimation, UIManager } from 'react-native';
import BeComponent from './BeComponent';
import GState from '../stores/globalState/index';

export default class AnimatedComponent extends BeComponent {
    constructor(props){
        super(props)
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.initialize()
    }
    initialize(){

    }
    defaultAnimationDuration = 100
    animationDuration = 100
    animateUI(){
        //if(this.animationTimeout) clearTimeout(this.animationTimeout)
        //this.animationTimeout = setTimeout(() => {
            LayoutAnimation.configureNext({
                duration: 150,
                create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.scaleX,
                },
                update: { type: LayoutAnimation.Types.easeInEaseOut },
            });
      //  })
    }
    componentWillUpdate(prevProps,preState,preContext){
        this.animateUI()
    }
}