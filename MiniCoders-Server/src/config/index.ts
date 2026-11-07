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

}