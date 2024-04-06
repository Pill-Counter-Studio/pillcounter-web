import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Image } from "antd";
import type { UploadFile, UploadProps } from 'antd';
import PredictResult from './predict-result';
import { Link } from "react-router-dom"
import { notify, PREVIEW_IMAGE_WIDTH_PIXEL } from '../../utils';
import predictImage from '../../apis';

export default function UploadSection({ canPredict }: { canPredict: boolean }) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadImageUri, setUploadImageUri] = useState("");
    const [predictImageUri, setPredictImageUri] = useState("");
    const [predicting, setPredicting] = useState(false);
    const [pillsCount, setPillsCount] = useState(0);

    const [messageApi, contextHolder] = message.useMessage();

    const uploadAndPredict = () => {
        const file = fileList[0];
        if (file) {
            const formData = new FormData();
            formData.append('files', file as unknown as File);

            setPredicting(true);
            predictImage(formData).then(data => {
                if (typeof data === "string") {
                    notify({
                        api: messageApi,
                        type: "error",
                        content: "已經用完免費額度，請付費升級！"
                    })
                } else if (data) {
                    setPillsCount(data.count);
                    setPredictImageUri(data.predict_img_uri);
                }
            })
                .catch(err => {
                    console.error(err)
                    notify({
                        api: messageApi,
                        type: "error",
                        content: '系統無法辨識數量，請確認網路狀態'
                    })
                })
                .finally(() => {
                    setPredicting(false);
                })
        } else {
            notify({
                api: messageApi,
                type: "error",
                content: "找不到照片，無法計數 :("
            })
        }
    }

    const reset = () => {
        setPredictImageUri("");
        setUploadImageUri("");
        setFileList([]);
        setPillsCount(0);
    }

    const props: UploadProps = {
        onRemove: (file) => {
            reset();
        },
        beforeUpload: (file) => {
            reset();
            setFileList([file]);
            setUploadImageUri(URL.createObjectURL(file));
            return false;
        },
        showUploadList: false,
        multiple: false,
        fileList,
    };

    const PreviewImage = () => {
        // Has predicted
        if (predictImageUri?.length > 0) {
            return <Image alt="Predict Image" width={PREVIEW_IMAGE_WIDTH_PIXEL} style={{ objectFit: "fill", borderRadius: 8, margin: "auto", marginTop: 15 }} src={predictImageUri} />
        }
        // Only uploaded
        else {
            if (fileList.length > 0 && uploadImageUri) {
                return <Image alt="loaded-image" width={PREVIEW_IMAGE_WIDTH_PIXEL} style={{ objectFit: "fill", borderRadius: 8, margin: "auto", marginTop: 15 }} src={uploadImageUri} />
            }
        }
        return null;
    }

    return (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {contextHolder}
            {
                canPredict ? <Upload {...props}>
                    <Button type="primary" size="middle" icon={<UploadOutlined />}>選擇圖片</Button>
                </Upload> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p>今日額度已用完</p>
                    <Link to="/payment">
                        <Button size="small" type="primary">繼續使用</Button>
                    </Link>
                </div>
            }
            <PreviewImage />
            <div>
                {
                    fileList.length > 0 && predictImageUri?.length === 0 ?
                        <Button
                            type="primary"
                            size="middle"
                            onClick={uploadAndPredict}
                            disabled={fileList.length === 0}
                            loading={predicting}
                            style={{ marginTop: 16 }}
                        >
                            {predicting ? '計算中...' : '開始計數'}
                        </Button>
                        :
                        <PredictResult pillsCount={pillsCount} predictImageUri={predictImageUri} />
                }
            </div>
        </div>
    );
}