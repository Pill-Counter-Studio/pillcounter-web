import React, { useContext, useEffect, useState } from 'react';
import {
    BookFilled,
    PlusCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Result } from 'antd';
import type { MenuProps } from "antd";
import { Route, BrowserRouter as Router, Link } from 'react-router-dom';
import Avatar from './components/auth/avatar';
import HistoryRecords from './components/history-records';
import { LoginUserContext } from './context/loginUser';
import PredictSection from './components/predicts/predict-section';
import GoogleAuth from './components/auth/googleLogin';
import UserPage from './components/auth/user';
import "./App.css"
import PaymentPage from './components/payment';

const { Header, Content } = Layout;

const loadingTimeSeconds = 3;
const contentHeight = window.innerHeight - 206;  // 110(footer)+64(header)+32(margin-top, margin-bottom)

const menus: MenuProps["items"] = [
    {
        key: "/history",
        label: "記錄",
        icon: <Link to="/history"><BookFilled /></Link>,
        style: { fontSize: 12, margin: "auto" }
    },
    {
        key: "/",
        label: "開始",
        icon: <Link to="/"><PlusCircleOutlined /></Link>,
        style: { fontSize: 12, margin: "auto" }
    },
    {
        key: "/user",
        label: "帳號",
        icon: <Link to="/user"><UserOutlined /></Link>,
        style: { fontSize: 12, margin: "auto" }
    }
];

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentMenuKey, setCurrentMenuKey] = useState(window.location.pathname ?? "/");

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { isLogin } = useContext(LoginUserContext);

    useEffect(() => {
        const waitForSeconds = setTimeout(() => {
            setIsLoading(false);
        }, loadingTimeSeconds * 1000);

        return () => clearTimeout(waitForSeconds);
    }, [])

    const UnAuthPage = () => {
        return <Result
            icon={<UserOutlined />}
            title="登入才能使用服務"
            extra={<GoogleAuth onlyIcon={false} />}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        />
    }

    return isLoading ? <img src="./logo.png" alt="Loading" style={{ objectFit: "contain", width: "100%", height: window.innerHeight, backgroundColor: "rgb(87,92,95)", animation: `fade ${loadingTimeSeconds}s`, zIndex: 100 }} /> : <Router>
        <Header style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
            <a href='/' style={{ color: "white" }}>
                Pill Counter
            </a>
            <div>
                <Avatar />
            </div>
        </Header>
        <Layout>
            <Content
                style={{
                    margin: '16px 16px',
                    padding: 20,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    height: contentHeight,
                    minHeight: contentHeight,
                    maxHeight: contentHeight,
                    overflow: "auto"
                }}
            >
                {
                    isLogin ?
                        <>
                            <Route path="/" exact component={PredictSection} />
                            <Route path="/history" component={HistoryRecords} />
                            <Route path="/user" component={UserPage} />
                            <Route path="/payment" component={PaymentPage} />
                        </>
                        :
                        <UnAuthPage />
                }
            </Content>
        </Layout>
        {/* Increase footer height to prevent blocking the bottom line on mobile */}
        <Header style={{ height: 110 }}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[currentMenuKey]}
                items={menus}
                style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}
                onSelect={(menu) => {
                    setCurrentMenuKey(menu.key);
                }}
            />
        </Header>
    </Router>
}

export default App;