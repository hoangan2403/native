import React, { createContext, useReducer } from 'react';
import Home from './layout/Home';
import Profile from './layout/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeAuction from './layout/HomeAuction';
import HomeNotification from './layout/HomeNotification';
import Login from './layout/Login';
import MyUserReducer from './reducers/MyUserReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Signup from './layout/Signup';
import CommentPost from './layout/CommentPost';
import createPost from './layout/CreatePost';

const Stack = createStackNavigator();
export const MyUserConText = createContext();

function App() {
  const [user, dispatch] = useReducer(MyUserReducer, AsyncStorage.getItem('@UserData') || null);
  console.log(user)
  if (user) {
    return (
      <MyUserConText.Provider value={[user, dispatch]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Comment" component={CommentPost} />
            <Stack.Screen name="HomeAuction" component={HomeAuction} />
            <Stack.Screen name="HomeNotification" component={HomeNotification} />
            <Stack.Screen name="CreatePost" component={createPost} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyUserConText.Provider>
    );
  }
  else {
    return (
      <MyUserConText.Provider value={[user, dispatch]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Signup} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyUserConText.Provider>
    );
  }

}


export default App;
