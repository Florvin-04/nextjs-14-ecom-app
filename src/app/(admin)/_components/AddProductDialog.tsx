import CustomFormField from "@/components/custom/forms/CustomFormFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addProductSchema, AddProductType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
};

export default function AddProductDialog({ onClose }: Props) {
  const form = useForm<AddProductType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      category: "",
      description: "",
      image: "",
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const handleSubmitForm = (values: AddProductType) => {
    console.log({ values });

    // startTransition(async () => {
    //   const { error } = await handleLoginAction(values);

    //   if (error) {
    //     toast({
    //       title: "Something Went Wrong",
    //       variant: "destructive",
    //       description: error,
    //     });
    //   }
    // });
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="px-3 py-2 space-y-3"
        >
          <CustomFormField
            control={form.control}
            id="product-name"
            type="text"
            placeholder="Product Name"
            name="name"
            label="Product Name"
            error={form.formState.errors.name?.message}
          />

          <CustomFormField
            control={form.control}
            id="product-description"
            type="textarea"
            placeholder="Product Description"
            name="description"
            label="Product Description"
            error={form.formState.errors.description?.message}
          />

          {/* <div className="mt-3">
            <Button className="w-full">Submit</Button>
          </div> */}

          <DialogFooter>
            <Button>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
