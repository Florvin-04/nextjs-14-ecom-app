import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProductMutation } from "../mutation";
type Props = {
  id: string;
  name: string;
  closeModal: () => void;
};

export default function DeleteProductModal({ id, name, closeModal }: Props) {
  const mutation = useDeleteProductMutation();

  const handleDeleteProduct = () => {
    mutation.mutate(id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return (
    <AlertDialog open onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete ({name})</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDeleteProduct}
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
            variant="destructive"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
