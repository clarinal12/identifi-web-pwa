import * as Yup from 'yup';

export const editAnswerFormSchema = Yup.object().shape({
  answer: Yup
    .string()
    .required("Answer is required."),
});
