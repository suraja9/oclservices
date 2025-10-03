import React from "react";
import StickyTabs from "./StickyTabs";

interface GlobalStickyTabsProps {
  children: React.ReactNode;
}

const GlobalStickyTabs: React.FC<GlobalStickyTabsProps> = ({ children }) => {
  return (
    <>
      {children}
      <StickyTabs />
    </>
  );
};

export default GlobalStickyTabs;
