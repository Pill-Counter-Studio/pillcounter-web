interface PredictResultProp {
    pillsCount: number
    predictImageUri: string
}

export default function PredictResult({ pillsCount, predictImageUri }: PredictResultProp) {
    const hasResult = predictImageUri?.length > 0;

    return hasResult ? <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>數量：{pillsCount}</div>
    </div> : null;
}