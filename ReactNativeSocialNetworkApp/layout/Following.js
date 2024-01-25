
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Follow from '../components/follow';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthApis, endpoints } from '../configs/Apis';

const Following = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [follower, setFollower] = useState([]);
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
                console.log(res.data)
                setFollower(res.data)
            } catch (ex) {
                console.error(ex);
            }

        }
        loadFollower();
    }, [])



    return (
        <View>
            <ScrollView>
                {
                    follower.map(c => (
                        <View style={styles.container} key={c.id}>
                            <Follow userFollow={c.follow_with_user}
                                option={false} />
                        </View>
                    ))
                }

            </ScrollView>
        </View>

    );
};
export default Following;

const styles = StyleSheet.create({


});