import { useContext } from "react";
import { Avatar as AntDesignAvatar, Popover, Button } from 'antd';
import { LoginUserContext } from "../../context/loginUser";
import GoogleAuth from "./googleLogin";

export default function Avatar() {
    const { username, avatarUri, isLogin, logout } = useContext(LoginUserContext)

    return <div style={{ margin: "auto" }}>
        {
            isLogin ?
                <Popover
                    content={
                        <div style={{ width: 100, margin: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <p>{`嗨, ${username}`}</p>
                            <Button size="small" type="default" danger onClick={() => logout()}>登出</Button>
                        </div>
                    }
                >
                    <AntDesignAvatar src={avatarUri} size={35} />
                </Popover>
                :
                <GoogleAuth />
        }
    </div>
}