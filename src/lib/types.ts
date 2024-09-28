/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoleType } from "@prisma/client";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export type ControllerType = ControllerRenderProps<FieldValues, string>;

export type FieldType = "text" | "textarea" | "select" | "customField";

type RenderCustomFieldParams = {
  field: ControllerType; // Assuming ControllerType is already defined
  additionalParam?: number; // Replace with actual parameter names and types
};

export type FormFieldProps = {
  // control: any;
  // name: string;
  type: FieldType;
  children?: React.ReactNode;
  renderCustomField?: (params: RenderCustomFieldParams) => React.ReactNode;
} & FieldValues;

export type RenderInputType = {
  field: ControllerType;
  props: FormFieldProps;
};

export interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: RoleType;
}

// type UserDetailsRoleType = Record<RoleType, boolean>;

export type UserDetailsRoleType = {
  [K in RoleType]: boolean; // Automatically creates properties based on RoleType
};

export type UserDetails = Omit<DatabaseUserAttributes, "id" | "role"> & {
  role: UserDetailsRoleType;
};
