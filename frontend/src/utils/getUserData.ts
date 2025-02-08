import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { unstable_noStore as noStore } from "next/cache";
import { JWT_SECRET } from "./constants";

export default async function getUserData(): Promise<any> {
  noStore();

  const cookieStore = await cookies();
  const token = cookieStore.get("token") || { name: "token", value: "" };
  if (!token.value.length) throw new Error("Token not found");

  const secret = JWT_SECRET || "";
  if (!secret) throw new Error("JWT secret not found");
  try {
    let data = jwt.verify(token.value, secret);

    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
