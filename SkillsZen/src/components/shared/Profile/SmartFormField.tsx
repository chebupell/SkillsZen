import type { Control, FieldPath } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import type { ProfileValues } from "../../../types/UserTypes";

interface SmartFormFieldProps {
  control: Control<ProfileValues>; 
  name: FieldPath<ProfileValues>; 
  label: string;
  placeholder?: string;
  icon: React.ElementType;
  type?: string;
}
export const SmartFormField = ({ control, name, label, placeholder, icon: Icon, type = "text" }: SmartFormFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="space-y-1">
        <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
          {label}
        </FormLabel>
        <FormControl>
          <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value || ''}
              className="h-11 pl-11 rounded-2xl bg-slate-50/50 border-slate-200 transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary"
            />
          </div>
        </FormControl>
        <FormMessage className="text-[9px] font-bold ml-1 text-red-500" />
      </FormItem>
    )}
  />
);
