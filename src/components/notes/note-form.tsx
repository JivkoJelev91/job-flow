"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createNote, updateNote } from "@/lib/actions/notes";
import {
  noteFormSchema,
  type NoteFormInput,
  type NoteFormValues,
} from "@/lib/validation/note-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export function NoteForm({
  applicationId,
  noteId,
  initialValues,
}: {
  applicationId: string;
  noteId?: string;
  initialValues?: NoteFormValues;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormInput, unknown, NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: initialValues ?? { content: "" },
  });

  const onSubmit = (values: NoteFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = noteId
        ? await updateNote(noteId, applicationId, values)
        : await createNote(applicationId, values);
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
          <Field>
            <FieldLabel htmlFor="note-content">Note</FieldLabel>
            <Textarea
              id="note-content"
              rows={6}
              placeholder="Anything worth remembering…"
              autoFocus
              autoComplete="off"
              aria-invalid={!!errors.content}
              {...register("content")}
            />
            <FieldError>{errors.content?.message}</FieldError>
          </Field>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button
          render={<Link href={`/applications/${applicationId}`} />}
          variant="outline"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? "Saving…" : noteId ? "Save Changes" : "Save Note"}
        </Button>
      </div>
    </form>
  );
}