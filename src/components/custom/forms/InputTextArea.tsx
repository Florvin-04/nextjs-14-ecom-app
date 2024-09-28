import { Textarea } from "@/components/ui/textarea";
import { RenderInputType } from "@/lib/types";

export default function InputTextarea({ field, props }: RenderInputType) {
  return (
    <div>
      <Textarea {...field} {...props} />
    </div>
  );
}
