"use client";

import Image from "next/image";
import Link from "next/link";

import { socialLinks } from "@/libs/socialLinks";
import { coolveticaRegular } from "@/app/fonts/fonts";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const FooterComp = () => {
  const pathname = usePathname();
  const isHome = () => {
    if (pathname === "/") {
      return true;
    }
  };

  return (
    <footer
      className={clsx(isHome() ? "mt-4" : "", "bg-[rgba(1,11,26,1)] py-4")}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-y-2 lg:max-w-[972px] xl:max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-x-4">
          <Image
            src="/logo.png"
            width={64}
            height={68}
            alt="Rome Exchange Logo"
          />
          <div className="font-semibold">RomeSwap</div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-x-12 gap-y-2">
          <div
            className={`${coolveticaRegular.className} text-grayText lg:w-[260px] lg:text-3xl text-end font-light`}
          >
            Join our socials to get more updates!
          </div>
          <div className="flex items-center gap-x-3">
            {socialLinks.map((link, idx) => {
              return (
                <Link
                  href={link.link}
                  key={idx}
                  target="_blank"
                  className="text-2xl"
                >
                  {link.icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;
