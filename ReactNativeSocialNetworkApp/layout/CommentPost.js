import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import Post from '../components/Post';
import Comment from '../components/Comment';
import InputComment from '../components/InputComent';
import Apis, { endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';

const CommentPost = ({ navigation }) => {

    const route = useRoute();
    const postID = route.params;
    const [commnents, setComments] = useState([])
    useEffect(() => {
        const loadComments = async () => {
            try {
                let res = await Apis.get(endpoints['comments'](postID))
                setComments(res.data)
            } catch (ex) {
                console.error(ex);
            }
            console.log(res.data)
        }
        loadComments();
    }, [])

    const imageList = [
        'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
        'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
        'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
        // Thêm các URL hình ảnh khác nếu cần
    ];
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView style={styles.scrollContainer}>

                <Post
                    username="John Doe"
                    date="10/04/2023"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    images={imageList}
                    navigation={navigation}
                />
                {commnents.map(c =>
                    <Comment
                        username='John Doe'
                        message={c.content}
                        avatar='https://via.placeholder.com/50'
                        timestamp={c.created_date} />
                )}
            </ScrollView>
            <InputComment postID={postID}/>
        </View>
    );
};
export default CommentPost;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        padding: 10,
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderColor: "#C5CBE3",
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 15,
    },
    scrollContainer: {
        margin: 5,
        height: '40%'
    }

});