/* 
	Hide Panel
	Copyright Francois Thirioux 2021
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
    	this._set_panel(this.panel_height, 255);
    }
    
    _hide_panel() {
    	this._set_panel(1, 0);
    }

    enable() {
    	AppMenu.container.hide();
		this.panel_height = Panel.get_height();
		this._set_panel(1, 0);
		this.showing = Overview.connect('showing', this._show_panel.bind(this));
		this.hiding = Overview.connect('hiding', this._hide_panel.bind(this));
    }

    disable() {
    	Overview.disconnect(this.showing);
    	Overview.disconnect(this.hiding);
    	this._set_panel(this.panel_height, 255);
    	if (!Main.sessionMode.isLocked) {
    		AppMenu.container.show();
    	}
    }
}

function init() {
	return new Extension();
}

