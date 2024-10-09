import { Metadata } from "next";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Swap | RomeSwap",
};

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={clsx(
        "h-screen overflow-hidden bg-[url('/swap-bg.png')] bg-cover bg-center",
        "before:absolute before:w-full before:h-full before:top-0 before:right-0 before:bg-background/80 before:z-0",
      )}
    >
      <div className="absolute left-0 w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {children}
      </div>
    </main>
  );
}
