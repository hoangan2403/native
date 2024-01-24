import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import Post from '../components/Post';
import Comment from '../components/Comment';
import InputComment from '../components/InputComent';
import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommentPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const route = useRoute();
    const postID = route.params;
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState();
    const [fix, setFix] = useState(false);
    const [name, setName] = useState();
    const [idComment, setIdComment] = useState();
    const [commentFix, setCommentFix] = useState();
    const [idCommentFix, setIdCommentFix] = useState();
    const [reload, setReload] = useState(false);
    useEffect(() => {

        setReload(false);
        const loadComments = async () => {
            try {
                let res = await AuthApis().get(endpoints['comments'](postID))
                setComments(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        const loadPost = async () => {
            try {
                let res = await AuthApis().get(endpoints['post'](postID))
                setPost(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadPost();
        loadComments();
    }, [reload])

    const reloadComment = () => {
        setReload(true);
    }
    const replycomment = (reply_name, reply_idComment) => {
        setName(reply_name);
        setIdComment(reply_idComment);
        setFix(false);
        setCommentFix(null);
        console.log(post)
    }
    const fix_comment = (id, content) => {
        setFix(true);
        setName(null);
        setIdComment(null);
        setIdCommentFix(id);
        setCommentFix(content);
    }
    const cancel_update = () => {
        setFix(false);
    }
    const send_fix_comment = async () => {
        try {
            const formData = new FormData();
            formData.append('content', commentFix);
            const token = await AsyncStorage.getItem('@Token');
            let res = AuthApis(token).patch(endpoints['update_comment'](idCommentFix), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
            )
            setReload(true);
            setFix(false);
        } catch (ex) {
            console.error(ex);
        }
    }
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView style={styles.scrollContainer}>

                {/* <Post
                    post={post}
                    navigation={navigation}
                /> */}

                {comments.map((comment) =>
                    comment.comment === null ?
                        <ScrollView key={comment.id}>
                            <View style={styles.notificationItem} >
                                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${comment.user.avatar}` }} style={styles.avatar} />
                                <View style={styles.notificationContent}>
                                    <Text style={styles.username}>{comment.user.first_name} {comment.user.last_name}</Text>
                                    <Text>{comment.content}</Text>
                                    <View style={styles.horizontalTextContainer}>
                                        <Text style={styles.timestamp}>{comment.created_date}</Text>
                                        <TouchableOpacity onPress={() => replycomment(comment.user.username, comment.id)}>
                                            <Text style={styles.rep}>Phản hồi</Text>
                                        </TouchableOpacity>

                                        {comment.user.id === user.id ? <TouchableOpacity onPress={() => fix_comment(comment.id, comment.content)}>
                                            <Text style={styles.rep}>Chỉnh sửa</Text>
                                        </TouchableOpacity> : <></>}

                                    </View>
                                </View>

                            </View>
                            <Comment
                                reload={reload}
                                ParID={comment.id}
                                replycomment={replycomment}
                                fix_comment={fix_comment}
                            />
                        </ScrollView>
                        : <></>
                )}

            </ScrollView>
            {!fix ? <InputComment postID={postID} replyName={name} id={idComment} reloadCmt={reloadComment} /> :
                <>
                    <View style={styles.view_reply}>
                        <Text style={styles.text_reply}>Đang chỉnh sửa</Text>
                        <TouchableOpacity onPress={() => cancel_update()}>
                            <Text style={styles.text_reply_cancel}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchBar}>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Trả lời..."
                            placeholderTextColor="#888"
                            value={commentFix}
                            onChangeText={(commentFix) => setCommentFix(commentFix)}
                        />
                        <TouchableOpacity onPress={() => send_fix_comment()}>
                            <Icon name="send" size={28} color="#4056A1" />
                        </TouchableOpacity>
                    </View>
                </>}





        </View >
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
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationContent: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
    },
    timestamp: {
        color: 'gray',
        fontSize: 12,
    },
    rep: {
        color: 'gray',
        fontSize: 12,
        marginLeft: 40,
    },

    horizontalTextContainer: {
        flexDirection: 'row', // Thiết lập làm cho các phần tử con nằm ngang
        alignItems: 'center', // Canh giữa theo chiều dọc
        marginBottom: 10,
        marginTop: 5,
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
    },
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

});