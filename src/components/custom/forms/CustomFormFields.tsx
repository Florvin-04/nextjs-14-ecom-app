import { FieldValues, Controller, Control, Path } from "react-hook-form";

import { ControllerType, FormFieldProps } from "@/lib/types";
import Field from ".";

const RenderInput = ({
  field,
  props,
}: {
  field: ControllerType;
  props: FormFieldProps;
}) => {
  switch (props.type) {
    case "text":
      return <Field.InputText field={field} props={props} />;

    case "textarea":
      return <Field.Textarea field={field} props={props} />;

    case "select":
      return (
        <Field.SelectMenu field={field}>{props.children}</Field.SelectMenu>
      );

    case "number":
      return <Field.InputNumber field={field} props={props} />;

    case "customField":
      return props.renderCustomField
        ? props.renderCustomField({ field, additionalParam: 1 })
        : null;
    default:
      return null;
  }
};

export default function CustomFormField<T extends FieldValues>(
  props: FormFieldProps & { control: Control<T>; name: Path<T>; error?: string }
) {
  const { name, control, error, id } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div>
            <label htmlFor={id}>{props.label}</label>
            <RenderInput field={field} props={props} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );
      }}
    />
  );
}
