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
    name: "Info",
    href: "https://www.icecreamswap.com/info",
    isExternal: true,
  },
];
