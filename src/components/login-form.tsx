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
import { toast } from "sonner"
import { authApi } from "@/api/auth/auth.api"
import { FormInput } from "./common/FormInput"
import { MESSAGES } from "@/constants/messages"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { UserRole } from "@/types/enums/auth.enum"
import { APP_ROUTES, CONFIG, LOCAL_STORAGE_KEYS } from "@/constants/app"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

import { showSuccessToast } from "./common/toast"
import mockData from "../../mock_data/data.json";
import { User } from "@/types/auth"
import z from "zod/v3"
import { zodResolver } from "@hookform/resolvers/zod"

export const loginSchema = z.object({
  role: z.string().min(1, MESSAGES.ROLE_REQUIRED),

  email: z
    .string()
    .min(1, MESSAGES.EMAIL_REQUIRED)
    .email(MESSAGES.INVALID_EMAIL_FORMAT),

  password: z
    .string()
    .min(1, MESSAGES.PASSWORD_REQUIRED)
    .min(6, MESSAGES.PASSWORD_MIN_LENGTH),
})

export type LoginFormValues = z.infer<typeof loginSchema>



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const roleTabOptions = [
    { label: "User", value: UserRole.USER },
    { label: "Admin", value: UserRole.ADMIN },
  ];

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      role: UserRole.USER,
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  })

  const formValues = watch();

  useEffect(() => {
    setEmailIfNotLoggedIn(formValues.role)
  }, []);

  const onRoleChange = (value: any) => {
    setEmailIfNotLoggedIn(value)
    setValue('role', value as UserRole);
  }

  function setEmailIfNotLoggedIn(role: string) {
    const storedUsers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGEDIN_USERS) || "[]"
    )

    if (role !== UserRole.ADMIN && storedUsers.length > 0) return

    const email =
      mockData[0]?.login?.find(item => item.role === role)?.email ?? ""

    setValue("email", email)
  }


  const onSubmit = async (data: {
    role: string
    email: string
    password: string
  }) => {
    try {
      const loggedUsers = getLoggedUsers()

      if (!validateEmailOrSetError(data.email, data.role, loggedUsers)) return

      const res = await loginUser(data)

      if (!res.success) {
        showSuccessToast(MESSAGES.LOGIN_FAILED)
        return
      }

      const { token, ...userData } = res.data

      saveLoggedUser(userData)
      login(userData, token)

      showSuccessToast(MESSAGES.LOGIN_SUCCESS)
    } catch (error) {
      if (process.env.NODE_ENV === CONFIG.DEVELOPMENT) {
        console.error(error)
      }
      toast.error(MESSAGES.LOGIN_FAILED)
    }
  }

  async function loginUser(data: {
    email: string
    password: string
    role: string
  }) {
    return await authApi.login({
      ...data,
      role: data.role as UserRole,
    })
  }


  function saveLoggedUser(userData: User) {
    const users = getLoggedUsers()

    const uniqueUsers = [
      ...users.filter(
        user => !(user.email === userData.email && user.role === userData.role)
      ),
      userData,
    ]

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOGGEDIN_USERS,
      JSON.stringify(uniqueUsers.map((user, i) => ({ ...user, id: i })))
    )
  }


  function getLoggedUsers(): User[] {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGEDIN_USERS) || "[]"
    )
  }

  function validateEmailOrSetError(
    email: string,
    role: string,
    users: User[]
  ): boolean {
    const isValid = checkIsEmailValid(email, role, users)

    if (isValid) {
      setError("email", { message: MESSAGES.EMAIL_NOT_EXIST })
      return false
    }

    return true
  }


  function checkIsEmailValid(
    email: string,
    role: string,
    parsedLoggedUsers: User[] | null
  ): boolean {
    const emailSet = new Set<string>([
      ...mockData[0].login
        .filter(u => u.role === role)
        .map(u => u.email),

      ...(parsedLoggedUsers ?? [])
        .filter(u => u.role === role)
        .map(u => u.email),
    ])

    return !emailSet.has(email)
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

              <Tabs value={formValues.role} onValueChange={onRoleChange}>
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
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}

                <FieldDescription className="text-center cursor-pointer">
                  Don&apos;t have an account? <Link href={APP_ROUTES.SIGNUP}>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
