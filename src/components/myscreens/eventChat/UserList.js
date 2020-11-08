import React from "react"
import BePureComponent from '../../BePureComponent';
import BleashupFlatList from "../../BleashupFlatList";
import ProfileView from "../invitations/components/ProfileView";
import { Text,View } from 'react-native';
import GState from '../../../stores/globalState/index';
import  moment  from 'moment';


export default class UserList extends BePureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return <View>
            <BleashupFlatList
                dataSource={this.props.data}
                numberOfItems={this.props.data.length}
                keyExtractor= {(item,index) => item && item.phone}
                renderPreBatch={20}
                initialRender={20}
                renderItem={(item, index) => <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width:"95%",
                    alignSelf: 'center',
                    margin: 'auto',
                    height: 50,
                    alignItems: 'center',
                }}>
                    <View><ProfileView phone={item && item.phone}>
                    </ProfileView></View>
                    <View><Text style={{
                        ...GState.defaultIconSize,
                        fontSize: 12,
                        fontStyle: 'italic',
                    }}>{moment(item && item.date).calendar()}</Text></View>
                </View>}
            >
            </BleashupFlatList>
        </View>
    }
}