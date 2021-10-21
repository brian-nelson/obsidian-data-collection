import {FileView, TFile, WorkspaceLeaf} from "obsidian";
import ObsidianDataCollection from "./main";
import {DataRepo} from "./repos";

export class JsonView extends FileView {
    private plugin:ObsidianDataCollection;
    private wrapperEl: HTMLElement;
    private repo: DataRepo;

    constructor(leaf: WorkspaceLeaf, plugin: ObsidianDataCollection) {
        super(leaf);
        this.plugin = plugin;

        let contentEl = this.containerEl.querySelector(".view-content") as HTMLElement;
        this.wrapperEl = contentEl.createDiv("dc-json-wrapper");
        this.repo = new DataRepo(this.plugin.app.vault);
    }

    async onLoadFile(file: TFile) : Promise<void> {
        console.log("Loaded json file");

        this.repo.ReadData(file.path)
            .then(data => {
                let codeEl = this.wrapperEl.createEl("pre");
                codeEl.innerText = JSON.stringify(data, null, 2);
            })
            .catch(e => {
                console.log(e.message);
            });
    }

    getViewType(): string {
        return "json";
    }
}