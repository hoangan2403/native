import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputComment = ({ postID }) => {

    const [comment, setComment] = useState();


    const addComment = () => {
        const process = async () => {
            try {
                const formData = new FormData();
                formData.append('content', comment);
                const token = await AsyncStorage.getItem('@Token');
                console.log(token)
                console.log(endpoints['add_comment'](postID))
                let res = await AuthApis().post(endpoints['add_comment'](postID), formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
                );
                setComment('');
            }
            catch (ex) {
                console.error(ex);
            }
        }
        process();

    };
    return (

        <View style={styles.searchBar}>
            <TextInput
                style={styles.searchInput}
                placeholder="Trả lời..."
                placeholderTextColor="#888"
                value={comment}
                onChangeText={(comment) => setComment(comment)}
            />
            <TouchableOpacity onPress={addComment}>
                <Icon name="send" size={28} color="#4056A1" />
            </TouchableOpacity>
        </View>
    )
};
export default InputComment;
const styles = StyleSheet.create({

    searchBar: {
        padding: 10,
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row', // Hiển thị các thành phần con nằm ngang
        alignItems: 'center', // Canh giữa theo chiều dọc
    },
    searchInput: {
        backgroundColor: '#fff',
        borderColor: "#C5CBE3",
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 15,
        marginRight: 10,
        width: '85%'
    },
    commentIcon: {
        width: 28,
        height: 28,
        tintColor: '#4056A1',
    },


});