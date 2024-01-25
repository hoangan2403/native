
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserConText } from '../App';

const Post = ({ post, navigation, reloadPost, Follow }) => {
  const [user, dispatch] = useContext(MyUserConText);
  const [showAdditionalIcons, setShowAdditionalIcons] = useState(false);
  const [openSele, setOpensele] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [like, setLike] = useState('');
  const [userFollow, setUserFollow] = useState(false);
  const [reload, setReload] = useState(false)
  const [likeType, setLikeType] = useState({
    name: "thumbs-o-up",
    color: "blue",
    title: "Like"
  });
  const [comment, setComment] = useState('');
  const [user_react, setUser_React] = useState(false);
  useEffect(() => {
    setReload(false)
    const loadLike = async () => {
      try {
        let res = await AuthApis().get(endpoints['count_like'](post.id))
        setLike(res.data)
      } catch (ex) {
        console.error(ex);
      }
    }
    const loadComment = async () => {
      try {
        let res = await AuthApis().get(endpoints['count_comment'](post.id))
        setComment(res.data)
      } catch (ex) {
        console.error(ex);
      }
    }
    const loadListLike = async () => {
      try {
        setLikeType({
          name: "thumbs-o-up",
          color: "black",
          title: "like"
        });
        let res = await AuthApis().get(endpoints['post_like'](post.id))
        res.data.forEach(item => {
          if (item.user.id === user.id) {
            setUser_React(true);
            if (item.like_type === 1) {
              setLikeType({
                name: "thumbs-up",
                color: "blue",
                title: "Đã like",
              });
            }
            else if (item.like_type === 2) {
              setLikeType({
                name: "heart",
                color: "red",
                title: "Đã like",
              });
            }
            else {
              setLikeType({
                name: "frown-o",
                color: "ogrange",
                title: "Đã like",

              });
            }
          }
        });
      } catch (ex) {
        console.error(ex);
      }


    }
    ///kiểm tra xem người udnf có follow hay chưa
    const actFollow = async () => {
      const isUserFollowed = Follow.some(item => item.follower.id === user.id);
      setUserFollow(isUserFollowed);
      console.log(isUserFollowed)
    };

    loadLike();
    loadComment();
    actFollow();
    loadListLike();

  }, [reload, Follow]);

  //gửi biểu cảm
  const sendReact = async (likeTypeId) => {
    try {
      const formData = new FormData();
      formData.append('liketype_id', likeTypeId);
      const token = await AsyncStorage.getItem('@Token');
      let res = AuthApis(token).post(endpoints['send_react'](post.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
      )
      setReload(true);
    } catch (ex) {
      console.error(ex);
    }
    setShowAdditionalIcons(false);
  }

  //mở image full screen
  const openImage = (image) => {
    setSelectedImage(image);
  };

  //đống image đang mở
  const closeImage = () => {
    setSelectedImage(null);
  };

  //download image
  const downloadImage = (image) => {
    console.log(`Downloading image: ${image}`);
  };

  //troe tới comment
  const goToComments = () => {
    navigation.navigate('Comment', post.id);
  };

  //hiện icon react
  const onLikeButtonLongPress = () => {
    setShowAdditionalIcons(true);
  };

  //mở bảng tùy chọn
  const openSelect = () => {
    setOpensele(!openSele);
  };

  const handleOptionClick = (option) => {
    // Xử lý khi một tùy chọn được chọn
    console.log(`Option selected: ${option}`);
    // Đóng modal sau khi chọn
    openSelect();
  };

  //updatepost
  const updatePost = () => {
    setOpensele(false);
    navigation.navigate('UpdatePost', post.id)
  }

  //hoàm xóa bàu viết
  const delete_post = async () => {
    try {

      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc chắn muốn xóa bài viết này?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: async () => {
              const token = await AsyncStorage.getItem('@Token');
              let res = AuthApis(token).delete(endpoints['delete_post'](post.id))
              reloadPost();
              setOpensele(!openSele);
            },
          },
        ],
        { cancelable: true }
      );


    } catch (ex) {
      console.error(ex);
    }
  }

  //hàm tìm kiếm các bài viết theo hashtag
  const search_hashtag = (hashtag, name) => {
    console.log(hashtag)
    navigation.navigate('PostHashtag', { hashtagId: hashtag, hashtagName: name })
  }
  ///theo dõi người kuacs
  const follow_user = async (id) => {
    try {
      const token = await AsyncStorage.getItem('@Token');
      let res = await AuthApis(token).post(endpoints['follow'](id))
      reloadPost();

    } catch (ex) {
      console.error(ex);
    }
  }
  if (!post) {
    return <></>
  }

  return (
    <View style={styles.postContainer}>

      <View style={styles.select}>
        <TouchableOpacity onPress={openSelect} style={{ padding: 5 }}>
          <Icon name="ellipsis-v" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openSele}
        onRequestClose={openSelect}
      >
        <View style={styles.modalSelectPost} >
          {post.user.id === user.id ? <>
            <TouchableOpacity style={styles.modalOption} onPress={() => updatePost(post.id)}>
              <Text>Sửa bài viết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => delete_post()}>
              <Text>Xóa bài viết</Text>
            </TouchableOpacity></> : <><TouchableOpacity style={styles.modalOption} onPress={() => handleOptionClick('Option 1')}>
              <Text>Báo cáo bài viết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionClick('Option 2')}>
              <Text>Chưa biết</Text>
            </TouchableOpacity></>}
          <TouchableOpacity onPress={openSelect} style={styles.closeButton}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.userInfo}>
        <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${post.user.avatar}` }} style={styles.avatar} />
        <View>
          <View style={styles.view_user_follow}>
            <Text style={styles.username}>{post.user.first_name} {post.user.last_name}</Text>
            {post.user.id === user.id ? <></> :
              <TouchableOpacity onPress={() => follow_user(post.user.id)}>
                <Text style={styles.text_follow}>
                  {userFollow ? "Bỏ theo dỗi" : "Theo dõi"}

                </Text>
              </TouchableOpacity>}

          </View>

          <Text style={styles.timepost}>{post.created_date}</Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.hashtag_view}>
        {post.post_hashtag.map((hashtag) => (
          <TouchableOpacity key={hashtag.id} style={styles.click_hashtag} onPress={() => search_hashtag(hashtag.id, hashtag.name)}>
            <Text style={styles.text_hashtag}> #{hashtag.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {post.images ? <ScrollView horizontal>
        {post.images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => openImage(`https://res.cloudinary.com/dhcvsbuew/${image.image}`)}>
            <Image
              source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${image.image}` }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        ))}
      </ScrollView> : <></>}
      <View style={styles.view_count}>
        <View style={styles.view_like}>
          <Icon name="thumbs-o-up" size={20} color="blue" />
          <Text style={styles.text_like}>{like.count}</Text>
        </View>
        <View style={styles.view_like}>

          <Text style={styles.text_like}>{comment.count}</Text>
          <Text style={styles.text_like}>bình luận</Text>
        </View>
      </View>
      <View style={styles.actions}>

        <TouchableOpacity style={styles.actionButton}
          onLongPress={onLikeButtonLongPress} onPress={() => sendReact("1")}
        >

          {user_react ? <>
            <Icon name={likeType.name} size={20} color={likeType.color} />
            <Text style={styles.actionText}>{likeType.title}</Text></>
            :
            <>
              <Icon name="thumbs-o-up" size={20} color="black" />
              <Text style={styles.actionText}>Like</Text></>}
        </TouchableOpacity>
        {showAdditionalIcons && (
          <View style={styles.additionalIcons}>
            <TouchableOpacity style={styles.additionalIcon} onPress={() => sendReact("1")}>
              <Icon name="thumbs-o-up" size={20} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalIcon} onPress={() => sendReact("2")}>
              <Icon name="heart" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalIcon} onPress={() => sendReact("1")}>
              <Icon name="frown-o" size={20} color="orange" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={goToComments}>
          <Icon name="comment-o" size={20} color="green" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>


      </View>
      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={closeImage}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => downloadImage(selectedImage)} style={styles.downloadButton}>
              <Icon name="download" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>

  );
}
export default Post;
const styles = StyleSheet.create({

  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  select: {
    position: 'absolute',
    right: 25,
    top: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 5,
  },
  postImage: {
    width: 360,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullScreenImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 5,
    borderRadius: 5,

  },
  downloadButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 5,
    borderRadius: 5,

  },
  closeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    width: 20,
    height: 20,
    textAlign: 'center',
  },

  timepost: {
    fontSize: 12,
    color: "#888"
  },
  additionalIcons: {
    zIndex: 10,
    flexDirection: 'row',
    position: 'absolute',
    top: -15,
    left: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },

  additionalIcon: {
    marginLeft: 5,
    marginRight: 5,
    padding: 8,
    backgroundColor: "#D1E8E2",
    borderRadius: 30,
  },
  view_count: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  view_like: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  text_like: {
    marginLeft: 5,
    fontWeight: '700',
  },
  modalSelectPost: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalOption: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '40%'
  },
  hashtag_view: {
    flexDirection: 'row',

  },
  click_hashtag: {
    marginRight: 3,
    marginBottom: 15,

  },
  text_hashtag: {
    fontWeight: '700',
  },
  view_user_follow: {
    flexDirection: 'row',
  },
  text_follow: {
    marginLeft: 5,
    fontWeight: '600',
    color: '#aaa'
  }
});