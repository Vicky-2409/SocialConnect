import { useEffect, useRef, useState } from "react";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { FRONTEND_DOMAIN, PAYU_MERCHANT_KEY } from "@/utils/constants";
import { IUser } from "@/types/types";
import { generateTxnId } from "@/utils/generateTxnId";

type props = {
  currUserData: IUser;
  postId: string;
};

const PayUComponent = ({ currUserData, postId }: props) => {
  const [hash, setHash] = useState(null);

  const { firstName, lastName, email } = currUserData;

  const txnidRef = useRef(generateTxnId(8));
  const txnid = txnidRef.current;
  const amount = parseFloat("1000").toFixed(2); // Ensure correct format
  const productinfo = postId;
  const firstname = firstName;
  const lastname = lastName;
  const key = PAYU_MERCHANT_KEY;
  const phone = "1234567890"; // Ensure this is a string
  const surl = `${FRONTEND_DOMAIN}/api/paymentSuccess`;
  const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;
  const service_provider = "payu_paisa";

  useEffect(() => {
    const data = { txnid, amount, productinfo, firstname, email, phone };

    (async function (data) {
      try {
        const res = await PayUApiCalls.paymentReq(data);
        setHash(res.hash);
      } catch (error: any) {
        console.error("Payment Error: " + error.message);
        alert(error.message);
      }
    })(data);
  }, [amount, email, firstname, productinfo, txnid]);

  return (
    <form action="https://test.payu.in/_payment" method="post">
      <input type="hidden" name="key" value={key} />
      <input type="hidden" name="txnid" value={txnid} />
      <input type="hidden" name="productinfo" value={productinfo} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="firstname" value={firstname} />
      <input type="hidden" name="lastname" value={lastname} />
      <input type="hidden" name="surl" value={surl} />
      <input type="hidden" name="furl" value={furl} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="hash" value={hash || ""} />
      {hash && (
        <button
          type="submit"
          value="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
        >
          <span>Pay with PayU</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default PayUComponent;
