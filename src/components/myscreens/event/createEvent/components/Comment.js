import React, { Component } from "react"
import { View, } from "react-native"
import { Icon, Text} from "native-base"
import { countComments } from '../../../../../services/cloud_services';
import ColorList from '../../../../colorList';
import { TouchableOpacity } from "react-native-gesture-handler";
import stores from '../../../../../stores';
import BeNavigator from '../../../../../services/navigationServices';

export default class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentsCount: 0,
            latestComment: {

            }
        }
    }
    initializeComments(data) {
        this.props.setCommentsCount && this.props.setCommentsCount(data.count)
        this.setState({
            commentsCount: data.count,
            latestComment: data.latest
        })
    }
    componentDidMount() {
        stores.comments.loadComments(this.props.id).then(com => {
            this.initializeComments(com)
        })
        countComments(this.props.id).then(resp => {
            resp.json().then((data) => {
               this.initializeComments(data)
               stores.comments.addComment({...data,event_id:this.props.id}).then(() => {

               })
            })
        })
    }
    openComments() {
        BeNavigator.pushTo('Comment', { 
            activity_id: this.props.activity_id, 
            activity_name: this.props.activity_name,
            title: this.props.title,
            id: this.props.id
        })
    }
    render() {
        return <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', }}>
            <TouchableOpacity onPress={() => requestAnimationFrame(this.openComments.bind(this))}>
                <Icon style={{ color: ColorList.headerIcon, fontSize: 30, }}
                    type={"FontAwesome"}
                    name={"comments-o"}>
                </Icon>
            </TouchableOpacity>
            <View>
                {this.state.latestComment.text && <Text elipsizeMode={'tail'} numberOfLines={1} note>{`${this.state.latestComment.text}`}</Text>}
            </View>
        </View>
    }
}