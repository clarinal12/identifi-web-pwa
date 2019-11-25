import * as Yup from 'yup';

export const settingsFormSchema = Yup.object().shape({
  slackChannelId: Yup
    .string()
    .required('Channel is required'),
});
