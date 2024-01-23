
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const JoinAuction = ({ navigation }) => {
    const [auction, setAuction] = useState();
    const [price, setPrice] = useState();
    const route = useRoute();
    const auctionId = route.params;



    useEffect(() => {
        const loadAuction = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['auction_byId'](auctionId))
                setAuction(res.data)
                console.log(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadAuction();
    }, [])

    //định dạng input 3 chữ số
    const formatPrice = (text) => {

        const numericValue = text.replace(/[^0-9]/g, '');
        const parsedValue = parseFloat(numericValue);

        if (!isNaN(parsedValue)) {
            const formattedValue = parsedValue.toLocaleString('vi-VN');

            // Cập nhật state với giá trị đã định dạng hoặc '0' nếu giá trị nhập vào rỗng
            setPrice(formattedValue || '0');
        } else {
            setPrice('');
        }
    };

    //thực hiện đấu giá
    const buy_auction = async () => {
        try {
            if (price > auction.starting_price) {
                const formData = new FormData();
                formData.append('price', price);
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).post(endpoints['add_auction_buy'](auctionId), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                Alert.alert('Thông báo', 'Đã tham gia đấu giá !!')
            }
            else {
                Alert.alert('Thông báo', 'Vui lòng nhập giá cao hơn giá khởi điểm')
            }

        } catch (ex) {
            console.error(ex);
        }
    }

    return (
        <View style={styles.modalContainer}>

            <View style={styles.container_join}>
                <ScrollView>
                    {auction ? <><View style={styles.container_infouser}>
                        <Text style={styles.header_text_info}>Thông tin chung</Text>
                        <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin người bán</Text>
                        <Text style={styles.content_text_info}>Người bán: {auction.owner.first_name} {auction.owner.last_name}</Text>
                        <Text style={styles.content_text_info}>Giá khởi điểm: {auction.starting_price.toLocaleString('vi-VN')} VND</Text>
                        <Text style={styles.content_text_info}>Ngày bắt đầu: {auction.start_date}</Text>
                        <Text style={styles.content_text_info}>Ngày kết thúc: {auction.end_date}</Text>
                        <Text style={styles.content_text_info}>Hạn thanh toán: {auction.date_of_payment}</Text>
                    </View>
                        <View style={styles.info_product}>
                            <View >
                                <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin sản phẩm</Text>
                                <Text style={styles.content}>Tên Sản Phẩm: {auction.product.name} </Text>
                                <Text style={styles.content}>{auction.product.description} </Text>
                            </View>
                            <TouchableOpacity >
                                <Image
                                    source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.product.image}` }}
                                    style={styles.postImage}
                                />
                            </TouchableOpacity>
                        </View></> : <></>}
                </ScrollView>
                {/* Nội dung modal */}
                <View style={styles.pay_items}>
                    <Text style={styles.modalText}>Nhập số tiền:</Text>
                    <TextInput
                        style={styles.bidInput}
                        placeholder="Số tiền"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                    />
                    {/* Button tham gia đấu giá */}
                    <View>
                        <CheckBox
                            title='Chấp nhận chính sách'
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, width: '50%' }}
                            textStyle={{ fontSize: 13, marginLeft: 5 }}
                        />
                    </View>
                    <TouchableOpacity style={styles.joinButton} onPress={() => buy_auction()}>
                        <Text style={styles.joinButtonText}>Gửi đấu giá</Text>
                    </TouchableOpacity>
                </View>

            </View>


        </View>


    );
};

export default JoinAuction;
const styles = StyleSheet.create({
    container_join: {

        borderRadius: 5,
        padding: 10,
        display: 'block'
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
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
        width: 350,
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
        fontSize: 15,
        marginBottom: 4,
        marginTop: 4,
        marginLeft: 10,
    },
    pay_items: {
        marginTop: 5,
        paddingTop: 10,
        borderTopColor: '#C5CBE3',
        borderTopWidth: 1,
        marginLeft: 10,
    },
    postImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    content: {
        marginBottom: 5,
        paddingTop: 10,
        paddingLeft: 10,
    },
    price_text2: {
        fontWeight: '900',
        fontSize: 15,

    },
    container_infouser: {
        borderWidth: 1,
        borderColor: '#C5CBE3',
        borderRadius: 5,
        padding: 5,
    },

});