
import React, { Component } from 'react';

export default class BeComponent extends Component{

    componentWillMount(){
        this.mounted = true
        this.componentMounting()
    }
    setStatePure(state,callback){
        this.mounted && this.setState(state,callback)
    }
    mountTimeout = null
    componentMounting(){

    }
    componentWillUnmount(){
        this.mounted = false
        this.mountTimeout &&  clearTimeout(this.mountTimeout)
        this.unmountingComponent()
    }
    unmountingComponent(){

    }
}