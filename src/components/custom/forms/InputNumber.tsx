/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@/components/ui/input";
import { RenderInputType } from "@/lib/types";

export default function InputNumber({ field, props }: RenderInputType) {
  const { value } = field;
  const { type, ...rest } = props;

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow only digits (0-9)
    if (/^\d*$/.test(inputValue)) {
      field.onChange(inputValue);
    }
  };
  return (
    <div>
      <Input
        type="text"
        {...rest}
        value={value}
        onChange={handleNumberInputChange}
      />
    </div>
  );
}
