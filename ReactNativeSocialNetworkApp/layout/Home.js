import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Post from '../components/Post';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Apis, { AuthApis, endpoints } from '../configs/Apis';
import { MyUserConText } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [user, dispatch] = useContext(MyUserConText);
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState([]);
  const [reload, setReload] = useState(false);

  ///load bài viết
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const loadPost = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@Token');
      let res = await AuthApis(token).get(endpoints['posts'], {
        params: {
          offset: offset,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setPosts(prevPosts => [...prevPosts, ...res.data])
      setOffset(prevOffset => prevOffset + 3); // Tăng offset để lấy bài viết tiếp theo
      setLoading(false);
    } catch (ex) {
      console.error(ex);
      setLoading(false);
    }
  }
  const reLoadPost = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@Token');
      let res = await AuthApis(token).get(endpoints['posts'], {
        params: {
          offset: 0,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setPosts(prevPosts => [...prevPosts, ...res.data])
      setOffset(prevOffset => prevOffset + 3); // Tăng offset để lấy bài viết tiếp theo
      setLoading(false);
    } catch (ex) {
      console.error(ex);
      setLoading(false);
    }
  }
  const loadFolow = async () => {
    try {
      const token = await AsyncStorage.getItem('@Token');
      let res = await AuthApis(token).get(endpoints['getFollowing'], {
        params: {
          user_id: user.id,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setFollow(res.data)
    } catch (ex) {
      console.error(ex);
    }
  }
  useEffect(() => {
    console.log(reload)
    setReload(false);
    loadPost();
    loadFolow();
  }, [reload])

  const reloadPost = () => {
    setReload(true);
  }


  ///loadposst
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Kiểm tra khi người dùng đến gần cuối ScrollView
    if (offsetY + screenHeight >= contentHeight - 20) {
      handleLoadMore();
    }
  };

  const handleScrollUp = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    // Kiểm tra xem người dùng có đang cuộn lên không
    if (currentOffsetY < offset) {
      setPosts([]);
      setOffset(0);
      reLoadPost();
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      loadPost();
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
        // Các thuộc tính khác của TextInput có thể được thêm vào ở đây
        />
        <TouchableOpacity>
          <Icon name="search" size={28} color="#4056A1" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[styles.croll_post, { minHeight: 400, maxHeight: "80%" }]}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollUp}
        scrollEventThrottle={400} >
        {posts.map(c =>
          <Post key={c.id}
            post={c}
            navigation={navigation}
            reloadPost={reloadPost}
            Follow={follow}
          />
        )}
        {renderFooter()}
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