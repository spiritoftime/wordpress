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
// validateProperty would be what property you would like to check, in countries.js it would be the value property.
// displayProperty is what property should be displayed in the frontend. in countries.js it would be the label property
const Combobox = ({
  field,
  setValue,
  options,
  fieldName,
  validateProperty,
  displayProperty,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[100%] justify-between",
              !field[validateProperty] && "text-muted-foreground"
            )}
          >
            {field[validateProperty]
              ? options.find(
                  (item) =>
                    item[validateProperty].toUpperCase() ===
                    field[validateProperty].toUpperCase()
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
              {options.map((item) => {
                return (
                  <CommandItem
                    value={item[validateProperty]}
                    key={item[validateProperty]}
                    onSelect={(value) => {
                      setValue(`${fieldName.toLowerCase()}`, value);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item[validateProperty].toUpperCase() ===
                          field[validateProperty].toUpperCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item[displayProperty]}
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
