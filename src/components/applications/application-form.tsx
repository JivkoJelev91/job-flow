"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Briefcase, Send, Wallet } from "lucide-react";

import {
  createApplication,
  updateApplication,
} from "@/lib/actions/applications";
import {
  applicationFormSchema,
  applicationStatusLabels,
  applicationStatuses,
  currencySuggestions,
  employmentTypeLabels,
  employmentTypes,
  workModeLabels,
  workModes,
  type ApplicationFormInput,
  type ApplicationFormValues,
  type ApplicationStatusValue,
} from "@/lib/validation/application-schema";

const createStatusOptions: ApplicationStatusValue[] = [
  "NOT_APPLIED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "CLOSED",
];

const softwarePositions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Principal Engineer",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Test Automation Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Security Engineer",
  "Solutions Architect",
  "Mobile Developer (iOS)",
  "Mobile Developer (Android)",
  "React Native Developer",
  "Flutter Developer",
  "Engineering Manager",
  "Tech Lead",
  "DevRel Engineer",
  "Product Manager",
  "Project Manager",
  "UX/UI Designer",
  "Intern Developer",
];

function FormField({
  label,
  htmlFor,
  invalid,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  invalid: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

export function ApplicationForm({
  companies,
  applicationId,
  initialValues,
  defaultAppliedAt = "",
}: {
  companies: { id: string; name: string }[];
  applicationId?: string;
  initialValues?: ApplicationFormValues;
  defaultAppliedAt?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const statusOptions = applicationId ? applicationStatuses : createStatusOptions;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: initialValues ?? {
      companyName: "",
      position: "",
      jobUrl: "",
      jobDescription: "",
      salaryMin: "",
      salaryMax: "",
      vacationDays: "20",
      currency: "EUR",
      location: "",
      workMode: "UNKNOWN",
      employmentType: "FULL_TIME",
      status: "NOT_APPLIED",
      appliedAt: defaultAppliedAt,
      nextAction: "",
      nextActionDate: "",
      notes: "",
    },
  });

  const onSubmit = (values: ApplicationFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = applicationId
        ? await updateApplication(applicationId, values)
        : await createApplication(values);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <Briefcase className="size-4" />
            </span>
            <CardTitle>Job</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
            <FormField
              label="Company"
              htmlFor="company"
              invalid={!!errors.companyName}
              error={errors.companyName?.message}
            >
              <Input
                id="company"
                list="companies"
                placeholder="Start typing to reuse a company"
                autoFocus
                autoComplete="off"
                aria-invalid={!!errors.companyName}
                {...register("companyName")}
              />
              <datalist id="companies">
                {companies.map((company) => (
                  <option key={company.id} value={company.name} />
                ))}
              </datalist>
            </FormField>
            <FormField
              label="Position"
              htmlFor="position"
              invalid={!!errors.position}
              error={errors.position?.message}
            >
              <Input
                id="position"
                list="positions"
                placeholder="e.g. Senior Software Engineer"
                autoComplete="off"
                aria-invalid={!!errors.position}
                {...register("position")}
              />
              <datalist id="positions">
                {softwarePositions.map((position) => (
                  <option key={position} value={position} />
                ))}
              </datalist>
            </FormField>
            <FormField
              label="Location"
              htmlFor="location"
              invalid={!!errors.location}
              error={errors.location?.message}
            >
              <Input
                id="location"
                placeholder="e.g. Warsaw (Remote)"
                autoComplete="off"
                aria-invalid={!!errors.location}
                {...register("location")}
              />
            </FormField>
            <FormField
              label="Job URL"
              htmlFor="job-url"
              invalid={!!errors.jobUrl}
              error={errors.jobUrl?.message}
            >
              <Input
                id="job-url"
                type="url"
                placeholder="https://…"
                autoComplete="off"
                aria-invalid={!!errors.jobUrl}
                {...register("jobUrl")}
              />
            </FormField>
            <FormField
              label="Job description"
              htmlFor="job-description"
              invalid={!!errors.jobDescription}
              error={errors.jobDescription?.message}
              className="md:col-span-2"
            >
              <Textarea
                id="job-description"
                rows={4}
                placeholder="Paste the job description…"
                aria-invalid={!!errors.jobDescription}
                {...register("jobDescription")}
              />
            </FormField>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Wallet className="size-4" />
            </span>
            <CardTitle>Salary & Terms</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
            <FormField
              label="Salary min (per month)"
              htmlFor="salary-min"
              invalid={!!errors.salaryMin}
              error={errors.salaryMin?.message}
            >
              <Input
                id="salary-min"
                type="number"
                min={0}
                max={1_000_000}
                inputMode="numeric"
                placeholder="e.g. 90000"
                aria-invalid={!!errors.salaryMin}
                {...register("salaryMin")}
              />
            </FormField>
            <FormField
              label="Salary max (per month)"
              htmlFor="salary-max"
              invalid={!!errors.salaryMax}
              error={errors.salaryMax?.message}
            >
              <Input
                id="salary-max"
                type="number"
                min={0}
                max={1_000_000}
                inputMode="numeric"
                placeholder="e.g. 120000"
                aria-invalid={!!errors.salaryMax}
                {...register("salaryMax")}
              />
            </FormField>
            <FormField
              label="Vacation days"
              htmlFor="vacation-days"
              invalid={!!errors.vacationDays}
              error={errors.vacationDays?.message}
            >
              <Input
                id="vacation-days"
                type="number"
                list="vacation-day-options"
                min={0}
                max={365}
                inputMode="numeric"
                placeholder="e.g. 25"
                aria-invalid={!!errors.vacationDays}
                {...register("vacationDays")}
              />
              <datalist id="vacation-day-options">
                {["20", "25", "30"].map((days) => (
                  <option key={days} value={days} />
                ))}
              </datalist>
            </FormField>
            <FormField
              label="Currency"
              htmlFor="currency"
              invalid={!!errors.currency}
              error={errors.currency?.message}
            >
              <Input
                id="currency"
                list="currencies"
                maxLength={3}
                placeholder="EUR"
                className="uppercase"
                autoComplete="off"
                aria-invalid={!!errors.currency}
                {...register("currency")}
              />
              <datalist id="currencies">
                {currencySuggestions.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
            </FormField>
            <Controller
              control={control}
              name="workMode"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Work mode"
                  name="workMode"
                  value={field.value}
                  onValueChange={field.onChange}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                  options={workModes.map((mode) => ({
                    value: mode,
                    label: workModeLabels[mode],
                  }))}
                />
              )}
            />
            <Controller
              control={control}
              name="employmentType"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Employment type"
                  name="employmentType"
                  value={field.value}
                  onValueChange={field.onChange}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                  options={employmentTypes.map((type) => ({
                    value: type,
                    label: employmentTypeLabels[type],
                  }))}
                />
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
              <Send className="size-4" />
            </span>
            <CardTitle>Application</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Status"
                  name="status"
                  value={field.value}
                  onValueChange={field.onChange}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                  options={statusOptions.map((status) => ({
                    value: status,
                    label: applicationStatusLabels[status],
                  }))}
                />
              )}
            />
            <FormField
              label="Applied on"
              htmlFor="applied-on"
              invalid={!!errors.appliedAt}
              error={errors.appliedAt?.message}
            >
              <Input
                id="applied-on"
                type="date"
                aria-invalid={!!errors.appliedAt}
                {...register("appliedAt")}
              />
            </FormField>
            <FormField
              label="Next action date"
              htmlFor="next-action-date"
              invalid={!!errors.nextActionDate}
              error={errors.nextActionDate?.message}
            >
              <Input
                id="next-action-date"
                type="date"
                aria-invalid={!!errors.nextActionDate}
                {...register("nextActionDate")}
              />
            </FormField>
            <FormField
              label="Next action"
              htmlFor="next-action"
              invalid={!!errors.nextAction}
              error={errors.nextAction?.message}
            >
              <Input
                id="next-action"
                placeholder="e.g. Follow up with the recruiter"
                autoComplete="off"
                aria-invalid={!!errors.nextAction}
                {...register("nextAction")}
              />
            </FormField>
            {!applicationId && (
              <FormField
                label="Notes"
                htmlFor="notes"
                invalid={!!errors.notes}
                error={errors.notes?.message}
                className="md:col-span-2"
              >
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Anything worth remembering…"
                  aria-invalid={!!errors.notes}
                  {...register("notes")}
                />
              </FormField>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button render={<Link href="/" />} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending
            ? "Saving…"
            : applicationId
              ? "Save Changes"
              : "Save Application"}
        </Button>
      </div>
    </form>
  );
}