import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Post from '../components/Post';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Apis, { endpoints } from '../configs/Apis';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);
  const loadPost = async () => {
    try {
      let res = await Apis.get(endpoints['posts'])
      setPosts(res.data)
    } catch (ex) {
      console.error(ex);
    }
  }
  useEffect(() => {
    console.log(reload)
    setReload(false);
    loadPost();
  }, [reload])

  const reloadPost = () => {
    setReload(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.searchBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        // Các thuộc tính khác của TextInput có thể được thêm vào ở đây
        />
        <TouchableOpacity>
          <Icon name="search" size={28} color="#4056A1" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.croll_post}>
        {posts.map(c =>
          <Post key={c.id}
            post={c}
            navigation={navigation}
            reloadPost={reloadPost}
          />
        )}
      </ScrollView>
      <Header navigation={navigation} />
    </View>
  );
};
export default Home;

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
    flexDirection: 'row', // Hiển thị các thành phần con nằm ngang
    alignItems: 'center', // Canh giữa theo chiều dọc
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: "#C5CBE3",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    width: '88%'
  },
  commentIcon: {
    width: 28,
    height: 28,
    tintColor: '#4056A1',
  },

});