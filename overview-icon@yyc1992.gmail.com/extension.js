/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// overview-icon: Gnome shell extension displaying icons in overview mode
// Copyright (C) 2011 Yichao Yu

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Author: Yichao Yu
// Email: yyc1992@gmail.com

const Shell = imports.gi.Shell;
const Workspace = imports.ui.workspace;
const Lang = imports.lang;

let tracker = Shell.WindowTracker.get_default();
let icon_size = 64;

function injectToFunction(parent, name, func) {
    let origin = parent[name];
    parent[name] = function() {
        let ret;
        ret = origin.apply(this, arguments);
        if (ret === undefined)
            ret = func.apply(this, arguments);
        return ret;
    }
}

function addIcon(windowClone, parentActor) {
    let app = tracker.get_window_app(windowClone.metaWindow);
    this._appicon = app.create_icon_texture(icon_size);
    this._appicon.hide();
    parentActor.add_actor(this._appicon);
}

function updatePositions(cloneX, cloneY, cloneWidth, cloneHeight) {
    let iconX = cloneX + cloneWidth - this._appicon.get_width();
    let iconY = cloneY + cloneHeight - this._appicon.get_height();
    this._appicon.set_position(Math.floor(iconX), Math.floor(iconY));
    this._appicon.raise_top();
    this._appicon.show();
}

function main() {
    injectToFunction(Workspace.WindowOverlay.prototype, '_init', addIcon);
    injectToFunction(Workspace.WindowOverlay.prototype, 'updatePositions', updatePositions);
    injectToFunction(Workspace.WindowOverlay.prototype, 'hide', function() {
        this._appicon.hide();
    });
    injectToFunction(Workspace.WindowOverlay.prototype, 'show', function() {
        this._appicon.show();
    });
}
