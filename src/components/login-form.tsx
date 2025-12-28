'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"
import { authApi } from "@/api/auth/auth.api"
import { FormInput } from "./common/FormInput"
import { MESSAGES } from "@/constants/messages"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { UserRole } from "@/types/enums/auth.enum"
import { CONFIG } from "@/constants/app"
import { useAuth } from "@/hooks/useAuth"

import dynamic from "next/dynamic"

// const FormInput = dynamic(() => import("./common/FormInput"), {
//   ssr: false,
// })
const loginSchema = yup.object().shape({
  role: yup.string().required(),
  email: yup.string().email(MESSAGES.INVALID_EMAIL_FORMAT).required(MESSAGES.EMAIL_REQUIRED),
  password: yup.string().min(6, MESSAGES.PASSWORD_MIN_LENGTH).required(MESSAGES.PASSWORD_REQUIRED),
})


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const roleTabOptions = [
    { label: "User", value: UserRole.USER },
    { label: "Admin", value: UserRole.ADMIN },
  ];

  const { login } = useAuth();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: UserRole.USER, email: "", password: "" },
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit'
  })

  const formValues = watch();

  const onSubmit = async (data: { role: string; email: string; password: string }) => {
    try {
      if (data) {
        const res = await authApi.login({
          ...data,
          role: data.role as UserRole,
        });

        if (res.success) {
          const { token, ...userData } = res.data;
          login(userData, token);
        }
        toast.success(res.success ? MESSAGES.LOGIN_SUCCESS : MESSAGES.LOGIN_FAILED);
      }
    } catch (error) {
      if (process.env.NODE_ENV === CONFIG.DEVELOPMENT)
        console.log(error);

      toast.success(MESSAGES.LOGIN_FAILED);
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  }

  const inputProps = {
    email: {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Please enter your email",
      required: true,
    },
    password: {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Please enter your password",
      required: true,
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={handleFormSubmit}>
            <FieldGroup>

              <Tabs value={formValues.role} onValueChange={(value) => {
                setValue('role', value as UserRole);
              }}>
                <TabsList className="w-full">
                  {
                    roleTabOptions.map((option) => (
                      <TabsTrigger key={option.value} value={option.value}>
                        {option.label}
                      </TabsTrigger>
                    ))
                  }
                </TabsList>
              </Tabs>

              <FormInput {...inputProps.email} register={register} error={errors.email} />
              <Field>
                <div className="flex items-center">
                  <FormInput {...inputProps.password} register={register} error={errors.password} />
                </div>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-end"
                >
                  Forgot your password?
                </a>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting} >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
