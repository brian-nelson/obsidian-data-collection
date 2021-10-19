import {App, MarkdownRenderChild, Notice} from 'obsidian';
import {DataObject, FormField, FormSpec} from "./types";
import {DataRepo} from "./repos";

export class FormRenderer extends MarkdownRenderChild {
    ID_PREFIX: string;
    repo: DataRepo;

    constructor(public app: App, public formSpec: FormSpec, public container: HTMLElement) {
        super(container)

        this.ID_PREFIX = "dcf_";
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

                if (field.required == undefined
                    || !field.required) {
                    fieldTitleElement.innerText = field.displayName;
                } else {
                    fieldTitleElement.innerText = field.displayName + "*";
                }

                const fieldDataElement = row.createEl('div');
                fieldDataElement.className = this.ID_PREFIX + "field_entry";
                if (field.type == 'date') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'date'
                    this.setDefaultDateValue(field.defaultValue, input);
                    this.setRequired(field, input);
                } else if (field.type == 'string') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'text'
                    this.setRequired(field, input);
                } else if (field.type == 'double') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'number'
                    this.setRequired(field, input);
                } else if (field.type == 'int') {
                    let input = fieldDataElement.createEl("input");
                    input.id = this.ID_PREFIX + field.name;
                    input.type = 'number'
                    this.setRequired(field, input);
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

    setRequired(field:FormField, input:HTMLInputElement){
        input.required = !(field.required == undefined
            || !field.required);
    }

    setDefaultDateValue(defaultValue:string, input:HTMLInputElement) {
        if (defaultValue != null) {
            if (defaultValue == 'today') {
                input.valueAsDate = new Date();
            } else if (defaultValue == 'tomorrow') {
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                input.valueAsDate = tomorrow;
            } else if (defaultValue == 'yesterday') {
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                input.valueAsDate = yesterday;
            } else {
                input.value = defaultValue;
            }
        }
    }

    async SaveData() {
        const newData:DataObject = {};

        let missingRequiredField:boolean = false;

        if (this.formSpec.fields !== null) {
            for (const field of this.formSpec.fields) {
                const element = document.getElementById(this.ID_PREFIX + field.name);

                if (element != null) {
                    let value:any = (element as HTMLInputElement).value;

                    if (field.required
                        && (value == null || value =="")) {
                        missingRequiredField = true;
                    }

                    if (field.type == 'date') {
                        newData[field.name] = value;
                    } else {
                        newData[field.name] = value;
                    }
                } else {
                    newData[field.name] = null;

                    if (field.required) {
                      missingRequiredField = true;
                    }
                }
            }
        }

        if (missingRequiredField) {
            if (this.formSpec.requiredFieldMessage != null) {
                new Notice(this.formSpec.requiredFieldMessage, 5000);
            } else {
                new Notice("A required field is missing a value", 5000);
            }

            return;
        }

        console.log(newData);

        this.repo.AppendData(this.formSpec.source, newData, this.formSpec.sortOnSave)
            .then( () => {
                console.log("Data saved");

                if (this.formSpec.recordSavedMessage != undefined) {
                    new Notice(this.formSpec.recordSavedMessage);
                } else {
                    new Notice("Record Saved");
                }
            })
            .catch(e => {
               console.log(e.message);
            });
    }
}