import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputComment = ({ postID, replyName, id }) => {

    const [comment, setComment] = useState();
    const [idComment, setIDComment] = useState(null);

    useEffect(() => {
        // Update the input field when replyName changes
        if (replyName) {
            setComment(`@${replyName} `);
            setIDComment(id)
            console.log(id)
        }
    }, [id]);
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
        const reply_comment_user = async () => {
            try {
                const formData = new FormData();
                formData.append('content', comment);
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis().post(endpoints['reply_comment'](idComment), formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
                );
                console.log(idComment)
                setComment('');
            }
            catch (ex) {
                console.error(ex);
            }
        }

        if (idComment) {
            reply_comment_user();
        }
        else {
            process();
        }


    };
    const cancel_reply = () => {
        setIDComment(null)
        setComment('');
    }
    return (

        <View style={styles.Input_comment}>
            {idComment ? <View style={styles.view_reply}>
                <Text style={styles.text_reply}>Đang phản hồi {replyName}</Text>
                <TouchableOpacity onPress={cancel_reply}>
                    <Text style={styles.text_reply_cancel}>Hủy</Text>
                </TouchableOpacity>

            </View> : <></>}

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
    Input_comment: {
        backgroundColor: '#eee',
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
    text_reply: {
        marginLeft: 10,
    },
    view_reply: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    text_reply_cancel: {
        fontWeight: 'bold',
        marginLeft: 5,
    }


});