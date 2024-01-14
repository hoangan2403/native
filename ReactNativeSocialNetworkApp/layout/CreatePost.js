import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

const createPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [content, setContent] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [hashtag, setHashtag] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Quyền truy cập vào thư viện ảnh bị từ chối!');
        }
    };

    // Gọi hàm yêu cầu quyền truy cập khi ứng dụng khởi chạy hoặc khi cần thiết

    const pickImage = async () => {
        requestMediaLibraryPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setAvatar(result.uri);
        }
    };

    const postContent = () => {
        // Add logic to post content, hashtag, and selectedImages
        const createPost = async () => {
            try {
                const formData = new FormData();
                formData.append('content', content);
                formData.append('user', "2");
                const token = await AsyncStorage.getItem('@Token');
                console.log(formData)
                let res = await AuthApis().post(endpoints['posts'], formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                })

            } catch (ex) {
                console.error(ex);
            }
        }
        createPost();
    };
    return (

        <View style={styles.container}>
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

                {avatar !== null ? <TouchableOpacity style={styles.view_image} onPress={pickImage}>
                    <Image source={{ uri: avatar }} style={styles.image_post} />
                </TouchableOpacity> :
                    <TouchableOpacity onPress={pickImage} style={styles.view_image}>
                        <Text style={styles.add_image_post}>Thêm ảnh</Text>
                    </TouchableOpacity>}

            </View>
            <TouchableOpacity onPress={postContent} style={styles.view_button_post}>
                <Text style={styles.buton_post} >Post</Text>
            </TouchableOpacity>
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
        alignItems: 'center',
        marginTop: 20,
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
    }
});
