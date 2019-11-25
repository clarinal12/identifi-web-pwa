import * as Yup from 'yup';

export const checkInFormSchema = Yup.object().shape({
  name: Yup
    .string()
    .required("Check-in name is required."),
});
