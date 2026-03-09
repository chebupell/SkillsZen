import type { Resolver } from "react-hook-form";
import z from "zod"

export const authFieldsSchema = z.object({
  login: z.string(),
  password: z.string(),
})

export type AuthValues = z.infer<typeof authFieldsSchema>


export interface AuthFormProps {
  title: string;
  resolver: Resolver<AuthValues>;
  onSubmit: (data: AuthValues) => Promise<void>;
  buttonText: string;
  loginLabel: string;
  linkText: string;
  linkHref: string;
  linkDescription: string;
}
