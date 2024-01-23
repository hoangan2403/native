import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';



const Comment = ({ avatar, replycomment, ParID, margin = 0, fix_comment, reload }) => {
    const [user, dispatch] = useContext(MyUserConText)
    const [commentReplies, setCommentReplies] = useState([]);

    const loadComments = async () => {
        try {
            let res = await AuthApis().get(endpoints['get_reply_comment'](ParID))
            setCommentReplies(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    const handleReplyComment = (username, comment) => {
        replycomment(username, comment);
    };
  
    useEffect(() => {
        if (ParID) {
            loadComments();
        }
    }, [ParID, reload]);

    return (
        <View>
            {commentReplies.map((comment) => comment != null ? <>
                <View style={[styles.notificationItem, { marginLeft: margin + 30 }]} key={comment.id}>
                    <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${comment.user.avatar}` }} style={styles.avatar} />
                    <View style={styles.notificationContent}>
                        <Text style={styles.username}>{comment.user.first_name} {comment.user.last_name}</Text>
                        <Text>{comment.content}</Text>
                        <View style={styles.horizontalTextContainer}>
                            <Text style={styles.timestamp}>{comment.created_date}</Text>
                            <TouchableOpacity onPress={() => handleReplyComment(comment.user.username, comment.id)}>
                                <Text style={styles.rep}>Phản hồi</Text>
                            </TouchableOpacity>
                            {comment.user.id === user.id ? <TouchableOpacity onPress={() => fix_comment(comment.id, comment.content)}>
                                <Text style={styles.rep}>Chỉnh sửa</Text>
                            </TouchableOpacity> : <></>}
                        </View>
                    </View>
                </View>
                <Comment replycomment={replycomment} ParID={comment.id} avatar={avatar} margin={margin + 30} reload={reload} />
            </>
                : null)}
        </View>
    )
};
export default Comment;
const styles = StyleSheet.create({

    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
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
});