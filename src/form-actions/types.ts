export type FormAction = {
  id: string;
  label: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  run: () => void | Promise<void>;
};
