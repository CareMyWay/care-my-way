/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm, UseFormProps, FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UseFormSectionProps<T extends FieldValues> {
    schema: z.ZodSchema<T>;
    defaultValues?: Partial<T>;
    onDataChange: (_data: T) => void;
}

export function useFormSection<T extends FieldValues>({
    schema,
    defaultValues,
    onDataChange,
}: UseFormSectionProps<T>): UseFormReturn<T> {
    const form = useForm<T>({
        mode: "onChange",
        defaultValues: defaultValues as UseFormProps<T>["defaultValues"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema as any),
    });

    // Track and notify parent of progress
    useEffect(() => {
        const subscription = form.watch((value) => {
            onDataChange(value as T);
        });
        return () => subscription.unsubscribe();
    }, [form, onDataChange]);

    return form;
} 