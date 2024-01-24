
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MyUserConText } from '../App';
import { AuthApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Auction = ({ auction, navigation }) => {
    const [user, dispatch] = useContext(MyUserConText);
    const [selectedImage, setSelectedImage] = useState(null);
    const [buyer, setBuyer] = useState([]);
    const [reports, setReports] = useState([]);
    const [openReport, setOpenReport] = useState(false);
    useEffect(() => {
        const loadBuyer = async () => {
            try {
                let res = await AuthApis().get(endpoints['count_buyer'](auction.id))
                setBuyer(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        const loadReportTypes = async () => {
            try {
                const token = await AsyncStorage.getItem('@Token');
                let res = await AuthApis(token).get(endpoints['get_report'])
                setReports(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadBuyer();
        loadReportTypes();
    }, [])

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };
    const downloadImage = (image) => {

        console.log(`Downloading image: ${image}`);
    };
    const JoinAuction = (id) => {
        if (auction.owner.id == user.id) {
            navigation.navigate('Participate', auction.id)
        }
        else {
            navigation.navigate('JoinAuction', id)
        }
    }
    const Participate = () => {
        navigation.navigate('Participate', auction.id)
    }

    const openReportType = () => {
        setOpenReport(!openReport);
    };

    const sendReport = async (idReportType) => {
        try {

            const formData = new FormData();
            formData.append('report_type', idReportType)
            const token = await AsyncStorage.getItem('@Token');
            let res = await AuthApis(token).post(endpoints['report_auction'](auction.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            Alert.alert("Thông báo", "Đã báo cáo bài viết !!");
            openReportType();
        } catch (ex) {
            console.error(ex);
        }
    }

    const UpdateAuction = () => {
        const curentDate = new Date();
        const startDate = new Date(auction.start_date)
        if(startDate>curentDate){
            navigation.navigate('UpdateAuction', auction.id)
        }
        else{
            Alert.alert("Thông báo", "Quá hạn chỉnh sửa")
        }
        
    }
    if (!auction) {
        return <></>
    }
    return (
        <View style={styles.postContainer}>
            {auction.owner.id === user.id ? <View style={styles.select}>
                <TouchableOpacity style={{ padding: 5 }} onPress={() => UpdateAuction()}>
                    <Icon name="pencil" size={20} color="black" />
                </TouchableOpacity>
            </View> : <></>}

            <View style={styles.userInfo}>
                <Image source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.owner.avatar}` }} style={styles.avatar} />

                <View>
                    <Text style={styles.username}>{auction.owner.first_name} {auction.owner.last_name}</Text>
                    <Text style={styles.timepost}>{auction.product.created_date}</Text>
                </View>
            </View>

            <View>
                <Text style={[styles.price_text2, { marginTop: 10 }]}>Thông tin sản phẩm</Text>
                <Text style={styles.content}>{auction.product.description}</Text>
                <Text style={styles.old_price}>Giá khởi điểm:{auction.starting_price.toLocaleString('vi-VN')} VND</Text>
            </View>

            <TouchableOpacity onPress={() => openImage(auction.product.image)}>
                <Image
                    source={{ uri: `https://res.cloudinary.com/dhcvsbuew/${auction.product.image}` }}
                    style={styles.postImage}
                />
            </TouchableOpacity>
            <View style={styles.price}>
                <TouchableOpacity style={[styles.price_text, { backgroundColor: '#116466' }]} onPress={() => JoinAuction(auction.id)}>
                    <Text style={styles.price_text2}>Tham Gia</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="exclamation-triangle" size={20} color="orange" onPress={() => openReportType()} />

                </TouchableOpacity>
                {auction.owner.id === user.id ? <TouchableOpacity style={styles.actionButton} onPress={() => Participate()}>
                    <Icon name="users" size={20} color="black" />
                    <Text style={styles.count_buyer}>{buyer.count}</Text>
                </TouchableOpacity> : <TouchableOpacity style={styles.actionButton}>
                    <Icon name="heart" size={20} color="black" />
                </TouchableOpacity>}
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={openReport}
                onRequestClose={() => {
                    setOpenReport(!openReport);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.reportTypeView}>
                        <Text style={styles.header_report}>Báo cáo bài viết</Text>
                        {reports.map(report => (
                            <TouchableOpacity style={styles.tou_report_view} key={report.id}
                                onPress={() => sendReport(report.id)}>
                                <Icon name="exclamation-triangle" size={20} color="orange" />
                                <Text style={styles.text_report_option}>{report.content}</Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                    <TouchableOpacity onPress={() => openReportType()} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>

        </View >
    );
};

export default Auction;
const styles = StyleSheet.create({

    postContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
        marginBottom: 10,
    },
    postImage: {
        width: "98%",
        height: 300,
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
    price_text: {
        height: 45,
        width: '100%',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    price_text2: {
        fontWeight: '900',
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    timepost: {
        fontSize: 12,
        color: "#888"
    },
    count_buyer: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '800',
    },
    old_price: {
        fontWeight: '800',
        fontSize: 15,
        padding: 5,
        marginBottom: 10,
        backgroundColor: "#659DBD",
        width: 230,
        borderRadius: 5,
    },
    modalBackground: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        display: 'none',
    },
    modalView: {
        zIndex: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        overflow: 'hidden',
    },

    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
    },
    reportTypeView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
        width: "90%"
    },
    tou_report_view: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
        width: "100%",
        flexDirection: 'row',
        paddingRight: 5,
        paddingBottom: 10,
        paddingTop: 10,
    },
    header_report: {
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 10,
    },
    text_report_option: {
        marginLeft: 5,
        fontSize: 15,
    }
});