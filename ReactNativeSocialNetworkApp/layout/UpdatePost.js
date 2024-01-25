import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, PermissionsAndroid, ScrollView, Alert } from 'react-native';

import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


const UpdatePost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [avatar, setAvatar] = useState([]);
    const [content, setContent] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [post, setPost] = useState([]);
    const route = useRoute();
    const [hashtagIds, setHashtagIds] = useState([]);
    const postID = route.params;
    const [realoadImg, setReloadImg] = useState(false);

    useEffect(() => {

        const loadPost = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['post'](postID))
                setPost(res.data.images)
                console.log(res.data)
                const hashtagArray = res.data.post_hashtag.map((tag) => `#${tag.name} `);
                const hashtagId = res.data.post_hashtag.map((tag) => tag.id);

                setHashtagIds(hashtagId);

                // Sử dụng join để kết hợp các chuỗi thành một chuỗi duy nhất, ngăn cách bởi dấu '#'
                const combinedHashtags = hashtagArray.join('');
                setHashtag(combinedHashtags);
                setContent(res.data.content);
            } catch (ex) {
                console.error(ex);
            }
        }

        loadPost();
    }, [])
    useEffect(() => {
        setReloadImg(false);
        const loadPost = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['post'](postID))
                setPost(res.data.images)

            } catch (ex) {
                console.error(ex);
            }
        }
        loadPost();
    }, [realoadImg])
    //chọn image từ phone
    const pickImage = async () => {

        try {
            setAvatar([]);
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

    //appent trường hashtag vào form data
    const handleAddHashtag = (formData) => {

        const cleanedHashtag = hashtag.replace(/\s+/g, '');

        // Tách thành phần sau mỗi dấu #
        const hashtags = cleanedHashtag.split('#').filter(Boolean);

        // Thêm từng hashtag vào formData
        hashtags.forEach((hashtagValue) => {
            formData.append('hashtag_name', hashtagValue);
        });

        // Xóa nội dung trong TextInput
        // setHashtag('');
    };

    //kiểm tra định dạng của hashtag
    const validateHashtag = (text) => {
        // Định nghĩa biểu thức chính quy cho hashtag
        const hashtagRegex = /^#[a-zA-Z0-9]+(\s#[a-zA-Z0-9]+)*$/;

        // Kiểm tra xem chuỗi nhập vào có khớp với biểu thức không
        return hashtagRegex.test(text.trim());
    };
    const updateHashTag = async () => {
        try {

            const formData = new FormData();
            hashtagIds.forEach((tag) => {
                formData.append('hashtag_id', tag)
            }
            )
            console.log(formData)
            handleAddHashtag(formData);
            console.log(formData)
            const token = await AsyncStorage.getItem('@Token');
            console.log(endpoints['update_hashtag'](postID))
            let res = await AuthApis(token).put(endpoints['update_hashtag'](postID), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
        } catch (ex) {
            console.error(ex);
        }
    }
    const addImage = async () => {
        try {
            const formData = new FormData();
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
            formData.append('post', postID)
            console.log(endpoints['add_image'])
            const token = await AsyncStorage.getItem('@Token');

            let res = await AuthApis(token).post(endpoints['add_image'], formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
        } catch (ex) {
            console.error(ex);
        }
    }
    const updateContent = async () => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            const token = await AsyncStorage.getItem('@Token');
            console.log(endpoints['update_post'](postID))
            let res = await AuthApis(token).put(endpoints['update_post'](postID), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })


        } catch (ex) {
            console.error(ex);
        }
    }

    const deleteImage = async (id) => {
        try {

            const token = await AsyncStorage.getItem('@Token');
            let res = await AuthApis(token).delete(endpoints['delete_image'](id)
            )
            setReloadImg(true)
        } catch (ex) {
            console.error(ex);
        }
    }
    const updatepost = () => {
        if (validateHashtag(hashtag)) {
            updateContent();
            updateHashTag();
            addImage();
            Alert.alert('Thành Công', 'Dã cập nhật bài viết !!!');
            navigation.navigate('Home');
        }
        else {
            Alert.alert('Sai', 'Sai định dạng Hashtag')
        }
    }
    return (

        <View style={styles.container}>
            <TouchableOpacity onPress={updatepost} style={styles.view_button_post}>
                <Text style={styles.buton_post} >Update</Text>
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
                <ScrollView horizontal style={styles.scroll_view_image}>

                    {post.map((image) => (
                        <View key={image.id} style={styles.view_add_image}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => deleteImage(image.id)}>
                                <Icon name="close" size={15} color="#FFF" />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${image.image}` }}
                                style={styles.postImage}
                            />
                        </View>
                    ))}
                    {avatar.map((image, index) => (
                        <View key={index} style={styles.view_add_image}>
                            <TouchableOpacity style={styles.closeButton}>
                                <Icon name="close" size={15} color="#fff" />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: `${image}` }}
                                style={styles.postImage}
                            />
                        </View>
                    ))}
                    <TouchableOpacity onPress={pickImage} style={styles.view_add_image}>
                        <Text style={styles.add_image_post}>Thêm ảnh</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>

            <Header navigation={navigation} />
        </View>
    );
};
export default UpdatePost;

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
        height: 220,
        resizeMode: 'cover',
        marginLeft: 5,
        marginRight: 5,
    },
    view_add_image: {
        height: 220,
        width: 210,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#C5CBE3",
        borderWidth: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 15,
        zIndex: 10,
    },
});
