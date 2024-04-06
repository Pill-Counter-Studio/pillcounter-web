import { PaymentSettings, PredictApiResponse, PredictRecord, RealtimeUserInfo, SystemSetting } from "./types";

export default async function predictImage(formData: FormData): Promise<PredictApiResponse | null> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/predict`, {
        method: 'POST',
        body: formData,
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 403) {
                return "Cannot predict image"
            }
            throw Error(`Cannot predict image, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
}

export async function getHistoryRecords(): Promise<PredictRecord[]> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/records`, {
        method: "GET",
        credentials: "include",
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot fetch history records, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
}

export async function updateRecordNote(record_id: string, note: string): Promise<PredictRecord | null> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/records/${record_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            note
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot update the note of record ${record_id}, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
}

export async function deleteRecord(record_id: string): Promise<number | null> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/records/${record_id}`, {
        method: "DELETE",
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot delete the record ${record_id}, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
}

export async function getPaymentSettings(): Promise<PaymentSettings | null> {
    return await fetch(`${process.env.REACT_APP_PAYMENT_SERVER_URL}/settings`, {
        method: "GET",
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot retrieve the payment settings, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return data;
        })
        .catch(err => {
            console.error(err);
            return null;
        })
}

export async function getRealtimeUserInfo(): Promise<RealtimeUserInfo | null> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/user`, {
        method: "GET",
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot retrieve the user, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)

            let canPredict = false;
            if (data.is_paid && data.available_predict_count > 0) {
                canPredict = true;
            } else if (!data.is_paid && data.free_tried_count > 0) {
                canPredict = true;
            }

            return {
                isPaid: data.is_paid,
                freeTriedCount: data.free_tried_count,
                canPredict,
                availablePredictCount: data.available_predict_count
            }
        })
        .catch(err => {
            console.error(err);
            return null;
        })
}

export async function getSystemSetting(): Promise<SystemSetting | null> {
    return await fetch(`${process.env.REACT_APP_MODEL_SERVER_URL}/settings`, {
        method: "GET",
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`Cannot get the settings, status code: ${res.status}, message: ${res.statusText}`);
        })
        .then(data => {
            // console.log(data)
            return {
                records_expired_days: data.schedule.records_expired_days,
                cleanup_per_minutes: data.schedule.cleanup_per_minutes,
                max_free_tried_number: data.application.max_free_tried_number,
                max_predict_number_after_paid: data.application.max_predict_number_after_paid
            }
        })
        .catch(err => {
            console.error(err);
            return null;
        })
}
