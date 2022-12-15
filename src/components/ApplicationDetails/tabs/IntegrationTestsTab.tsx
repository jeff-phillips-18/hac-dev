import * as React from 'react';
import IntegrationTestsListView from '../../IntegrationTest/IntegrationTestsListView/IntegrationTestsListView';

type IntegrationTestsTabProps = {
  applicationName: string;
};

const IntegrationTestsTab: React.FC<IntegrationTestsTabProps> = ({ applicationName }) => (
  <IntegrationTestsListView applicationName={applicationName} />
);

export default IntegrationTestsTab;
