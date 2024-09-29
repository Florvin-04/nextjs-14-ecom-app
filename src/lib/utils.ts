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
  const fileExtensionName = file.name.split(".")[1];

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
