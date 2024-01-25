import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ChatUser = ({ id , navigation}) => {
    const [user, dispatch] = useContext(MyUserConText)
    const [userSend, setUserSend] = useState()

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['getUserById'](id))
                setUserSend(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadUser();
    }, []);

    if(!userSend){
        return <></>
    }
    return (
        <View style={styles.viewChatBox}>
            <TouchableOpacity style={styles.touChatBox}
                onPress={() => navigation.navigate("chat", { id: id })}
            >
                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${userSend.avatar}` }} style={styles.avatar} />
                <Text style={styles.chat_name}> {userSend.first_name} {userSend.last_name}</Text>
            </TouchableOpacity>
        </View>
    )
};
export default ChatUser;
const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    viewChatBox: {
        margin: 5,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
        padding: 5,
    },
    touChatBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    chat_name: {
        fontSize: 17,
        fontWeight: "600",
    },

});