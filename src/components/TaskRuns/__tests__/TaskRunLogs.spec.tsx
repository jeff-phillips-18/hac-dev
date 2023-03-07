import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TaskRunLogs from '../TaskRunLogs';

describe('TaskRunLogs', () => {
  it('should render no logs found', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status="Running" />,
    );
    expect(result.queryByText('No logs found.')).toBeInTheDocument();
  });

  it('should render waiting to start', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status="Idle" />,
    );
    expect(result.queryByText('Waiting on task to start.')).toBeInTheDocument();
  });

  it('should render no logs due to Skipped status', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status="Skipped" />,
    );
    expect(result.queryByText('No logs. This task was skipped.')).toBeInTheDocument();
  });
});
