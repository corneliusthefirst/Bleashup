import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import { Body, Accordion, Content, Thumbnail, Title, Icon } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "../../invitations/components/ProfileModal";
import testForURL from '../../../../services/testForURL';
import GState from '../../../../stores/globalState/index';
import Highlighter from 'react-native-highlight-words';
import Invite from '../../Contacts/invite';
import ColorList from '../../../colorList';

export default class ProfileSimple extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invite: false
        }

    }

    openModal() {
        this.setState({
            isModalOpened: true
        })
    }
    showingProfile = false
    render() {
        let textStyles = {
            justifyContent: 'flex-start', width: this.props.invite && this.props.profile && !this.props.profile.found ? "67%" : "77%",
            flexDirection: "column", paddingLeft: this.props.relation ? "4.6%" : "1.7%"
        }
        return (

            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", marginBottom: "4%" }}>

                {!this.props.hidePhoto && <View style={{ width: this.props.invite ? "15%" : "23%", paddingLeft: this.props.relation ? "4%" : "0%" }}>
                    {this.props.profile && this.props.profile.profile && testForURL(this.props.profile.profile) ?
                        <TouchableWithoutFeedback onPress={() => {
                            requestAnimationFrame(() => {
                                GState.showingProfile = true
                                this.setState({ isModalOpened: true })
                                //this.props.showPhoto(this.props.profile.profile)
                                setTimeout(() => {
                                    GState.showingProfile = false
                                }, 50)
                            });
                        }}>
                            <CacheImages staySmall small thumbnails {...this.props} source={{ uri: this.props.profile.profile }} />
                        </TouchableWithoutFeedback> :

                        <Icon type={"FontAwesome"} style={{
                            color:ColorList.photoPlaceHolderColor,
                            fontSize: 50,
                        }} name={"user-circle-o"}>

                        </Icon>}
                </View>}

                {this.props.searching ?
                    <View style={textStyles}>
                        <Highlighter numberOfLines={1}
                            ellipsizeMode="tail" highlightStyle={{ backgroundColor: ColorList.iconInactive, 
                        fontWeight: 'bold',color:ColorList.bodyBackground }}
                            searchWords={[this.props.searchString]}
                            style={{
                                fontSize: 12,
                                color: ColorList.bodyIcon
                            }}
                            autoEscape={true}
                            textToHighlight={this.props.profile.nickname}
                        >
                        </Highlighter></View> :
                    <View style={textStyles}>
                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                            marginBottom: "2%",
                            fontWeight: 'bold', alignSelf: "flex-start", color: (this.props.profile && this.props.profile.found) || this.props.relation ? "black" : "#494949", fontSize: 16
                        }}>{this.props.profile && this.props.profile.phone === stores.LoginStore.user.phone ? "You " : this.props.profile && this.props.profile.nickname}</Text>
                        {this.props.profile && this.props.profile.status && this.props.profile.status !== 'undefined' ? <Title style={{ fontStyle: 'italic', alignSelf: "flex-start", fontSize: 12, color: "gray" }} >{this.props.profile && this.props.profile.status}</Title> : null}

                    </View>}



                {this.props.invite && !this.props.profile.found ?
                    <View style={{ width: "17%" }}>
                        <TouchableWithoutFeedback onPress={() => {
                            requestAnimationFrame(() => {
                                this.setState({ invite: true })
                            })
                        }} >
                            <Text style={{ fontWeight: "500", color: ColorList.indicatorColor }}>invite</Text>
                        </TouchableWithoutFeedback>

                    </View> : null}


                {<ProfileModal
                    isOpen={this.state.isModalOpened}
                    hasJoin={this.props.hasJoin}
                    isToBeJoint
                    joined={this.props.joined}
                    parent={this}
                    onClosed={() => {
                        this.setState({ isModalOpened: false })
                        //this.props.onOpen()
                    }
                    }
                    profile={this.props.profile}
                ></ProfileModal>}

                <Invite isOpen={this.state.invite} onClosed={() => { this.setState({ invite: false }) }} />
            </View>
        )
    }
}