/* eslint-disable */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderDate from './RenderDate';
import SwipeMenu from '../../../SwiperComponent/swipeMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GState from '../../../../stores/globalState';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {props} = this;

    return (
      !this.props.swiper?
      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        top: props.swiper ? 0 : 55,
        width: '98%',
        padding:10,
        alignItems: 'center',
        backgroundColor: 'rgba(52,52,52,0.1)',
      }}>
        <Image
          source={{ uri: props.profile }}
          style={{ width:props.activityMode?40: 50,height:props.activityMode?40:50,borderRadius: 25,
           marginLeft: 8}}
        />
        <View style={{ flex: 1 ,paddingRight:10}}>
           { props.activityname?
            <Text style={styles.name} ellipsizeMode='tail'  numberOfLines={2} >{props.name+" @"+props.activityname}</Text>
            :<Text style={styles.name} >{props.name}</Text>}
         
         {props.swiper?<RenderDate style={styles.time} date={this.props.updated_at} />
         :<Text style={styles.time}>{"Posted "+props.updated_at}</Text>}
        </View>
        
       {props.activityMode ? null:
        <TouchableOpacity onPress={props.onClosePress}>
        <Ionicons
          name="close"
          color="white"
          size={25}
          style={{...GState.defaultIconSize, marginRight: 8 }}
        />
      </TouchableOpacity>
       }

      </View> 
      :
      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        top: props.swiper ? 0 : 55,
        width: '100%',
        padding:10,
        alignItems: 'center',
        backgroundColor: 'rgba(52,52,52,0.1)',
      }}>
        
        <TouchableOpacity onPress={props.onClose}>
        <MaterialIcons
          name="arrow-back"
          type="MaterialIcons"
          size={30}
          style={{...GState.defaultIconSize, marginRight: 8,color:"white" }}
        />
      </TouchableOpacity>

        <Image
          source={{ uri: props.profile }}
          style={{ width:props.activityMode||this.props.swiper?40: 50,height:props.activityMode||this.props.swiper?40:50,borderRadius: 25,
           marginLeft: 8}}
        />
        <View style={{ flex: 1 ,paddingRight:10}}>
           { props.activityname?
            <Text style={styles.name} ellipsizeMode='tail'  numberOfLines={2} >{props.name+" @"+props.activityname}</Text>
            :<Text style={styles.name} >{props.name}</Text>}
         
         {props.swiper?<RenderDate style={styles.time} date={this.props.updated_at} />
         :<Text style={styles.time}>{"Posted "+props.updated_at}</Text>}
        </View>
          <SwipeMenu forward={this.props.forward} reply={this.props.reply} />
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
