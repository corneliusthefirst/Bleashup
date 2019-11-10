import React, { Component } from "react";

import { View } from "react-native";
import { Text } from "native-base";
import moment from "moment"
export default class DateView extends Component {
    constructor(props) {
        super(props)
    }
    dateDisplayer(date){
        let statDate = moment(date,"YYYY/MM/DD")
        let end = moment()
        let daysDiff = moment.duration(end.diff(statDate)).asDays()
        switch (Math.floor(daysDiff)){
        case 0 :
            return "Today";
        case 1 :
            return "Yesterday"
        case 2 :
            return "3 Days Ago"
        case 3:
            return "4 Days Ago"
        case 4:
            return "5 Days Ago"
        case 5:
            return "6 Days Ago"
        case 7:
            return "1 Week Ago"
        default :
         return moment(date,"YYYY/MM/DD").format("YYYY/MM/DD")
        } 
    }
    render() {
        return (
            <View style={{ width: 150, height: 30, backgroundColor: "#fff", borderRadius: 10,alignSelf: 'center',borderWidth: 1,borderColor: "#fff",}}>
              <Text style={{fontWeight: 'bold',marginTop: "3%",alignSelf:'center'}}>{this.dateDisplayer(this.props.date)}</Text>
             </View>
        );
    }
}