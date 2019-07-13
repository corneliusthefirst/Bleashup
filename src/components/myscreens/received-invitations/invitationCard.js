import React, {Component} from 'react';
import {Platform, StyleSheet,Image,TextInput,FlatList,TouchableOpacity, ActivityIndicator, View,Alert,TouchableHighlight} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Thumbnail,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,CheckBox,List,Accordion,DeckSwiper
} from "native-base";

import Swipeout from 'react-native-swipeout';
import Modal from  'react-native-modalbox';
import imageCacheHoc from 'react-native-image-cache-hoc';
import styles from './style';
import Exstyles from './style';
import svg from '../../../../svg/svg';
import SvgUri from 'react-native-svg-uri';
import { createOpenLink } from "react-native-open-maps";


const defaultPlaceholderObject = {
  component: ActivityIndicator,
  props: {
    style: styles.activityIndicatorStyle
  }
};

// We will use this placeholder object to override the default placeholder.
const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.image,
   // source: {require('../../../../Images/avatar.svg')}
  }
};
 
const CacheableImage = imageCacheHoc(Thumbnail, {
  defaultPlaceholder: defaultPlaceholderObject
});





//Private class component for a flatLisItem
class CardListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
           //this shall be used on choosing a key to delete
           activeRowKey: null,
           isOpen:false,
           isOpenStatus:false,
           enlargeEventImage:false,
           descriptionEnd:false,
           highlightEnd:false
           
       };
    }



//Maps schedule
  Query = { query: this.props.item.location };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });



 
    _renderHeader(item, expanded) {
      return (
        <View style={{
          flexDirection: "row",
          padding: 5,
          justifyContent: "space-between",
          alignItems: "center" ,
          backgroundColor: "#FEFFDE" }}  >
        <Text style={{ fontWeight: "400", fontStyle: "italic" }} note>
            {" "}{item.title}
          </Text>
          {expanded
            ? <Icon style={{ fontSize: 18 }} name="arrow-up" />
            : <Icon style={{ fontSize: 18 }} name="arrow-down" />}
            
        </View>
      );
    }
    _renderContent(item) {
      return (
        <Text
          style={{
            backgroundColor: "#FEFFDE",
            paddingTop: -30,
            paddingLeft:10,
            paddingBottom:10,
            fontStyle: "italic",
          }}
          note
        >
          {item.content}
        </Text>
      );
    }




Desc(item){
       

  if(item.image){
      //creating the highlights starting and ending data

         const highlightData = item.description
         max_length = highlightData.length
         highlightStartData = highlightData.slice(0,62)
         highlightEndData = highlightData.slice(62,max_length) 

    return(
      

               <Card style={{ elevation: 3,marginTop:95 }}>
                <CardItem style={{height:40,marginBottom:-10}} >
                 
                      <Text style={{fontSize:19}}>{item.title}</Text> 
                </CardItem>
                <CardItem style={{height:16,marginLeft:25,marginTop:5}}>
                      <Text note>highlight:</Text>    
                </CardItem>
                <CardItem cardBody>
                  <Icon name="caretleft" type="AntDesign" style={{}} onPress={() => this._deckSwiper._root.swipeLeft()} />

                  <Image style={{ height: 150,marginTop:5, flex: 1 }} source={{uri:item.image}} />

                  <Icon name="caretright" type="AntDesign" onPress={() => this._deckSwiper._root.swipeRight()}/>

                </CardItem>

                <CardItem style={{}}>
                
                    <Text style={{ padding:10}} >
                      {<Text style={{marginBottom:7}} note>Description:                                                     </Text>}
                      {highlightStartData}...
                      {<Text style={{color:"blue"}} onPress={()=>this.setState({ highlightEnd:true })}> view all</Text>}
                    </Text>

                </CardItem>


           <Modal
           isOpen={this.state.highlightEnd}
           onClosed={() => this.setState({ highlightEnd: false })}
           style={{ padding:20,alignItems: 'center',height: 220,flex:1,borderRadius:15,backgroundColor:'#FEFFDE',width:330}}
           position={'center'}
           >

            <Text style={{}}>{highlightEndData}</Text>

           </Modal>

         </Card>)

  }else {
         return(
           <Card style={{ elevation: 3,marginTop:95 }}>
                <CardItem style={{height:40}}>
                 
                      <Text note>{item.event_title}</Text>               
                
                </CardItem>
                <CardItem cardBody>
                  <Icon name="caretleft" type="AntDesign" style={{}} onPress={() => this._deckSwiper._root.swipeLeft()} />
                 
                     <Text style={{ height: 230, flex: 1 }} >
                      {<Text style={{marginBottom:7}} note>Description:                                                     </Text>}
                      {item.event_description}...
                      {<Text style={{color:"blue"}} onPress={()=>this.setState({ descriptionEnd:true })}> view all</Text>}
                      </Text>
                      
              

                  <Icon name="caretright" type="AntDesign" onPress={() => this._deckSwiper._root.swipeRight()}/>

                </CardItem>

           <Modal
           isOpen={this.state.descriptionEnd}
           onClosed={() => this.setState({ descriptionEnd: false })}
           style={{ padding:20,alignItems: 'center',height: 220,flex:1,borderRadius:15,backgroundColor:'#FEFFDE',width:330}}
           position={'center'}
           >

               <Text style={{}}>{descriptionEndData}</Text>

           </Modal>

  
          </Card> )

  }

}















    render(){
   
        const AccordData = this.props.item.sender_status
        max_length = this.props.item.sender_status.length
        let dataArray = [{title:AccordData.slice(0,35),content:AccordData.slice(35,max_length)}] 
        
        //deck swiper object
        const cards = [];
        item = this.props.item
         //creating the event description starting and ending data
         const descriptionData = item.event_description
         max_length1 = item.event_description.length
         descriptionStartData = descriptionData.slice(0,300)
         descriptionEndData = descriptionData.slice(300,max_length1)
                 

         Description = {event_title:item.event_title,event_description:descriptionStartData}
         cards.push(Description)


        for(i=0;i<item.highlight.length;i++){
           cards.push(item.highlight[i])
        }

       //console.warn(cards)


 
        const swipeSettings = {
            autoClose:true,
            //take this and do something onClose
            onClose: (secId,rowId,direction) => {
                if(this.state.activeRowKey != null){
                    this.setState({activeRowKey: null});
                }

            }, 
            //on open i set the activerowkey
            onOpen: (secId,rowId,direction) =>{
                this.setState({ activeRowKey: this.props.item.key});
            },

            right: [
                
                {
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;

                       Alert.alert(
                           'Alert',
                           'Are you sure you want to delete ?',
                           [
                               {text:'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},

                               {text:'Yes', onPress: () => {
                                 cardListData.splice(this.props.index, 1);
                                 //make request to delete to database(back-end)
                                    /**

                                    */
                                 //Refresh FlatList
                                 this.props.parentCardList.refreshCardList(deletingRow);
                               }},
                           ],
                            {cancelable: true}
                       );

                    },
                    text:'Delete',type:'delete'
                    
                }
            ],

            rowId: this.props.index,
            sectionId: 1
        }

   

        return(
            <Swipeout {...swipeSettings}>

            
          <Card style={{height:this.state.isOpen||this.state.isOpenStatus||this.state.enlargeEventImage?530:150}}>
            <CardItem>
              <Left>
              <TouchableHighlight onPress={()=>this.setState({ isOpenStatus: true })} >
              <CacheableImage  source={{uri: this.props.item.sender_Image}} 
                 />
              </TouchableHighlight>
               
              
                <Body >
                  <Text style={styles.flatlistItem} >{this.props.item.sender_name}</Text>    
                   
                {dataArray.content == "" ? <Text style={{ color:'dimgray',padding:10,fontSize:16,marginTop:-10,borderWidth:0}} note>{this.props.item.sender_status}</Text>:
              
                  <Accordion
                  dataArray={dataArray}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  style={{borderWidth: 0}}
                />
             
                }

                </Body>
              </Left>
            </CardItem>

            <CardItem cardBody>
            <Left> 

            <CacheableImage  source={{uri: this.props.item.receiver_Image}} />
            
            <TouchableHighlight onPress={()=>this.setState({ enlargeEventImage: true })} >
            <CacheableImage  source={{uri: this.props.item.event_Image}} style={{marginLeft:-30 }}/>
            </TouchableHighlight>

            </Left>
            
            <Body >
              
                  <Text style={{marginLeft:-40}} onPress={()=>this.setState({ isOpen: true })} >{this.props.item.event_title}</Text>

                  <Text style={{marginLeft:-40,color:'dimgray',fontSize:12}} onPress={()=>this.setState({ isOpen: true })}> on the {this.props.item.created_date} at {this.props.item.event_time}</Text>
          
              
           </Body>

              
            </CardItem>
       
            <CardItem style={{marginTop:10}}>
              <Right>
                <Text style={{marginRight:-60,color:'dimgray',marginBottom:-10,fontSize:13}}>{this.props.item.received_date}</Text>

                <Text style={{marginRight:220,marginTop:-10,color:'dimgray',fontSize:13}}>{this.props.item.invitation_status}</Text>
              </Right>
            </CardItem>
          


           <Modal
           isOpen={this.state.isOpen}
           onClosed={() => this.setState({ isOpen: false })}
           style={{ justifyContent: 'center',alignItems: 'center',height: 510,borderRadius:10,backgroundColor:'#FEFFDE',width:350}}
           //backdrop={false}
           position={'center'}
           >

       


          <View  style={{width:330,height:280,marginTop:-245}}>
          <DeckSwiper
            ref={(c) => this._deckSwiper = c}
            dataSource={cards}
            renderEmpty={() =>
              <View style={{ alignSelf: "center"}}>
                <Text>Over</Text>
              </View>
            }
            renderItem={item => this.Desc(item)}

             
      />

      </View>


      
 
          <View style={{height:"20%"}}>
         

            <View style={{marginLeft:160,marginTop:"30%"}}>
              <TouchableOpacity>
                <Text ellipsizeMode="clip" numberOfLines={3} style={{fontSize:14,color:"#1FABAB"}}>
                  {this.props.item.location}
                </Text>
              </TouchableOpacity>
              <TouchableHighlight onPress={this.OpenLinkZoom}>
                <Image
                  source={require("../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                  style={{
                    height: 100,
                    width: "70%",
                    borderRadius: 15,
                    marginTop:-10
                  }}
                  resizeMode="contain"
                  onLoad={() => {}}
                />
              </TouchableHighlight>

                <TouchableOpacity onPress={this.OpenLink} style={{marginTop:-20}}>
                  <Text note> View On Map </Text>
                </TouchableOpacity>
           
             </View> 
              
             <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop:35
                }}
              >

              <Text  style={{marginLeft:7}}note>
                  {this.props.item.created_date}
                </Text>

               <Text  style={{marginLeft:"-30%",fontStyle:"italic"}} note>
                  Organised by {this.props.item.event_organiser_name}
                </Text>
              </View>


        </View>



 </Modal>




           <Modal
           isOpen={this.state.isOpenStatus}
           onClosed={() => this.setState({ isOpenStatus: false })}
           style={{ justifyContent: 'center',alignItems: 'center',height: 380,borderRadius:15,backgroundColor:'#FEFFDE',width:330}}
           position={'center'}
           >
      
      <Text style={{fontSize:18,fontWeight:'600',marginLeft:-220}}>{this.props.item.sender_name}</Text>
    
      <TouchableHighlight onPress={()=>this.setState({ isOpenStatus: false })} >
      <CacheableImage  source={{uri: this.props.item.sender_Image}} square style={{marginTop:20,width:300,height:200}} />
      </TouchableHighlight>

     <Text  style={{fontSize:18,fontWeight:'500',marginLeft:-245,marginTop:10}}>Status:</Text>

     {this.props.item.sender_status.length > 35 ?     <Text  style={{fontSize:17,fontWeight:'600',marginLeft:14,marginTop:10}} note>{this.props.item.sender_status}</Text>:<Text  style={{fontSize:17,fontWeight:'600',marginLeft:-104,marginTop:10}} note>{this.props.item.sender_status}</Text>}
  
      </Modal>



           <Modal
           isOpen={this.state.enlargeEventImage}
           onClosed={() => this.setState({ enlargeEventImage: false })}
           style={{ justifyContent: 'center',alignItems: 'center',height: 380,borderRadius:15,backgroundColor:'#FEFFDE',width:330}}
           position={'center'}
           >
           <TouchableHighlight onPress={()=>this.setState({ enlargeEventImage: false })} >
           <CacheableImage  source={{uri: this.props.item.event_Image}} square style={{width:310,height:360,padding:10,}} />          
           </TouchableHighlight>


           </Modal>


          </Card>
           </Swipeout>

            
           
        );
    }
}




export default  CardListItem 













/*
import RemindListItem from "./RemindsCard";

<Content>
<Card>

  <CardItem header>
  <Left>
      <CacheableImage  source={{uri: this.props.item.sender_Image}} />
      <Body>
        <Text>{this.props.item.sender_name}</Text>
        <Text note>{this.props.item.sender_status}</Text>
      </Body>
    </Left>
  </CardItem>

  <CardItem>
    <Body>
    <CacheableImage  source={{uri: this.props.item.sender_Image}} style={{height: 200, width: null, flex: 1}}/>
    </Body>
  </CardItem>

  <CardItem footer>
    <Text>GeekyAnts</Text>
  </CardItem>

</Card>
</Content>*/

 /* <Thumbnail source={{uri: this.props.item.sender_Image}} 
     />




          {this.props.item.reminds.length == 0 ? <Text style={{marginTop:120,marginLeft:15,width:"50%",height:70,flexDirection: "column"}}></Text> : 
         <TouchableHighlight>
          <Button style={{marginTop:120,marginLeft:15,width:"37%",height:70,flexDirection: "column"}}
            onPress={() => this.setState({ remindsModal: true })}> 
              <Text> Scheduled</Text>
              <Text> Reminds</Text>
          </Button>  
          </TouchableHighlight> 
        }
          
         <Modal
           isOpen={this.state.remindsModal}
           onClosed={() => this.setState({ remindsModal: false })}
           style={{ justifyContent: 'center',alignItems: 'center',height:280,borderRadius:15,backgroundColor:'#FEFFDE',width:260}}
           position={'center'}
           >

            <FlatList 
    
             ref={"remindlist"}
             listKey={'Reminds'}
             data={this.props.item.reminds}
             renderItem={( {item,index} )=> {
           
              return(
              
               <RemindListItem  item={item} index={index} >
               </RemindListItem>

                 );


             }}
             >
                
             </FlatList>
     

          </Modal>
        */