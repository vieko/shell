const Me = imports.misc.extensionUtils.getCurrentExtension();

const { Gio, GObject, Meta, Shell } = imports.gi;
const { Window } = Me.imports.lib;
const { Search } = Me.imports.search;
const { uiGroup } = imports.ui.main;
const { ShellWindow } = Window;

const LIST_MAX = 5;
const ICON_SIZE = 32;

var WindowSearch = GObject.registerClass(
    class WindowSearch extends Search {
        _init(ext) {
            this.windows = [];
            this.active = [];

            let search = (pattern) => {
                this.windows.splice(0);
                this.active.splice(0);

                let window_list = ext.tab_list(Meta.TabList.NORMAL, null);
                window_list.sort((a, b) => a.name() > b.name());

                for (const win of window_list) {
                    let name = win.name();
                    let title = win.meta.get_title();

                    if (name != title) {
                        name += ": " + title;
                    }

                    if (!name.toLowerCase().includes(pattern)) {
                        continue
                    }

                    this.windows.push(win);
                    this.active.push([name, win.icon(ICON_SIZE)]);
                    if (this.active.length == LIST_MAX) {
                        break
                    }
                }

                

                return this.active;
            };

            let apply = (id) => this.windows[id].activate();

            super._init(search, apply);
        }
    }
);
