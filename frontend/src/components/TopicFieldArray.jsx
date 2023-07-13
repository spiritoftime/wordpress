import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useFieldArray } from "react-hook-form";
import { Input } from "./ui/input";
import FormMultiSelect from "./FormMultiSelect";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useAppContext } from "../context/appContext";

const TopicFieldArray = ({ control, fields: topicDetails }) => {
  const noOptions = [{ value: "", label: "" }];
  console.log("topicdetails", topicDetails);

  return (
    <div className="flex flex-col gap-4">
      {topicDetails.map((field, index) => (
        <div
          className={`w-full flex items-center gap-3  ${
            index === 0 ? "w-[95%] mt-1" : "w-[95%] mt-3"
          }`}
          key={`${field.id}`}
        >
          <div className={"w-[25%]"}>
            <FormField
              control={control}
              name={`topics.${index}.startTime`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Start Time:</FormLabel>}
                  <FormControl>
                    <Input placeholder="Start Time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={"w-[25%]"}>
            <FormField
              control={control}
              name={`topics.${index}.endTime`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>End Time:</FormLabel>}
                  <FormControl>
                    <Input placeholder="End Time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={"w-[25%]"}>
            <FormField
              control={control}
              name={`topics.${index}.topic`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Topic:</FormLabel>}
                  <FormControl>
                    <Input readOnly={true} placeholder="Topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={"w-[25%]"}>
            <FormField
              control={control}
              name={`topics.${index}.speakers`}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Speaker:</FormLabel>}
                  <FormControl>
                    <FormMultiSelect
                      readOnly={true}
                      options={noOptions}
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicFieldArray;
