import React from "react";
import { ToastContainer } from "react-toastify";
import {
  Page,
  EditForm,
  Feature,
  ComponentExt,
  Client,
  ChromeTabs,
  Utils,
} from "htmljs-code";
import { MenuComponent } from "./components/menu";
import { LoginBL } from "./forms/login.jsx";
import Profile from "./components/profile.jsx";
import "htmljs-code/lib/css/root.css";
import "htmljs-code/lib/css/fontawesome.min.css";
import "htmljs-code/lib/css/checkbox.css";
import "htmljs-code/lib/css/chrome-tabs.css";
import "htmljs-code/lib/css/datepicker.css";
import "htmljs-code/lib/css/dropdown.css";
import "htmljs-code/lib/css/fileupload.css";
import "htmljs-code/lib/css/gridview.css";
import "htmljs-code/lib/css/header.css";
import "htmljs-code/lib/css/input.css";
import "htmljs-code/lib/css/main.css";
import "htmljs-code/lib/css/number.css";
import "htmljs-code/lib/css/section.css";
import "htmljs-code/lib/css/test.css";
export class App {
  /** @type {Page} */
  static MyApp;
  /** @type {App} */
  static _instance;
  /** @type {App} */
  static get Instance() {
    if (!this._instance) {
      this._instance = new App();
    }
    return this._instance;
  }
  /** @type {Feature} */
  Meta;
  constructor() {
    this.Meta = new Feature();
    this.Meta.ParentElement = document.getElementById("app");
    this.Meta.Layout = () => (
      <>
        <div className="wrapper">
          <nav className="main-header navbar navbar-expand navbar-light">
            <div className="chrome-tabs">
              <div className="chrome-tabs-content"></div>
            </div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown"></li>
              <li className="nav-item dropdown"></li>
              <li className="nav-item dropdown">
                <Profile />
              </li>
            </ul>
            <div className="chrome-tabs-bottom-bar"></div>
          </nav>
          <aside className="main-sidebar main-sidebar-custom sidebar-light-info elevation-1">
            <a href="/" className="brand-link">
              <img
                src="https://htmlcs.softek.com.vn/icons/icon.png"
                alt="HTMLJS DESIGN"
                className="brand-image"
              />
              <span className="brand-text font-weight-light">
                HTMLJS DESIGN
              </span>
              <div className="chrome-tabs-bottom-bar"></div>
            </a>
            <div className="sidebar">
              <div className="form-inline" style={{ marginTop: "6px" }}>
                <div className="input-group">
                  <input
                    className="form-control form-control-sidebar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </div>
              </div>
              <nav className="mt-2" id="menu" data-name="Menu"></nav>
            </div>
          </aside>
          <div className="content-wrapper" id="tab-content"></div>
          <aside className="control-sidebar control-sidebar-light"></aside>
        </div>
        <ToastContainer />
      </>
    );
    this.Meta.Components = [
      {
        ComponentType: () => {
          return new MenuComponent();
        },
        FieldName: "Menu",
      },
    ];
    this.MyApp = new Page();
    this.MyApp.EditForm = new EditForm("MyApp");
    this.MyApp.EditForm.Policies = [
      {
        CanRead: true,
      },
    ];
    this.MyApp.Meta = this.Meta;
    this.MyApp.EditForm.Meta = this.Meta;
  }

  Init() {
    LoginBL.Instance.Render();
  }

  async RenderLayout() {
    await this.MyApp.Render();
    var el = document.querySelector(".chrome-tabs");
    if (el != null) {
      ChromeTabs.init(el);
    }
    this.LoadByFromUrl();
  }

  LoadByFromUrl() {
    const fName = this.GetFeatureNameFromUrl() || "";
    if (!fName) {
      return;
    }
    ComponentExt.InitFeatureByName(fName, true).Done();
    return fName;
  }

  /**
   * @returns {string|null}
   */
  GetFeatureNameFromUrl() {
    let feature = window.location.pathname
      .toLowerCase()
      .replace(Client.BaseUri.toLowerCase(), "");
    if (feature.startsWith(Utils.Slash)) {
      feature = feature.substring(1);
    }
    if (!feature.trim() || feature == undefined) {
      return null;
    }
    return feature;
  }
}
App.Instance.Init();
