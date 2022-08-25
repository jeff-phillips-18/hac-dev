import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { WatchK8sResource } from '../dynamic-plugin-sdk';
import { PipelineRunGroupVersionKind } from '../shared';
import { PipelineRunKind } from '../shared/components/pipeline-run-logs/types';

const BUILD_COMPONENT_LABEL = 'build.appstudio.openshift.io/component';
const BUILD_APPLICATION_LABEL = 'build.appstudio.openshift.io/application';

export const useComponentPipelineRun = (
  name: string,
  application: string,
  namespace: string,
): { pipelineRun: PipelineRunKind; loaded: boolean } => {
  const watchResource: WatchK8sResource = React.useMemo(() => {
    const matchLabels = {
      [BUILD_COMPONENT_LABEL]: name,
      [BUILD_APPLICATION_LABEL]: application,
    };

    return {
      groupVersionKind: PipelineRunGroupVersionKind,
      namespace,
      selector: { matchLabels },
      isList: true,
    };
  }, [name, application, namespace]);

  const [pipelineRuns, loaded, error] = useK8sWatchResource(watchResource);

  const pipelineRun = React.useMemo(() => {
    if (loaded && !error) {
      return (pipelineRuns as PipelineRunKind[])?.sort?.(
        (a, b) =>
          new Date(b.metadata.creationTimestamp).getTime() -
          new Date(a.metadata.creationTimestamp).getTime(),
      )?.[0];
    }
    return undefined;
  }, [pipelineRuns, loaded, error]);

  return { loaded, pipelineRun };
};
