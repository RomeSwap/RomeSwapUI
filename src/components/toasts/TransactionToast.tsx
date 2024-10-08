import { poppins } from "@/app/fonts/fonts";
import React from "react";

const TransactionToast: React.FC<ToastProps> = ({ status, tx }) => {
  return (
    <div className={`${poppins.className} text-sm text-grayText`}>
      Tx {status}: {tx}
    </div>
  );
};

export default TransactionToast;
