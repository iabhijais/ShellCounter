
"use client";

import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ActiveShellIcon from "./icons/active-shell-icon";
import BlankShellIcon from "./icons/blank-shell-icon";
import type { ShellType } from "@/app/page";
import { X } from "lucide-react";

type TipPopoverProps = {
  children: ReactNode;
  onSelect: (type: ShellType | null) => void;
  hasTip?: boolean;
};

export function TipPopover({ children, onSelect, hasTip = false }: TipPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: ShellType | null) => {
    onSelect(type);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14"
            onClick={() => handleSelect("active")}
          >
            <ActiveShellIcon className="w-10 h-10" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14"
            onClick={() => handleSelect("blank")}
          >
            <BlankShellIcon className="w-10 h-10" />
          </Button>
          {hasTip && (
             <Button
                variant="destructive"
                size="icon"
                className="w-14 h-14"
                onClick={() => handleSelect(null)}
            >
                <X className="w-8 h-8" />
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
