import React, { Component } from "react";
import { Animated, View, Text, TouchableWithoutFeedback} from "react-native";
import Requester from "../Requester";
import stores from "../../../../stores";
import { findIndex } from "lodash";
import emitter from "../../../../services/eventEmiter";
import ColorList from "../../../colorList";
import AnimatedComponent from '../../../AnimatedComponent';
import Toaster from "../../../../services/Toaster";
import AntDesign  from 'react-native-vector-icons/AntDesign';
import Texts from '../../../../meta/text';

export default class Like extends AnimatedComponent {
    state = {
        likes: 0,
        liked: false,
        likers: [],
        newWing: false,
        loaded: false,
        isOpen: false,
    };
    scaleValue = new Animated.Value(0);
    cardScale = this.scaleValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.15, 1.2],
    });

    didILiked(likes, id) {
        return new Promise((resolve, reject) => {
            if (likes) {
                let index = indexOf(likes.likers, stores.Session.SessionStore.phone);
                if (index >= 0) resolve({ status: true, likes: likes });
                else resolve({ status: false, likes: likes });
            } else {
                resolve({
                    status: false,
                    likes: { event_id: id, likers: [], likes: 0 },
                });
            }
        });
    }
    componentDidMount() {
        stores.Likes.loadLikes(this.props.id).then((like) => {
            if (like) {
                this.setLikesCount(parseInt(like.likes))
                this.setStatePure({
                    liked: findIndex(like.likers, ele => ele === stores.LoginStore.user.phone) >= 0,
                    likesCount: like.likes,
                    loaded: true
                })
            }
        })
        stores.Likes.getLikesFromRemote(this.props.id, "count", 0, 0).then(
            (data) => {
                this.setLikesCount(data.count)
                this.setStatePure({
                    likesCount: data.count,
                    liked: data.liked,
                    loaded: true,
                });

                data.liked
                    ? stores.Likes.like(
                        this.props.id,
                        stores.LoginStore.user.phone,
                        this.state.likesCount,
                        true
                    ).then(() => { })
                    : stores.Likes.unlike(
                        this.props.id,
                        stores.LoginStore.user.phone,
                        this.state.likesCount
                    ).then(() => { });

            }
        ).catch(() => {
           
        });
    }
    setLikesCount(count) {
        this.props.setLikesCount && this.props.setLikesCount(count)
        this.setStatePure({
            likesCount:  count
        })
    }
    likes = 0;
    liking = false;
    likers = [];
    unliking = false;
    like() {
        if (!this.liking) {
            this.liking = true;
            Requester.like(this.props.id, this.state.likesCount+1)
                .then((response) => {
                    this.liking = false;
                    this.setStatePure({
                        liked: true,
                    });
                    this.setLikesCount(this.state.likesCount + 1)
                    this.likes = this.state.likes;
                    this.likers = this.state.likers;
                    this.props.end;
                })
                .catch((error) => {
                    this.liking = false;
                    this.props.end;
                    Toaster({
                        text: Texts.unable_to_perform_request,
                        buttonText: "Okay",
                    });
                });
        }
    }
    unlike() {
        if (!this.unliking) {
            this.unliking = true;
            Requester.unlike(this.props.id, this.state.likesCount - 1)
                .then((response) => {
                    this.unliking = false;
                    this.setStatePure({
                        liked: false,
                    });
                    this.setLikesCount(this.state.likesCount -1)
                    this.likers = this.state.likers;
                    this.likes = this.state.likes;
                })
                .catch((error) => {
                    console.warn(error);
                    this.unliking = false;
                    Toaster({
                        text: Texts.unable_to_perform_request,
                        buttonText: "Okay",
                    });
                });
        }
    }
    action() {
        if (this.state.liked) {
            this.unlike();
        } else {
            this.like();
        }
    }
    render() {
        return <View>
            <View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        return this.action();
                    }}
                    onPressOut={() => {
                        
                    }}
                >
                    <Animated.View style={{ transform: [{ scale: this.cardScale }] }}>
                        <AntDesign
                            name={this.props.icon.name}
                            type={this.props.icon.type}
                            style={{
                                color: this.state.liked
                                    ? this.props.likedColor
                                    : ColorList.likeInactive,
                                fontSize: this.props.size,
                            }}
                        />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <View></View>
        </View>
    }
}
