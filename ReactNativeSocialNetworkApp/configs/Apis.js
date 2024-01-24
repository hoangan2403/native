import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER = 'http://192.168.1.102:8000'
const SERVER_URL = 'http://192.168.1.102'

export const endpoints = {
    'login': `${SERVER}/auth/token/`,
    'current-user': `${SERVER}/users/current_user/`,
    'register': `${SERVER}/users/`,
    //auction
    'auctions': `${SERVER}/auctions/`,
    'Create_auction': `${SERVER}/auctions/create/`,
    'auction_byId': (id) => `${SERVER}/auctions/${id}/get_by_id/`,
    'update_auction': (id) => `${SERVER}/auctions/${id}/update_auction/`,
    'report_auction': (id) => `${SERVER}/auctions/${id}/report/`,
    'add_auction_buy': (id) => `${SERVER}/auctions/${id}/add_participateauction/`,
    'count_buyer': (id) => `${SERVER}/auctions/${id}/count_participateauction/`,
    'get_participateauction': (id) => `${SERVER}/auctions/${id}/get_participateauction/`,
    'get_auction_id': (id) => `${SERVER}/auctions/${id}/get_by_id/`,
    'auction_by_User': `${SERVER}/auctions/get_auction_by_user/`,

    //post
    'posts': `${SERVER}/posts/get_all_in_post/`,
    'posts_user': `${SERVER}/posts/get_post_by_user/`,
    'add_post': `${SERVER}/posts/create/`,
    'comments': (id) => `${SERVER}/posts/${id}/get_comments/`,
    'update_post': (id) => `${SERVER}/posts/${id}/update/`,
    'update_hashtag': (id) => `${SERVER}/posts/${id}/update_hashtag/`,
    'count_like': (id) => `${SERVER}/posts/${id}/count_like/`,
    'send_react': (id) => `${SERVER}/posts/${id}/like/`,
    'count_comment': (id) => `${SERVER}/posts/${id}/count_comment/`,
    'post': (id) => `${SERVER}/posts/${id}/get_by_id/`,
    'post_like': (id) => `${SERVER}/posts/${id}/get_likes/`,
    'add_comment': (id) => `${SERVER}/posts/${id}/add_comment/`,
    'reply_comment': (id) => `${SERVER}/comments/${id}/add_reply/`,
    'get_reply_comment': (id) => `${SERVER}/comments/${id}/get_reply/`,
    'update_comment': (id) => `${SERVER}/comments/${id}/update_comments/`,
    'delete_post': (id) => `${SERVER}/posts/${id}/`,
    //notices
    'notices': `${SERVER}/notices/get_notice/`,
    'count_notices': `${SERVER}/notices/count_notice_by_user/`,
    //hashtag
    'post_hashtag': (id) => `${SERVER}/hashtags/${id}/get_post_by_hashtag/`,
    //image
    'update_image': `${SERVER}/images/update_image/`,
    'add_image': `${SERVER}/images/add_images_for_post/`,
    //report
    'get_report': `${SERVER}/reportTypes/`,
}

export const AuthApis = (accessToken) => {
    const instance = axios.create({
        baseURL: SERVER_URL,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return instance;
}

export default axios.create({
    baseURL: SERVER_URL
})