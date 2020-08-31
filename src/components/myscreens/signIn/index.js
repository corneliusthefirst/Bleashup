import React, { Component } from "react";
import { Image, TouchableOpacity, BackHandler,View ,ScrollView,Text,TextInput as Input} from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores/index";
import globalState from "../../../stores/globalState";
import firebase from 'react-native-firebase';
import VerificationModal from "../invitations/components/VerificationModal";
import connect from '../../../services/tcpConnect';
import HeaderHome from '../login/header';
import ColorList from "../../colorList";
import Toaster from "../../../services/Toaster";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from "../../../stores/globalState";
import CreationHeader from '../event/createEvent/components/CreationHeader';
import Texts from '../../../meta/text';
import rounder from "../../../services/rounder";
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import CreateButton from "../event/createEvent/components/ActionButton";
import Spinner from '../../Spinner';
import  Ionicons  from 'react-native-vector-icons/Ionicons';


@observer
export default class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      mounted : false,
      isModalOpened:false
    };
  }
  loginStore = stores.LoginStore;
  state = {}
  OnChangedPassword(value) {
    this.setState({ password: value });
  }

  back() {
    this.props.navigation.navigate("Login");
  }

  removeError() {
    globalState.error = false;
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.state.mounted && this.login()
      }
    });
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({
        mounted:true
      })
    },1000)
  }
  user = {}
  exiting = false
  timeout = null
 
  back() {
    this.props.navigation.goBack();
  }

  phone = this.loginStore.user.phone||""
  forgotPassword() {
    this.props.navigation.navigate("Login");
  }
  verifyNumber(code) {
    console.warn("code to verify is: ",code)
    code ?
    stores.TempLoginStore.confirmCode.confirm(code).then(success => {
    this.state.password &&  this.login()
    }).catch(err => {
      this.sayVerificationError()
    }):Toaster({text:Texts.enter_verification_code})
    globalState.loading = false
  }
  sayVerificationError(){
    Toaster({ text: `${Texts.unable_to_verify_account}` })
    globalState.loading = false
  }
  login() {
    this.user.password = this.state.password;
    this.loginStore.setUser(this.user).then(() => {
      stores.Session.initialzeStore().then(session => {
        globalState.loading = false;
        this.setState({ isModalOpened: false })
        connect.init().then(socket => {
          this.props.navigation.navigate("Home");
        }).catch(() =>{
          console.warn("error while connecting socket")
        })
      });
    });
  }

  signIn = () => {
    globalState.loading = true;
    this.loginStore.getUser().then(user => {
      this.user = user;
      console.warn(user)
      UserService.login(user.phone, this.state.password).then(response => {
        if (response === "true") {
          //this.login()
          firebase.auth().signInWithPhoneNumber(user.phone.replace("00", "+")).then(confirmCode => {
            stores.TempLoginStore.confirmCode = confirmCode
            this.setState({ isModalOpened: true })
          }).catch(() => {
            this.sayVerificationError()
          })
        } else {
          globalState.loading = false;
          globalState.error = true;
          //alert("Wrong password !");
        }
      });
    });
  }
  onChangedCode(value) {
    this.setState({
      code: value
    })
  }
  render() {
    return (
      <View style={{height:"100%",width:"100%",alignItems:"center"}}>
      <CreationHeader title={Texts.sign_in} back={this.back.bind(this)} ></CreationHeader>
        <ScrollView style={{flex:1,width:"100%"}}  showsVerticalScrollIndicator={false}>
        <View style={{...rounder(200,ColorList.indicatorColor),marginLeft: "auto",marginRight: "auto",marginTop: "2%",}}>
            <Image resizeMode={"cover"} source={this.loginStore.user.profile_ext}
              style={{...rounder(200), }}>
        </Image>
        </View>
        <View style={{
          alignSelf: 'center',
          margin: '2%',
        }}>
          <Text style={{...GState.defaultTextStyle,fontWeight: 'bold',}}>{this.loginStore.user.name}</Text>
          <Text style={{...GState.defaultTextStyle}}>{this.loginStore.user.status}</Text>
        </View>
          <TouchableOpacity
            style={{ alignSelf:"flex-end",marginRight:"5%" }}
            onPress={this.forgotPassword.bind(this)}
          >
            <Text style={{ color: ColorList.indicatorColor, fontSize: 14 }}>
              forgot password ?
            </Text>
          </TouchableOpacity>

          <View rounded style={[{ ...styles.input, }, 
            globalState.error ? {borderColor: ColorList.errorColor,}:{}]}>
            <FontAwesome style={{...GState.defaultIconSize,
              fontSize: 18,
              alignSelf: 'center',
              marginTop: 7,
              marginLeft: 5,
            }} active type="FontAwesome" name="unlock" />
            <Input
              secureTextEntry
              style={{...GState.defaultTextStyle,width:"70%",marginLeft: "2%",height:40}}
              placeholder={
                globalState.error == false
                  ? Texts.enter_password
                  : Texts.invalide_password
              }
              onChangeText={value => this.OnChangedPassword(value)}
            />
            {globalState.error == false ? (
              <Text />
            ) : (
                  <TouchableOpacity style={styles.close_button} onPress={this.removeError.bind(this)}>
                    <Ionicons
                    style={{...GState.defaultIconSize,fontSize: 14,marginTop: 7,}}
                      type="Ionicons"
                      name="ios-close-circle"
                      style={{ color: ColorList.errorColor }}
                    />
              </TouchableOpacity>
              )}
          </View>
       <View style={{marginTop:"15%",marginBottom:"7%"}}>
            {!globalState.loading?<CreateButton title={Texts.sign_in} action={this.signIn.bind(this)}>
       </CreateButton> : <Spinner />}
          </View>
       </ScrollView>
        <VerificationModal isOpen={this.state.isModalOpened} phone={this.phone}
        verifyCode={(code) => this.verifyNumber(code)} onClose={() => {
          globalState.loading = false
          this.setState({
            isModalOpened:false,
          })
        }}></VerificationModal>
      </View>
    );
  }
}



