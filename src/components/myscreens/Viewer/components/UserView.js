/* eslint-disable */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderDate from './RenderDate';

class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      props,
    } = this;

    return (
      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        top: props.swiper ? 15 : 55,
        width: '98%',
        alignItems: 'center',
      }}>
        <Image
          source={{ uri: props.profile }}
          style={styles.image}
        />
        <View style={{ flex: 1 ,paddingRight:10}}>
          { props.activityname?
            <Text style={styles.name} ellipsizeMode='tail'  numberOfLines={2} >{props.name+" @"+props.activityname}</Text>
            :<Text style={styles.name} >{props.name}</Text>}
         
         {props.swiper?<RenderDate style={styles.time} date={this.props.updated_at} />
         :<Text style={styles.time}>{"Posted "+props.updated_at}</Text>}
        </View>
        <TouchableOpacity onPress={props.onClosePress}>
          <Icon
            name="close"
            color="white"
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
  name: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white',
    
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: 'white',
  },
});

export default UserView;
