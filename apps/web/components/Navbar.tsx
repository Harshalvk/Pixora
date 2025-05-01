import { ModeToggle } from "@repo/ui/components/ModeToggle";
import { Metadata } from "next";
import React from "react";
import WalletConnection from "./WalletConnection";

export const metadata: Metadata = {
  title: "Home",
  description: "Where user can view tasks my other workers",
};

const Navbar = () => {
  return (
    <nav className="p-2 border-b flex justify-between">
      <p className="font-black text-xl sm:text-2xl">Pixora</p>
      <div className="flex gap-2">
        <ModeToggle />
        <WalletConnection />
      </div>
    </nav>
  );
};

export default Navbar;
