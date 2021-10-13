import {FileView, TFile, WorkspaceLeaf} from "obsidian";
import ObsidianDataCollection from "./main";
import {DataRepo} from "./repos";

export class JsonView extends FileView {
    plugin:ObsidianDataCollection;
    wrapperEl: HTMLElement;
    repo: DataRepo;

    constructor(leaf: WorkspaceLeaf, plugin: ObsidianDataCollection) {
        super(leaf);
        this.plugin = plugin;

        let contentEl = this.containerEl.querySelector(".view-content") as HTMLElement;
        this.wrapperEl = contentEl.createDiv("dc-json-wrapper");

        this.repo = new DataRepo(this.plugin.app.vault);
    }

    async onLoadFile(file: TFile) : Promise<void> {
        console.log(file);

        this.repo.ReadData(file.path)
            .then(data => {
                this.wrapperEl.innerText = JSON.stringify(data, null, 4);
            })
            .catch(e => {
                console.log(e.message);
            })

    }

    getViewType(): string {
        return "json";
    }
}