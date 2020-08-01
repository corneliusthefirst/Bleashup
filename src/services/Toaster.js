import { Platform,ToastAndroid,AlertIOS } from "react-native";
export default function (message) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message.text, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(message.text);
  }
}
