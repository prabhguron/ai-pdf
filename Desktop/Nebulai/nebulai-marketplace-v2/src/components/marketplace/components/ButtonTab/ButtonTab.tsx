import React from "react";
import { MenuEntry } from "../../interfaces/MenuEntry";

interface TabProps {
  tab: MenuEntry;
  onClickHandler: any;
}

const ButtonTab = ({ tab, onClickHandler }: TabProps) => {
  return (
    <button
      className={`nav-link button-tab ${tab.active ? "active" : ""}`}
      id={`${tab.id}`}
      data-bs-toggle="tab"
      data-bs-target={`#${tab.name}`}
      type="button"
      role="tab"
      aria-controls={`${tab.name}`}
      aria-selected="false"
      onClick={onClickHandler}
    >
      {/*@ts-ignore*/}
      <div style={{ display: "flex" }}>
        {/* icon */}
        <div>{tab.name}</div>
      </div>
    </button>
  );
};

export default ButtonTab;