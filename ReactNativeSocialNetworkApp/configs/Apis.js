import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER = 'http://192.168.1.102:8000'
const SERVER_URL = 'http://192.168.1.102'

export const endpoints = {
    'login': `${SERVER}/auth/token/`,
    'current-user': `${SERVER}/users/current_user/`,
    'register': `${SERVER}/users/`,
    'auctions': `${SERVER}/auctions/`,
    'posts': `${SERVER}/posts/`,
    'add_post': `${SERVER}/posts/create/`,
    'comments':(id)=>`${SERVER}/posts/${id}/get_comments/`,
    'add_comment':(id)=>`${SERVER}/posts/${id}/add_comment/`,
    'reply_comment':(id)=>`${SERVER}/comments/${id}/add_reply/`,
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
