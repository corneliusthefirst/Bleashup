import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View,TouchableOpacity } from "react-native";
import { Body, Text, Accordion, Content, Thumbnail, Button, Title } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import testForURL from '../../../../services/testForURL';
import ColorList from '../../../colorList';
import ProfileSimple from '../../currentevents/components/ProfileViewSimple';

export default class ProfileView extends Component {
    constructor(props) {
        super(props)
    }
    state = { profile: undefined, isMount: false, hide: false }
    componentDidMount() {
        setTimeout(() => stores.TemporalUsersStore.getUser(this.props.phone).then(user => {
            //console.warn("user gotten",user)
            if (user.response == "unknown_user" || user.response === 'wrong server_key') {
                this.props.hideMe ? this.props.hideMe() : null
                this.setState({
                    hide: true
                })
            } else {
                //console.warn("here we are boy",user);
               this.props.contact && stores.Contacts.addContact({phone:user.phone,host:user.current_host}).then(()=>{})
               this.props.contact && this.props.updateContact(user);
          
               

                this.setState({
                    profile: user,
                    isModalOpened: false,
                    isMount: true,
                })
                this.props.setContact ? this.props.setContact(user) : null
            }
        }), 20 * this.props.delay ? this.props.delay : 2)
    }
    openModal() {
        this.setState({
            isModalOpened: true
        })
    }
    render() {
        return this.state.hide ?<View style={{marginBottom:"2%"}}><ProfileSimple profile={this.props.phoneInfo} invite /></View>  : this.state.isMount ? (

            <View style={{ flexDirection: "row",marginBottom: "2%",}}>
              
                <Button onPress={() => {
                    requestAnimationFrame(() => {
                        this.setState({
                            isModalOpened: true
                        })
                    });
                }} transparent>
                    {testForURL(this.state.profile.profile) ? <CacheImages small thumbnails {...this.props}
                        source={{ uri: this.state.profile.profile }} /> :
                        <Thumbnail small source={require("../../../../../Images/images.jpeg")}></Thumbnail>}
                </Button>

                <TouchableOpacity onPress={() => {requestAnimationFrame(() => {if(this.props.action){this.props.action(this.state.profile);}}) } }>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center', paddingLeft: "10%", display: 'flex', fontWeight: 'bold',
                }}>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                        marginBottom: "2%",
                        color: ColorList.bodyText,
                        fontWeight: 'bold',
                    }}>{this.state.profile.phone === stores.LoginStore.user.phone ? "You" : this.state.profile.nickname}</Text>

                      <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ alignSelf: 'flex-start', fontStyle: 'italic', }}
                        note>{this.state.profile.status && this.state.profile.status != "undefined"? this.state.profile.status:null}</Text>
                </View>
                </TouchableOpacity>

                {this.state.isModalOpened ? <ProfileModal
                    isOpen={this.state.isModalOpened}
                    hasJoin={this.props.hasJoin}
                    isToBeJoint
                    joined={this.props.joined}
                    onClosed={() => {
                        this.setState({ isModalOpened: false })
                        //this.props.onOpen()
                    }
                    }
                    profile={this.state.profile}
                ></ProfileModal> : null}
            </View>
        ) : <ProfileIdicator />
    }
}