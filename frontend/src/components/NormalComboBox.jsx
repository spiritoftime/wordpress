import * as React from "react";
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

// normal comboBox that is not part of a react hook form.
export function NormalComboBox({
  options,
  validateProperty,
  displayProperty,
  fieldName,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {options &&
              options.map((option) => (
                <CommandItem
                  key={option[validateProperty]}
                  value={option[validateProperty]}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue.toUpperCase() === value.toUpperCase()
                        ? ""
                        : currentValue.toUpperCase()
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      option[validateProperty] === value[validateProperty]
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option[displayProperty]}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
