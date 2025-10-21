import React from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomButton from "../CustomButton/CustomButton";
import styles from "./CustomForm.module.css";

type FieldType = "input" | "dropdown";

export interface FormField {
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  /** ✅ Single select value */
  value?: string;
  /** ✅ Multi select values */
  values?: string[];
  /** ✅ Enables <select multiple> */
  multiple?: boolean;
  /** ✅ Handles both single or multiple changes */
  onChange?: (value: string | string[]) => void;
}

interface CustomFormProps {
  fields: FormField[];
  onSubmit?: (data: Record<string, string | string[]>) => void;
  submitLabel?: string;
  isShowBtn?: boolean;
}

const CustomForm: React.FC<CustomFormProps> = ({
  fields,
  onSubmit = () => {},
  submitLabel = "Submit",
  isShowBtn = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, string | string[]> = {};
    fields.forEach((f) => {
      if (f.multiple && f.values) data[f.name] = f.values;
      else if (f.value !== undefined) data[f.name] = f.value;
    });
    onSubmit(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.map((field) => {
        // 🔹 Input Field
        if (field.type === "input") {
          return (
            <CustomInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={field.value || ""}
              placeholder={field.placeholder}
              onChange={(e) => field.onChange?.(e.target.value as string)}
              required={field.required}
            />
          );
        }

        // 🔹 Dropdown Field
        if (field.type === "dropdown" && field.options) {
          return (
            <CustomDropdown
              key={field.name}
              label={field.label}
              name={field.name}
              options={field.options}
              value={field.multiple ? field.values || [] : field.value || ""}
              onChange={(e) => {
                if (field.multiple) {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  );
                  field.onChange?.(selected);
                } else {
                  field.onChange?.(e.target.value as string);
                }
              }}
              required={field.required}
              multiple={field.multiple}
            />
          );
        }

        return null;
      })}

      {isShowBtn && (
        <CustomButton label={submitLabel} type="submit" variant="primary" />
      )}
    </form>
  );
};

export default CustomForm;
