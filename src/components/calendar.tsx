"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { buttonVariants } from "@/components/button";

import { cn } from "@/utils/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ disabled, ...props }: CalendarProps) {
  return (
    <DayPicker
      disabled={disabled}
      showOutsideDays={true}
      captionLayout="dropdown-buttons"
      className={cn()}
      classNames={{
        root: "pr-1",
        // months: "",
        // month: "",
        caption: "relative inline-flex justify-center items-center w-[145px]",
        caption_dropdowns:
          "relative inline-flex rounded-lg bg-background text-foreground border-[1px] border-muted w-[102px] flex justify-between shadow-sm shadow-muted",
        caption_label: "text-center w-[50px]",
        // dropdown_month: "",
        // dropdown_year: "",
        // nav: "",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "p-0 opacity-50 hover:opacity-100 text-foreground",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
      }}
      formatters={{
        formatMonthCaption: (month, options) => {
          return format(month, "MMM", options);
        },
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Row: () => null,
        Day: () => null,
        Head: () => null,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
