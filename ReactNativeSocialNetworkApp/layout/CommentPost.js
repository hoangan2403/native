import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import Post from '../components/Post';
import Comment from '../components/Comment';
import Header from '../components/Header';
import InputComment from '../components/InputComent';

const CommentPost = ({ navigation }) => {

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
                />
                <Comment
                    username='John Doe'
                    message='You have a new friend request.'
                    avatar='https://via.placeholder.com/50'
                    timestamp='2 hours ago' />
                <Comment
                    username='John Doe'
                    message='You have a new friend request.'
                    avatar='https://via.placeholder.com/50'
                    timestamp='2 hours ago' />
                <Comment
                    username='John Doe'
                    message='You have a new friend request.'
                    avatar='https://via.placeholder.com/50'
                    timestamp='2 hours ago' />
            </ScrollView>
            <InputComment />
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