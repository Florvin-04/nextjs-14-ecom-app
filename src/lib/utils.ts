import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readableFormatNumber(value: string) {
  // return parseFloat(value.toString()).toLocaleString("en", {
  //   maximumFractionDigits: 0,
  // });
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(parseFloat(value.toString()));
}

export const readableLargeNumber = (value: string) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value));
};

export const fileTypeChecker = ({
  file,
  extensionNames,
}: {
  file: File;
  extensionNames: string[];
}) => {
  const splitExtensionName = file.name.split(".");
  const fileExtensionName = splitExtensionName[splitExtensionName.length - 1];

  if (!fileExtensionName) return false;

  if (extensionNames.includes(fileExtensionName)) {
    return true;
  }

  return false;
};

export const createNewFileFromBlob = ({
  blob,
  fileName,
  type,
}: {
  blob: Blob;
  fileName: string;
  type: string;
}) => {
  return new File([blob], fileName, {
    type,
  });
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getPartialUpdatedData = <T extends object>(
  initialData: T,
  updatedData: T
) => {
  return Object.keys(updatedData).reduce((acc, key) => {
    const typedKey = key as keyof T;

    if (updatedData[typedKey] !== initialData[typedKey]) {
      acc[typedKey] = updatedData[typedKey];
    }

    return acc;
  }, {} as Partial<T>);
};

type Checkable = Record<string, unknown> | unknown[];

/**
 * Helper to check if all values in an object or array are true.
 * @param input - Object or array to check
 * @returns boolean - true if all values are true, false otherwise
 */
export const areAllTrue = (input: Checkable): boolean => {
  if (Array.isArray(input)) {
    // For arrays, check if all elements are truthy
    return input.length > 0 && input.every((value) => Boolean(value));
  } else if (typeof input === "object" && input !== null) {
    // For objects, check if all property values are truthy
    const values = Object.values(input);
    // Check if object has keys and all values are truthy
    return values.length > 0 && values.every((value) => Boolean(value));
  }
  return false; // In case of a non-object, non-array input
};
