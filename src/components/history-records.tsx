import { useEffect, useRef, useState } from "react"
import { Button, Card, Image, Result } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { FALLBACK_IMAGE, getTime } from "../utils"
import { PredictRecord } from "../types";
import Loading from "./loading";
import TextArea, { TextAreaRef } from "antd/es/input/TextArea";
import { deleteRecord, getHistoryRecords, getSystemSetting, updateRecordNote } from "../apis";
import Swal from "sweetalert2";

const { Meta } = Card;

const boxShadowStyle = "10px 8px 24px 5px rgba(208, 216, 243, 0.6)";

function Note({ content, recordId, showTextArea, closeTextArea }: { content: string, recordId: string, showTextArea: boolean, closeTextArea: any }) {
    const noteRef = useRef<TextAreaRef | null>(null);
    const [note, setNote] = useState(content);
    const [hasError, setHasError] = useState(false);

    const save = async () => {
        const note = noteRef.current?.resizableTextArea?.textArea.value ?? "";
        updateRecordNote(recordId, note).then(updatedRow => {
            setNote(note);
            setHasError(false);
        }).catch(err => {
            console.error(err);
            setNote(content);
            setHasError(true);
        }).finally(() => {
            closeTextArea();
        })
    }

    return <div>
        <div style={{ margin: 3 }}>
            <span>備註:</span>
            {
                showTextArea ?
                    <div style={{ marginTop: 5 }}>
                        <TextArea
                            ref={noteRef}
                            showCount
                            maxLength={100}
                            // onChange={onChange}
                            defaultValue={note}
                            allowClear
                            style={{ resize: 'none' }}
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            status={hasError ? "error" : ""}
                        />
                        <Button size="small" type="primary" style={{ marginTop: 10 }} onClick={save}>儲存</Button>
                        <Button size="small" type="default" style={{ marginLeft: 5, marginTop: 10 }} onClick={closeTextArea}>取消</Button>
                    </div>
                    :
                    <span style={{ marginLeft: 5, overflowWrap: "break-word" }}>
                        {note}
                    </span>
            }
        </div>
    </div>
}

function HistoryRecords() {
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState<PredictRecord[]>([]);
    const [showTextAreaIdx, setShowTextAreaIdx] = useState(-1);
    const [expiredDays, setExpiredDays] = useState(7);

    const openTextArea = (idx: number) => {
        setShowTextAreaIdx(idx);
    }

    const closeTextArea = () => {
        setShowTextAreaIdx(-1);
    }

    const fetchHistoryRecords = () => {
        setIsLoading(true);
        getHistoryRecords()
            .then(records => {
                setRecords(records);
            }).catch(err => {
                console.error(err);
                setRecords([]);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        fetchHistoryRecords();
        getSystemSetting().then(setting => {
            if (setting) {
                setExpiredDays(setting.records_expired_days);
            }
        })
    }, [])

    const deleteOneRecord = (recordId: string) => {
        Swal.fire({
            title: "刪除記錄?",
            text: "確定要刪除這筆記錄嗎?",
            icon: "warning",
            confirmButtonText: "確認刪除",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRecord(recordId).then(() => {
                    Swal.fire({
                        title: "成功刪除",
                        text: "成功刪除該筆歷史記錄",
                        icon: "success"
                    }).finally(() => {
                        fetchHistoryRecords();
                    })
                }).catch(err => {
                    console.error(err);
                    Swal.fire({
                        title: "刪除失敗",
                        text: "無法刪除該筆歷史記錄",
                        icon: "error"
                    })
                })

            }
        });
    }

    return <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "gray", margin: "auto" }}>只保留最近 {expiredDays} 天的歷史記錄</span>
        <br />
        {
            isLoading ? <Loading /> : <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "flex-start" }}>
                {
                    records.length > 0 ? records?.map((each, idx) => {
                        return <Card
                            key={each.id}
                            hoverable={false}
                            size="small"
                            style={{ width: 250, margin: 12, boxShadow: boxShadowStyle }}
                            title={getTime(new Date(each.created_at), "yyyy/MM/dd HH:mm:ss")}
                            cover={<Image alt="Predict Image" src={each.predict_img.uri} fallback={FALLBACK_IMAGE} />}
                            actions={[
                                <EditOutlined style={{ cursor: "pointer" }} onClick={() => openTextArea(idx)} />,
                                <DeleteOutlined key="delete" onClick={() => deleteOneRecord(each.id)} />,
                            ]}
                        >
                            <Meta
                                title={
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <p style={{ marginLeft: 3 }}>數量：{each.count}</p>
                                        </div>
                                    </div>
                                }
                                description={
                                    <div>
                                        <Note content={each.note} recordId={each.id} showTextArea={idx === showTextAreaIdx} closeTextArea={closeTextArea} />
                                    </div>
                                } />
                        </Card>
                    }) : <Result
                        status="info"
                        title="尚未有歷史記錄"
                        subTitle="趕緊拍張照片上傳吧"
                    />
                }
            </div>
        }
    </div>
}


export default HistoryRecords