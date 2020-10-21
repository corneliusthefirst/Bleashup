import React, { Component } from "react";
import BleashupModal from "../../mainComponents/BleashupModal";
import ParticipantList from "../../ParticipantList";
import SelectableContactList from "../../SelectableContactList";
import { View } from 'react-native';
import Texts from '../../../meta/text';

export default class RemindMembers extends BleashupModal {
    onClosedModal(){
        this.setStatePure({
            selectMemberState: false
        })
        this.props.onClosed()
    }
    swipeToClose=false
    modalBody() {
        return (
            <View>
                <ParticipantList
                isSelecting={this.state.selectMemberState}
                close={() => {
                        this.onClosedModal()
                       
                }}
                    addMembers={() => {
                        this.setStatePure({
                            selectMemberState: true,
                            adding: true,
                        });
                    }}
                    removeMember={(selectedPhone) => {
                        this.setStatePure({
                            selectMemberState: true,
                            selectedPhone,
                            adding: false,
                        });
                    }}
                    title={Texts.program_members}
                    participants={this.props.currentMembers}
                    creator={this.props.creator}
                managing></ParticipantList>
                <SelectableContactList
                    firstMember={this.state.selectedPhone}
                    isOpen={this.state.selectMemberState}
                    close={() => {
                        this.setStatePure({
                            selectMemberState: false,
                        });
                    }}
                    members={
                        this.state.adding
                            ? this.props.participants.filter(
                                (ele) =>
                                    ele && this.props.currentMembers.findIndex(
                                        (e) => e.phone === ele.phone
                                    ) < 0
                            )
                            : this.props.currentMembers
                    }
                    notcheckall={!this.state.adding ? true : false}
                    takecheckedResult={(members) =>
                        this.state.adding
                            ? this.props.takecheckedResult([
                                ...members,
                                ...this.props.currentMembers,
                            ])
                            : this.props.takecheckedResult(
                                this.props.currentMembers.filter(
                                    (ele) => ele && members.findIndex((e) => e.phone === ele.phone) < 0
                                )
                            )
                    }
                ></SelectableContactList>
            </View>
        );
    }
}
