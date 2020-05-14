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
            if (user.response == "unknown_user" || user.response === 'wrong server_key') {

                this.setState({ hide: true }) //this.state.hide = true;
                this.props.hideMe ? this.props.hideMe(this.state.hide) : null

            } else {
                
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

        //small method fro testing
        /*if(this.props.phone != "00237650594616"){
            console.warn("here we are")
            this.state.hide = true;
            this.props.hideMe(this.state.hide)
        }*/
    }

    openModal() {
        this.setState({  isModalOpened: true })
    }

    render() {
        return !this.state.hide && this.state.isMount ? (

            <View style={{ flexDirection: "row"}}>
              
               <TouchableOpacity  onPress={() => {
                    requestAnimationFrame(() => { this.openModal() });
                }} >
                <View style={{alignSelf:"center"}} transparent>
                    {testForURL(this.state.profile.profile) ? <CacheImages small thumbnails {...this.props}
                        source={{ uri: this.state.profile.profile }} /> :
                        <Thumbnail small source={require("../../../../../Images/images.jpeg")}></Thumbnail>}
                </View>
                </TouchableOpacity>

              
                <View style={{
                   alignSelf:"center", marginLeft:this.props.contact? "6.5%": "4%", fontWeight: 'bold'
                }}>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                        color: ColorList.bodyText,
                        fontWeight: 'bold',
                        //marginTop: "4%",
                    }}>{this.state.profile.phone === stores.LoginStore.user.phone ? "You" : this.state.profile.nickname}</Text>

                    {this.state.profile.status && this.state.profile.status != "undefined"&& !this.state.profile.status.isEmpty()?<Text ellipsizeMode={'tail'} numberOfLines={1} style={{ alignSelf: 'flex-start', fontStyle: 'italic', }}
                     note>{this.state.profile.status}</Text>:null}

                </View>
             

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

