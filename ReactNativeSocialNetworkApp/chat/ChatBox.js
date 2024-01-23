import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
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

const ChatBox = ({ navigation }) => {
  const [user, dispatch] = useContext(MyUserConText);
  const [chatBox, setAllbox] = useState([]);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome name="search" size={24} style={{ marginLeft: 15 }} />
      ),
    });
  }, [navigation]);

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
      setAllbox(tam);
    };

    fetchDataAsync();
  }, [user]);

  console.info(chatBox);

  return (
    <View>
      {chatBox.map((box) =>
        box != user.id ? (
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("chat", { id: box })}
            >
              <Text>{box}</Text>
            </TouchableOpacity>
          </View>
        ) : null
      )}
    </View>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    backgroundColor: "#fff",
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
});
