
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Auction = ({ username, content, images, toggleModal, handleJoinAuction }) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };
    const downloadImage = (image) => {

        console.log(`Downloading image: ${image}`);
    };
    return (
        <View style={styles.postContainer}>
            <View style={styles.userInfo}>
                <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
                <Text style={styles.username}>{username}</Text>
            </View>

            <View>
                <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin sản phẩm</Text>
                <Text style={styles.content}>{content}</Text>
            </View>

            {images ? <ScrollView horizontal>
                {images.map((image, index) => (
                    <TouchableOpacity key={index} onPress={() => openImage(image)}>
                        <Image
                            source={{ uri: image }}
                            style={styles.postImage}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView> : <></>}
            <View style={styles.price}>
                <TouchableOpacity style={[styles.price_text, { backgroundColor: '#116466' }]} onPress={handleJoinAuction}>
                    <Text style={styles.price_text2}>5.000.000 VND</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
                    <Icon name="exclamation-triangle" size={20} color="orange" />
                    <Text style={styles.actionText}>Báo cáo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="comment-o" size={25} color="black" />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="heart" size={20} color="red" />
                    <Text style={styles.actionText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            {selectedImage && (
                <Modal
                    visible={!!selectedImage}
                    transparent={true}
                    onRequestClose={closeImage}
                >
                    <View style={styles.modalContainer}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity onPress={() => downloadImage(selectedImage)} style={styles.downloadButton}>
                            <Icon name="download" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default Auction;
const styles = StyleSheet.create({

    postContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    content: {
        marginBottom: 10,
    },
    postImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
    },
    price: {
        height: 50,
    },
    price_text: {
        height: 45,
        width: '100%',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    price_text2: {
        fontWeight: '900',
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullScreenImage: {
        width: '90%',
        height: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 5,
        borderRadius: 5,

    },
    downloadButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 5,
        borderRadius: 5,

    },
    closeText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '900',
        width: 20,
        height: 20,
        textAlign: 'center',
    },


});