import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(obj: string | object | Buffer, options?: jwt.SignOptions | undefined) {
  return jwt.sign(obj, config.get<string>("jwtSecret"), {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, config.get<string>("jwtSecret"));
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
