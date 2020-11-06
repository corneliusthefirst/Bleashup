import React from "react"
import BleashupModal from '../../mainComponents/BleashupModal';
import { View, TouchableOpacity, Text } from 'react-native';
import GState from "../../../stores/globalState";
import Texts from '../../../meta/text';
import Spinner from "../../Spinner";
import ColorList from "../../colorList";
import rounder from "../../../services/rounder";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import shadower from "../../shadower";
import { calculateAndExportReport } from './exportServices';

export default class ConcludeExportModal extends BleashupModal {
    initialize() {

    }
    position = "top"
    entry = "top"
    modalMinHieight = 80
    modalHeight = 500
    modalWidth = "100%"
    maincontianer = {
        margin: '3%',
    }
    headerCotainer = {
        marginBottom: '5%',
        flexDirection: 'row',
        alignItems: 'center',
    }
    exportAs(type) {
        const doExport = (typer) => {
            calculateAndExportReport(
                this.props.allreport ? null : this.props.donners,
                this.props.allreport ? this.props.intervals : this.props.interval ? [this.props.interval] : null,
                this.props.program_name, this.props.type, this.props.donnersFunc, typer).then((path) => {
                    this.setStatePure({
                        exporting: false
                    })
                    this.onClosedModal()
                })
        }
        switch (type) {
            case 'csv':
                this.setStatePure({
                    exporting: true
                }, () => {
                    doExport(type)
                })
                break;
            case 'xlsx':
                this.setStatePure({
                    exporting: true
                }, () => {
                    doExport(type)
                })

        }
    }
    methods = [
        {
            id: 'csv',
            title: Texts.export_as_csv,
        },
        {
            id: 'xlsx',
            title: Texts.export_as_xls
        }
    ]
    backdropOpacity = .4
    borderTopLeftRadius = 0
    borderTopRightRadius = 0
    onClosedModal() {
        this.props.onClosed()
    }
    exportMethods() {
        return this.methods.map(ele => <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 55, }} key={ele.id}>
            <View style={{ marginRight: 20, }}>
                <FontAwesome5 style={{
                    ...GState.defaultIconSize,
                    color: ColorList.indicatorColor
                }} name={ele.id == 'csv' ? "file-csv" : 'file-excel'} />
            </View><View style={{ flex: 1, }}><Text style={{
                ...GState.defaultTextStyle,
                fontWeight: 'bold',
            }}>{ele.title}</Text></View><View style={{ minWidth: 40, }}>
                <TouchableOpacity onPress={() => this.exportAs(ele.id)} style={{
                    backgroundColor: ColorList.descriptionBody,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    ...shadower(1),
                    padding: 10,
                }}><Text style={{
                    ...GState.defaultTextStyle,
                    fontWeight: '600',
                    color: ColorList.indicatorColor
                }}>{Texts.export_}</Text>
                </TouchableOpacity>
            </View>
        </View>)
    }
    modalBody() {
        console.warn("current type is: ", this.props.type)
        return <View style={this.maincontianer}>
            <View style={this.headerCotainer}><View style={{
                flex: 1,
            }}><Text ellipsizeMode={'tail'} numbrOfLines={1} style={{
                ...GState.defaultTextStyle,
                fontWeight: 'bold',
            }}>{Texts.export_report}</Text>
                <Text ellipsizeMode={'tail'} numbrOfLines={1} style={{
                    ...GState.defaultTextStyle,
                    fontStyle: 'italic',
                    fontSize: 12,
                }}>{Texts.chose_export_method}</Text></View>
                <View style={{ width: 50, alignSelf: 'flex-end', flexDirection: 'row', }}>
                    {this.state.exporting ? <View style={{
                        ...rounder(40, ColorList.indicatorColor),
                        justifyContent: 'center',
                    }}>
                        <Spinner big color={ColorList.bodyBackground}></Spinner>
                    </View> : null}
                </View>
            </View>
            <View>
                {this.exportMethods()}
            </View>
        </View>
    }
}