import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import DatePicker from 'react-native-date-picker'
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import Apis, { endpoints } from '../configs/Apis';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [next, setNext] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setAvatar(selectedImageUri);
    }
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(false);
    setBirthday(currentDate);
  };

  const register = async () => {
    try {
      if (password === confirm) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', email);
        if (avatar) {
          const uriParts = avatar.split('.');
          const fileType = uriParts[uriParts.length - 1];
          const fileName = `avatar.${fileType}`;
          formData.append('avatar', {
            uri: avatar,
            name: fileName,
            type: `image/${fileType}`,
          });
        }
        console.log(formData)

        let res = await Apis.post(endpoints['register'], formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.status === 201) {
          Alert.alert('Thành Công', 'Đăng ký thành công !!!');
          navigation.navigate('Login');
        }
        else {
          Alert.alert('Lỗi', 'Hệ thống đang gặp một số vấn đề, vui lòng thử lại sao');
        }
      }
      else {
        Alert.alert('Lỗi', 'Mật khẩu không trùng khớp. Vui lòng nhập lại.');
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  const nextStep = () => {
    setNext(!next);
  };

  return (
    <View style={styles.container}>

      <View style={styles.box_image}>
        <Image style={styles.image} source={require("../assets/image/logomedia.png")} />
      </View>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll_info}>
        {next ? <>

          <Text style={styles.text_info}>Thông tin cá nhân</Text>
          <Text style={styles.label_text}>First Name</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              require
              placeholder="Phạm..."
              value={lastName}
              placeholderTextColor="#888"
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </View>
          <Text style={styles.label_text}>Last Name</Text>
          <View style={styles.inputView}>
            <TextInput
              require
              value={firstName}
              style={styles.TextInput}
              placeholder="Văn A..."
              placeholderTextColor="#888"
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </View>

          <Text style={styles.label_text}>Date Of Birth</Text>

          <View style={styles.inputView}>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={birthday}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
            <Text style={styles.text_birthday} onPress={() => setShowDatePicker(true)}>{birthday.toDateString()}</Text>

          </View>
          <Text style={styles.label_text}>Chọn Avatar</Text>
          <View style={styles.add_avt}>
            {avatar && <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
            <Button title="Chọn Ảnh"
              color="#C5CBE3"
              onPress={pickImage}
              style={styles.btn_avt} />
          </View>
        </> : <><Text style={styles.text_account}>Tạo tài khoản</Text>
          <Text style={styles.label_text}>Tài Khoản</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              require
              placeholder="ABC123"
              value={username}
              placeholderTextColor="#888"
              onChangeText={(username) => setUsername(username)}
            />
          </View>
          <Text style={styles.label_text}>Email</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              require
              value={email}
              placeholder="abc@gmail.com"
              placeholderTextColor="#888"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <Text style={styles.label_text}>Mật Khẩu</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              require
              placeholder="Mật Khẩu"
              value={password}
              placeholderTextColor="#888"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <Text style={styles.label_text}>Nhập Lại Mật Khẩu</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Nhập Lại Mật Khẩu"
              require
              placeholderTextColor="#888"
              value={confirm}
              secureTextEntry={true}
              onChangeText={(confirm) => setConfirm(confirm)}
            />
          </View>
          <TouchableOpacity style={styles.back} onPress={nextStep}>
            <Icon name="chevron-left" size={20} color="#4056A1" />
          </TouchableOpacity>

        </>}


      </ScrollView>
      <TouchableOpacity>

        <Text style={styles.login}>
          <Text >Bạn đã có tài khoản? </Text>
          <Text style={styles.text_register} onPress={() => navigation.navigate('Login')}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
      {next ?
        <TouchableOpacity style={styles.loginBtn} onPress={nextStep}>
          <Text style={styles.loginText} >Tiếp Theo</Text>
        </TouchableOpacity> :
        <TouchableOpacity style={styles.loginBtn} onPress={register}>
          <Text style={styles.loginText} >Đăng Ký</Text>
        </TouchableOpacity>
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll_info: {
    width: '100%',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  image: {
    marginBottom: 10,
    maxHeight: 150,
    maxWidth: 150,
  },
  box_image: {
    maxHeight: 200,
    marginTop: -30,
  },
  text_info: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: "#4056A1",
    textAlign: 'center',
  },
  text_account: {
    fontSize: 18,
    fontWeight: '700',
    color: "#4056A1",
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  inputView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderColor: "#C5CBE3",
    borderWidth: 2,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    width: 300,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  back: {
    width: 60,
    borderRadius: 25,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    left: -20,
    bottom: -5,
    position: "absolute",
  },
  login: {
    flexDirection: 'row',
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
  text_birthday: {
    height: 50,
    width: 300,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  label_text: {
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: '#4056A1'
  },
  add_avt: {
    width: 100,
  },
  btn_avt: {
    backgroundColor: "#4056A1",
  },

});

export default Signup;