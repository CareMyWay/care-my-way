"use server";
import { z } from "zod";

//defined a schema to structure validation for sign up
const schemaRegister = z.object({
  firstName: z.string().min(1).max(100, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1).max(100, {
    message: "Please enter your last name",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  console.log("Hello From Register User Action");

  //use our schema using safeParse
  const validatedFields = schemaRegister.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  //check if successful, if not return message
  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  //otherwise return prev state with message ok
  return {
    ...prevState,
    data: "ok",
  };
}
