import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    swipeout: {
        backgroundColor: '#dbddde',
        overflow: 'hidden',
    },
    swipeoutBtnTouchable: {
        flex: 1,
    },
    swipeoutBtn: {
        alignItems: 'center',
        backgroundColor: '#b6bec0',
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        width:"100%"
    },
    swipeoutBtnText: {
        color: '#fff',
        textAlign: 'center',
    },
    swipeoutBtns: {
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        width:"100%",
        right: 0,
        top: 0,
    },
    swipeoutContent: {
    },
    colorDelete: {
        backgroundColor: '#fb3d38',
    },
    colorPrimary: {
        backgroundColor: '#006fff'
    },
    colorSecondary: {
        backgroundColor: '#fd9427'
    },
})

export default styles;