import * as Yup from 'yup';

export const agendaFormSchema = Yup.object().shape({
  topic: Yup
    .string()
    .required("Topic is required."),
});
