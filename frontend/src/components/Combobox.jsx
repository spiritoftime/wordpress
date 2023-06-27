import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl } from "./ui/form";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Combobox = ({ field, setValue, options, fieldName }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[100%] justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? options.find(
                  (item) =>
                    item.value.toUpperCase() === field.value.toUpperCase()
                )?.label
              : `Select ${fieldName}`}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command>
          <CommandInput placeholder={`Search ${fieldName}`} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="w-[100%] h-72">
              {options.map((item) => (
                <CommandItem
                  value={item.value}
                  key={item.value}
                  onSelect={(value) => {
                    console.log(value);
                    setValue(`${fieldName.toLowerCase()}`, value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value.toUpperCase() === field.value.toUpperCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
