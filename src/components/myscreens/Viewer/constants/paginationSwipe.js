/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {View, Dimensions } from 'react-native';
//import Swiper from 'react-native-swiper';
//import ColorList from '../colorList';
import {Icon,Text} from 'native-base';
import data from './paginationdata';
import GestureRecognizer from 'react-native-swipe-gestures';
import ProfileSimple from '../../currentevents/components/ProfileViewSimple';
import bleashupHeaderStyle from '../../../../services/bleashupHeaderStyle';
import ColorList from '../../../colorList';
import { TouchableOpacity } from 'react-native-gesture-handler';

let { height, width } = Dimensions.get('window');

export default class PaginationView extends Component {
    constructor(props){
      super(props);
      this.state = {
          currentposition:0,
          numberOfItems: Math.round( height / 60),
          currentItems:[],
      };
    }

    init(){
        console.warn(data.length);
        this.setState({currentItems:data.slice(0,this.state.numberOfItems), currentposition: this.state.numberOfItems});
    }
    componentDidMount(){
        this.init();
    }

    config = {
        velocityThreshold: 0.1,
        directionalOffsetThreshold: 20,
      };

    onSwipeDown = () => {
        //console.warn("swiped down");
        if (this.state.currentposition === 0 ){

        }
        else if (this.state.currentposition - this.state.numberOfItems > 0) {
            this.setState({
                currentItems:data.slice(this.state.currentposition - this.state.numberOfItems,this.state.currentposition),
                currentposition: this.state.currentposition - this.state.numberOfItems,
            });
         }
         else {
             this.setState({
                 currentItems:data.slice(0,this.state.numberOfItems),
                 currentposition: this.state.numberOfItems,
                });
         }
      };

    onSwipeUp = () => {
        //console.warn("swiped up");
        if (this.state.currentposition === data.length){

        }
        else if (this.state.currentposition + this.state.numberOfItems < data.length) {
           this.setState({
               currentItems:data.slice(this.state.currentposition,this.state.currentposition + this.state.numberOfItems),
               currentposition: this.state.currentposition + this.state.numberOfItems,
            });

        }
        else {
            this.setState({
                currentItems:data.slice(this.state.currentposition,data.length),
                currentposition:data.length,
            });
        }
      };


  render() {
    return (
        <View style={{height:this.props.height ? this.props.height : height,
            backgroundColor:'white',justifyContent: 'center',alignItems: 'center'}}>
         <View style={{ height:ColorList.headerHeight,width:'100%',marginBottom:5}}>
           <View style={{
                height:50,
                width:'100%',
                justifyContent:'center',
                //backgroundColor:'red',
              }}>
                 <View style={{flex:1,flexDirection:"row",width:'50%',marginLeft:width / 25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon }} onPress={() => this.props.navigation.goBack()} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginLeft:10}}>Pagination List</Text>
                 <TouchableOpacity onPress={() => {
                   this.onSwipeUp()
                 }} ><Text>Next</Text></TouchableOpacity>
                 </View>
          </View>
        </View>

        <GestureRecognizer
          onSwipeDown={() => {
            //console.warn('want to go down');
            this.onSwipeDown();
        }}
          onSwipeUp={() => {
             // console.warn('want to go up');
              this.onSwipeUp();
            }}
          config={this.config}
          style={{
            flex:1,
            alignItems: 'center',
            justifyContent:'center',
            flexDirection:'column',
            paddingHorizontal:20,
          }}
         >
             <View style={{height:'100%',width:'100%'}}>
             {this.state.currentItems.map((item, index) => {

                return (
                 item.type === 'image' ? <ProfileSimple profile={{profile:item.url,nickname:item.creator.name}}/> : <ProfileSimple  profile={{profile:item.creator.profile,nickname:item.creator.name}}/>
                );
               })
             }
             </View>


         </GestureRecognizer>

       </View>
    );
   }
}

/**       <Swiper
          ref={(ref) => (this.swiper = ref)}
          showsPagination={false}
          loop={true}
          showsButtons={true}
          nextButton={<Text style={{color:ColorList.bodyIcon,fontSize:40}}>›</Text>}
          prevButton={<Text style={{color:ColorList.bodyIcon,fontSize:40}}>‹</Text>}
         >
          {this.props.swipeArray.map((item, index) => {

            return (
              <View style={{height:this.props.height ? this.props.height : height,
               backgroundColor:this.props.backgroundColor ? this.props.backgroundColor : 'black',justifyContent: 'center',alignItems: 'center'}}>
                   {item}
              </View>
            );
           })
          }
        </Swiper> */
