import { hash } from "crypto";
import { NextResponse } from "next/server";

const MERCURYO_BASE_URL = "https://exchange.mercuryo.io/";
const SECRET = process.env.MERCURYO_SECRET ?? "missing";
const WIDGET_ID = process.env.MERCURYO_WIDGET_ID ?? "missing";

const genSignature = (address: string, secret: string) => {
  return hash("sha256", `${address}:${secret}`);
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const token = searchParams.get("token");
  const currency = searchParams.get("currency");
  const amount = searchParams.get("amount");

  if (!address || !token || !currency || !amount) {
    return NextResponse.error();
  }

  const signature = genSignature(address, SECRET);

  const params = {
    widget_id: WIDGET_ID,
    type: "buy",
    currency,
    network: "SOLANA",
    amount,
    fiat_currency: "EUR",
    address,
    signature,
  };

  return NextResponse.json({
    url: `${MERCURYO_BASE_URL}?${new URLSearchParams(params).toString()}`,
  });
};
