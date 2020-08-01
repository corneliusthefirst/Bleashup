/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import VideoController from '../../eventChat/VideoController';
import {Animated,View,StyleSheet,} from 'react-native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from '../../../../stores/globalState';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default class VideoViewerController  extends VideoController {


     /**
     * When load is finished we hide the load icon
     * and hide the controls. We also set the
     * video duration.
     *
     * @param {object} data The video meta data
     */
    _onLoad(data = {}) {
        this.props.onLoad(data);
        let state = this.state;
        state.duration = data.duration;
        state.loading = false;
        this.setState(state);

        if (state.showControls) {
            this.setControlTimeout();
        }

        if (typeof this.props.onLoad === 'function') {
            this.props.onLoad(...arguments);
        }
    }



    /**
     * Render the seekbar and attach its handlers
     */
    renderSeekbar() {

        return (
            <View style={styles.seekbar.containerViewer}>
                <View
                    style={styles.seekbar.track}
                    onLayout={event => this.player.seekerWidth = event.nativeEvent.layout.width}
                >
                    <View style={[
                        styles.seekbar.fill,
                        {
                            width: isNaN(this.state.seekerFillWidth)? "100%" : this.state.seekerPosition,
                            backgroundColor: this.props.seekColor || '#FEFFDE'
                        }
                    ]} />
                </View>
                <View
                    style={[
                        styles.seekbar.handle,
                        { left: isNaN(this.state.seekerPosition) ? "100%" : this.state.seekerPosition }
                    ]}
                    {...this.player.seekPanResponder.panHandlers}
                >
                    <View style={[
                        styles.seekbar.circle,
                        { backgroundColor: this.props.seekColor || '#FEFFDE' }]}
                    />
                </View>
            </View>
        );
    }


    /**
     * Render the play/pause button and show the respective icon
     */
    renderPlayPause() { 

        return this.renderControl(
            <MaterialCommunityIcons type="MaterialCommunityIcons" 
            name={this.state.paused?"play-circle-outline":"pause"} style={{...GState.defaultIconSize, color: 'white',fontSize:55}}/>,
            this.methods.togglePlayPause,
            styles.controls.playPause
        );
    }


    /**
     * Groups the top bar controls together in an animated
     * view and spaces them out.
     */
    renderTopControls() {

        const backControl = this.props.disableBack ? this.renderNullControl() : this.renderBack();
        const volumeControl = this.props.disableVolume ? this.renderNullControl() : this.renderVolume();
        const fullscreenControl = this.props.disableFullscreen ? this.renderNullControl() : this.renderFullscreen();

        return (
            <Animated.View style={[
                styles.controls.top,
                {
                    opacity: this.animations.topControl.opacity,
                    marginTop: this.animations.topControl.marginTop,
                }
            ]}>
                <View
                    style={[styles.controls.column,]}
                    imageStyle={[styles.controls.vignette]}>
                    <View style={[styles.controls.topControlGroup,]}>
                        {backControl}
                        <View style={[styles.controls.pullRight]}>
                            {volumeControl}
                            {fullscreenControl}
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }



     /**
     * Render our center content pause,play and next...if supplied.
     */
    renderCenter() {
        const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
        
            return(
            
                <View style={[styles.loader]}>
                      {this.props.nextPrev?<MaterialIcons name="skip-previous" type="MaterialIcons" style={{...GState.defaultIconSize,color:"white",fontSize:40,paddingRight:"10%"}} onPress={this.props.previousVideo}/>:null}
                      {playPauseControl}
                      {this.props.nextPrev?<MaterialIcons name="skip-next" type="MaterialIcons" style={{...GState.defaultIconSize,color:"white",fontSize:40,paddingLeft:"10%"}} onPress={this.props.nextVideo}/>:null}
                </View>
                
            );

    }

    renderCenterControls() {
      
    return (
            <Animated.View style={[
                styles.controls.bottom,
                {
                    opacity: this.animations.bottomControl.opacity,
                    marginBottom: this.animations.bottomControl.marginBottom,
                }
            ]}>
                <View imageStyle={[styles.controls.vignette,]}>
                    <View style={[
                         styles.controls.centerControlGroup
                    ]}>
                        {this.renderCenter()}
                    </View>
                </View>
            </Animated.View>
        );
    }


    /**
     * Render bottom control group and wrap it in a holder
     */
    renderBottomControls() {

        const timerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
        const seekbarControl = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar();
       

        return (
            <Animated.View style={[
                styles.controls.bottom,
                {
                    opacity: this.animations.bottomControl.opacity,
                    marginBottom: this.animations.bottomControl.marginBottom,
                }
            ]}>
                <View
                    //style={[styles.controls.column]}
                    imageStyle={[styles.controls.vignette]}>
                    <View style={[
                        styles.controls.row,
                        styles.controls.bottomControlGroupViewer
                    ]}>
                        {/*playPauseControl*/}
                        {/*this.renderTitle()*/}
                        <View style={{flex:1,justifyContent:"center",height:20}}>
                        {seekbarControl}
                        </View>
                        <View style={{width:60,justifyContent:"center",height:20}}>
                        {timerControl}
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }


}

const transparent = "rgba(52, 52, 52, 0.8)";
/**
 * This object houses our styles. There's player
 * specific styles and control specific ones.
 * And then there's volume/seeker styles.
 */
const styles = {
    player: StyleSheet.create({
        container: {
            backgroundColor:transparent ,
            flex: 1,
            alignSelf: 'stretch',
            justifyContent:"center", //was space-between
        },
        video: {
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    }),
    error: StyleSheet.create({
        container: {
            backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            marginBottom: 16,
        },
        text: {
            backgroundColor: transparent,
            color: '#f27474'
        },
    }),
    loader: StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
    controls: StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: null,
            width: null,
        },
        rowcenter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 55,
            width: null,
        },
        column: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: null,
            width: null,
        },
        vignette: {
            resizeMode: 'stretch'
        },
        control: {
            padding: 16,
        },
        text: {
            backgroundColor: 'transparent',
            color: '#FEFFDE',
            fontSize: 14,
            textAlign: 'center',
        },
        pullRight: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        top: {
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
        },
        bottom: {
            alignItems: 'stretch',
            flex: 2,
            justifyContent: 'flex-end',
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: null,
            paddingTop:10,
            //margin: 12,
            //marginBottom: 18,
        },
        bottomControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 10,
        },
        bottomControlGroupViewer: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 17,
        },
        centerControlGroup: {
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            //marginTop: 20,
            //backgroundColor:"red"
        },
        volume: {
            flexDirection: 'row',
        },
        fullscreen: {
            flexDirection: 'row',
        },
        playPause: {
            position: 'relative',
            width: 90,
            zIndex: 0,
        },
        title: {
            alignItems: 'center',
            flex: 0.6,
            flexDirection: 'column',
            padding: 0,
        },
        titleText: {
            textAlign: 'center',
        },
        timer: {
            width: 70,
        },
        timerText: {
            backgroundColor: 'transparent',
            color: '#FEFFDE',
            fontSize: 11,
            textAlign: 'left',
        },
    }),
    volume: StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            height: 1,
            marginLeft: 20,
            marginRight: 20,
            width: 150,
        },
        track: {
            backgroundColor: '#333',
            height: 1,
            marginLeft: 7,
        },
        fill: {
            
            height: 1,
        },
        handle: {
            position: 'absolute',
            marginTop: -24,
            marginLeft: -24,
            padding: 16,
        },
        icon: {
            marginLeft: 7
        }
    }),
    seekbar: StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            height: 30,
            marginLeft: 20,
            marginRight: 20,
        },
        containerViewer: {
            alignSelf: 'stretch',
            height: 20,
            marginLeft: 5,
            paddingRight: 5,
            //justifyContent:"center",
        },
        track: {
            backgroundColor: '#333',
            height: 1,
            position: 'relative',
            top: 14,
            width: '100%'
        },
        fill: {
            
            height: 3,
            width: '100%'
        },
        handle: {
            position: 'absolute',
            marginLeft: -7,
            height: 28,
            width: 28,
        },
        circle: {
            borderRadius: 12,
            position: 'relative',
            top: 8, left: 8,
            height: 12,
            width: 12,
        },
    })
};