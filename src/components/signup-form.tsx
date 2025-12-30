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
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { useForm } from "react-hook-form"
import React, { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"
import { authApi } from "@/api/auth/auth.api"
import { FormInput } from "./common/FormInput"
import { MESSAGES } from "@/constants/messages"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { UserRole } from "@/types/enums/auth.enum"
import { APP_ROUTES, CONFIG, LOCAL_STORAGE_KEYS } from "@/constants/app"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

import { showSuccessToast } from "./common/toast"
import mockData from "../../mock_data/data.json";
import { User } from "@/types/auth"
import Link from "next/link"


const signupSchema = yup.object().shape({
  role: yup.string().required(),
  email: yup.string().email(MESSAGES.INVALID_EMAIL_FORMAT).required(MESSAGES.EMAIL_REQUIRED),
  password: yup.string().min(6, MESSAGES.PASSWORD_MIN_LENGTH).required(MESSAGES.PASSWORD_REQUIRED),
})


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: UserRole.USER, email: "", password: "" },
    resolver: yupResolver(signupSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async (data: {
    role: string
    email: string
    password: string
  }) => {
    try {
      const users = getLoggedUsers()

      if (!validateSignupEmail(data.email, data.role, users)) return

      const res = await signupUser(data)

      if (!res.success) {
        showSuccessToast(MESSAGES.LOGIN_FAILED)
        return
      }

      const { token, ...userData } = res.data

      saveNewUser(userData)
      login(userData, token)
      router.push(APP_ROUTES.DASHBOARD)

      showSuccessToast(MESSAGES.LOGIN_SUCCESS)
    } catch (error) {
      if (process.env.NODE_ENV === CONFIG.DEVELOPMENT) {
        console.error(error)
      }
      toast.error(MESSAGES.LOGIN_FAILED)
    }
  }

  async function signupUser(data: {
    email: string
    password: string
    role: string
  }) {
    return authApi.signup({
      ...data,
      role: data.role as UserRole,
    })
  }

  function saveNewUser(userData: User) {
    const users = getLoggedUsers()

    const newUser = {
      ...userData,
      id: users.length,
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOGGEDIN_USERS,
      JSON.stringify([...users, newUser])
    )
  }

  function getLoggedUsers(): User[] {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGEDIN_USERS) || "[]"
    )
  }


  function validateSignupEmail(
    email: string,
    role: string,
    users: User[]
  ): boolean {
    const isExists = checkIsEmailValid(email, role, users)

    if (isExists) {
      setError("email", { message: MESSAGES.EMAIL_EXIST })
      return false
    }

    return true
  }


  function checkIsEmailValid(
    email: string,
    role: string,
    parsedLoggedUsers: User[] | null
  ): boolean {
    const existingEmailsForRole = [
      ...mockData[0].login,
      ...(parsedLoggedUsers ?? []),
    ]
      .filter(user => user.role === role)
      .map(user => user.email.toLowerCase())

    return existingEmailsForRole.includes(email.toLowerCase())
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={handleFormSubmit}>
            <FieldGroup>

              <FormInput {...inputProps.email} register={register} error={errors.email} />
              <Field>
                <div className="flex items-center">
                  <FormInput {...inputProps.password} register={register} error={errors.password} />
                </div>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting} >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
              </Field>
              <FieldDescription className="text-center cursor-pointer">
                Already have an account? <Link href={APP_ROUTES.LOGIN}>Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
