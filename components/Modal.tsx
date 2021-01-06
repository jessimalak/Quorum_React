import React from 'react';
import {Modal, Text, View, StyleSheet, TouchableHighlight} from 'react-native'
import sharedStyles from '../classes/Styles'
import PropTypes from 'prop-types'
import {useTheme} from '@react-navigation/native'

const style = StyleSheet.create({
    main:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    window:{
        width: '80%',
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        elevation: 10,
        zIndex: 1,
        paddingBottom: 10,
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingBottom: 5,
        width: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        color: "#fff"
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
        <View style={style.main} >
            <View style={[style.window, {backgroundColor: colors.text}]}>
                <Text style={[style.title,{ backgroundColor: colors.card, borderBottomColor: colors.border}]}>
                    {props.title}
                </Text>
                <View style={style.propsView}>
                    {props.children}
                </View>
                
            </View>
            
        </View>
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from 'react-native/Libraries/NewAppScreen';

//@ts-ignore
const cancelButton = (props)=>{
    let size:Number;
    let icon:String;
    if(props.size == null){
        size = size = props.icon ? 20 : 16
    }else{
        size = props.size
    }
    if(props.name == null){
        icon = "close"
    }else{
        icon = props.name
    }
    const {colors} = useTheme();
    return(
    <TouchableHighlight onPress={props.onPress} style={[sharedStyles.modalButton, props.style, {backgroundColor: colors.notification, marginLeft: 10}]} underlayColor={colors.primary}>
            {props.icon ? <Icon name={icon} size={size} style={{textAlign:'center'}} color="#FfF"/>  : <Text style={{textAlign:'center', color: props.size}}>{props.texto}</Text>}
    </TouchableHighlight>)
}

//@ts-ignore
const acceptButton = (props)=>{
    const {colors} = useTheme();
    let size:Number;
    let icon:String;
    if(props.size == null){
        size = props.icon ? 20 : 16
    }else{
        size = props.size
    }
    if(props.name == null){
        icon = "check"
    }else{
        icon = props.name
    }
    return(<TouchableHighlight onPress={props.onPress} style={[sharedStyles.modalButton, props.style]} underlayColor="#b37feb">
            {props.icon ? <Icon name={icon} size={size} color={colors.card} style={{textAlign:'center'}}/> : <Text style={{textAlign:'center', color: colors.card, fontSize: props.size}}>{props.texto}</Text>}
        </TouchableHighlight>)
}

//@ts-ignore
 export const Button = (props)=>{
    if(props.isCancel){
        return cancelButton(props)
    }else{
       return acceptButton(props)
    }
}

Button.propTypes = {
    texto: PropTypes.string,
    isCancel: PropTypes.bool.isRequired,
    icon: PropTypes.bool.isRequired,
    name: PropTypes.string,
    size: PropTypes.number,
    onPress: PropTypes.func,
    style: PropTypes.object
}
