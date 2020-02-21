import * as Yup from 'yup';

export const editGoalFormSchema = Yup.object().shape({
  goal: Yup
    .string()
    .required("Goal is required."),
});
