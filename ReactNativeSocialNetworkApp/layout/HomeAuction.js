import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Animated, TouchableOpacity, Text, Easing } from 'react-native';
import Auction from '../components/Auction';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAuction = ({ navigation }) => {

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

      <ScrollView style={{ maxHeight: "81%" }}>
        {auctions.map((auction) =>
          <Auction key={auction.id}
            auction={auction}
            navigation={navigation}
          />
        )}


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