// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextApiResponse } from "next";
// import { redirect } from "next/navigation";

// export async function POST(req: any, res: NextApiResponse) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();

//   const data: { [key: string]: any } = {};
//   formData.forEach((value: any, key: string) => {
//     data[key] = value;
//   });
//   console.log(data);

//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.log(error.message);
//   }
//   redirect(
//     `/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`
//   );
// }

// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { FRONTEND_DOMAIN } from "@/utils/constants";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();
//   const data: { [key: string]: any } = {};

//   formData.forEach((value, key) => {
//     data[key] = value;
//   });

//   console.log(data);

//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.error("Error processing payment:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   const baseUrl = FRONTEND_DOMAIN || "http://localhost:3000";

//   return NextResponse.redirect(
//     `${baseUrl}/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`
//   );
// }




// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextResponse } from "next/server";
// import { useRouter } from "next/router";
// export async function POST(req: any) {
//   const router = useRouter()
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();

//   const data: { [key: string]: any } = {};
//   formData.forEach((value: any, key: string) => {
//     data[key] = value;
//   });

//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.log(error.message);
//   }
// console.log(`http://localhost:3000/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`);

// router.push(`http://localhost:3000/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`)
//   // return NextResponse.redirect(
//   //   `http://localhost:3000/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`
//   // );
// }
















// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();
//   const data: { [key: string]: any } = {};

//   formData.forEach((value, key) => {
//     data[key] = value;
//   });



//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.error("Error processing payment:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   const redirectUrl = `http://localhost:3000/post/promote/paymentCompleted/?status=${data.status}&mihpayid=${data.mihpayid}`;
//   console.log("Redirecting to:", redirectUrl);

//   return NextResponse.redirect(redirectUrl);
// }















// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextResponse } from "next/server";
// import { FRONTEND_DOMAIN } from "@/utils/constants"; // Ensure this is correctly set

// export async function POST(req: Request) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();
//   const data: { [key: string]: any } = {};

//   formData.forEach((value, key) => {
//     data[key] = value;
//   });


//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.error("Error processing payment:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   // ✅ Ensure all values are correctly set
//   const status = data.status ?? "failed";  // Default to "failed" if status is null
//   const mihpayid = data.mihpayid ?? "unknown";  // Default to "unknown" if mihpayid is null

//   const baseUrl = FRONTEND_DOMAIN || "http://localhost:3000"; // Fallback if FRONTEND_DOMAIN is not set
//   const redirectUrl = `${baseUrl}/post/promote/paymentCompleted/?status=${status}&mihpayid=${mihpayid}`;

//   console.log("Redirecting to:", redirectUrl);

//   return NextResponse.redirect(redirectUrl);
// }









// import adsService from "@/utils/apiCalls/adsService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextResponse } from "next/server";
// import { FRONTEND_DOMAIN } from "@/utils/constants"; 

// export async function POST(req: Request) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();
//   const data: { [key: string]: any } = {};

//   formData.forEach((value, key) => {
//     data[key] = value;
//   });

//   console.log("Payment Data:", data);

//   try {
//     const PayUOrderId = await PayUApiCalls.saveData(data);
//     await adsService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.error("Error processing payment:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   // ✅ Prevent invalid values
//   const status = data.status ?? "failed";  
//   const mihpayid = data.mihpayid ?? "unknown";  

//   // ✅ Ensure `baseUrl` is valid
//   const baseUrl = FRONTEND_DOMAIN?.trim() || "http://localhost:3000";  

//   // ✅ Construct a valid URL
//   const redirectUrl = `${baseUrl}/post/promote/paymentCompleted/?status=${status}&mihpayid=${mihpayid}`;

//   console.log("Redirecting to:", redirectUrl); // Debugging log

//   try {
//     return NextResponse.redirect(new URL(redirectUrl)); // Use `new URL()` to validate
//   } catch (error) {
//     console.error("Invalid URL:", redirectUrl, error);
//     return NextResponse.json({ error: "Invalid redirect URL" }, { status: 500 });
//   }
// }







import adsService from "@/utils/apiCalls/adsService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextResponse } from "next/server";
import { FRONTEND_DOMAIN } from "@/utils/constants"; 

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  
  // Validate content type
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
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
  const baseUrl = FRONTEND_DOMAIN?.trim().replace(/\/+$/, '') || "http://35.225.102.73";
  
  // Safely encode URL components
  const queryParams = new URLSearchParams({
    status: status,
    mihpayid: mihpayid
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