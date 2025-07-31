export const DB_NAME = "vidtube";
export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRETE = process.env.ACCESS_TOKEN_SECRETE ?? "";
export const REFRESH_TOKEN_SECRETE = process.env.REFRESH_TOKEN_SECRETE ?? "";

export const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY || "0");
export const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY || "0");