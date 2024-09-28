"use client";

import PasswordInputField from "@/components/custom/PasswordInputField";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginSchemaType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import CustomFormField from "@/components/custom/forms/CustomFormFields";
import { handleLoginAction } from "../action";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });

  const handleSubmitForm = (values: LoginSchemaType) => {
    // console.log({ values });

    startTransition(async () => {
      const { error } = await handleLoginAction(values);

      if (error) {
        toast.error("Something Went Wrong", {
          description: error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="px-3 py-2">
      <div className="space-y-3">
        {/* name should be one of the key in the schema */}

        <CustomFormField
          control={control}
          type="text"
          placeholder="Username"
          name="username"
          label="Username"
        />
        <PasswordInputField
          control={control}
          label="Password"
          name="password"
          placeholder="Password"
        />
      </div>
      <div className="mt-3">
        <Button disabled={isPending} isLoading={isPending} className="w-full">
          Log In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
