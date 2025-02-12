import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Use NextRequest type instead of any
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  const data: { [key: string]: any } = {};

  try {
    const formData = await req.formData();
    formData.forEach((value: any, key: string) => {
      data[key] = value;
    });

    // Save to PayU orders collection
    const PayUOrderId = await PayUApiCalls.saveData(data);
  } catch (error: any) {
    console.log(error.message);
  }

  // Redirect after processing
  redirect(
    `/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`
  );
}
