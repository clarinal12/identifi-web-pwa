import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useMutation } from "react-apollo";
import { Button } from "antd";

import EditGoalForm from "./components/EditGoalForm";
import { IExternalProps } from "./components/EditGoalForm/EditGoalForm";
import { UPDATE_CHECKIN_GOAL } from "apollo/mutations/checkin";
import { TCheckInGoal } from "apollo/types/checkin";
import { useMessageContextValue } from "contexts/MessageContext";
import { useUserContextValue } from "contexts/UserContext";
import { useCheckInScheduleContextValue } from "contexts/CheckInScheduleContext";
import updateCheckInGoalCacheHandler from "./cache-handler/updateCheckInGoal";
import { openDB } from "idb";

interface IEditGoalModal
  extends Partial<IExternalProps>,
    RouteComponentProps<{ past_checkin_id: string; checkin_id: string }> {}

const fireSync = () => {
  navigator.serviceWorker.ready
    .then((serviceWorker) => {
      serviceWorker.sync.register("update-checkin-sync");
      console.log("Sync registered success");
    })
    .catch((error) => console.log("Sync register failed", { error }));
};

const EditGoalModal: React.FC<IEditGoalModal> = ({
  data,
  showSwitch,
  match,
}) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account, token } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId =
    match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const [modalState, setModalState] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [updateCheckInGoal] = useMutation(UPDATE_CHECKIN_GOAL);

  useEffect(() => {
    window.addEventListener("offline", () => {
      setIsOffline(true);
    });

    window.addEventListener("online", () => {
      setIsOffline(false);
    });

    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);

  const onSubmitAction = async (values: Partial<TCheckInGoal>) => {
    try {
      const variables = {
        ...(data && {
          goalId: data.id,
        }),
        input: values,
      };

      if (isOffline) {
        const query = UPDATE_CHECKIN_GOAL?.loc?.source?.body;
        const operationName = "UpdateCheckInGoal";
        const db = await openDB("identifi-web-db", 1);
        const tx = db.transaction("checkins", "readwrite");
        const store = tx.objectStore("checkins");

        await store.add({
          id: `update-${data?.id}`,
          query,
          variables,
          operationName,
          token,
        });
        await tx.done;

        fireSync();

        alertSuccess(
          "Check-in will be sent to server when you're back online."
        );
      } else {
        updateCheckInGoal({
          variables,
          ...updateCheckInGoalCacheHandler({
            isPreviousGoal: showSwitch,
            respondentId: account?.id,
            scheduleId: selectedCheckInCard?.scheduleId,
            checkInId: derivedCheckInId,
            value: {
              ...data,
              ...values,
            },
          }),
        });
        alertSuccess("Check-in goal updated");
      }

      setModalState(false);
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  };

  return (
    <>
      <Button
        style={{ minWidth: 32 }}
        onClick={() => setModalState(true)}
        title="edit"
        type="link"
        icon="form"
      />
      {data && (
        <EditGoalForm
          isOffline={isOffline}
          data={data}
          // key={data.goal?.length} // ugly hack to reset form values after updating content
          showSwitch={showSwitch}
          modalState={modalState}
          setModalState={setModalState}
          onSubmitAction={onSubmitAction}
        />
      )}
    </>
  );
};

export default withRouter(EditGoalModal);
