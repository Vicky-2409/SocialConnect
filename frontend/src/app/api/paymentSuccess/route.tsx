import adsService from "@/utils/apiCalls/adsService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextResponse } from "next/server";
import { FRONTEND_DOMAIN } from "@/utils/constants";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  // Validate content type
  if (
    !contentType.includes("multipart/form-data") &&
    !contentType.includes("application/x-www-form-urlencoded")
  ) {
    return NextResponse.json(
      { error: "Unsupported Media Type" },
      { status: 415 }
    );
  }

  const formData = await req.formData();
  const data: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Extract critical fields with defaults
  const status = data.status?.toString() ?? "failed";
  const mihpayid = data.mihpayid?.toString() ?? "unknown";
  const email = data.email?.toString() ?? "unknown@example.com";

  try {
    const PayUOrderId = await PayUApiCalls.saveData(data);
    // Use actual payment status for transaction recording
    await adsService.addTransaction(PayUOrderId, email, status);
  } catch (error: any) {
    console.error("Error processing payment:", error);
    // Avoid exposing internal errors to the client
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  // Sanitize and format base URL
  const baseUrl = FRONTEND_DOMAIN?.trim().replace(/\/+$/, "");

  // Safely encode URL components
  const queryParams = new URLSearchParams({
    status: status,
    mihpayid: mihpayid,
  }).toString();

  const redirectUrl = `${baseUrl}/post/promote/paymentCompleted/?${queryParams}`;

  try {
    // Redirect with appropriate HTTP status
    return NextResponse.redirect(new URL(redirectUrl), 303);
  } catch (error) {
    console.error("Invalid URL construction:", error);
    return NextResponse.json(
      { error: "Internal configuration error" },
      { status: 500 }
    );
  }
}
