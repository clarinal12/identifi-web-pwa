import * as Yup from 'yup';

export const respondentFormSchema = Yup.object().shape({
  respondents: Yup
    .array()
    .of(Yup.string())
    .required('Enter a minimum of 1 respondent'),
});
