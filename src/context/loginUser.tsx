import React, { createContext, useEffect, useState } from 'react';
import { UserInfo } from '../types';
import { message } from "antd"
import { notify } from '../utils';

interface LoginUserContextValue {
    isLogin: boolean
    username: string
    email: string
    avatarUri: string
    authUser: Function
    login: Function
    logout: Function
}

const defaultLoginUserValue = {
    isLogin: false,
    username: "",
    email: "",
    avatarUri: "",
    authUser: () => {
        console.log("auth user")
    },
    login: () => {
        console.log("login")
    },
    logout: () => {
        console.log("logout")
    }
}
export const LoginUserContext = createContext<LoginUserContextValue>(defaultLoginUserValue);

export default function LoginUserProvider({ children }: { children: React.ReactNode }) {
    const [isLogin, setIsLogin] = useState(defaultLoginUserValue.isLogin);
    const [username, setUsername] = useState(defaultLoginUserValue.username);
    const [email, setEmail] = useState(defaultLoginUserValue.email);
    const [avatarUri, setAvatarUri] = useState(defaultLoginUserValue.avatarUri);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        authUser();
    }, [])

    const reset = () => {
        setIsLogin(defaultLoginUserValue.isLogin);
        setUsername(defaultLoginUserValue.username);
        setAvatarUri(defaultLoginUserValue.avatarUri);
        setEmail(defaultLoginUserValue.email);
    }

    const setUserInfo = (userInfo: UserInfo) => {
        setUsername(userInfo.username);
        setEmail(userInfo.email);
        setAvatarUri(userInfo.avatar_uri);
        setIsLogin(true);
    }

    const authUser = () => {
        fetch(`${process.env.REACT_APP_AUTH_SERVER_URL}/auth`, {
            method: "GET",
            credentials: "include"
        }).then(res => {
            if (!res.ok) throw Error(res.statusText)
            return res.json()
        })
            .then((userInfo: UserInfo) => {
                // console.log(userInfo)
                setUserInfo(userInfo);
            }).catch(err => {
                console.error(err);
                reset();
            })
    }

    const login = (userInfo: UserInfo) => {
        fetch(`${process.env.REACT_APP_AUTH_SERVER_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userInfo)
        }).then(res => {
            if (res.ok) {
                console.log("Auth OK");
                // console.log(userInfo)
                notify({
                    api: messageApi,
                    type: "success",
                    content: `嗨！${userInfo.username}，歡迎回來`
                })
                setUserInfo(userInfo);
                return res.json();
            }
            throw new Error(`Cannot login, status code: ${res.status}, message: ${res.statusText}`)
        })
            .catch(err => {
                console.error(err);
                notify({
                    api: messageApi,
                    type: "error",
                    content: "登入失敗，請確認網路狀態是否穩定"
                })
                reset();
            })
    }

    const logout = () => {
        fetch(`${process.env.REACT_APP_AUTH_SERVER_URL}/logout`, {
            method: "GET",
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                window.location.reload();
                return;
            }
            throw new Error(`Cannot logout, status code: ${res.status}, message: ${res.statusText}`)
        }).catch(err => {
            console.error(err);
            notify({
                api: messageApi,
                type: "error",
                content: "登出失敗，請確認網路狀態是否穩定"
            })
        })
    };

    return <LoginUserContext.Provider value={{ isLogin, username, avatarUri, login, logout, authUser, email }}>
        {contextHolder}
        {children}
    </LoginUserContext.Provider>
}
