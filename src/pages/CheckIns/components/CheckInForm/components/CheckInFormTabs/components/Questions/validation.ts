import * as Yup from 'yup';

export const questionFormSchema = Yup.object().shape({
  goalsEnabled: Yup
    .boolean(),
  moodsEnabled: Yup
    .boolean(),
  questions: Yup
    .array()
    .of(Yup.string())
    .when(['goalsEnabled', 'moodsEnabled'], {
      is: (goalsEnabled, moodsEnabled) => !goalsEnabled && !moodsEnabled,
      then: Yup.array()
        .of(Yup.string().required('Custom questions must not be empty'))
        .min(1, 'Must have at least 1 custom question when both trackers are disabled')
    })
});
