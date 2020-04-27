import React, { Component } from "react"
import { View, Text } from "react-native"
import { Icon } from "native-base"
import { countComments } from '../../../../../services/cloud_services';
import ColorList from '../../../../colorList';

export default class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentsCount: 0,
            latestComment: {

            }
        }
    }
    componentDidMount() {
        countComments(this.props.id).then(resp => {
            resp.json().then((data) => {
                this.props.setCommentsCount && this.props.setCommentsCount()
                this.setState({
                    commentsCount: data.count,
                    latestComment: data.latest
                })
            })
        })
    }
    render() {
        return <View style={{ flexDirection: 'column',justifyContent: 'flex-start',alignItems: 'center', }}>
            <View>
                <Icon style={{ color: ColorList.headerIcon, fontSize: 30, }}
                    type={"FontAwesome"}
                    name={"comments-o"}>
                </Icon>
            </View>
            <View>
              {/* <Text elipsizeMode={'tail'} numberOfLines={1} note>{`${this.state.commentsCount} comments`}</Text>*/}
            </View>
        </View>
    }
}