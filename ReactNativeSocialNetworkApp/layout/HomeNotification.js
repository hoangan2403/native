import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Text } from 'react-native';
import Header from '../components/Header';
import Notification from '../components/Notification';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeNotification = ({ navigation }) => {
  const [notices, setNotices] = useState([])

  const [reloadNoice, setReloadNotice] = useState(false);

  const reload = () => {
    setReloadNotice(true);
  }
  useEffect(() => {
    setReloadNotice(false)
    const loadNotices = async () => {
      try {
        const token = await AsyncStorage.getItem('@Token');
        let res = await AuthApis(token).get(endpoints['notices'])
        setNotices(res.data)
        console.log(res.data)
      } catch (ex) {
        console.error(ex);
      }
    }
    loadNotices();
  }, [reloadNoice])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.searchBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Icon name="cog" size={30} color="black" />
      </View>
      <View>
        <View style={styles.container_notices}>
          <Text style={styles.new_text}>Thông báo mới</Text>
          {notices.map(not => (
            not.active && (
              <Notification key={not.id}
                notice={not}
                navigation={navigation}
                reload={reload}
              />)
          ))}
        </View>
        <View style={styles.container_notices}>
          <Text style={styles.new_text}>Thông cũ hơn</Text>
          {notices.map(not => (
            !not.active && (
              <Notification key={not.id}
                notice={not}
                navigation={navigation}
                reload={reload}
              />)
          ))}
        </View>
      </View>
      <Header navigation={navigation} />
    </View>
  );
};
export default HomeNotification;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row', // Hiển thị các thành phần theo chiều ngang
    alignItems: 'center', // Căn chỉnh các thành phần theo trục dọc
    justifyContent: 'space-between', // Căn chỉnh các thành phần theo chiều ngang, khoảng cách đều
    paddingHorizontal: 10, // Khoảng cách lề ngang
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 40,
  },
  searchInput: {
    flex: 8, // Chiếm 80% chiều rộng của parent (searchBar)
    paddingHorizontal: 8,
    fontSize: 16,
    color: 'black',
  },
  container_notices: {
    marginLeft: 5,
  },
  new_text: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  }

});