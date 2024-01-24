import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const Participate = ({ participate }) => {

    const isAuctionEnded = new Date(participate.auction.end_date) < new Date();
    console.log(isAuctionEnded)

    const addBuyer = () => {
        if (isAuctionEnded) {
            Alert.alert('Thông báo', 'Oke')
        }
        else {
            Alert.alert('Thông báo', 'Chưa đến hạn')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${participate.user.avatar}` }} style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{participate.user.first_name} {participate.user.last_name}</Text>
                <Text style={styles.price}>Giá tiền: {participate.price.toLocaleString('vi-VN')} VND</Text>
                <Text style={styles.joinDate}>Ngày tham gia: {participate.created_date}</Text>
            </View>
            <TouchableOpacity style={styles.selectButton} onPress={() => addBuyer()}>
                <Icon name="check" size={20} color="green" />
            </TouchableOpacity>
        </View>
    );
};
export default Participate;
const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#C5CBE3'
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
    },
    joinDate: {
        fontSize: 12,
        color: '#888',
    },
    selectButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
    },


});