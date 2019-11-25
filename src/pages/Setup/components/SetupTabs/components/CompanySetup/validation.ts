import * as Yup from 'yup';

export const companySetupFormSchema = Yup.object().shape({
  companyName: Yup
    .string()
    .max(25, 'You\'ve react the maximum limit')
    .required("Company name is required."),
});
