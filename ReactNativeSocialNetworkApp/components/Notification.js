import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Notification = ({ notice, navigation, reload }) => {


    const nav_post = async (id) => {

        try {
            const token = await AsyncStorage.getItem('@Token');
            let res = await AuthApis(token).post(endpoints['set_notice'](notice.id))
        } catch (ex) {
            console.error(ex);
        }
        reload();
        navigation.navigate('Comment', id);
    }
    return (
        <TouchableOpacity style={styles.notificationItem} onPress={() => nav_post(notice.post)}>
            <Image source={{ uri: "https://res.cloudinary.com/dhcvsbuew/image/upload/v1706185339/mxgkfxvcewvtc4qu3wwa.jpg" }} style={styles.avatar} />
            <View style={styles.notificationContent}>
                <Text style={styles.username}>Hoàng Ân</Text>
                <Text>{notice.content}</Text>
                <Text style={styles.timestamp}>{notice.updated_date}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default Notification;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationContent: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
    },
    timestamp: {
        color: 'gray',
        fontSize: 12,
    },


});