import Header from '../components/Header';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import Post from '../components/Post';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext, useEffect, useState } from 'react';
import Auction from '../components/Auction';
import { MyUserConText } from '../App';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {

  const imageList = [
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg',
    // Thêm các URL hình ảnh khác nếu cần
  ];
  const [user, dispatch] = useContext(MyUserConText);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPost, setIsPost] = useState(true);
  const [modalHeight] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const [extraStyle, setExtraStyle] = useState({ display: 'none' });
  const [post, setPost] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [countFollow, setCountFolow] = useState();
  const [countFollowing, setCountFolowing] = useState();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const token = await AsyncStorage.getItem('@Token');
        let res = await AuthApis(token).get(endpoints['posts_user'])
        setPost(res.data)
      } catch (ex) {
        console.error(ex);
      }

    }
    const loadAuction = async () => {
      try {
        const token = await AsyncStorage.getItem('@Token');
        let res = await AuthApis(token).get(endpoints['auction_by_User']);
        setAuctions(res.data)
      } catch (ex) {
        console.error(ex);
      }


    }
    const countFollow = async () => {
      try {
        const token = await AsyncStorage.getItem('@Token');
        let resFl = await AuthApis(token).get(endpoints['count_follow'], {
          params: {
            user_id: user.id,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        let resFlw = await AuthApis(token).get(endpoints['count_following'], {
          params: {
            user_id: user.id,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setCountFolow(resFl.data)
        setCountFolowing(resFlw.data)
      } catch (ex) {
        console.error(ex);
      }
    }

    loadPost();
    countFollow();
    loadAuction();
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
  const togglePost = () => {
    console.log(auctions)
    setIsPost(true);
  };
  const toggleAuction = () => {
    setIsPost(false);

  };
  const follower = () => {
    navigation.navigate('Follower')
  }
  const following = () => {
    navigation.navigate('Following')
  }

  const open_message = () => {
    navigation.navigate('Follower')
  }
  const logout = () => {
    dispatch({
      "type": "logout"
    });
  }

  if (user === null) {
    return (
      <></>
    )
  }
  return (
    <View style={styles.container}>

      <View style={styles.user}>
        <View style={styles.nav_message}>
          <TouchableOpacity onPress={() => navigation.navigate("chatbox")}>
            <Icon name="envelope" size={25} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.settingIconContainer} onPress={() => toggleModal()}>
          <Icon name="cog" size={25} color="#000" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${user.avatar}` }} style={styles.avatar} />
          <View style={styles.cameraIconContainer}>
            <Icon name="camera" size={20} color="#000" />
          </View>
        </View>
        <View>
          <Text style={styles.username}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.userid}>@{user.username}</Text>
          <View style={styles.container_follow}>
            <View style={styles.follow_item}>
              <TouchableOpacity onPress={() => following()}>
                <Text style={styles.follow_text}>Đang Follow</Text>
                <Text style={styles.follow_number}>{countFollowing}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.follow_item}>
              <TouchableOpacity onPress={() => follower()}>
                <Text style={styles.follow_text}>Follower</Text>
                <Text style={styles.follow_number}>{countFollow}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={[
            styles.statBox,
            { backgroundColor: isPost ? '#dddddd' : '#fff' },
          ]} onPress={togglePost}>
            <Icon name="home" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.statBox,
            { backgroundColor: !isPost ? '#dddddd' : '#fff' },
          ]} onPress={toggleAuction}>
            <Icon name="gavel" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Thêm thông tin cá nhân khác của người dùng */}


      </View>
      {isPost ? <ScrollView style={styles.croll_post}>
        {post.map(c =>
          <Post key={c.id}
            post={c}
            navigation={navigation}
          />
        )}

      </ScrollView> : <ScrollView>
        {auctions.map((auction) =>
          <Auction key={auction.id}
            auction={auction}
            toggleModal={toggleModal}
            navigation={navigation}
          />
        )}

      </ScrollView>}


      <Animated.View style={[styles.modalBackground, extraStyle, { opacity }]}>
        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>

        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.modalView, { height: modalHeight }]}>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="user" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="lock" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Bảo mật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} >
          <Icon name="trash" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Xóa tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={logout}>
          <Icon name="sign-out" size={20} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </Animated.View>
      <Header navigation={navigation} />
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,

  },
  settingIconContainer: {
    position: 'absolute',
    top: 0, // Điều chỉnh vị trí từ phía trên
    right: 5, // Điều chỉnh vị trí từ phía phải
    zIndex: 1, // Để icon hiển thị trên các thành phần khác
  },
  avatarContainer: {
    position: 'relative',
    overflow: 'hidden', // Giữ cho icon nằm trong phạm vi của hình ảnh
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu nền của icon
    borderRadius: 50, // Để tạo hình tròn cho icon
    padding: 5,
  },
  container_follow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  follow_item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  follow_text: {
    textAlign: 'center',
    color: '#aaa'
  },
  follow_number: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  userid: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  user: {
    margin: 15,
    alignItems: 'center',
    borderBottomColor: '#A4B3B6',
    borderBottomWidth: 1,
  },
  userInfo: {
    marginBottom: 20,
  },
  userStats: {
    // Kiểu dáng của phần thống kê người dùng
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10,
    width: '100%'
  },
  statBox: {
    width: '45%', // Sử dụng 48% để để lại khoảng trống giữa các ô
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  nav_message: {
    position: 'absolute',
    zIndex: 10,
    right: 40,
  }
});
