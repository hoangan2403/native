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
        if (!notice.follow) {
            navigation.navigate('Comment', id);
        }

    }
    // const follow = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('@Token');
    //         let res = await AuthApis(token).post(endpoints['follow'](notice.follow.follower.id))
    //         reloadPost();

    //     } catch (ex) {
    //         console.error(ex);
    //     }
    // }
    return (

        <TouchableOpacity style={styles.notificationItem} onPress={() => nav_post(notice.post)}>
            <Image source={{ uri: "https://res.cloudinary.com/dhcvsbuew/image/upload/v1706185339/mxgkfxvcewvtc4qu3wwa.jpg" }} style={styles.avatar} />
            <View style={styles.notificationContent}>
                <Text style={styles.username}>Hoàng Ân</Text>
                <Text>{notice.content}</Text>
                <Text style={styles.timestamp}>{notice.updated_date}</Text>
            </View >
            {/* {notice.follow ? <View style={styles.refollow}>
                <TouchableOpacity onPress={() => follow()}>
                    <Text style={styles.refollow_text}>Follow lại</Text>
                </TouchableOpacity>
            </View> : <></>} */}

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

    refollow: {
        position: 'absolute',
        right: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        width: 85,
        alignItems: 'center',
    },
    refollow_text: {
        fontWeight: '600',
    }
});