import { Client, EditableComponent, Feature, Html, ComponentExt, TabEditor } from "htmljs-code";
import EventType from "htmljs-code/lib/models/eventType.js";
import { ElementType } from "htmljs-code/lib/models/elementType.js";

export class MenuComponent extends EditableComponent {
    /**
     * @type {HTMLElement}
     */
    _elementMain;
    /**
     * @type {HTMLElement}
     */
    _elementMenu;
    /**
     * @type {HTMLElement}
     */
    _elementBrandLink;
    /**
     * @type {HTMLElement}
     */
    _elementMainHeader;
    /**
     * @type {HTMLElement}
     */
    _elementMainSidebar;
    /**
     * @type {HTMLElement}
     */
    _elementExpand;
    /**
     * Creates an instance of the MenuComponent.
     * @param {Component} meta - The UI component.
     * @param {HTMLElement} ele - The HTML element.
     */
    constructor(meta, ele) {
        super(meta, ele);
        this._elementMain = document.querySelector("#tab-content");
        this._elementMenu = document.querySelector("aside");
        this._elementBrandLink = document.querySelector(".brand-link");
        this._elementMainHeader = document.querySelector(".main-header");
        this._elementMainSidebar = document.querySelector(".main-sidebar");
        var widthMenu = window.localStorage.getItem("menu-width") ?? "202px";
        this._elementMain.style.marginLeft = widthMenu;
        this._elementBrandLink.style.width = widthMenu;
        this._elementMainHeader.style.marginLeft = widthMenu;
        this._elementMainSidebar.style.width = widthMenu;
    }
    /**
     * @type {Feature[]}
     */
    Features;
    Render() {
        new Promise(() => {
            Client.Instance.SubmitAsync({
                Url: `/api/feature/getMenu`,
                IsRawString: true,
                Method: "GET"
            }).then(features => {
                this.Features = features;
                this.RenderMenu(features);
                this.SearchMenu();
                var main = document.querySelector("aside");
                this.CreateResizableTable(main);
            });
        });
    }

    /**
     * @param {HTMLElement} col
     */
    CreateResizableTable(col) {
        var resizer = document.createElement("div");
        resizer.classList.add("resizer");
        col.appendChild(resizer);
        var button = document.createElement("button");
        button.classList.add("resizer-button");
        button.addEventListener(EventType.Click, () => {
            if (parseInt(this._elementBrandLink.style.width.replace("px", "")) < 100) {
                this._elementMain.style.marginLeft = "202px";
                this._elementBrandLink.style.width = "202px";
                this._elementMainHeader.style.marginLeft = "202px";
                this._elementMainSidebar.style.width = "202px";
                col.style.width = "202px";
                col.style.minWidth = "202px";
                col.style.maxWidth = "202px";
                this._elementExpand.classList.replace("fa-arrow-circle-right", "fa-arrow-circle-left");
            }
            else {
                this._elementMain.style.marginLeft = "45px";
                this._elementBrandLink.style.width = "45px";
                this._elementMainHeader.style.marginLeft = "45px";
                this._elementMainSidebar.style.width = "45px";
                col.style.width = "45px";
                col.style.minWidth = "45px";
                col.style.maxWidth = "45px";
                this._elementExpand.classList.replace("fa-arrow-circle-left", "fa-arrow-circle-right");
            }
        });
        this._elementExpand = document.createElement("i");
        if (parseInt(this._elementBrandLink.style.width.replace("px", "")) < 100) {
            this._elementExpand.classList.add("fal");
            this._elementExpand.classList.add("fa-arrow-circle-right");
        }
        else {
            this._elementExpand.classList.add("fal");
            this._elementExpand.classList.add("fa-arrow-circle-left");
        }
        button.appendChild(this._elementExpand);
        col.appendChild(button);
        this.CreateResizableColumn(col, resizer);
    }

    /**
     * @param {HTMLElement} col
     * @param {HTMLElement} resizer
     */
    CreateResizableColumn(col, resizer) {
        this.x = 0;
        this.w = 0;
        resizer.addEventListener("mousedown", (e) => this.MouseDownHandler(e, col, resizer));
    }
    /** @type {MouseEvent} */
    mouseMoveHandler;
    /** @type {MouseEvent} */
    mouseUpHandler;
    /**
    * @param {HTMLElement} col
    * @param {HTMLElement} resizer
    * @param {MouseEvent} mouse
    */
    MouseDownHandler(mouse, col, resizer) {
        mouse.preventDefault();
        this.x = mouse.clientX;
        var styles = window.getComputedStyle(col);
        this.w = parseFloat((styles.width.replace("px", "") == "") ? "0" : styles.width.replace("px", ""));
        this.mouseMoveHandler = (a) => this.MouseMoveHandler(a, col, resizer);
        this.mouseUpHandler = (a) => this.MouseUpHandler(a, col, resizer);
        document.addEventListener("mousemove", this.mouseMoveHandler);
        document.addEventListener("mouseup", this.mouseUpHandler);
        resizer.AddClass("resizing");
    }

    /**
    * @param {HTMLElement} col
    * @param {HTMLElement} resizer
    * @param {MouseEvent} mouse
    */
    MouseMoveHandler(mouse, col, resizer) {
        mouse.preventDefault();
        var dx = mouse.clientX - this.x;
        col.style.width = `${this.w + dx}px`;
        col.style.minWidth = `${this.w + dx}px`;
        col.style.maxWidth = `${this.w + dx}px`;
        this._elementMain.style.marginLeft = `${this.w + dx}px`;
        this._elementBrandLink.style.width = `${this.w + dx}px`;
        this._elementMainHeader.style.marginLeft = `${this.w + dx}px`;
        if (this.w + dx < 100) {
            this._elementExpand.classList.replace("fa-arrow-circle-left", "fa-arrow-circle-right");
        }
        else {
            this._elementExpand.classList.replace("fa-arrow-circle-right", "fa-arrow-circle-left");
        }
        window.localStorage.setItem("menu-width", `${this.w + dx}px`);
    }

    /**
    * @param {HTMLElement} col
    * @param {HTMLElement} resizer
    * @param {MouseEvent} mouse
    */
    MouseUpHandler(mouse, col, resizer) {
        mouse.preventDefault();
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", this.mouseMoveHandler);
        document.removeEventListener("mouseup", this.mouseUpHandler);
    }

    SearchMenu() {
        /** @type {HTMLInputElement}*/
        var search = document.querySelector(".form-control-sidebar");
        search.addEventListener(EventType.Input, (e) => {
            if (search.value == "") {
                this.RenderMenu(this.Features);
                return;
            }
            var menus = this.Features.filter(x => x.Label.toLowerCase().includes(search.value.toLowerCase()));
            this.RenderMenu(menus);
        });
    }
    /**
     * Renders the menu using the provided features.
     * @param {Feature[]} features - The array of Feature objects.
     */
    RenderMenu(features) {
        Html.Take("#menu");
        Html.Instance.Clear();
        /**
         * @param {Feature[]} features
         */
        Html.Instance.Ul.ClassName("nav nav-pills nav-sidebar flex-column nav-child-indent").ForEach(features,
            /**
            * @param {Feature} item
            */
            (item, index) => {
                if (item.IsGroup) {
                    Html.Instance.Li.ClassName("nav-header").Title(item.Label).End.Render();
                }
                else {
                    var featureParam = window.location.pathname.replace("/", "");
                    var check = item.InverseParent && item.InverseParent.length > 0;
                    Html.Instance.Li.ClassName("nav-item");
                    if (check) {
                        if (item.InverseParent.Any(x => x.Name == featureParam)) {
                            Html.Instance.ClassName("menu-open");
                        }
                    }
                    Html.Instance.A.DataAttr("page", item.Name).ClassName("nav-link");
                    if (!check) {
                        if (featureParam == item.Name) {
                            Html.Instance.ClassName("active");
                        }
                    }
                    Html.Instance.Event(EventType.Click, (e) => this.MenuItemClick(e, item.Name))
                        .Icon(item.Icon).ClassName("nav-icon").End.Div.IText(item.Label).End.Render();
                    if (check) {
                        Html.Instance.I.ClassName("right fas fa-angle-left").End.Render();
                    }
                    Html.Instance.EndOf(ElementType.a).Render();
                    if (check) {
                        RenderMenuItems(item.InverseParent.ToList(), true);
                    }
                    Html.Instance.EndOf(ElementType.li).Render();
                }
            });
    }

    /**
    * @param {Feature} menuItems
    */
    RenderMenuItems(menuItems, nested = false) {
        Html.Instance.Ul.ClassName("nav nav-treeview").ForEach(menuItems,
            /**
            * @param {Feature} item
            */
            (item, index) => {
                var featureParam = Window.Location.PathName.Replace("/", "");
                var check = item.InverseParent != null && item.InverseParent.Count > 0;
                Html.Instance.Li.ClassName("nav-item");
                if (check) {
                    if (item.InverseParent.some(x => x.Name == featureParam)) {
                        Html.Instance.ClassName("menu-open");
                    }
                }
                Html.Instance.A.DataAttr("page", item.Name).ClassName("nav-link");
                if (!check) {
                    if (featureParam == item.Name) {
                        Html.Instance.ClassName("active");
                    }
                }
                Html.Instance.Event(EventType.Click, (e) => this.MenuItemClick(e, item.Name).bind(this))
                    .Icon(item.Icon).ClassName("nav-icon").End.Div.IText(item.Label).End.Render();
                if (check) {
                    Html.Instance.I.ClassName("right fas fa-angle-left").End.Render();
                }
                Html.Instance.EndOf(ElementType.a).Render();
                if (check) {
                    this.RenderMenuItems(item.InverseParent, true);
                }
                Html.Instance.EndOf(ElementType.li).Render();
            });
    }

    /**
     * @param {Event} e 
     * @param {string} featureName
     */
    MenuItemClick(e, featureName) {
        /**
         * @type {HTMLElement}
         */
        var a = e.target;
        if (!(a instanceof HTMLAnchorElement)) {
            a = a.closest("a");
        }
        var li = a.closest(ElementType.li);
        if (li.classList.contains("menu-open")) {
            li.classList.remove("menu-open");
            return;
        }
        this.HideAll(a.closest("ul"));
        a.focus();
        if (a.classList.contains("active")) {
            a.classList.remove("active");
        }
        else {
            a.classList.add("active");
        }
        if (li.classList.contains("menu-open")) {
            li.classList.remove("menu-open");
        }
        else {
            li.classList.add("menu-open");
        }
        e.preventDefault();
        var tab = TabEditor.Tabs.find(x => x.Meta.Name == featureName);
        if (tab) {
            tab.Focus();
            return;
        }
        ComponentExt.InitFeatureByName(featureName, true).Done();
    }

    /**
     * @param {HTMLElement} current
     */
    HideAll(current) {
        if (!current) {
            current = document.body;
        }
        var activea = current.querySelectorAll("a.active");
        var activeLi = current.querySelectorAll("li.menu-open");
        activea.forEach(x => x.classList.remove("active"));
        activeLi.forEach(x => x.classList.remove("menu-open"));
    }
}