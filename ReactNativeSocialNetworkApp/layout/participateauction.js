import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';

import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyUserConText } from '../App';
import Participate from '../components/participate';


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
                {auction ? <View style={styles.postContainer}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.owner.avatar}` }} style={styles.avatar} />

                        <View>
                            <Text style={styles.username}>{auction.owner.first_name} {auction.owner.last_name}</Text>
                            <Text style={styles.timepost}>{auction.product.created_date}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.price_text_view]}>
                            Giá Bán: {auction.starting_price.toLocaleString('vi-VN')} VND
                        </Text>

                        <Text style={styles.price_text2}>Thời gian hết hạn: {auction.end_date}</Text>
                    </View>
                    <TouchableOpacity >
                        <Image
                            source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.product.image}` }}
                            style={styles.postImage}
                        />
                    </TouchableOpacity>
                </View> : <></>}
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
        margin: 5,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#C5CBE3'
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
    postImage: {
        width: 300,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
 

    price_text2: {
        fontWeight: '900',
        fontSize: 15,
        marginBottom: 15,
    },
    price_text_view: {
        borderRadius: 10,
        marginTop: 10, 
        backgroundColor: 'green', 
        fontWeight: 'bold', 
        padding: 5, 
        color: 'white',
        width: 200,
    }

});