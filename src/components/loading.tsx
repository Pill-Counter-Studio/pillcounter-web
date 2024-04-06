import { Spin } from "antd"

export default function Loading({ style }: { style?: object }) {
    return <Spin size="large" style={style} />
}