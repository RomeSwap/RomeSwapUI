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
        "h-screen overflow-hidden bg-[url('/swap-bg.png')] bg-cover bg-center bg-fixed",
        "before:absolute before:w-full before:h-screen before:top-0 before:right-0 before:bg-background/80 before:z-0",
      )}
    >
      <div className="absolute z-10 left-0 w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {children}
      </div>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
        <div className="hidden lg:block absolute -top-[0px] left-0 w-[300px] h-[300px] bg-[rgba(99,57,249,0.15)] rounded-br-full blur-[150px]"></div>
      </div>
    </main>
  );
}
