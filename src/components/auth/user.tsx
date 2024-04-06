import { Avatar as AntDesignAvatar, Button, Descriptions, Divider, message } from "antd"
import { useContext, useEffect, useState } from "react"
import { LoginUserContext } from "../../context/loginUser"
import type { DescriptionsProps } from 'antd';
import { Link } from "react-router-dom"
import { getRealtimeUserInfo } from "../../apis";
import { notify } from "../../utils";

export default function UserPage() {
    const { username, avatarUri, email, logout } = useContext(LoginUserContext);
    const [isPaid, setIsPaid] = useState(false);
    const [freeTriedCnt, setFreeTriedCnt] = useState(0);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getRealtimeUserInfo().then(info => {
            if (info) {
                setIsPaid(info.isPaid);
                setFreeTriedCnt(info.freeTriedCount);
            }
        })
    }, [])

    const onSubscribe = async () => {
        const isSuccess = await fetch(`${process.env.REACT_APP_PAYMENT_SERVER_URL}/unsubscribe`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.ok
        }).catch(err => {
            console.error(err);
            return false;
        });

        if (isSuccess) {
            notify({
                api: messageApi,
                type: "success",
                content: "退訂成功"
            })
            window.setTimeout(() => {
                window.location.reload();
            }, 1000)
        } else {
            notify({
                api: messageApi,
                type: "error",
                content: "退訂失敗"
            })
        }
    }

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '名稱',
            children: username ?? "-",
        },
        {
            key: '2',
            label: '信箱',
            children: email ?? "-",
        },
        {
            key: '3',
            label: '已付款',
            children: (isPaid ? "是" : "否") ?? "-"
        }
    ];
    if (!isPaid) {
        items.push({
            key: '4',
            label: '免費額度',
            children: freeTriedCnt > 0 ? `剩餘 ${freeTriedCnt} 次` : `已用完`
        })
    }

    return <div style={{ margin: "auto" }}>
        {contextHolder}
        <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 10 }}>
            <AntDesignAvatar src={avatarUri} size={80} />
            <p style={{ marginLeft: 15 }}>{`嗨，${username}`}</p>
        </div>
        <Divider />
        <Descriptions title="帳戶資訊" items={items} style={{ marginTop: 15 }} />
        {
            isPaid
                ?
                <Button size="small" type="primary" danger style={{ marginRight: 12 }} onClick={onSubscribe}>
                    退訂
                </Button>
                :
                <Link to="/payment" style={{ marginRight: 12 }}>
                    <Button size="small" type="primary">方案說明</Button>
                </Link>
        }
        <Button size="small" type="default" danger onClick={() => logout()} style={{ marginTop: 20 }}>登出</Button>
    </div >
}