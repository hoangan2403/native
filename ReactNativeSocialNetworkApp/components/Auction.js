
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyUserConText } from '../App';
import { AuthApis, endpoints } from '../configs/Apis';

const Auction = ({ auction, toggleModal, navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [selectedImage, setSelectedImage] = useState(null);
    const [buyer, setBuyer] = useState([]);


    useEffect(() => {
        const loadBuyer = async () => {
            try {
                let res = await AuthApis().get(endpoints['count_buyer'](auction.id))
                setBuyer(res.data)
                console.log(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadBuyer();


    }, [])

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };
    const downloadImage = (image) => {

        console.log(`Downloading image: ${image}`);
    };
    const JoinAuction = (id) => {
        navigation.navigate('JoinAuction', id)
    }
    const Participate = () => {
        navigation.navigate('Participate', auction.id)
    }
    if (!auction) {
        return <></>
    }
    return (
        <View style={styles.postContainer}>
            <View style={styles.userInfo}>
                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.owner.avatar}` }} style={styles.avatar} />

                <View>
                    <Text style={styles.username}>{auction.owner.first_name} {auction.owner.last_name}</Text>
                    <Text style={styles.timepost}>{auction.product.created_date}</Text>
                </View>
            </View>

            <View>
                <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin sản phẩm</Text>
                <Text style={styles.content}>{auction.product.description}</Text>
            </View>


            <TouchableOpacity onPress={() => openImage(auction.product.image)}>
                <Image
                    source={{ uri: auction.product.image }}
                    style={styles.postImage}
                />
            </TouchableOpacity>

            <View style={styles.price}>
                <TouchableOpacity style={[styles.price_text, { backgroundColor: '#116466' }]} onPress={() => JoinAuction(auction.id)}>
                    <Text style={styles.price_text2}>{auction.starting_price}</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
                    <Icon name="exclamation-triangle" size={20} color="orange" />

                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="comment-o" size={20} color="black" />

                </TouchableOpacity>

                {auction.owner.id === user.id ? <TouchableOpacity style={styles.actionButton} onPress={() => Participate()}>
                    <Icon name="users" size={20} color="black" />
                    <Text style={styles.count_buyer}>{buyer.count}</Text>
                </TouchableOpacity> : <TouchableOpacity style={styles.actionButton}>
                    <Icon name="heart" size={20} color="black" />
                </TouchableOpacity>}
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
    timepost: {
        fontSize: 12,
        color: "#888"
    },
    count_buyer: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '800',
    }

});