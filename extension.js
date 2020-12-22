/* 
	Hide Panel
	Copyright Francois Thirioux 2020
	GitHub contributors: @fthx
	License GPL v3
*/

const Main = imports.ui.main;
const Panel = Main.panel;
const Overview = Main.overview;
const AppMenu = Main.panel.statusArea.appMenu;

class Extension {
    constructor() {
    }
    
    _set_panel(height, opacity) {
    	Panel.set_height(height);
    	Panel.set_opacity(opacity);
    }
    
    _show_panel() {
    	AppMenu.hide();
    	this._set_panel(this.panel_height, 255);
    }
    
    _hide_panel() {
    	AppMenu.show();
    	this._set_panel(1, 0);
    }

    enable() {
		this.panel_height = Panel.get_height();
		this._set_panel(1, 0);
		this.entering_overview = Overview.connect("showing", this._show_panel.bind(this));
		this.leaving_overview = Overview.connect("hiding", this._hide_panel.bind(this));
    }

    disable() {
    	Overview.disconnect(this.entering_overview);
    	Overview.disconnect(this.leaving_overview);
    	this._set_panel(this.panel_height, 255);
    }
}

function init() {
	return new Extension();
}

