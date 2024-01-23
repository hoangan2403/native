import AsyncStorage from '@react-native-async-storage/async-storage';


const MyUserReducer = (user, action) => {
    switch (action.type) {
      case "login":
        return action.payload;
      case "logout":
        return null;
    }
    return user;
  };
  
  export default MyUserReducer;