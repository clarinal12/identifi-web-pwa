import * as Yup from 'yup';

export const scheduleFormSchema = Yup.object().shape({
  frequency: Yup
    .string()
    .required("Frequency is required."),
  days: Yup
    .array()
    .of(Yup.string())
    .required('Please select a minimum of 1 day'),
  time: Yup
    .date()
    .required("Time is required."),
  waitingTime: Yup
    .number()
    .typeError('Waiting time must be a number')
    .required("Waiting time is required."),
  remindTime: Yup
    .number()
    .typeError('Remind time must be a number')
    .required("Remind time is required."),
  timezone: Yup
    .string()
    .required('Timezone is required')
});
