import * as Yup from 'yup';

export const questionFormSchema = Yup.object().shape({
  question1: Yup
    .string()
    .required('Question 1 is required'),
  question2: Yup
    .string()
    .required('Question 2 is required'),
  question3: Yup
    .string()
    .required('Question 3 is required'),
});
