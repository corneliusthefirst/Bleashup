import React, { Component } from 'react'
import { Animated, View, Easing, TouchableWithoutFeedback } from "react-native"
import { Icon, Spinner, Text, Toast } from "native-base"
import Requester from '../Requester'
import stores from "../../../../stores"
import { indexOf, dropWhile, uniq, find } from "lodash"
import LikerssModal from '../../../LikersModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import emitter from '../../../../services/eventEmiter';


export default class Like extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        likes: 0,
        liked: false,
        likers: [],
        newWing:false,
        loaded: false,
        isOpen: false
    }
    scaleValue = new Animated.Value(0)
    cardScale = this.scaleValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.15, 1.2],

    })
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.loaded !== nextState.loaded ||
            this.state.liked !== nextState.liked || 
            this.state.isOpen !== nextState.isOpen ||
            this.state.newWing !== nextState.newWing
    }
    didILiked(Likes, id) {
        return new Promise((resolve, reject) => {
            likes = find(Likes, { event_id: id })
            if (likes) {
                let index = indexOf(likes.likers, stores.Session.SessionStore.phone)
                if (index >= 0) resolve({ status: true, likes: likes })
                else resolve({ status: false, likes: likes })
            } else {
                let index = indexOf(Likes.likers, stores.Session.SessionStore.phone)
                if (index >= 0) resolve({ status: true, likes: Likes })
                else resolve({ status: false, likes: Likes })
            }
        })
    }
    componentDidMount() {
        stores.Likes.loadLikes(this.props.id).then(likes => {
            this.didILiked(likes, this.props.id).then(result => {
                this.setState({
                    likes: likes.likers.length,
                    liked: result.status,
                    likers: likes.likers,
                    loaded: true
                })
                emitter.on(`liked_${this.props.id}`, () => {
                    stores.Likes.loadLikes(this.props.id).then(likes => {
                        this.didILiked(likes, this.props.id).then(result => {
                            this.setState({
                                likes: likes.likers.length,
                                liked: result.status,
                                newWing:!this.state.newWing,
                                likers: likes.likers,
                                loaded: true
                            })
                        })
                    })
                })
                this.likers = this.state.likers
                this.likes = this.state.likers.length
            })
        })
    }
    likes = 0
    liking = false
    likers = []
    unliking = false
    like() {
        if (!this.liking) {
            this.liking = true
            Requester.like(this.props.id).then(response => {
                this.liking = false;
                this.setState({
                    liked: true,
                    likes: this.likes + 1,
                    likers: uniq([stores.Session.SessionStore.phone].concat(this.likers))

                })
                this.likes = this.state.likes
                this.likers = this.state.likers
                this.props.end
            }).catch(error => {
                this.liking = false
                this.props.end
                Toast.show({
                    text: 'unable to connect to the server !',
                    buttonText: 'Okay'
                })
            })
        }
    }
    unlike() {
        if (!this.unliking) {
            this.unliking = true
            Requester.unlike(this.props.id).then(response => {
                this.unliking = false
                this.setState({
                    liked: false,
                    likes: this.likes - 1,
                    likers: dropWhile(this.likers, element => element == stores.Session.SessionStore.phone)
                })
                this.likers = this.state.likers
                this.likes = this.state.likes
            }).catch(error => {
                console.warn(error)
                this.unliking = false
                Toast.show({
                    text: 'unable to connect to the server ',
                    buttonText: 'Okay'
                })
            })
        }
    }
    /*  componentWillReceiveProps(nextProps) {
          this.didILiked(stores.Likes.likes, nextProps.id).then(result => {
              this.setState({
                  likes: result.likes.likers ? result.likes.likers.length : 0,
                  liked: result.status,
                  likers: result.likes.likers,
                  loaded: true
              })
              this.likers = this.state.likers
              this.likes = this.state.likers.length
          })
      }*/
    action() {
        if (this.state.liked) {
            this.unlike()
        } else {
            this.like()
        }
    }
    render() {
        return this.state.loaded ? (
            <View style={{ flexDirection: "row" }}>
                <View>
                    <TouchableWithoutFeedback onPressIn={() => {
                        this.scaleValue.setValue(0);
                        Animated.timing(this.scaleValue, {
                            toValue: 1,
                            duration: 300,
                            easing: Easing.linear,
                            userNativeDriver: true
                        }).start()
                    }} onPressOut={() => {
                        Animated.timing(this.scaleValue, {
                            toValue: 1,
                            duration: 200,
                            easing: Easing.linear,
                            userNativeDriver: true
                        }).start()
                        return this.action()
                    }} >
                        <Animated.View style={{ transform: [{ scale: this.cardScale }] }} >
                            <Icon
                                name="thumbs-up"
                                type="Entypo"
                                style={{
                                    color: this.state.liked ? "#54F5CA" : "#bfc6ea",
                                    fontSize: 30
                                }}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>

                </View>
                <View>
                    <TouchableOpacity onPress={() => this.setState({ isOpen: true })}>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{
                                color: this.state.liked ? "#54F5CA" :
                                    "#bfc6ea", fontSize: 18,
                            }} note>{" "} {this.state.likes} {"liker(s)"} </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <LikerssModal likers={this.state.likers} isOpen={this.state.isOpen}
                        onClosed={() => this.setState({ isOpen: false })}></LikerssModal>
                </View>
            </View>
        ) : null
    }
}
