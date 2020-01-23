import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// eslint-disable-next-line react/prefer-stateless-function
class Response extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {onResponse,color} = this.props;

    return (
      <TouchableOpacity onPress={onResponse} style={styles.responseWrapper}>
        <View style={{width: 40,height: 40,borderRadius: 20,justifyContent: 'center',alignItems: 'center',
             borderColor:color,borderWidth: 2}}>
          <Icon name="chevron-up" size={20} color={color} />
        </View>
        <Text style={{ fontSize: 16,fontWeight: '500', color:color,marginTop: 8,}}>REPONDRE</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

  responseWrapper: {
    position: 'absolute',
    bottom: 50,
    width: '98%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Response;
