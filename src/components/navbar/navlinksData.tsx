import { IoHome, IoSwapHorizontal } from "react-icons/io5";

export const navLinksData = [
  {
    name: "Home",
    href: "/",
    icon: <IoHome />,
  },
  {
    name: "Swap",
    href: "/swap",
    icon: <IoSwapHorizontal />,
  },
  {
    name: "Bridge",
    href: "https://www.icecreamswap.com/bridge",
    isExternal: true,
  },
  {
    name: "Onramp",
    href: "https://exchange.mercuryo.io/?widget_id=d950fbc7-9c58-4f04-bedc-dad3dd03d004&type=buy&network=SOLANA&currency=SOL&signature=8b1ebb7fbe0f56280f42eaf8e2cb7ebabd4f3c3d760373c214c509b3d7ffe50a",
    isExternal: true,
  },
];
