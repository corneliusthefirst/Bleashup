import React, { Component } from "react";
import { Animated, View, Easing, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import { Icon, Spinner, Text, Toast } from "native-base";
import Requester from "../Requester";
import stores from "../../../../stores";
import { indexOf, dropWhile, uniq, find, findIndex } from "lodash";
import emitter from "../../../../services/eventEmiter";
import ColorList from "../../../colorList";

export default class Like extends Component {
    constructor(props) {
        super(props);
    }
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
                this.setState({
                    liked: findIndex(like.likers, ele => ele === stores.LoginStore.user.phone) >= 0,
                    likesCount: like.likes,
                    loaded: true
                })
            }
        })
        stores.Likes.getLikesFromRemote(this.props.id, "count", 0, 0).then(
            (data) => {
                this.setLikesCount(data.count)
                this.setState({
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
        this.setState({
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
                    this.setState({
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
                    Toast.show({
                        text: "unable to connect to the server !",
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
                    this.setState({
                        liked: false,
                    });
                    this.setLikesCount(this.state.likesCount -1)
                    this.likers = this.state.likers;
                    this.likes = this.state.likes;
                })
                .catch((error) => {
                    console.warn(error);
                    this.unliking = false;
                    Toast.show({
                        text: "unable to connect to the server ",
                        buttonText: "Okay",
                    });
                });
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
                        this.scaleValue.setValue(0);
                        Animated.timing(this.scaleValue, {
                            toValue: 1,
                            duration: 300,
                            easing: Easing.linear,
                            userNativeDriver: true,
                        }).start();
                        return this.action();
                    }}
                    onPressOut={() => {
                        Animated.timing(this.scaleValue, {
                            toValue: 1,
                            duration: 200,
                            easing: Easing.linear,
                            userNativeDriver: true,
                        }).start();
                        
                    }}
                >
                    <Animated.View style={{ transform: [{ scale: this.cardScale }] }}>
                        <Icon
                            name={this.props.icon.name}
                            type={this.props.icon.type}
                            style={{
                                color: this.state.liked
                                    ? this.props.likedColor
                                    : ColorList.likeInactive,
                                fontSize: this.props.size,
                            }}
                        />
                      {/*  <Text note>{`${this.state.likesCount} likes`}</Text>*/}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <View></View>
        </View>
    }
}
