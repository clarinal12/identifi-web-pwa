import * as Yup from 'yup';

export const feedbackFormSchema = Yup.object().shape({
  content: Yup
    .string()
    .required("Content is required.")
});
