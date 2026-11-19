import dotenv from "dotenv";
import path from "node:path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT ,
    database_url : process.env.DATABASE_URL,
    app_url : process.env.APP_URL ,
    google_client_id: process.env.GOOGLE_CLIENT_ID!,
    bycrypt_salt : process.env.BYCRYPT_SALT,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in : process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in : process.env.JWT_REFRESH_EXPIRES_IN!,
    stripe_product_id : process.env.STRIPE_PRICE_ID!,
    stripe_secret_key : process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret_key : process.env.STRIPE_WEBHOOK_SECRET_KEY!,
    redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,
    smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	email_sender: process.env.EMAIL_SENDER!,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    judge0_api_url: process.env.JUDGE0_API_URL ?? "https://ce.judge0.com",
    judge0_api_key: process.env.JUDGE0_API_KEY ?? "",
    judge0_api_host: process.env.JUDGE0_API_HOST ?? "",
    judge0_language_ids: {
        python: process.env.JUDGE0_PYTHON_LANGUAGE_ID ?? "71",
        javascript: process.env.JUDGE0_JAVASCRIPT_LANGUAGE_ID ?? "63",
        cpp: process.env.JUDGE0_CPP_LANGUAGE_ID ?? "54",
        java: process.env.JUDGE0_JAVA_LANGUAGE_ID ?? "62",
    },
    judge0_poll_timeout_ms: Number(process.env.JUDGE0_POLL_TIMEOUT_MS ?? 45000),
    judge0_poll_interval_ms: Number(process.env.JUDGE0_POLL_INTERVAL_MS ?? 1000),
    max_source_code_length: Number(process.env.MAX_SOURCE_CODE_LENGTH ?? 100000),
    max_custom_input_length: Number(process.env.MAX_CUSTOM_INPUT_LENGTH ?? 10000),
}