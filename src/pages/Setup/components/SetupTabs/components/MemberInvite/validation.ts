import * as Yup from 'yup';

export const memberInviteFormSchema = Yup.object().shape({
  emails: Yup
    .array()
    .of(Yup.string().email("Invalid email"))
    .min(1, 'Must contain at least 1 email')
});
