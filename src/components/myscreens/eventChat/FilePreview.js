import React, { PureComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import ColorList from "../../colorList";
import { Text, Icon } from "native-base";
import Pickers from "../../../services/Picker";
import shadower from "../../shadower";

export default class FilePreview extends PureComponent {
  constructor(props) {
    super(props);
  }
  openFile() {
    Pickers.openFile(this.props.source);
  }
  componentDidMount() {
    console.warn(this.mbSize);
  }
  mbSize = this.props.size / (1000 * 1000);
  render() {
    return (
      <View
        style={{
          height: 70,
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "space-between",
          backgroundColor: ColorList.buttonerBackground,
          borderTopLeftRadius: 5,
          width: "100%",
          ...shadower(0.5),
          borderTopRightRadius: 5,
          padding: "1%",
        }}
      >
        <View
          style={{
            width: "15%",
            marginTop: "auto",
            marginBottom: "auto",
            justifyContent: "center",
          }}
        >
          <Icon
            name={"profile"}
            type={"AntDesign"}
            style={{
              color: ColorList.bodyBackground,
              fontSize: 30,
            }}
          ></Icon>
        </View>
        <View
          style={{
            marginBottom: "auto",
            width: "60%",
            marginTop: "auto",
          }}
        >
          <Text style={{ color: ColorList.bodyBackground }}>
            {this.props.filename +
              (isNaN(this.mbSize)
                ? ""
                        : " (" + this.mbSize.toFixed(2).toString() + "Mb)")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            requestAnimationFrame(() => {
              this.openFile();
            });
          }}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
          }}
        >
          <Icon
            type="FontAwesome"
            name="folder-open"
            style={{
              color: ColorList.bodyBackground,
              fontSize: 30,
            }}
          ></Icon>
        </TouchableOpacity>
      </View>
    );
  }
}
