import { JwtPayload } from "jwt-decode"

export interface GoogleJwtPayload extends JwtPayload {
    // Authorized party
    azp: string
    email: string
    email_verified: boolean
    name: string
    picture: string
    given_name: string
    family_name: string
    locale: string
    isPaid: boolean
}

/* Example of Google JWT payload
{
    "iss": "https://accounts.google.com",
    "azp": "929367097969-4fsv26cds7i22dlep2pfq229galvqm86.apps.googleusercontent.com",
    "aud": "929367097969-4fsv26cds7i22dlep2pfq229galvqm86.apps.googleusercontent.com",
    "sub": "108278494247513964661",
    "email": "madihsiang@gmail.com",
    "email_verified": true,
    "nbf": 1707227959,
    "name": "Eric Ma",
    "picture": "https://lh3.googleusercontent.com/a/ACg8ocLLsB4AjY4DzNYqeO5XA99xbgtWgd4d7xTZwIjrTWpkOh0=s96-c",
    "given_name": "Eric",
    "family_name": "Ma",
    "isPaid": false,
    "locale": "zh-TW",
    "iat": 1707228259,
    "exp": 1707231859,
    "jti": "599b55ae611619bf008163641d4188ab08ef0973"
}
*/

export interface UserInfo {
    username: string
    email: string
    avatar_uri: string
}

export interface RealtimeUserInfo {
    isPaid: boolean
    freeTriedCount: number
    canPredict: boolean
}

export interface Box {
    x1: number
    x2: number
    y1: number
    y2: number
    x_center: number
    y_center: number
}

export interface PredictRecord {
    id: string
    predict_img: {
        id: string
        uri: string
        is_deleted: boolean
        updated_at: string
        created_at: string
    }
    predict_img_id: string
    raw_img: {
        id: string
        uri: string
        is_deleted: boolean
        updated_at: string
        created_at: string
    }
    raw_img_id: string
    count: number
    created_at: string
    is_deleted: boolean
    user_id: string
    boxes: Box[]
    note: string
}

export interface PredictApiResponse {
    boxes: Box[]
    count: number
    raw_img_uri: string
    predict_img_uri: string
    predict_record_id: string
}

export interface SystemSetting {
    records_expired_days: number
    cleanup_per_minutes: number
    max_free_tried_number: number
    max_predict_number_after_paid: number
}