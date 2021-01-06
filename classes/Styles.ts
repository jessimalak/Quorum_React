import {StyleSheet} from 'react-native'

const sharedStyles = StyleSheet.create({
    button_mini: {
        flexDirection: "row",
        marginHorizontal: 5,
        backgroundColor: "#b37feb",
        borderRadius: 5,
        padding: 7,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    linearGradient: {
        width: '100%',
        height: '100%',
      },
      card: {
        padding: 15,
        margin: 10,
        borderRadius: 10,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 6,
        width: '95%'
    },
    fab:{
        borderRadius: 32/2,
        height:32,
        width:32,
        padding:0,
        margin:0
    },
    modalButton:{
        paddingVertical:2,
        paddingHorizontal:15,
        borderRadius:4,
        height: 35,
        justifyContent: 'center',
        flex:1
    },
    modalInput:{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        marginBottom: 20,
        marginHorizontal: 20,
        color: '#111',
        paddingBottom: 1
    }
})

export default sharedStyles
