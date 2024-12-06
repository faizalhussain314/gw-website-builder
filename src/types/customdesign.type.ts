import { Dispatch, SetStateAction } from "react";

export type FontCombination = {
  label?: string;
  primary: string;
  secondary: string;
};

export type SelectedColor = {
  primary: string;
  secondary: string;
};

export interface ColorCombination {
  primary: string;
  secondary: string;
}

export type SelectedFont = {
  primary: string;
  secondary: string;
};

export type GetDomainFromEndpoint = (endpoint: string) => string;
export type SetLogoUrl = Dispatch<SetStateAction<string | null>>;
export type SetError = Dispatch<SetStateAction<string | null>>;
export type SetSuccessMessage = Dispatch<SetStateAction<string | null>>;
export type SetLoading = Dispatch<SetStateAction<boolean>>;
export type DispatchAction = (action: any) => void;
export type StoreContent = (content: object) => Promise<void>;
export type SendIframeMessage = (
  action: string,
  payload: { logoUrl: string }
) => void;
