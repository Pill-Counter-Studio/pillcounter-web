import { Button, Card, Col, Collapse, CollapseProps, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getRealtimeUserInfo, getSystemSetting } from "../apis";

const { Meta } = Card;

const boxShadowStyle = "10px 8px 24px 5px rgba(208, 216, 243, 0.6)";

export default function PaymentPage() {
    const [maxFreeTriedCnt, setMaxFreeTriedCnt] = useState(5);
    const [availablePredictCnt, setAvailablePredictCnt] = useState(100);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        getSystemSetting().then(setting => {
            if (setting) {
                setMaxFreeTriedCnt(setting.max_free_tried_number);
                setAvailablePredictCnt(setting.max_predict_number_after_paid);
            }
        })
        getRealtimeUserInfo().then(info => {
            if (info) {
                setIsPaid(info.isPaid);
            }
        })
    }, [])

    const upgrade = async () => {
        const payload = await fetch(`${process.env.REACT_APP_PAYMENT_SERVER_URL}/order`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).catch(err => {
            console.error(err);
        });

        document.getElementById("payForm")?.setAttribute("action", payload.PayGatewayUrl);
        document.getElementById("merchantId")?.setAttribute("value", payload.MerchantID);
        document.getElementById("postData")?.setAttribute("value", payload.PostData);
        document.getElementById("createOrderBtn")?.click();
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Q: 我們的服務有什麼特色？',
            children: <div>
                我們的服務有以下幾點特色：
                <ul>
                    <li>
                        <b>免海外刷卡手續費</b>:
                        <p>
                            與國外的商用 APP 相比，您只需要刷國內的信用卡就能省去海外刷卡的高額手續費，對於每月訂閱的用戶，省下來的錢都可以拿去買一杯咖啡了！
                        </p>
                    </li>
                    <li>
                        <b>高達95%的準確度</b>:
                        <p>
                            我們透過 AI 訓練後的影像辨識模型，預測準確率高達 95% ! 對於每天都要數藥丸的用戶來說，可以大幅節省您寶貴的時間！
                        </p>
                    </li>
                    <li>
                        <b>保存歷史預測紀錄</b>:
                        <p>
                            系統會自動保存每次辨識的照片，可隨時回溯確認！
                        </p>
                    </li>
                    <li>
                        <b>標記/分類功能</b>:
                        <p>
                            過往的預測紀錄，可讓用戶寫下任何註記，輕鬆標註每張預測後的照片，不再煩惱照片太多該如何管理！
                        </p>
                    </li>
                </ul>
            </div>,
        },
        {
            key: '2',
            label: 'Q: 我可以先試用看看嗎？',
            children: <div>可以！我們提供以下兩種方案:
                <ol>
                    <li>免費版: <b>單日上限 {maxFreeTriedCnt} 次</b>，每日午夜 12:00 恢復額度</li>
                    <li>付費版: <b>單日上限 {availablePredictCnt} 次</b>，每日午夜 12:00 恢復額度</li>
                </ol>
            </div>,
        },
        {
            key: '3',
            label: 'Q: 付款方式有哪些？金流是安全的嗎？',
            children: <p>付款採<b>訂閱制</b>，綁定信用卡後將每月扣款，採用第三方 <a href="https://www.newebpay.com/">藍新金流</a> 作為收款管道，是安全無虞的金流方式！</p>,
        },
    ];

    return <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Back</Button>
        <Row justify="center" style={{ overflow: "auto", display: "flex", flexDirection: "row" }}>
            <Col span={12} style={{ padding: 10, display: "flex", justifyContent: 'center' }}>
                <Card
                    cover={<img src="./free-plan.jpeg" />}
                    style={{ width: 250, boxShadow: boxShadowStyle }}
                >
                    <Meta title="免費版" description={`單日上限 ${maxFreeTriedCnt} 次`} />
                </Card>
            </Col>
            <Col span={12} style={{ padding: 10, display: "flex", justifyContent: 'center' }}>
                <Card
                    cover={<img src="./paid-plan.jpeg" />}
                    style={{ width: 250, boxShadow: boxShadowStyle }}
                    actions={[
                        <Button type={isPaid ? "dashed" : "primary"} disabled={isPaid} onClick={upgrade}>{isPaid ? "已升級" : "升級"}</Button>
                    ]}
                >
                    <Meta title="付費版" description={`單日上限 ${availablePredictCnt} 次`} />
                </Card>
            </Col>
        </Row>
        <form hidden id="payForm" action="" method="post">
            <input id="merchantId" type="text" name="MerchantID_" value="" readOnly />
            <input id="postData" type="hidden" name="PostData_" value="" readOnly />
            <button id="createOrderBtn" type="submit"></button>
        </form>
        <Row>
            <Collapse items={items} defaultActiveKey={['1', '2', '3']} style={{ width: "100%", margin: 20 }} />
        </Row>
    </div>
}