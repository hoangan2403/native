import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER = 'http://192.168.163.1:8000'
const SERVER_URL = 'http://192.168.163.1'

export const endpoints = {
    'login': `${SERVER}/auth/token/`,
    'current-user': `${SERVER}/users/current_user/`,
    'register': `${SERVER}/users/`,
    'auctions': `${SERVER}/auctions/`,
    'posts': `${SERVER}/posts/`,
    'comments':(id)=>`${SERVER}/posts/${id}/get_comments/`,
    'add_comment':(id)=>`${SERVER}/posts/${id}/add_comment/`,
}

export const AuthApis = () => {
    const token = AsyncStorage.getItem('@Token');
    const instance = axios.create({
        baseURL: SERVER_URL,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return instance;
}

export default axios.create({
    baseURL: SERVER_URL
})
