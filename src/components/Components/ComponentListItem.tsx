import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  ClipboardCopy,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import { PACState } from '../../hooks/usePACState';
import { DeploymentGroupVersionKind } from '../../models/deployment';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, RouteKind, ResourceStatusCondition } from '../../types';
import { DeploymentKind } from '../../types/deployment';
import { GitOpsDeploymentKind } from '../../types/gitops-deployment';
import { getConditionForResource } from '../../utils/common-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { useComponentActions } from '../ApplicationDetails/component-actions';
import GitRepoLink from '../GitLink/GitRepoLink';
import PodLogsColumn from '../PodLogs/PodLogsColumn';
import BuildStatusColumn from './BuildStatusColumn';
import ComponentPACStateLabel from './ComponentPACStateLabel';

import './ComponentListItem.scss';

const getConditionStatus = (condition: ResourceStatusCondition) => {
  if (condition.reason === 'Error') {
    return (
      <>
        <ExclamationCircleIcon color={redColor.value} /> Component {condition.type}
      </>
    );
  }
  return null;
};

export type ComponentListViewItemProps = {
  component: ComponentKind;
  routes: RouteKind[];
  onStateChange?: (state: PACState) => void;
  gitOpsDeployment?: GitOpsDeploymentKind;
};

export const ComponentListItem: React.FC<ComponentListViewItemProps> = ({
  component,
  routes,
  onStateChange,
  gitOpsDeployment,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [expanded, setExpanded] = React.useState(false);
  const { replicas, targetPort, resources } = component.spec;
  const name = component.metadata.name;
  const actions = useComponentActions(component, name);
  const resourceRequests = resources?.requests;
  const containerImage = component.status?.containerImage;
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);
  const condition = getConditionForResource<ComponentKind>(component);

  const deploymentResource = gitOpsDeployment?.status?.resources?.find(
    (resource) => resource.kind === 'Deployment',
  );

  const [deployment, deploymentLoaded, deploymentLoadError] = useK8sWatchResource<DeploymentKind>({
    groupVersionKind: DeploymentGroupVersionKind,
    isList: false,
    name: deploymentResource?.name,
    namespace: deploymentResource?.namespace,
  });

  const podSelector = React.useMemo(
    () => !deploymentLoadError && deploymentLoaded && deployment?.spec?.selector,
    [deploymentLoaded, deployment, deploymentLoadError],
  );

  return (
    <DataListItem aria-label={name} isExpanded={expanded} data-testid="component-list-item">
      <DataListItemRow data-test={`${name}-component-list-item`}>
        <DataListToggle
          id={name}
          data-testid={`${name}-toggle`}
          onClick={() => setExpanded((x) => !x)}
          isExpanded={expanded}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={3}>
              <Flex direction={{ default: 'column' }}>
                <Flex>
                  <FlexItem data-testid="component-list-item-name" style={{ minWidth: '30%' }}>
                    <b>{name}</b>
                  </FlexItem>
                  <FlexItem>
                    <ComponentPACStateLabel
                      component={component}
                      onStateChange={onStateChange}
                      enableAction
                    />
                  </FlexItem>
                </Flex>
                <FlexItem>
                  <GitRepoLink
                    url={component.spec.source?.git?.url}
                    revision={component.spec.source?.git?.revision}
                    context={component.spec.source?.git?.context}
                  />
                </FlexItem>
                <FlexItem>
                  {componentRouteWebURL && (
                    <ExternalLink
                      href={componentRouteWebURL}
                      analytics={{
                        link_name: 'component-route',
                        component_name: component.metadata.name,
                        app_name: component.spec.application,
                        workspace,
                      }}
                      text="Route"
                    />
                  )}
                </FlexItem>
              </Flex>
            </DataListCell>,
            condition && getConditionStatus(condition) ? (
              <DataListCell key={`${name}-component-status`} alignRight>
                <Tooltip content={condition.message}>
                  <span>{getConditionStatus(condition)}</span>
                </Tooltip>
              </DataListCell>
            ) : null,
            <DataListCell key="status" alignRight>
              <BuildStatusColumn component={component} />

              {podSelector && <PodLogsColumn component={component} podSelector={podSelector} />}
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-labelledby={`${name.toLowerCase()}-actions`}
          data-testid={`${name.toLowerCase()}-actions`}
          id={`${name.toLowerCase()}-actions`}
          aria-label={`${name.toLowerCase()}-actions`}
          isPlainButtonAction
        >
          <ActionMenu actions={actions} />
        </DataListAction>
      </DataListItemRow>
      <DataListContent
        className="component-list-item__details"
        aria-label={`${name} details`}
        isHidden={!expanded}
      >
        <DescriptionList
          columnModifier={{
            default: '2Col',
          }}
        >
          {resourceRequests && (
            <DescriptionListGroup>
              <DescriptionListTerm>CPU / Memory</DescriptionListTerm>
              <DescriptionListDescription>
                {`${resourceRequests.cpu}, ${resourceRequests.memory}`}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {replicas !== undefined && (
            <DescriptionListGroup>
              <DescriptionListTerm>Instances</DescriptionListTerm>
              <DescriptionListDescription>{replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {targetPort && (
            <DescriptionListGroup>
              <DescriptionListTerm>Target Port</DescriptionListTerm>
              <DescriptionListDescription>{targetPort}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {componentRouteWebURL && (
            <DescriptionListGroup>
              <DescriptionListTerm>Route</DescriptionListTerm>
              <DescriptionListDescription>
                <ExternalLink
                  href={componentRouteWebURL}
                  text={componentRouteWebURL}
                  dataTestID={`${name}-route`}
                  hideIcon
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {containerImage && (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Built container image</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                    {containerImage}
                  </ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Download SBOM</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                    {`cosign download sbom ${containerImage}`}
                  </ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
        </DescriptionList>
      </DataListContent>
    </DataListItem>
  );
};
