import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



const changePass = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confilmPassword, setConfilmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordColor, setPasswordColor] = useState("#FF0000");
    // Gọi hàm yêu cầu quyền truy cập khi ứng dụng khởi chạy hoặc khi cần thiết
    const changePass = async () => {
        try {
            if (newPassword === confilmPassword) {
                const formData = new FormData();
                formData.append('old_password', password)
                formData.append('new_password', newPassword)
                formData.append('new_password_again', confilmPassword)
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).post(endpoints['update_password'], formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
                )
                if (res.status === 201) {
                    Alert.alert("Thông báo", "Mật khẩu không hợp lệ")
                }
                else {
                    navigation.navigate("Profile")
                }
            }
            else {
                Alert.alert("Thông báo", "Mật khẩu không trùng khớp")
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    const checkPasswordStrength = (password) => {
        const strongRegex = new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&\\*])(?=.{8,})"
        );

        if (!password) {
            return " ";
        }
        if (strongRegex.test(password)) {
            setPasswordColor("#00FF00"); // Mật khẩu mạnh, đặt màu xanh
            return "Mật khẩu mạnh";
        } else {
            setPasswordColor("#FF0000"); // Mật khẩu yếu, đặt màu đỏ
            return "Mật khẩu yếu";
        }
    };


    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.view_button_post} onPress={() => changePass()}>
                <Text style={styles.buton_post} >Thay đổi</Text>
            </TouchableOpacity>
            <ScrollView>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập mật khẩu</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập mật khẩu mới</Text>
                        <Text style={styles.red_text}>*</Text>
                        <Text style={[styles.label_text_pass, { color: passwordColor }]}>{passwordStrength}</Text>
                    </View>
                    <TextInput
                        placeholder="New PassWord"
                        value={newPassword}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setNewPassword(text);
                            setPasswordStrength(checkPasswordStrength(text));
                        }}
                        style={styles.content_hashtag}
                    />
                </View>
                <View>
                    <View style={styles.view_red_text}>
                        <Text style={styles.label_text}>Nhập lại mật khẩu</Text>
                        <Text style={styles.red_text}>*</Text>
                    </View>
                    <TextInput
                        placeholder="Confirm Password"
                        value={confilmPassword}
                        secureTextEntry={true}
                        onChangeText={(text) => setConfilmPassword(text)}
                        style={styles.content_hashtag}
                    />
                </View>
            </ScrollView>

        </View>
    );
};
export default changePass;

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
    label_text_pass: {
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
        marginLeft: 5,
    }

});
