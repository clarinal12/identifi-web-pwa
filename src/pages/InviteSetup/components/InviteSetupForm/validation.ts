import * as Yup from 'yup';

export const inviteSetupFormSchema = Yup.object().shape({
  username: Yup
    .string()
    .email("Invalid email")
    .required("Email is required."),
  firstname: Yup
    .string()
    .required("First name is required."),
  lastname: Yup
    .string()
    .required("Last name is required."),
  location: Yup
    .string()
    .required("Location is required."),
  role: Yup
    .string()
    .required("Role is required."),
  password: Yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required("Password is Required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
