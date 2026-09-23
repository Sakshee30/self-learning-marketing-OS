import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn
} from "react-hook-form";
import type { ZodType } from "zod";

export function useZodForm<TValues extends FieldValues>(
  schema: ZodType<TValues>,
  options: Omit<UseFormProps<TValues>, "resolver"> & {
    defaultValues?: DefaultValues<TValues>;
  } = {}
): UseFormReturn<TValues> {
  return useForm<TValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    ...options,
    resolver: zodResolver(schema)
  });
}
