import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await validateRequest();

  if (!user) return redirect("/login");

  console.log({ user });

  if (!user.role.ADMIN) return <div>UnAuthorized</div>;

  return <>{children}</>;
};

export default layout;
