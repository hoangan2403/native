import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, StatusBar, TextInput, ScrollView } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  QuerySnapshot,
  and,
  collection,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "../configs/firebase";
import { MyUserConText } from "../App";
import Header from "../components/Header";
import ChatUser from "../components/ChatUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthApis, endpoints } from "../configs/Apis";

const ChatBox = ({ navigation }) => {
  const [user, dispatch] = useContext(MyUserConText);
  const [chatBox, setAllbox] = useState([]);
  const [name, setName] = useState();
  const [users, setUsers] = useState([])


  const searchName = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      console.log(formData)
      const token = await AsyncStorage.getItem('@Token');
      if (!name) {
        setUsers([]);
      }
      else {
        let res = await AuthApis(token).get(endpoints['searchName'], {
          params: {
            name: name,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
        );
        console.log(res.data)
        setUsers(res.data)
      }

    }
    catch (ex) {
      console.error(ex);
    }
  }
  useEffect(() => {
    searchName();
  }, [name])

  const fetchData = async (userId) => {
    console.log("id ne", userId);
    const collectionRef = collection(database, "doduocdi/chatbox/box");
    const q = query(
      collectionRef,
      or(where("nguoigui._id", "==", userId), where("nguoinhan", "==", userId))
    );

    try {
      const snapshot = await getDocs(q);
      let documents = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        documents.push(data);
      });
      console.info("======fetch========", documents);
      return documents;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const documents = await fetchData(user.id);

      let tam = [];
      documents.forEach((document) => {
        const chatBoxId =
          document.nguoinhan === user.id
            ? document.nguoigui._id
            : document.nguoinhan;

        if (!tam.includes(chatBoxId)) {
          tam.push(chatBoxId);
        }
      });
      console.info(documents)
      setAllbox(tam);
    };

    fetchDataAsync();
  }, []);

  console.info(chatBox);

  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <View style={styles.searchBar}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={name}
          onChangeText={(text) => setName(text)}
        // Các thuộc tính khác của TextInput có thể được thêm vào ở đây
        />
        <TouchableOpacity onPress={() => searchName()}>
          <Icon name="search" size={28} color="#4056A1" />
        </TouchableOpacity>
      </View>
      <ScrollView>

        {users.map((user) => (
          <View style={styles.viewChatBox} key={user.id}>
            <TouchableOpacity style={styles.touChatBox}
              onPress={() => navigation.navigate("chat", { id: user.id })}
            >
              <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${user.avatar}` }} style={styles.avatar} />
              <Text style={styles.chat_name}> {user.first_name} {user.last_name}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={styles.text_old_mess}>Tin nhắn cũ</Text>
        {chatBox.map((box) =>
          box != user.id ? (
            <ChatUser id={box}
              navigation={navigation}
              key={box} />
          ) : <></>
        )}
      </ScrollView>
      <Header navigation={navigation} />
    </View>
  );
};

export default ChatBox;

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
  chatButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  viewChatBox: {
    margin: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    padding: 5,
  },
  touChatBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  chat_name: {
    fontSize: 17,
    fontWeight: "600",
  },
  text_old_mess: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
  }
});
