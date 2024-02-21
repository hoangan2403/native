import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



const ChangeInfo = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [lastName, setLastName] = useState(user.last_name);
    const [firstName, setFirstName] = useState(user.first_name);
    const [email, setEmail] = useState(user.email);

    // Gọi hàm yêu cầu quyền truy cập khi ứng dụng khởi chạy hoặc khi cần thiết
    const changeUser = async () => {
        try {
            if (lastName && firstName && email) {
                const formData = new FormData();
                formData.append('firstname', firstName)
                formData.append('lastname', lastName)
                formData.append('email', email)
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).post(endpoints['update_user'], formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
                )
                dispatch({
                    type: 'login',
                    payload: res.data,
                });
                navigation.navigate("Profile")
            }
            else {
                Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin")
            }
        } catch (ex) {
            console.error(ex);
        }
    }



    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.view_button_post} onPress={() => changeUser()}>
                <Text style={styles.buton_post} >Cập nhật</Text>
            </TouchableOpacity>
            <ScrollView>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập Tên</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="An"
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập Họ và Tên Lót</Text>
                        <Text style={styles.red_text}>*</Text>

                    </View>
                    <TextInput
                        placeholder="Phạm Văn..."
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                        }}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập Email</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={styles.content_hashtag}
                    />
                </View>
            </ScrollView>

        </View>
    );
};
export default ChangeInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    label_text: {
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 20,
        color: '#4056A1'
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


});
