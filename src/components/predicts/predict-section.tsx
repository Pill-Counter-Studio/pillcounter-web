import { Segmented } from "antd"
import { useEffect, useState } from "react";
import { getRealtimeUserInfo } from "../../apis";
import CaptureSection from "./capture-section";
import UploadSection from "./upload-section";

export default function PredictSection() {
    const [currOptionIdx, setCurrOptionIdx] = useState(0);
    const [canPredict, setCanPredict] = useState(false);

    const options = ['上傳圖片', '立即拍照'];
    const components = [
        <UploadSection canPredict={canPredict} />,
        <CaptureSection canPredict={canPredict} />
    ]

    useEffect(() => {
        getRealtimeUserInfo().then(info => {
            if (info) {
                setCanPredict(info.canPredict)
            }
        })
    }, [])

    return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Segmented
            style={{ margin: "auto" }}
            options={options}
            onChange={(option) => {
                setCurrOptionIdx(options.indexOf(option));
            }}
        />
        {components[currOptionIdx]}
    </div>
}