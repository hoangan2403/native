
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ navigation }) => {

  const route = useRoute();
  const [notices, setNotices] = useState([])
  const isScreenActive = (routeName) => {
    return route.name === routeName;
  };
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const token = await AsyncStorage.getItem('@Token');
        let res = await AuthApis(token).get(endpoints['count_notices'])
        setNotices(res.data)
      } catch (ex) {
        console.error(ex);
      }
    }
    loadNotices();
  }, [])
  const create_post = () => {
    const showConfirmationAlert = () => {
      Alert.alert(
        'Thông báo',
        'Bạn muốn thêm bài viết hay bài đấu giá?',
        [
          {
            text: 'Thêm bài Post',
            onPress: () => navigation.navigate('CreatePost'),
          },
          {
            text: 'Thêm bài đấu giá',
            onPress: () => navigation.navigate('CreateAuction'),
          },
        ],
        { cancelable: true }
      );
    }
    showConfirmationAlert();
  };
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity style={[styles.navItem, isScreenActive('Home') ? styles.selectedNav : null]}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={28} color="#4056A1" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, isScreenActive('HomeAuction') ? styles.selectedNav : null]}
        onPress={() => navigation.navigate('HomeAuction')}>
        <Icon name="gavel" size={28} color="#4056A1" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, isScreenActive('HomeMessage') ? styles.selectedNav : null]}
        onPress={() => create_post()}>
        <Icon name="plus" size={28} color="#4056A1" style={styles.iconPost} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, isScreenActive('HomeNotification') ? styles.selectedNav : null]}
        onPress={() => navigation.navigate('HomeNotification')}>
        <Icon name="bell" size={28} color="#4056A1" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.navItem, isScreenActive('Profile') ? styles.selectedNav : null]}
        onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={28} color="#4056A1" />
      </TouchableOpacity>
    </View>

  );
};
export default Header;

const styles = StyleSheet.create({

  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  selectedNav: {
    opacity: 0.4,
  },
  iconPost: {
    backgroundColor: "#A4B3B6",
    padding: 10,
    borderRadius: 15,
  }
});