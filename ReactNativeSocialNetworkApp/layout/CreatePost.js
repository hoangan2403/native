import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Button, PermissionsAndroid, ScrollView, Alert } from 'react-native';

import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';


const createPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [content, setContent] = useState('');
    const [avatar, setAvatar] = useState([]);
    const [hashtag, setHashtag] = useState('');

    const pickImage = async () => {

        try {
            const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
                if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsMultipleSelection: true,
                        quality: 1,
                    });

                    if (!result.canceled) {
                        result.assets.forEach(image => {
                            setAvatar(prevAvatar => [...prevAvatar, image.uri]);
                        });
                    }
                }

            }
            else {
                console.log("No")
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleAddHashtag = (formData) => {

        const cleanedHashtag = hashtag.replace(/\s+/g, '');

        // Tách thành phần sau mỗi dấu #
        const hashtags = cleanedHashtag.split('#').filter(Boolean);

        // Thêm từng hashtag vào formData
        hashtags.forEach((hashtagValue) => {
            formData.append('name_hashtag', hashtagValue);
        });

        // Xóa nội dung trong TextInput
        setHashtag('');
    };
    //kiểm tra định dạng của hashtag
    const validateHashtag = (text) => {
        // Định nghĩa biểu thức chính quy cho hashtag
        const hashtagRegex = /^#[a-zA-Z0-9]+(\s#[a-zA-Z0-9]+)*$/;

        // Kiểm tra xem chuỗi nhập vào có khớp với biểu thức không
        return hashtagRegex.test(text.trim());
    };

    const postContent = () => {
        const createPost = async () => {
            try {
                const formData = new FormData();
                formData.append('content', content);
                formData.append('user', "2");
                handleAddHashtag(formData);
                if (avatar.length > 1) {
                    avatar.forEach((ava) => {
                        const uriParts = ava.split('.');
                        const fileType = uriParts[uriParts.length - 1];
                        const fileName = `ava.${fileType}`;
                        formData.append('image', {
                            uri: ava,
                            name: fileName,
                            type: `image/${fileType}`,
                        });
                    });
                }
                const token = await AsyncStorage.getItem('@Token');
                console.log(formData)
                let res = await AuthApis().post(endpoints['add_post'], formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                })
                Alert.alert('Thành công', 'Đã đăng bài....');
                navigation.navigate('Home')
            } catch (ex) {
                console.error(ex);
            }
        }
        if (validateHashtag(hashtag)) {

            createPost();
        }
        else {
            Alert.alert('Sai rồi', 'Hashtag chưa đúng định dạng')
        }

    };
    return (

        <View style={styles.container}>
            <TouchableOpacity onPress={postContent} style={styles.view_button_post}>
                <Text style={styles.buton_post} >Post</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="Bạn đang nghĩ gì...."
                value={content}
                onChangeText={(text) => setContent(text)}
                multiline
                style={styles.content_post}
            />
            <TextInput
                placeholder="Enter hashtag"
                value={hashtag}
                onChangeText={(text) => setHashtag(text)}
                style={styles.content_hashtag}
            />
            <Text style={styles.label_text}>Ảnh</Text>
            <View style={styles.add_avt}>
                {avatar.length > 0 ? <ScrollView horizontal onPress={pickImage} style={styles.scroll_view_image}>
                    {avatar.map((image, index) => (
                        <TouchableOpacity key={index}>
                            <Image
                                source={{ uri: image }}
                                style={styles.postImage}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                    :
                    <TouchableOpacity onPress={pickImage} style={styles.view_image}>
                        <Text style={styles.add_image_post}>Thêm ảnh</Text>
                    </TouchableOpacity>}
            </View>

            <Header navigation={navigation} />
        </View>
    );
};
export default createPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    add_avt: {
        alignItems: 'center',
    },
    btn_avt: {
        backgroundColor: "#4056A1",
    },
    content_post: {
        width: '90%',
        height: 200,
        borderColor: "#C5CBE3",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        textAlignVertical: 'top',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    content_hashtag: {
        width: '90%',
        height: 60,
        borderColor: "#C5CBE3",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        textAlignVertical: 'top',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    buton_post: {
        backgroundColor: '#4056A1',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 100,
        color: "#EFE2BA",
        textAlign: 'center',

    },
    view_button_post: {
        alignItems: 'flex-end',
        margin: 15,
    },

    image_post: {
        width: 300,
        height: 300,
    },
    view_image: {
        height: 320,
        width: 375,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderColor: "#C5CBE3",
        borderWidth: 1,
    },
    scroll_view_image: {
        borderWidth: 1,
        margin: 10,
    },
    label_text: {
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 20,
        color: '#4056A1'
    },
    add_image_post: {
        fontWeight: '600',
        color: '#4056A1',
        textDecorationLine: 'underline',
    },
    postImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
});
