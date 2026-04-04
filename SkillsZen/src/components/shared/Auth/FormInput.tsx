import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";


interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export const FormInput = ({ id, label, type = 'text', placeholder, error, register }: FormInputProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id} className="text-sm font-medium ml-1">{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register}
      className={`h-11 rounded-xl transition-all focus:ring-2 ${
        error ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'
      }`}
    />
    {error && <p className="text-[11px] font-medium text-destructive ml-1">{error.message}</p>}
  </div>
)
