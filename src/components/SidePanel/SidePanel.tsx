import React from 'react';
import SidePanelContext, { SidePanelProps } from './SidePanelContext';

const SidePanel: React.FC<SidePanelProps> = ({ isExpanded, isInline, onExpand, children }) => {
  const { setProps } = React.useContext(SidePanelContext);

  React.useEffect(() => {
    setProps({ isExpanded, isInline, onExpand, children });
  }, [setProps, isExpanded, isInline, onExpand, children]);

  return null;
};

export default SidePanel;
