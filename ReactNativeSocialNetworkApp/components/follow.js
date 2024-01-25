import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Follow = ({ userFollow, option }) => {
    const [user, dispatch] = useContext(MyUserConText)
    const [follower, setFollower] = useState(false);
    useEffect(() => {
        const loadFollower = async () => {
            try {

                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['getFollowing'], {
                    params: {
                        user_id: user.id,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                res.data.map(c => {
                    if (c.follow_with_user.id === userFollow.id) {
                        setFollower(true);
                    }
                })
            } catch (ex) {
                console.error(ex);
            }

        }
        loadFollower();
    }, []);
    const follow_user = async (id) => {
        try {
            const token = await AsyncStorage.getItem('@Token');
            let res = await AuthApis(token).post(endpoints['follow'](id))
            setFollower(!follower)
        } catch (ex) {
            console.error(ex);
        }
    }
    return (
        <View style={styles.follow_container}>

            <View style={[styles.notificationItem]}>
                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${userFollow.avatar}` }} style={styles.avatar} />
                <View style={styles.notificationContent}>
                    <Text style={styles.username}>{userFollow.first_name} {userFollow.last_name}</Text>
                    <Text>@{userFollow.username}</Text>
                </View>
                <View style={styles.refollow}>
                    <TouchableOpacity onPress={() => follow_user(userFollow.id)}>
                        {option ? <Text style={styles.refollow_text} >
                            {follower ? "Bạn bè" : "Follow lại"}
                        </Text> : <Text style={styles.refollow_text} >
                            {follower ? "Bạn bè" : "Bỏ follow"}
                        </Text>}

                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
};
export default Follow;
const styles = StyleSheet.create({

    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginLeft: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationContent: {

    },
    username: {
        fontWeight: 'bold',
    },
    refollow: {
        position: 'absolute',
        right: 25,
        padding: 10,
        backgroundColor: '#4056A1',
        borderRadius: 8,
        width: 80,
        alignItems: 'center',
    },
    refollow_text: {
        fontWeight: '600',
    }
});