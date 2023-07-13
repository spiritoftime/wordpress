// @/app/examples/multi-select-form/page.tsx
"use client";

import { FancyMultiSelect } from "./ui/FancyMultiSelect";

export default function FormMultiSelect({ field, options, readOnly = false }) {
  // console.log("field", field);
  return (
    <FancyMultiSelect
      readOnly={readOnly}
      options={options}
      defaultValue={field?.value}
      onChange={(values) => {
        // console.log("values", values);
        field.onChange(values.map((data) => data)); // react hook form requires the value
      }}
    />
  );
}
