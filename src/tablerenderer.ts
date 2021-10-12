import {App, MarkdownRenderChild} from 'obsidian';
import {DataObject, TableSpec} from "./types";
import {DataRepo} from "./repos";

export class TableRenderer extends MarkdownRenderChild {
    ID_PREFIX:string = "dct_";
    repo: DataRepo;

    constructor(public app: App, public tableSpec: TableSpec, public container: HTMLElement) {
        super(container)

        this.repo = new DataRepo(app.vault);
    }

    async onload() {
        await this.render();
    }

    async render() {
        this.repo.ReadData(this.tableSpec.source)
            .then(dataObjects => {
                const outerElement = this.container.createEl('div');

                const tableElement = outerElement.createEl('table');
                const tr = tableElement.createEl('tr');

                for (const field of this.tableSpec.fields) {
                    const headerCell = tr.createEl('th');
                    headerCell.innerText = field.displayName;
                }
            })
            .catch(e => {
                console.log(e.message);
            });

    }
}