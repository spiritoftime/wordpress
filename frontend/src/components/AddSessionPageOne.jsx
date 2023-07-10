import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import Combobox from "./Combobox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import DatePicker from "./DatePicker";
import { SelectOption } from "./SelectOption";
import { Trash } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Button } from "./ui/button";
// TO ADD SESSION TYPE & MODERATORS!!

const AddSessionPageOne = ({ control }) => {
  //  to query
  const speakers = ["Bob", "Sally"];
  const {
    fields: moderators,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "speakers",
  });
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center gap-6">
        <div className="w-[60%]">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Title:</FormLabel>
                <FormControl>
                  <Input placeholder="Session Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[20%]">
          <FormField
            control={control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Type:</FormLabel>
                <FormControl>
                  <SelectOption
                    field={field}
                    placeholder="Session Type"
                    options={["Symposia", "Masterclass"]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[20%]">
          <FormField
            control={control}
            name="sessionCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code:</FormLabel>
                <FormControl>
                  <Input placeholder="Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex items-center gap-10">
        <div className="w-[25%]">
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time:</FormLabel>
                <FormControl>
                  <Input placeholder="Start Time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[25%]">
          <FormField
            control={control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time:</FormLabel>
                <FormControl>
                  <Input placeholder="End Time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[25%]">
          <FormItem>
            <FormLabel>{"Presentation Duration (mins):"}</FormLabel>
            <FormControl>
              <Input placeholder="Duration" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className="w-[25%]">
          <FormItem>
            <FormLabel>{"Discussion Duration (mins):"}</FormLabel>
            <FormControl>
              <Input placeholder="Duration" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <div className="w-[50%]">
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[50%]">
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location:</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={control}
        name="synopsis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Synopsis:</FormLabel>
            <FormControl>
              <Textarea placeholder="Synopsis" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col">
        <FormLabel>Moderators</FormLabel>
        {moderators.map((field, index) => (
          <div
            className={`w-full flex items-center gap-3  ${
              index === 0 ? "w-[95%] mt-1" : "w-[95%] mt-3"
            }`}
            key={`${field.id}`}
          >
            <div className={"w-[45%]"}>
              <FormField
                control={control}
                name={`speakers.${index}.speakerRole`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectOption
                        field={field}
                        placeholder="Select a role"
                        options={[
                          "Course Director",
                          "Co-Course Director",
                          "Chair",
                          "Co-Chair",
                          "Moderator",
                          "Judge",
                          "Chief Judge",
                          "Faculty",
                          "Speaker",
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={"w-[45%]"}>
              <FormField
                control={control}
                name={`speakers.${index}.speaker`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectOption
                        field={field}
                        placeholder="Select a speaker"
                        options={speakers}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {index > 0 && (
              <div>
                <Trash
                  type="button"
                  size={18}
                  onClick={() => {
                    remove(index);
                  }}
                />
              </div>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="justify-start w-fit"
          onClick={() => {
            append({});
          }}
        >
          Add Role
        </Button>
      </div>
      <div className="w-[100%]">
        <FormField
          control={control}
          name="isPublish"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-wrap w-full">
                <div className="w-full">
                  <FormLabel>Publish To Wordpress</FormLabel>
                </div>
                <div className="w-full">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      {...field}
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddSessionPageOne;
