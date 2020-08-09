import React, { Component } from "react";
import stores from "../../../stores";
import Modal from 'react-native-modalbox';
import {
  Button,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
} from "react-native";
import {  map, } from "lodash";
import ColorList from '.././../colorList';
import CreateTextInput from '../event/createEvent/components/CreateTextInput';

let { height, width } = Dimensions.get('window');

export default class EditUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      value: '',
      userInfo: null,
      previousLength: 0,
      textLength: 0,
    };
  }

  init() {
    //console.warn("here is init")
    setTimeout(() => {
      if (this.props.type == 'nickname') {
        this.setState({ value: this.props.userInfo.nickname });
      } else if (this.props.type == 'actu') {
        this.setState({ value: this.props.userInfo.status });
      }
      this.setState({
        userInfo: this.props.userInfo,
        previousLength: this.state.value.length,
      });
      this.setState({
        textLength: this.props.maxLength - this.state.previousLength,
        isMount: true,
      });
    }, 50);
  }

  componentDidMount() {
    this.init();
  }

  textChanged = (value) => {
    if (value.length > this.state.previousLength) {
      this.setState({ previousLength: this.state.previousLength + 1 });
      this.setState({
        textLength: this.props.maxLength - this.state.previousLength,
      });
    } else {
      this.setState({ previousLength: this.state.previousLength - 1 });
      this.setState({
        textLength: this.props.maxLength - this.state.previousLength,
      });
    }

    if (this.props.type === 'nickname') {
      this.state.userInfo.nickname = value;
      this.setState({ value: value });
    } else if (this.props.type === "actu") {
      this.state.userInfo.status = value;
      this.setState({ value: value });
    }
  };

  save = () => {
    if (this.props.type === 'nickname') {
      stores.LoginStore.updateName(this.state.value).then(() => {
        this.props.onClosed();
      });
    } else if (this.props.type === 'actu') {
      map(this.props.data, (o) => {
        o.state = false;
      });
      stores.LoginStore.updateStatus(this.state.value).then(() => {
        stores.LoginStore.updateStatusOptions(this.props.data).then(() => {
          this.props.parent.init();
          this.props.onClosed();
        });
      });
    }
  };

  cancel = () => {
    this.setState({ value: '' });
    this.props.onClosed();
  };

  render() {
    return (
      <Modal
        coverScreen={true}
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        style={{
          backgroundColor: ColorList.bodyBackground,
          alignItems: 'center',
          height: height / 4,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: '100%',
        }}
        position={this.props.position}
        coverScreen={this.props.coverscreen}
        backdropPressToClose={false}
      >
        {this.state.isMount ? (
          <View style={{ flexDirection: 'column', width: '90%', margin: '5%' }}>
            <Text style={{ alignSelf: 'flex-start',fontWeight: 'bold', }}>
              {this.props.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CreateTextInput
                height={height / 12}
                value={this.state.value}
                onChange={this.textChanged}
                placeholder={"enter new status"}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                width: '50%',
                justifyContent: 'space-between',
                marginTop: height / 30,
              }}
            >
              <TouchableWithoutFeedback style={{ height: height / 20 }}>
                <Text onPress={this.cancel}>cancel</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback style={{ height: height / 20 }}>
                <Text onPress={this.save}>save</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        ) : null}
      </Modal>
    );
  }
}
