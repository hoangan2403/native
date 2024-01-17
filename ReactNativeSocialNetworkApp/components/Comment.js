import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';



const Comment = ({ username, message, avatar, timestamp, replycomment, idComment }) => {


    const handleReplyComment = () => {
        replycomment(username, idComment);
    };

    return (
        <View style={styles.notificationItem}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.notificationContent}>
                <Text style={styles.username}>{username}</Text>
                <Text>{message}</Text>
                <View style={styles.horizontalTextContainer}>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                    <TouchableOpacity onPress={handleReplyComment}>
                        <Text style={styles.rep}>Phản hồi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
export default Comment;
const styles = StyleSheet.create({

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
});