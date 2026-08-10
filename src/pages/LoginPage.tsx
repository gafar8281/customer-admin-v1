import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Navigate, useLocation, useNavigate, type Location } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "@/auth/useAuth"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { TFunction } from "i18next"

function buildLoginSchema(t: TFunction) {
  return z.object({
    email: z.email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  })
}

type LoginFormValues = z.infer<ReturnType<typeof buildLoginSchema>>

interface LocationState {
  from?: Location
}

export function LoginPage() {
  const { t } = useTranslation()
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const loginSchema = useMemo(() => buildLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  if (user) {
    const state = location.state as LocationState | null
    return <Navigate to={state?.from?.pathname ?? "/employees"} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null)
    const error = await signIn(values.email, values.password)
    if (error) {
      setFormError(t("auth.invalidCredentials"))
      return
    }
    const state = location.state as LocationState | null
    navigate(state?.from?.pathname ?? "/employees", { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.title")}</CardTitle>
          <CardDescription>{t("auth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {formError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{formError}</AlertTitle>
                </Alert>
              )}
              <Field>
                <FieldLabel htmlFor="email">{t("auth.email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">{t("auth.password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {/* Demo credentials:{" "}
                <span className="font-medium">customer@email.com</span> /{" "}
                <span className="font-medium">cust@123</span> */}
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
