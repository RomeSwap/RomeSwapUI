import React from "react";

import clsx from "clsx";
import { GoCheckCircle, GoPlusCircle, GoXCircle } from "react-icons/go";

interface ToastProps {
  status: "error" | "idle" | "pending" | "success";
  tx: string;
}

const getClass = (status: "error" | "idle" | "pending" | "success") => {
  switch (status) {
    case "success":
      return "bg-primary/10 border-primary";
    case "pending":
      return "bg-pending/10 border-pending";
    case "error":
      return "bg-error/10 border-error";
  }
};

const TransactionToast: React.FC<ToastProps> = ({ status, tx }) => {
  console.log("asdf");
  return (
    <div
      className={
        (clsx("flex items-center border p-4 rounded-md"), getClass(status))
      }
    >
      <div className="text-2xl">
        {status == "success" && (
          <div className="text-primary">
            <GoCheckCircle />
          </div>
        )}
        {status == "error" && (
          <div className="text-error">
            <GoXCircle />
          </div>
        )}
        {status == "pending" && (
          <div className="text-pending">
            <GoPlusCircle />
          </div>
        )}
      </div>
      <div className="text-sm">
        Tx {status}: {tx}
      </div>
    </div>
  );
};

export default TransactionToast;
