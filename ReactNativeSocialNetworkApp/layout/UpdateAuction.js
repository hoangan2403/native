import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';


const UpdateAuction = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [avatar, setAvatar] = useState([]);
    const [image_old, setImage_old] = useState();
    const [endDate, setEndDate] = useState(new Date());
    const [payDate, setPayDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState();
    const [content, setContent] = useState();
    const [productName, setProductName] = useState();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState();
    const route = useRoute();
    const auctionId = route.params;

    useEffect(() => {
        const loadAuction = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['auction_byId'](auctionId))
                setContent(res.data.content);
                setCategory(res.data.product.category);
                setProductName(res.data.product.name);
                const end = new Date(res.data.end_date)
                const pay = new Date(res.data.date_of_payment)
                const pricetest = `${res.data.starting_price}`
                setEndDate(end);
                setPayDate(pay);
                setPrice(pricetest);
                setDescription(res.data.product.description);
                setImage_old(`https://res.cloudinary.com/dhcvsbuew/${res.data.product.image}`)


            } catch (ex) {
                console.error(ex);
            }
        }
        loadAuction();

    }, []);

    //kiểm tra quyền truy cập ảnh
    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Quyền truy cập vào thư viện ảnh bị từ chối!');
        }
    };

    // Gọi hàm yêu cầu quyền truy cập khi ứng dụng khởi chạy hoặc khi cần thiết

    const pickImage = async () => {
        requestMediaLibraryPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            const selectedImageUri = selectedImage.uri;
            console.log(selectedImageUri)
            setAvatar(selectedImageUri);
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowDatePicker(false);
        setEndDate(currentDate);
    };
    const onChangePayDate = (event, selectedDate) => {
        const currentDate = selectedDate || payDate;
        setShowDatePicker(false);
        setPayDate(currentDate);
    };

    //format lại date
    const formatDate = (currentDate) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    //kiểm tra ngày nhập vào
    const validateDates = (startDate, endDate, paymentDate) => {
        // Kiểm tra ngày kết thúc sau ngày bắt đầu
        if (endDate <= startDate) {
            Alert.alert("Thông báo", 'Kết thúc phải sau ngày bắt đầu!!')
            return false;
        }
        // Kiểm tra ngày thanh toán sau ngày kết thúc
        if (paymentDate <= endDate) {
            Alert.alert("Thông báo", 'Ngày thanh toán phải sau ngày kết thúc !!')

            return false;
        }
        // Nếu không có lỗi, trả về true
        return true;
    }

    //kiểm tra giá tri nhập vào
    const validateInputs = (content, productName, price, description, avatar) => {
        if (!content || !productName || !price || !description || !avatar) {
            return false;
        }
        else {
            return true;
        }

    }
    const Create_auction = async () => {
        try {
            const startDate = new Date();
            const formData = new FormData();
            console.log(avatar)
            if (validateInputs(content, productName, price, description, avatar)) {


                if (validateDates(startDate, endDate, payDate)) {
                    formData.append('content', content)
                    formData.append('category', category)
                    formData.append('starting_price', price)
                    formData.append('end_date', formatDate(endDate))
                    formData.append('date_of_payment', formatDate(payDate))
                    formData.append('start_date', formatDate(startDate))
                    formData.append('name_product', productName)
                    formData.append('description_product', description)
                    if (avatar.length>0) {
                        const uriParts = avatar.split('.');
                        const fileType = uriParts[uriParts.length - 1];
                        const fileName = `avatar.${fileType}`;
                        formData.append('image_product', {
                            uri: avatar,
                            name: fileName,
                            type: `image/${fileType}`,
                        });
                    }
                    const token = await AsyncStorage.getItem('@Token');
                    console.log(endpoints['update_auction'](auctionId));

                    let res = await AuthApis(token).post(endpoints['update_auction'](auctionId), formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    Alert.alert("Thành Công", 'Đã cập nhật !!')
                    navigation.navigate("HomeAuction");
                }
            }
            else {
                Alert.alert("Thông Báo", "Vui lòng nhập đầy đủ thông tin")
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.view_button_post} onPress={() => Create_auction()}>
                <Text style={styles.buton_post} >Update</Text>
            </TouchableOpacity>
            <ScrollView>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nội dung bài viết</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>

                    <TextInput
                        placeholder="Nội dung bài viết"
                        multiline
                        value={content}
                        onChangeText={(text) => setContent(text)}
                        style={styles.content_post}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Tên sản phẩm</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="Tên sản phẩm"
                        value={productName}
                        onChangeText={(text) => setProductName(text)}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Giá khởi điểm</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="Giá khởi điểm..."
                        keyboardType="numeric"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Mô tả sản phẩm</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="Mô tả sản phẩm..."
                        multiline
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        style={styles.content_post}
                    />
                </View>
                <View >
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Danh mục sản phẩm</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <View style={styles.select_cate}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item style={styles.item_picker} label="Option 1" value="1" />
                            <Picker.Item style={styles.item_picker} label="Option 2" value="2" />
                            <Picker.Item style={styles.item_picker} label="Option 3" value="1" />
                        </Picker>
                    </View>
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Ngày kết thúc</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>

                    <View style={styles.inputView}>

                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onChangeEndDate}
                            />
                        )}
                        <Text style={styles.text_birthday} onPress={() => setShowDatePicker(true)}>{endDate.toLocaleDateString()}</Text>

                    </View>
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Hạn thanh toán</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>

                    <View style={styles.inputView}>
                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={payDate}
                                mode="date"
                                display="default"
                                onChange={onChangePayDate}
                            />
                        )}
                        <Text style={styles.text_birthday} onPress={() => setShowDatePicker(true)}>{payDate.toLocaleDateString()}</Text>

                    </View>
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Thêm ảnh</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <View style={styles.add_avt}>
                        {avatar.length > 0 ?
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    source={{ uri: avatar }}
                                    style={styles.postImage}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={pickImage} style={styles.view_image}>
                                <Image
                                    source={{ uri: image_old }}
                                    style={styles.postImage}
                                />
                            </TouchableOpacity>}
                    </View>
                </View>
            </ScrollView>
            <Header navigation={navigation} />
        </View>
    );
};
export default UpdateAuction;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    add_avt: {
        alignItems: 'center',
        marginBottom: 50,
    },
    btn_avt: {
        backgroundColor: "#4056A1",
    },
    content_post: {
        width: '90%',
        height: 150,
        borderColor: "#C5CBE3",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        textAlignVertical: 'top',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    content_hashtag: {
        width: '90%',
        height: 60,
        borderColor: "#C5CBE3",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        textAlignVertical: 'top',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    buton_post: {
        backgroundColor: '#4056A1',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 100,
        color: "#EFE2BA",
        textAlign: 'center',

    },
    view_button_post: {
        alignItems: 'flex-end',
        margin: 15,
    },

    image_post: {
        width: 300,
        height: 300,
    },
    view_image: {
        height: 320,
        width: 375,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderColor: "#C5CBE3",
        borderWidth: 1,
    },
    label_text: {
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 20,
        color: '#4056A1'
    },
    add_image_post: {
        fontWeight: '600',
        color: '#4056A1',
        textDecorationLine: 'underline',
    },
    postImage: {
        height: 320,
        width: 375,
        resizeMode: 'cover',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    inputView: {
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        borderColor: "#C5CBE3",
        borderWidth: 2,
        width: "70%",
        height: 45,
        marginBottom: 10,
        alignItems: "center",
        marginLeft: 15,
    },
    text_birthday: {
        height: 50,
        width: 300,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    picker: {
        width: 200,
        height: 50,
        fontSize: 16,
        zIndex: 20,
    },
    item_picker: {
        fontSize: 16,
        color: '#000',
    },
    red_text: {
        color: 'red',
        fontSize: 17,
        marginTop: 10,
        marginLeft: 5,
    },
    view_red_text: {
        flexDirection: 'row',
    },
    select_cate: {
        borderWidth: 2,
        borderColor: '#C5CBE3',
        borderRadius: 25,
        width: 210,
        marginLeft: 20,
    }
});
