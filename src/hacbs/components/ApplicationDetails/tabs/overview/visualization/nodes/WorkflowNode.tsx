import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Node, NodeModel, observer, TaskNode } from '@patternfly/react-topology';
import { WorkflowNodeModelData } from '../types';
import { getWorkflowNodeIcon } from '../utils/node-icon-utils';
import { getLinkForElement, statusToRunStatus } from '../utils/node-utils';
import WorkflowNodeTipContent from './WorkflowNodeTipContent';

import './WorkflowNode.scss';

type WorkflowNodeProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ element }) => {
  const setSearchParams = useSearchParams()[1];
  const setActiveTab = React.useCallback(
    (tabData: { tab: string; filter?: { name: string; value: string } }, replace = false) => {
      const params = new URLSearchParams();
      params.set('activeTab', tabData.tab);
      if (tabData.filter) {
        params.set(tabData.filter.name, tabData.filter.value);
      }
      setSearchParams(params, { replace });
    },
    [setSearchParams],
  );
  const { isDisabled, workflowType, status, resources, hidden } = element.getData();

  if (hidden) {
    return null;
  }

  return (
    <Tooltip
      content={<WorkflowNodeTipContent element={element} setActiveTab={setActiveTab} />}
      appendTo={() => document.querySelector('#hacDev-modal-container')}
    >
      <TaskNode
        truncateLength={element.getLabel().length}
        element={element}
        status={statusToRunStatus(status)}
        showStatusState
        statusIconSize={18}
        hover={isDisabled ? false : undefined}
        badge={resources?.length ? `${resources?.length}` : undefined}
        className={css('hacbs-workload-node', { 'm-disabled': isDisabled })}
        taskIcon={getWorkflowNodeIcon(workflowType)}
        paddingY={6}
        onSelect={() => setActiveTab(getLinkForElement(element))}
      />
    </Tooltip>
  );
};

export default observer(WorkflowNode);
