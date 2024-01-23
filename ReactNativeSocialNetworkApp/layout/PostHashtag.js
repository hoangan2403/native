import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Post from '../components/Post';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Apis, { endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';

const PostHashtag = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const route = useRoute();
    const { hashtagId, hashtagName } = route.params;

    useEffect(() => {
        const loadPost = async () => {
            try {
                let res = await Apis.get(endpoints['post_hashtag'](hashtagId))
                setPosts(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadPost();
    }, [])


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.searchBar}>

                <Text style={styles.text_hashtag_header}>#{hashtagName}</Text>
            </View>
            <ScrollView style={styles.croll_post}>
                {posts.map(c =>
                    <Post key={c.id}
                        post={c}
                        navigation={navigation}
                    />
                )}
            </ScrollView>
            <Header navigation={navigation} />
        </View>
    );
};
export default PostHashtag;

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
        flexDirection: 'row', // Hiển thị các thành phần con nằm ngang
        alignItems: 'center', // Canh giữa theo chiều dọc
    },
    text_hashtag_header: {
        fontSize: 30,
        fontWeight: '800',

    },
    commentIcon: {
        width: 28,
        height: 28,
        tintColor: '#4056A1',
    },

});