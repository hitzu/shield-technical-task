import { randomUUID } from 'crypto';

import CryptoJS from 'crypto-js';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenData {
  user_id: string;
  username: string;
  status: boolean;
  jti?: string;
  exp?: number;
}

export const generate = (
  user_id: number,
  username: string,
  status: string
): string => {
  const jti = randomUUID();
  const data = { user_id, username, status, jti };
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    String(process.env.TOKEN_SECRET)
  );

  return jwt.sign(
    { encrypted: encryptedData.toString(), jti },
    String(process.env.TOKEN_SECRET_KEY),
    { expiresIn: String(process.env.JWT_EXPIRATION) }
  );
};

export const verify = (token: string): Promise<TokenData> =>
  new Promise<TokenData>((resolve, reject) => {
    try {
      const decoded = jwt.verify(
        token,
        String(process.env.TOKEN_SECRET_KEY)
      ) as JwtPayload;
      const bytes = CryptoJS.AES.decrypt(
        String(decoded.encrypted),
        String(process.env.TOKEN_SECRET)
      );
      const tokenData: TokenData = JSON.parse(
        bytes.toString(CryptoJS.enc.Utf8)
      );
      tokenData.jti = decoded.jti as string | undefined;
      tokenData.exp = decoded.exp as number | undefined;
      resolve(tokenData);
    } catch (error) {
      reject(error);
    }
  });

export const decode = (token: string): Promise<TokenData> =>
  new Promise((resolve, reject) => {
    verify(token)
      .then(resolve)
      .catch(reject);
  });
