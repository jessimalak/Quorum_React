import React from 'react';
import {Modal, Text, View, StyleSheet, TouchableHighlight, Dimensions, StyleProp, ViewStyle} from 'react-native'
import sharedStyles from '../classes/Styles'
import PropTypes from 'prop-types'
import {useTheme} from '@react-navigation/native'

const {height, width} = Dimensions.get('screen')

const style = StyleSheet.create({
    main:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    window:{
        width: width - 10,
        height: height / 2.4,
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        elevation: 10,
        zIndex: 1,
        paddingBottom: 10,
        bottom: 0,
        marginHorizontal: 5
    },
    title:{
        fontSize: 24,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 5,
        width: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        fontFamily: 'Raleway-Regular'
    },
    propsView:{
        width: '100%',
        padding: 10,
        alignItems: 'center'
    }
})

//@ts-ignore
const ModalView = (props)=>{
const {colors} = useTheme();
return(
    <Modal
        animationType='slide'
        transparent={true}
        visible={props.visible}
    >
        {/* <View style={style.main} > */}
            <View style={[style.window, {backgroundColor: colors.background}]}>
                <Text style={[style.title,{ backgroundColor: colors.card, borderBottomColor: colors.border, color: colors.text}]}>
                    {props.title}
                </Text>
                <View style={style.propsView}>
                    {props.children}
                </View>
                
            </View>
            
        {/* </View> */}
    </Modal>
    )
}
ModalView.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.array
}

export default ModalView;

//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'

interface ButtonProps{
    size?: number
    icon: string | null
    type: 'primary' | 'secundary'
    onPress: Function
    style?: StyleProp<ViewStyle>
    text?: string
}

// //@ts-ignore
// const cancelButton = (props)=>{
//     let size:Number;
//     let icon:String;
//     if(props.size == null){
//         size = props.icon ? 20 : 16
//     }else{
//         size = props.size
//     }
//     if(props.name == null){
//         icon = "close"
//     }else{
//         icon = props.name
//     }
//     const {colors} = useTheme();
//     return(
//     <TouchableHighlight onPress={props.onPress} style={[sharedStyles.modalButton, props.style, {backgroundColor: colors.notification}]} underlayColor={colors.primary}>
//             {props.icon ? <Icon name={icon} size={size} style={{textAlign:'center'}} color={colors.text}/>  : <Text style={{textAlign:'center', color: props.size}}>{props.texto}</Text>}
//     </TouchableHighlight>)
// }

// //@ts-ignore
// const acceptButton = (props)=>{
//     const {colors} = useTheme();
//     let size:Number;
//     let icon:String;
//     if(props.size == null){
//         size = props.icon ? 20 : 16
//     }else{
//         size = props.size
//     }
//     if(props.name == null){
//         icon = "checkmark"
//     }else{
//         icon = props.name
//     }
//     return(<TouchableHighlight onPress={props.onPress} style={[sharedStyles.modalButton, props.style]} underlayColor="#b37feb">
//             {props.icon ? <Icon name={icon} size={size} color={colors.primary} style={{textAlign:'center'}}/> : <Text style={{textAlign:'center', color: colors.card, fontSize: props.size}}>{props.texto}</Text>}
//         </TouchableHighlight>)
// }

//@ts-ignore
 export function Button({type, onPress, icon, text, style, size}:ButtonProps){
    const {colors} = useTheme();
    const size_ = size || 20
    const isPrimary = type == 'primary' 
    return(
        <TouchableHighlight
        onPress={()=>onPress()}
        style={[sharedStyles.modalButton,isPrimary && {backgroundColor: colors.notification}, style]} underlayColor="#b37feb"
        >
            {
            icon ? <Icon name={icon} size={size_} color={isPrimary ? colors.text : colors.primary} style={{textAlign:'center'}}/>
            : <Text style={{textAlign:'center', color: colors.card, fontSize: size_}}>{text}</Text>
            }
        </TouchableHighlight>
    )
}