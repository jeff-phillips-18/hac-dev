import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
} from '@patternfly/react-core';
import SidePanelContext, { SidePanelProps } from './SidePanelContext';

const SidePanelHost: React.FC = ({ children }) => {
  const [props, setProps] = React.useState<SidePanelProps>({ isExpanded: false });
  const [initDisplay, setInitDisplay] = React.useState<boolean>(true);

  const panelContent = <DrawerPanelContent isResizable>{props.children}</DrawerPanelContent>;

  React.useEffect(() => {
    setTimeout(() => setInitDisplay(false), 300);
  }, []);

  return (
    <SidePanelContext.Provider value={{ setProps }}>
      <Drawer
        isExpanded={props.isExpanded}
        isInline={props.isInline}
        onExpand={props.onExpand}
        className={initDisplay ? 'pf-m-resizing' : 'undefined'}
      >
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>{children}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </SidePanelContext.Provider>
  );
};

export default SidePanelHost;
