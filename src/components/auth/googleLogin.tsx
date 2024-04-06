import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { message } from "antd";
import { LoginUserContext } from "../../context/loginUser";
import { GoogleJwtPayload, UserInfo } from "../../types";
import { notify } from "../../utils";


export default function GoogleAuth({ onlyIcon = true }) {
    const { login } = useContext(LoginUserContext)

    const [messageApi, contextHolder] = message.useMessage();

    return <>
        {contextHolder}
        <GoogleLogin
            onSuccess={(credentialResponse) => {
                const decoded: GoogleJwtPayload = jwtDecode(credentialResponse?.credential ?? "");
                // console.log(decoded)

                const userInfo: UserInfo = {
                    username: decoded.name,
                    email: decoded.email,
                    avatar_uri: decoded.picture
                }

                login(userInfo);
            }}
            onError={() => {
                console.error('Login Failed');
                notify({
                    api: messageApi,
                    type: "error",
                    content: "Google第三方登入失敗，請確認網路狀態是否正常"
                })
            }}
            type={onlyIcon ? "icon" : "standard"}
        />
    </>
}