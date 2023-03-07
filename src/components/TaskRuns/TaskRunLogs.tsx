import React from 'react';
import { PodGroupVersionKind } from '../../shared';
import { runStatus } from '../../shared/components';
import LogsWrapperComponent from '../../shared/components/pipeline-run-logs/logs/LogsWrapperComponent';

type Props = {
  podName: string;
  taskName: string;
  namespace: string;
  status: string;
};

const TaskRunLogs: React.FC<Props> = ({ taskName, podName, namespace, status }) => {
  if (status === runStatus.Skipped) {
    return <div>No logs. This task was skipped.</div>;
  }
  if (status === runStatus.Idle) {
    return <div>Waiting on task to start.</div>;
  }
  if (!podName) {
    return <div>No logs found.</div>;
  }
  return (
    <LogsWrapperComponent
      resource={{
        name: podName,
        groupVersionKind: PodGroupVersionKind,
        namespace,
        isList: false,
      }}
      taskName={taskName}
    />
  );
};

export default TaskRunLogs;
