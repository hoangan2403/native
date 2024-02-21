import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Animated, TouchableOpacity, Text, Easing, Alert, ActivityIndicator } from 'react-native';
import Auction from '../components/Auction';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAuction = ({ navigation }) => {

  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);


  const loadAuctions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@Token');
      let res = await AuthApis(token).get(endpoints['auctions'],
        {
          params: {
            offset: offset,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      setAuctions(prevPosts => [...prevPosts, ...res.data])
      setOffset(prevOffset => prevOffset + 3);
      // Hiển thị thông báo cho người dùng
      setLoading(false);
    } catch (ex) {
      console.error(ex);
      setLoading(false);
    }

  }
  useEffect(() => {

    loadAuctions();
  }, [])

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Kiểm tra khi người dùng đến gần cuối ScrollView
    if (offsetY + screenHeight >= contentHeight - 20) {
      handleLoadMore();
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      loadAuctions();
    }
  };

  const renderFooter = () => {
    return loading ? (
      <ActivityIndicator size="small" color="#0000ff" />
    ) : null;
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

      <ScrollView style={{ maxHeight: "81%", minHeight: 400 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {auctions.map((auction) =>
          <Auction key={auction.id}
            auction={auction}
            navigation={navigation}
          />
        )}
        {renderFooter()}

      </ScrollView>

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


});