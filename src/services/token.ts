const JWT = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

interface AnyObject {
  [key: string]: any;
}

export interface TokenData {
  user_id: string;
  username: string;
  status: boolean;
  jti?: string;
  exp?: number;
}

const lowerCaseObjectKeys = (obj: any): AnyObject => {
  const lower = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      lower[key.toLowerCase()] = obj[key];
    }
  }

  return lower;
};

export const generate = (
  user_id: number,
  username: string,
  status: string
): string => {
  const jti = require('crypto').randomUUID();
  const data = {
    user_id: user_id as number,
    username: username as string,
    status: status as string,
    jti
  };
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.TOKEN_SECRET
  );

  return JWT.sign(
    { encrypted: encryptedData.toString(), jti },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

export const verify = (token: string): Promise<TokenData> => {
  return new Promise<TokenData>((resolve, reject) => {
    try {
      const tokenEncryptedData = JWT.verify(
        token,
        process.env.TOKEN_SECRET_KEY
      );

      const bytes = CryptoJS.AES.decrypt(
        tokenEncryptedData.encrypted.toString(),
        process.env.TOKEN_SECRET
      );

      const tokenData: TokenData = JSON.parse(
        bytes.toString(CryptoJS.enc.Utf8)
      );
      tokenData.jti = tokenEncryptedData.jti;
      tokenData.exp = tokenEncryptedData.exp;
      resolve(tokenData);
    } catch (error) {
      reject(error);
    }
  });
};

export const decode = (token: string): Promise<TokenData> => {
  return new Promise(async (resolve, reject) => {
    try {
      let verifiedToken: TokenData = await verify(token);
      return resolve(verifiedToken);
    } catch (error) {
      return reject(error);
    }
  });
};
