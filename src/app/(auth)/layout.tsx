import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await validateRequest();

  console.log({ user });

  if (user) redirect("/");

  return <>{children}</>;
};

export default layout;
