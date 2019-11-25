import * as Yup from 'yup';

export const personalInfoFormSchema = Yup.object().shape({
  firstname: Yup
    .string()
    .required("First name is required."),
  lastname: Yup
    .string()
    .required("Last name is required."),
  role: Yup
    .string()
    .required("Role is required."),
  location: Yup
    .string()
    .required("Location is required."),
});
