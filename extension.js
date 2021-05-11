/* 
	Hide Panel
	Copyright Francois Thirioux 2021
	GitHub contributors: @fthx
	License GPL v3
*/


const { GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Panel = Main.panel;
const Overview = Main.overview;
const AppMenu = Main.panel.statusArea.appMenu;


var HideIndicator = GObject.registerClass(
class HideIndicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, 'Hide Panel Button');

		this.is_active = true;

		this.hbox = new St.Bin({visible: true, reactive: true, can_focus: true, track_hover: true});
		this.active_icon = new St.Icon({icon_name: 'view-conceal-symbolic', style_class: 'system-status-icon'});
		this.inactive_icon = new St.Icon({icon_name: 'view-reveal-symbolic', style_class: 'system-status-icon'});
		this._set_icon();
		this.add_child(this.hbox);

		this.click = this.connect('button-release-event', this._switch_active.bind(this));
	}

	_set_icon() {
		if (this.is_active) {
			this.hbox.set_child(this.active_icon);
		} else {
			this.hbox.set_child(this.inactive_icon);
		}
	}

	_set_panel(height, opacity) {
    	Panel.set_height(height);
    	Panel.set_opacity(opacity);
    }

	_switch_active() {
		this.is_active = !this.is_active;
		this._set_icon();
		if (this.is_active) {
			this._set_panel(1, 0);
		}
	}
});

class Extension {
    constructor() {
		this.panel_height = Panel.get_height();
		
		this.panel_icon = new HideIndicator();
    }
    
    _set_panel(height, opacity) {
    	Panel.set_height(height);
    	Panel.set_opacity(opacity);
    }
    
    _show_panel() {
		if (this.panel_icon.is_active) {
			this._set_panel(this.panel_height, 255);
		}
    }
    
    _hide_panel() {
		if (this.panel_icon.is_active) {
			this._set_panel(1, 0);
		}
    }

    enable() {
    	AppMenu.container.hide();
		this._hide_panel();
		Panel.addToStatusArea('hide-panel', this.panel_icon);

		this.showing = Overview.connect('showing', this._show_panel.bind(this));
		this.hiding = Overview.connect('hiding', this._hide_panel.bind(this));
    }

    disable() {
    	Overview.disconnect(this.showing);
    	Overview.disconnect(this.hiding);
    	this._show_panel();
    	if (!Main.sessionMode.isLocked) {
    		AppMenu.container.show();
    	}
		this.panel_icon.destroy();
    }
}

function init() {
	return new Extension();
}

