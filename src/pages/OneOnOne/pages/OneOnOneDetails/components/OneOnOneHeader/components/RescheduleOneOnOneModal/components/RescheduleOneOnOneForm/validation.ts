import * as Yup from 'yup';
import moment from 'moment';

export const rescheduleOneOnOneFormSchema = Yup.object().shape({
  time: Yup
    .string()
    .test('time', 'Only time in the future is valid', (value: string) => {
      const selectedTime = moment(new Date(value).toISOString());
      const currentDateTime = moment();
      const minutesDiffFromToday = currentDateTime.diff(selectedTime, 'minutes', true);
      return minutesDiffFromToday < 0;
    }),
});
