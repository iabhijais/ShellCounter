"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ActiveShellIcon from "./icons/active-shell-icon";
import BlankShellIcon from "./icons/blank-shell-icon";
import { useEffect } from "react";

const formSchema = z.object({
  active: z.coerce.number().min(0, "Must be 0 or more.").max(8, "Max 8 shells."),
  blank: z.coerce.number().min(0, "Must be 0 or more.").max(8, "Max 8 shells."),
}).refine(data => data.active + data.blank > 0, {
  message: "There must be at least one shell.",
  path: ["active"],
}).refine(data => data.active + data.blank <= 8, {
  message: "Total shells cannot exceed 8.",
  path: ["active"],
});

type ResetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReset: (active: number, blank: number) => void;
  currentActive: number;
  currentBlank: number;
};

export function ResetModal({ isOpen, onClose, onReset, currentActive, currentBlank }: ResetModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: currentActive,
      blank: currentBlank,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        active: currentActive,
        blank: currentBlank,
      });
    }
  }, [isOpen, currentActive, currentBlank, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onReset(values.active, values.blank);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>
            Set the number of shells for this game. Maximum of 8 total shells.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right flex items-center justify-end gap-2">
                      <div className="w-5 h-5"><ActiveShellIcon /></div>
                      Active
                    </FormLabel>
                    <FormControl>
                      <Input type="number" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blank"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right flex items-center justify-end gap-2">
                       <div className="w-5 h-5"><BlankShellIcon /></div>
                      Blank
                    </FormLabel>
                    <FormControl>
                      <Input type="number" className="col-span-3" {...field} />
                    </FormControl>
                     <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                Start Game
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
