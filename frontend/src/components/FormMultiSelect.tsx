// @/app/examples/multi-select-form/page.tsx
"use client";

import { FancyMultiSelect } from "./ui/FancyMultiSelect";

export default function FormMultiSelect({ field, options }) {
  return (
    <FancyMultiSelect
      options={options}
      onChange={(values) => {
        field.onChange(values.map(({ value }) => value));
      }}
    />
  );
}
