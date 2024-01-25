
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { AuthApis, endpoints } from "../configs/Apis";
import { MyUserConText } from '../App';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [user, dispatch] = useContext(MyUserConText);

  const process = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('client_secret', '3tTmqCREeIFwu7eJtgULbt59R9eAqblzETHZmX81O5tBDlGFgKFtM1TZwVM02oediiAIfyQ4iVVS1lKpAkW8s2UfuMMifwrayGMdBfZIrUYb2GJtjR1SONBofYAJzIxr');
      formData.append('client_id', '5l2aOhM9XSHAhy44J8ByoQNHbE6rl4Mvs9Grvbnt');
      formData.append('grant_type', 'password');

      let res = await Apis.post(endpoints['login'], formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      AsyncStorage.setItem('@Token', res.data.access_token);

      const token = await AsyncStorage.getItem('@Token');
      let userdata = await AuthApis(token).get(endpoints['current-user']);
      AsyncStorage.setItem('@UserData', JSON.stringify(userdata.data));
      dispatch({
        type: 'login',
        payload: userdata.data,
      });

    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box_image}>
        <Image style={styles.image} source={require("../assets/image/logomedia.png")} />
      </View>
      <StatusBar style="auto" />
      <View style={styles.container_text}>
        <Text style={styles.label_text}>Tài Khoản</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="abc@gmail.com"
          placeholderTextColor="#888"
          value={username}
          onChangeText={(email) => setUsername(email)}
        />
      </View>
      <View style={styles.container_text}>
        <Text style={styles.label_text}>Mật Khẩu</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="*******"
          placeholderTextColor="#888"
          value={password}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity>
        <Text style={{ flexDirection: 'row' }}>
          <Text >Bạn chưa có tài khoản? </Text>
          <Text style={styles.text_register} onPress={() => navigation.navigate('Register')}>Đăng Ký</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={process}>
        <Text style={styles.loginText} >Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",

  },
  container_text: {
    width: '70%'
  },
  image: {
    marginBottom: 10,
    maxHeight: 300,
    maxWidth: 300,
  },
  inputView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderColor: "#C5CBE3",
    borderWidth: 2,
    width: "70%",
    height: 45,
    marginBottom: 20,

  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#4056A1",

  },
  loginText: {
    color: "#EFE2BA",
  },
  text_register: {
    color: "#4056A1",
    fontWeight: 'bold',
  },
  label_text: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#4056A1'
  },
});

export default Login;