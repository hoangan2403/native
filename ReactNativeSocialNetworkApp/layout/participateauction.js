import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';

import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auction from '../components/Auction';
import Participate from '../components/Participate';

const participateauction = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const route = useRoute();
    const [auction, setAuction] = useState();
    const [participate, setParticipate] = useState([]);
    const auctionId = route.params;


    const loadAuction = async () => {
        try {
            let res = await Apis.get(endpoints['get_auction_id'](auctionId))
            setAuction(res.data)

        } catch (ex) {
            console.error(ex);
        }
    }
    const loadParticipate = async () => {
        try {
            let res = await Apis.get(endpoints['get_participateauction'](auctionId))
            setParticipate(res.data)


        } catch (ex) {
            console.error(ex);
        }
    }
    useEffect(() => {
        loadAuction();
        loadParticipate();

    }, [])

    const toggleModal = () => {
        console.log(participate)
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView >
                {/* <View style={styles.postContainer}>
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


                    <TouchableOpacity >
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

                </View> */}
                {participate.map(part => (
                    <Participate
                        key={part.id}
                        participate={part}
                    />
                ))}

            </ScrollView>

        </View >
    );
};
export default participateauction;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        backgroundColor: '#fff',
    },
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


});