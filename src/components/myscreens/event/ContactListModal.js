import React, { PureComponent } from 'react';
import ModalBox from 'react-native-modalbox';
import { Container, Spinner } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import ProfileView from '../invitations/components/ProfileView';
import { TouchableOpacity, View } from 'react-native';



export default class ContactListModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            contacts: []
        }
    }
    state = {

    }
    componentDidMount() {
        setTimeout(() => {

        }, 20)
    }
    _keyExtractor(item) {
        return item.phone
    }
    render() {
        return (
            <ModalBox
                // backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={0.7}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        contacts: [],
                        loaded: false,
                        //event_id: null,
                        //hideTitle: false
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            contacts: this.props.contacts,
                            //event_id: this.props.event_id,
                            loaded: true,
                            //hideTitle: this.props.hideTitle
                        })
                    }, 20)
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                {!this.state.loaded ? <Spinner size={"small"}></Spinner> : <Container style={{marginTop:"7%"}}>
                    <BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={5}
                        initialRender={10}
                        numberOfItems={this.state.contacts.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.contacts}
                        renderItem={(item, index) =>
                            <TouchableOpacity key={index.toString()} opPress={() => {
                                console.warn("pressed")
                            }}><View style={{ display: 'flex', flexDirection: 'row', }}>
                                    <View style={{ margin: '2%', }}><TouchableOpacity ><ProfileView phone={item}></ProfileView>
                                    </TouchableOpacity></View>
                                </View></TouchableOpacity>

                        }
                    >
                    </BleashupFlatList>
                </Container>}
            </ModalBox>
        )
    };
}