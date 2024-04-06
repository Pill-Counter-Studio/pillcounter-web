import { useCallback, useRef, useState } from 'react';
import { Button, Image, message } from "antd"
import Webcam from 'react-webcam';
import Loading from '../loading';
import PredictResult from './predict-result';
import { dataURItoFile, getUploadFilename, notify, PREVIEW_IMAGE_WIDTH_PIXEL } from '../../utils';
import predictImage from '../../apis';
import { Link } from 'react-router-dom';

const videoConstraints = {
    width: window.innerWidth - 80,
    height: window.innerWidth - 80,
    facingMode: "environment"
    // "user"
};

export default function CaptureSection({ canPredict }: { canPredict: boolean }) {
    const [predicting, setPredicting] = useState(false);
    const [pillsCount, setPillsCount] = useState(0);
    const [capturedImg, setCapturedImg] = useState(null);
    const [predictImageUri, setPredictImageUri] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);

    const [messageApi, contextHolder] = message.useMessage();

    const imgRef = useRef<HTMLImageElement | null>(null);

    const uploadRealtimeCaptureImg = () => {
        const img = imgRef.current?.firstChild?.firstChild as HTMLImageElement | null;
        if (img && img.src) {
            const filename = getUploadFilename()
            // console.log(filename)
            const file = dataURItoFile(img.src, filename);

            if (file) {
                const formData = new FormData();
                formData.append('files', file);

                setPredicting(true);
                predictImage(formData).then(data => {
                    if (typeof data === "string") {
                        notify({
                            api: messageApi,
                            type: "error",
                            content: "已經用完額度，請付費升級！"
                        })
                    } else {
                        if (data) {
                            setPillsCount(data.count);
                            setPredictImageUri(data.predict_img_uri);
                        }
                    }
                }).catch(err => {
                    console.error(err)
                    notify({
                        api: messageApi,
                        type: "error",
                        content: "計數失敗，請確認網路狀態是否穩定"
                    })
                }).finally(() => {
                    setPredicting(false);
                })
            } else {
                notify({
                    api: messageApi,
                    type: "error",
                    content: "找不到照片，無法計數 :("
                })
            }
        } else {
            notify({
                api: messageApi,
                type: "error",
                content: "找不到照片，無法計數 :("
            })
        }
    }

    const resetCapturedImg = () => {
        setCapturedImg(null);
    }

    const reset = () => {
        setCapturedImg(null);
        setPredictImageUri("");
        setPillsCount(0);
    }

    const WebcamCapture = () => {
        const webcamRef = useRef(null);

        const capture = useCallback(() => {
            if (webcamRef.current) {
                const screenshot = (webcamRef.current as any).getScreenshot();
                setCapturedImg(screenshot);
            }
        }, [webcamRef]);

        const PreviewImage = () => {
            // Has predict image
            if (predictImageUri?.length > 0) {
                return <Image width={PREVIEW_IMAGE_WIDTH_PIXEL} style={{ objectFit: "fill", borderRadius: 8, margin: "auto", marginTop: 20 }} src={predictImageUri} />
            } else {
                // Has screenshot
                if (capturedImg !== null) {
                    return <span ref={imgRef} style={{ marginTop: 20 }} >
                        <Image width={PREVIEW_IMAGE_WIDTH_PIXEL} style={{ objectFit: "fill", borderRadius: 8, margin: "auto" }} src={capturedImg} />
                    </span>
                }
            }
            return null;
        }

        const ButtonGroups = () => {
            // Has predict image
            if (predictImageUri?.length > 0) {
                return <Button size="large" type="primary" style={{ marginTop: 20 }} onClick={reset}>再來一張</Button>
            } else {
                // Has screenshot
                if (capturedImg !== null) {
                    return <div style={{ marginTop: 12, display: "flex", flexDirection: "row" }}>
                        <Button style={{ margin: 5 }} size="large" type="primary" danger onClick={resetCapturedImg}>重新拍照</Button>
                        <Button loading={predicting} style={{ margin: 5 }} size="large" type="primary" onClick={uploadRealtimeCaptureImg}>開始計數</Button>
                    </div>
                }
            }
            return <Button size="large" type="primary" style={{ marginTop: 5 }} onClick={capture}>拍照</Button>
        }

        return canPredict ? <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }
        } >
            {isInitializing && <Loading style={{ marginTop: 30 }} />}
            <PreviewImage />
            <Webcam
                style={{ margin: 20 }}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={(mediaStream: MediaStream) => {
                    if (mediaStream.active) {
                        setIsInitializing(false);
                    }
                }}
                hidden={capturedImg !== null || predictImageUri?.length > 0}
            />
            <ButtonGroups />
        </div > :
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p>今日額度已用完</p>
                <Link to="/payment">
                    <Button size="small" type="primary">繼續使用</Button>
                </Link>
            </div>
    };

    return <div style={{ display: "flex", flexDirection: "column" }}>
        {contextHolder}
        <WebcamCapture />
        <PredictResult pillsCount={pillsCount} predictImageUri={predictImageUri} />
    </div>

}