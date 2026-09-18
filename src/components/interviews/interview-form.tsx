"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createInterview,
  updateInterview,
} from "@/lib/actions/interviews";
import {
  interviewFormSchema,
  interviewTypeLabels,
  interviewTypes,
  type InterviewFormInput,
  type InterviewFormValues,
} from "@/lib/validation/interview-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  SelectField,
} from "@/components/ui/select-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";

export function InterviewForm({
  applicationId,
  interviewId,
  initialValues,
}: {
  applicationId: string;
  interviewId?: string;
  initialValues?: InterviewFormValues;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormInput, unknown, InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: initialValues ?? {
      scheduledAt: "",
      type: "VIDEO",
      location: "",
      notes: "",
      result: "",
    },
  });

  const onSubmit = (values: InterviewFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = interviewId
        ? await updateInterview(interviewId, applicationId, values)
        : await createInterview(applicationId, values);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="scheduled-at">Date and time</FieldLabel>
              <Input
                id="scheduled-at"
                type="datetime-local"
                aria-invalid={!!errors.scheduledAt}
                {...register("scheduledAt")}
              />
              <FieldError>{errors.scheduledAt?.message}</FieldError>
            </Field>

            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Interview type"
                  name="type"
                  value={field.value}
                  onValueChange={field.onChange}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                  options={interviewTypes.map((type) => ({
                    value: type,
                    label: interviewTypeLabels[type],
                  }))}
                />
              )}
            />

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                placeholder="e.g. Google Meet, Berlin office"
                autoComplete="off"
                aria-invalid={!!errors.location}
                {...register("location")}
              />
              <FieldError>{errors.location?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="result">Result</FieldLabel>
              <Input
                id="result"
                placeholder="e.g. Passed, Offer extended"
                autoComplete="off"
                aria-invalid={!!errors.result}
                {...register("result")}
              />
              <FieldError>{errors.result?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Anything worth remembering…"
                aria-invalid={!!errors.notes}
                {...register("notes")}
              />
              <FieldError>{errors.notes?.message}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button render={<Link href={`/applications/${applicationId}`} />} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? "Saving…" : interviewId ? "Save Changes" : "Save Interview"}
        </Button>
      </div>
    </form>
  );
}