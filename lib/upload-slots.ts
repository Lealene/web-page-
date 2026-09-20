export interface UploadSlot {
  id: string;
  label: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  url: string;
}

export const NEW_UPLOAD_SLOTS: UploadSlot[] = [
  { id: "new-page", label: "New page" },
  { id: "login-page-file", label: "Login page file" },
  { id: "sheet-page", label: "Sheet page" },
];

export const APPS_UI_SLOTS: UploadSlot[] = [
  { id: "apps-page", label: "Apps page" },
  { id: "apps-login-page-file", label: "Login page file" },
  { id: "apps-sheet-page", label: "Sheet page" },
];

export function isUploadSlot(id: string): boolean {
  return [...NEW_UPLOAD_SLOTS, ...APPS_UI_SLOTS].some((s) => s.id === id);
}