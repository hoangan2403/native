import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const InputComment = () => (
    <View style={styles.searchBar}>
        <TextInput
            style={styles.searchInput}
            placeholder="Trả lời..."
            placeholderTextColor="#888"
        // Các thuộc tính khác của TextInput có thể được thêm vào ở đây
        />
        <TouchableOpacity>
            {/* Thay thế Icon bằng một biểu tượng khác (ví dụ: biểu tượng comment) */}
            <Icon name="send" size={28} color="#4056A1" />
            {/* Hoặc sử dụng một thẻ Image nếu bạn có một biểu tượng hình ảnh */}
            {/* <Image source={require('path/to/your/icon.png')} style={styles.commentIcon} /> */}
        </TouchableOpacity>
    </View>
);

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


});