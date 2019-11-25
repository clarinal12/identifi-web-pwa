import * as Yup from 'yup';

export const forgotPasswordFormSchema = Yup.object().shape({
  username: Yup
    .string()
    .email("Invalid email")
    .required("Email is required."),
});
