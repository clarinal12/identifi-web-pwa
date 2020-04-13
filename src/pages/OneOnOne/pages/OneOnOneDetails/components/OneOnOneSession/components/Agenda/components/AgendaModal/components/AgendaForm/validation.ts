import * as Yup from 'yup';

export const agendaFormSchema = Yup.object().shape({
  topic: Yup
    .string()
    .max(100, 'Maximum limit is 100 characters.')
    .required("Topic is required."),
});
