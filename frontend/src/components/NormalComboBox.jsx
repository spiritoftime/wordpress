import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

// normal comboBox that is not part of a react hook form.
export function NormalComboBox({
  options,
  validateProperty,
  displayProperty,
  fieldName,
  value,
  setValue,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  // console.log("Normal ComboBox Options: ", options);
  // console.log("Normal ComboBox Value: ", value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          disabled={disabled}
        >
          {value
            ? options.find((option) => {
                return (
                  option[displayProperty].toUpperCase() === value.toUpperCase()
                );
              })?.[displayProperty]
            : `Select ${fieldName}...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${fieldName}...`} />
          <CommandEmpty>{`No ${fieldName} found.`}</CommandEmpty>
          <CommandGroup>
            {options &&
              options.map((option) => {
                return (
                  <CommandItem
                    key={option[validateProperty]}
                    value={option[validateProperty]}
                    onSelect={(currentValue) => {
                      // If user reselect the same option, do not change the selected value
                      if (currentValue.toUpperCase() !== value.toUpperCase()) {
                        setValue(currentValue.toUpperCase());
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value &&
                          option &&
                          option[validateProperty].toUpperCase() ===
                            value.toUpperCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option[displayProperty]}
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
