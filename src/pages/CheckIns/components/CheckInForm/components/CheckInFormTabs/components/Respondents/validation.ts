import * as Yup from 'yup';

export const respondentFormSchema = Yup.object().shape({
  respondents: Yup
    .array()
    .of(Yup.string())
    .required('Enter a minimum of 1 respondent'),
  isPrivate: Yup
    .boolean(),
  watchers: Yup
    .array()
    .of(Yup.string())
    .when(['isPrivate'], {
      is: isPrivate => isPrivate,
      then: Yup.array()
        .of(Yup.string().required('Watchers can\'t be empty'))
        .min(1, 'Must have at least 1 watcher when setting a private checkin')
    })
});
