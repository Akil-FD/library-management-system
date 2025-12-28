import React from "react"
import { FieldError, UseFormRegister } from "react-hook-form"
import { Field, FieldLabel, FieldError as UIFieldError, } from "../ui/field"
import { Input } from "../ui/input"

interface FormInputProps {
  label: string
  name: string
  type: string
  placeholder?: string
  register: UseFormRegister<any>
  error?: FieldError
  required?: boolean
}


export const FormInput = React.memo(({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  required,
}: FormInputProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        required={required}
      />

      <UIFieldError error={error} />
    </Field>
  )
})
