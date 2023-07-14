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
  value,
  setValue,
  options,
  fieldName,
  displayName,
  customHeight,
  validateProperty,
  displayProperty,
  buttonClassName,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              buttonClassName && `${buttonClassName}`,
              "w-[100%] justify-between",
              !value[validateProperty] && "text-muted-foreground"
            )}
          >
            {value[validateProperty]
              ? value[validateProperty]
              : `Select ${displayName}`}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command>
          <CommandInput placeholder={`Search ${displayName}`} />
          <CommandEmpty>{`No ${displayName} found`}</CommandEmpty>
          <CommandGroup>
            <ScrollArea
              className="w-[100%]"
              style={{ height: customHeight ? `${customHeight}px` : "72px" }}
            >
              {options.map((item) => {
                return (
                  <CommandItem
                    value={item[validateProperty]}
                    key={item[validateProperty]}
                    onSelect={() => {
                      setValue(fieldName, item);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value[validateProperty] &&
                          item[validateProperty].toUpperCase() ===
                            value[validateProperty].toUpperCase()
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
