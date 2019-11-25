import * as Yup from 'yup';

export const registerFormSchema = Yup.object().shape({
  username: Yup
    .string()
    .email("Invalid email")
    .required("Email is required."),
  password: Yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
