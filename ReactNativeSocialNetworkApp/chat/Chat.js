import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { View, TouchableOpacity, Text, Image, StyleSheet, StatusBar, TextInput, ScrollView } from "react-native";
import { database } from "../configs/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MyUserConText } from "../App";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [user, dispatch] = useContext(MyUserConText);
  const route = useRoute();
  const { id } = route.params;
  const [url_collection, setURL] = useState("chat");

  const getURLChat = (id) => {
    if (id > user.id) setURL("doduocdi/" + id + "/" + user.id);
    else {
      setURL("doduocdi/" + user.id + "/" + id);
    }
  };

  const data = {};

  useEffect(() => {
    getURLChat(id);
  }, [id]);

  console.log("++++++++++++=", url_collection);
  useLayoutEffect(() => {
    const collectionRef = collection(database, url_collection);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, [url_collection]);

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      // setMessages([...messages, ...messages]);
      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(database, url_collection), {
        _id,
        createdAt,
        text,
        user,
      });
      addDoc(collection(database, "doduocdi/chatbox/box"), {
        nguoigui: user,
        nguoinhan: id,
        createdAt,
      });
    },
    [url_collection]
  );

  return (
    // <>
    //   {messages.map(message => (
    //     <Text key={message._id}>{message.text}</Text>
    //   ))}
    // </>

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={(messages) => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      textInputStyle={{
        backgroundColor: "#fff",
        borderRadius: 20,
      }}
      user={{
        _id: user.id,
        avatar: "https://i.pravatar.cc/300",
      }}
    />

  );
}
