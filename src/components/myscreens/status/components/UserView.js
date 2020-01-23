/* eslint-disable */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { 
      props,
    } = this;

    return (
      <View style={styles.userView}>
        <Image
          source={{ uri: props.profile }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={{fontSize: 18,fontWeight: '500',marginLeft: 12,color:props.color}}>{props.name}</Text>
          <Text style={{fontSize: 12,fontWeight: '400',marginTop: 3,marginLeft: 12,color: props.color}}>{props.postDate}</Text>
        </View>
        <TouchableOpacity onPress={props.onClosePress}>
          <Icon
            name="close"
            color={props.color}
            size={25}
            style={{ marginRight: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 55,
    width: '98%',
    alignItems: 'center',
  }
});

export default UserView;
