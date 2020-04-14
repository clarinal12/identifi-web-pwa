import * as Yup from 'yup';

export const editBlockerFormSchema = Yup.object().shape({
  isBlocked: Yup
    .boolean(),
  blocker: Yup
    .string()
    .when(['isBlocked'], {
      is: isBlocked => isBlocked,
      then: Yup
        .string()
        .required('Blocker can\'t be empty')
    })
});
