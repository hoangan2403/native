
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Post = ({ username, content, images, date, postID, navigation }) => {
  const [showAdditionalIcons, setShowAdditionalIcons] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const downloadImage = (image) => {
    console.log(`Downloading image: ${image}`);
  };

  const goToComments = () => {
    navigation.navigate('Comment', postID);
  };

  const onLikeButtonLongPress = () => {
    setShowAdditionalIcons(true);
  };

  const onLikeButtonPressOut = () => {
    setShowAdditionalIcons(false);
  }
  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image source={{ uri: 'https://res.cloudinary.com/dhcvsbuew/image/upload/v1697662181/kyxsf60npwxl8dltsw2h.jpg' }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timepost}>{date}</Text>
        </View>
      </View>
      <Text style={styles.content}>{content}</Text>
      {images ? <ScrollView horizontal>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => openImage(image)}>
            <Image
              source={{ uri: image }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        ))}
      </ScrollView> : <></>}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}
          onLongPress={onLikeButtonLongPress}
          >
          <Icon name="thumbs-o-up" size={20} color="blue" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        {showAdditionalIcons && (
          <View style={styles.additionalIcons}>
            <TouchableOpacity style={styles.additionalIcon} onPress={onLikeButtonPressOut}>
              <Icon name="thumbs-o-up" size={20} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalIcon} onPress={onLikeButtonPressOut}>
              <Icon name="heart" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalIcon} onPress={onLikeButtonPressOut}>
            <Icon name="frown-o" size={20} color="orange" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={goToComments}>
          <Icon name="comment-o" size={20} color="green" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-square-o" size={20} color="orange" />
          <Text style={styles.actionText}>Share</Text>
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
    marginBottom: 10,
  },
  postImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
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
});