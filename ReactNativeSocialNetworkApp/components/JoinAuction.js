
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

const JoinAuction = ({ isModalVisible, handleJoinAuction, image }) => {


    return (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>

            <View style={styles.modalContainer}>

                <View style={styles.container_join}>
                    <View style={styles.container_infouser}>
                        <Text style={styles.header_text_info}>Thông tin chung</Text>
                        <Text style={styles.content_text_info}>Người bán: Phạm Hoàng Ân</Text>
                        <Text style={styles.content_text_info}>Giá khởi điểm: 5.000.000VND</Text>
                    </View>
                    <View>
                        <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin sản phẩm</Text>
                        <Text style={styles.content}>Sản phẩm được bải quản kỹ </Text>
                    </View>
                    <TouchableOpacity >
                        <Image
                            source={{ uri: image }}
                            style={styles.postImage}
                        />
                    </TouchableOpacity>
                    {/* Nội dung modal */}
                    <View style={styles.pay_items}>
                        <Text style={styles.modalText}>Nhập số tiền:</Text>
                        <TextInput
                            style={styles.bidInput}
                            placeholder="Số tiền"
                            keyboardType="numeric"
                            onChangeText={(text) => setBidAmount(text)}
                        />
                        {/* Button tham gia đấu giá */}
                        <View>
                            <CheckBox
                                title='Chấp nhận chính sách'
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, width: '60%' }}
                                textStyle={{ fontSize: 13, marginLeft: 5 }}
                            />
                        </View>
                        <TouchableOpacity style={styles.joinButton} >
                            <Text style={styles.joinButtonText}>Gửi đấu giá</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <TouchableOpacity style={styles.closeButton} onPress={handleJoinAuction}>
                    <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>

            </View>

        </Modal>

    );
};

export default JoinAuction;
const styles = StyleSheet.create({
    container_join: {
        height: '70%',
        width: '85%',
        backgroundColor: "#C5CBE3",
        borderRadius: 5,
        padding: 10,
        display: 'block'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',

    },
    modalText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 3,
        marginTop: 5,
    },
    bidInput: {
        padding: 7,
        borderRadius: 9,
        width: 300,
        marginBottom: 5,
        borderColor: "#4056A1",
        borderWidth: 2,

    },
    closeButton: {
        position: 'absolute', // Đặt vị trí của nút là tuyệt đối
        top: 20, // Đặt khoảng cách từ trên xuống
        right: 20, // Đặt khoảng cách từ phải qua
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: '#4056A1',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        width: 100,
    },
    joinButtonText: {
        color: '#EFE2BA',
        fontSize: 14,
        fontWeight: 'bold',
    },
    header_text_info: {
        fontWeight: '800',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },
    content_text_info: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 4,
    },
    pay_items: {
        marginTop: 25,
    },
    postImage: {
        width: 200,
        height: 100,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    content: {
        marginBottom: 10,
    },
    price_text2: {
        fontWeight: '900',
        fontSize: 15,
    },
});