import React from "react";
import {Nav} from "react-router-dom"

export const Header = () => {
  return (
    <header className="layout__navbar">
      <Nav>
      <div className="navbar__header">
        <a href="#" className="navbar__title">
          REACTSOCIAL
        </a>
      </div>
      <Nav/>
    </header>
  );
};
