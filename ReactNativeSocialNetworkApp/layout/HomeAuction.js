import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Animated, TouchableOpacity, Text, Easing, Modal } from 'react-native';
import Auction from '../components/Auction';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAuction = ({ navigation }) => {
  const imageList = [
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    // Thêm các URL hình ảnh khác nếu cần
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeight] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const [extraStyle, setExtraStyle] = useState({ display: 'none' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    const loadAuctions = async () => {

      try {
        const token = await AsyncStorage.getItem('@Token');
        let res = await AuthApis(token).get(endpoints['auctions']);
        console.log(res.data)
        setAuctions(res.data)

      } catch (ex) {
        console.error(ex);
      }

    }
    loadAuctions();
  }, [])

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      setExtraStyle({ display: 'block' });
      Animated.parallel([
        Animated.timing(modalHeight, {
          toValue: 210,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(modalHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setExtraStyle({ display: 'none' });
        setModalVisible(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.searchBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"

        />
      </View>
      <ScrollView style={{maxHeight: "81%"}}>
        {auctions.map((auction) =>
          <Auction key={auction.id}
            auction={auction}
            toggleModal={toggleModal}
            navigation={navigation}
          />
        )}


      </ScrollView>
      <Animated.View style={[styles.modalBackground, extraStyle, { opacity }]}>
        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.modalView, { height: modalHeight }]}>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="exclamation-triangle" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Sai Thông Tin Hành Hóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="exclamation-triangle" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Có ý định lừa đảo, bán giá sai sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="exclamation-triangle" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Bài đăng ảo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="exclamation-triangle" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Sai thông tin sản phẩm</Text>
        </TouchableOpacity>
      </Animated.View>
      <Header navigation={navigation} />
    </View>
  );
};
export default HomeAuction;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: "#C5CBE3",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
  },
  modalBackground: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    display: 'none',
  },
  modalView: {
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 5,
    borderRadius: 5,
    width: '100%',
    height: '100%',
  },


});