import {Vault} from "obsidian";
import {DataObject, FieldSort, FormField, FormSpec, Repo} from "./types";
import {DataHelper} from "./dataHelper";

export class DataRepo implements Repo {

    constructor(public vault: Vault) {
    }

    async ReadData(filename:string) : Promise<DataObject[]> {
        return new Promise<DataObject[]>( (resolve, reject) => {
            this.vault.adapter.exists(filename)
                .then(r => {
                    if (r) {
                        this.vault.adapter.read(filename)
                            .then(contents => {
                                const array = JSON.parse(contents);
                                resolve(array);
                            })
                            .catch(e2 => {
                                reject("Unable to parse file.");
                            });
                    } else {
                        let array : DataObject[] = [];
                        resolve(array);
                    }
                })
                .catch(e => {
                    reject("Error reading file.");
                });
        });
    }

    async WriteData(filename:string, data:DataObject[]) : Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            let json = JSON.stringify(data);

            this.vault.adapter.write(filename, json)
                .then(() => {
                    resolve();
                })
                .catch(e2 => {
                    reject("Unable to write file.");
                });
        });
    }

    async AppendData(formSpec:FormSpec, newData:DataObject) : Promise<void> {
        let filename = formSpec.source;

        return new Promise<void>( (resolve, reject) => {
            // Load the data
            this.ReadData(filename)
                .then(array => {
                    array.push(newData);

                    //Sort array if required
                    if (formSpec.sortOnSave != undefined) {
                        let sortField:string = formSpec.sortOnSave.sortFieldName;
                        let sortDirection:string = formSpec.sortOnSave.sortDirection;
                        let field:FormField = DataHelper.findFormField(formSpec.fields, sortField);

                        if (field != null) {
                            if (sortDirection === "desc") {
                                array = array.sort((a:DataObject,b:DataObject)=>{
                                    if (a[sortField] < b[sortField] ){
                                        return 1;
                                    }

                                    if (a[sortField] > b[sortField]) {
                                        return -1;
                                    }

                                    return 0;
                                })
                            } else {
                                array = array.sort((a:DataObject,b:DataObject)=>{
                                    if (a[sortField] > b[sortField] ){
                                        return 1;
                                    }

                                    if (a[sortField] < b[sortField]) {
                                        return -1;
                                    }

                                    return 0;
                                })
                            }
                        }
                    }

                    this.WriteData(filename, array)
                        .then( () => {
                            resolve();
                        })
                        .catch(e => {
                            reject("Unable to write appended data.");
                        });
                })
                .catch(e => {
                    reject("Unable to append data.");
                });
        });
    }
}