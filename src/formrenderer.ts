import {App, MarkdownRenderChild} from 'obsidian';
import {DataObject, FormSpec} from "./types";
import {DataRepo} from "./repos";

export class FormRenderer extends MarkdownRenderChild {
    ID_PREFIX:string = "dcf_";
    repo: DataRepo;

    constructor(public app: App, public formSpec: FormSpec, public container: HTMLElement) {
        super(container)

        this.repo = new DataRepo(app.vault);
    }

    async onload() {
        await this.render();
    }

    async render() {
        const outerElement = this.container.createEl('div');

        const titleElement = outerElement.createEl('div');
        titleElement.className = this.ID_PREFIX + "title_row";

        const titleText = titleElement.createEl('div');
        titleText.className = this.ID_PREFIX + "title_text";
        titleText.innerText = this.formSpec.title;

        const formElement = this.container.createEl('div');

        if (this.formSpec.fields !== null) {
            for (const field of this.formSpec.fields) {
                const row = formElement.createEl('div');
                row.className = this.ID_PREFIX + "field_group";

                const fieldTitleElement = row.createEl('div');
                fieldTitleElement.className = this.ID_PREFIX + "field_title";
                fieldTitleElement.innerText = field.displayName;

                const fieldDataElement = row.createEl('div');
                fieldDataElement.className = this.ID_PREFIX + "field_entry";
                if (field.type == 'date') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'date'

                    if (field.defaultValue != null) {
                        if (field.defaultValue == 'today') {
                            input.valueAsDate = new Date();
                        } else if (field.defaultValue == 'tomorrow') {
                            let tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            input.valueAsDate = tomorrow;
                        } else if (field.defaultValue == 'yesterday') {
                            let yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            input.valueAsDate = yesterday;
                        } else {
                            input.value = field.defaultValue;
                        }
                    }
                } else if (field.type == 'string') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'text'
                } else if (field.type == 'double') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'number'
                } else if (field.type == 'int') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'number'
                }
            }

            const buttonRow = formElement.createEl("div");
            buttonRow.className = this.ID_PREFIX + "button_row";

            const saveButton = buttonRow.createEl("button");
            saveButton.className = this.ID_PREFIX + "button";

            if (this.formSpec.buttonText != null) {
                saveButton.innerText = this.formSpec.buttonText;
            } else {
                saveButton.innerText = "Save";
            }

            saveButton.on("click", "button", () => {
                console.log("Saving data");
                this.SaveData();
            });
        }
    }

    async SaveData() {
        const newData:DataObject = {};

        if (this.formSpec.fields !== null) {

            for (const field of this.formSpec.fields) {
                const element = document.getElementById(this.ID_PREFIX + field.name);

                if (element != null) {
                    newData[field.name] = (element as HTMLInputElement).value;
                } else {
                    newData[field.name] = null;
                }
            }
        }

        console.log(newData);

        this.repo.AppendData(this.formSpec.source, newData)
            .then( () => {
                console.log("Data saved");
            })
            .catch(e => {
               console.log(e.message);
            });
    }
}