import React, { PureComponent } from 'react'
import { Animated, View, Easing, TouchableWithoutFeedback } from "react-native"
import { Icon, Spinner, Text, Toast } from "native-base"
import Requester from '../Requester'
import stores from "../../../../stores"
import { indexOf, drop ,uniq} from "lodash"
import { observer } from 'mobx-react';
import LikerssModal from '../../../LikersModal';
import { TouchableOpacity } from 'react-native-gesture-handler';


@observer export default class Like extends PureComponent {
    constructor(props) {
        super(props)
    }
    state = {
        likes: 0,
        liked: false,
        likers: [],
        loaded: false,
        isOpen: false
    }
    scaleValue = new Animated.Value(0)
    cardScale = this.scaleValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.15, 1.2],

    })
    didILiked(likers) {
        return new Promise((resolve, reject) => {
            let index = indexOf(likers, stores.Session.SessionStore.phone)
            if (index >= 0) resolve(true)
            else resolve(false)
        })
    }
    componentDidMount() {
        stores.Likes.loadLikes(this.props.id).then(like => {
            this.didILiked(like.likers).then(status => {
                this.setState({
                    likes: like.likers.length,
                    liked: status,
                    likers: like.likers,
                    loaded: true
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
                    likers: drop(this.likers, indexOf(this.likers, stores.Session.SessionStore.phone) + 1)
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
                                    color: this.state.liked ? "#7DD2D2" : "#bfc6ea",
                                    fontSize: 25
                                }}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>

                </View>
                <View>
                    <TouchableOpacity onPress={() => this.setState({ isOpen: true })}>
                        <View style={{ marginTop: 9 }}>
                            <Text style={{ color: this.state.liked ? "#7DD2D2" : "#bfc6ea" }} note>{" "} {this.state.likes} Likers </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <LikerssModal likers={this.state.likers} isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })}></LikerssModal>
                </View>
            </View>
        ) : null
    }
}
