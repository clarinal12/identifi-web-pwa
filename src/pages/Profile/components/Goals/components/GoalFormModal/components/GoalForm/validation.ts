import * as Yup from 'yup';

export const goalFormSchema = Yup.object().shape({
  title: Yup
    .string()
    .required("Title is required."),
  target: Yup
    .number()
    .typeError('Target value must be a number')
    .required("Target value is required"),
  initial: Yup
    .number()
    .typeError('Initial value must be a number')
    .required("Initial value is required"),
});
