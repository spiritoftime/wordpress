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
// TO ADD SESSION TYPE & MODERATORS!!
const AddSessionPageOne = ({ control }) => {
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
