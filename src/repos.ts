import {Vault} from "obsidian";
import {DataObject, FieldSort, Repo} from "./types";

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
                            .catch(() => {
                                reject("Unable to parse file.");
                            });
                    } else {
                        let array : DataObject[] = [];
                        resolve(array);
                    }
                })
                .catch(() => {
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
                .catch(() => {
                    reject("Unable to write file.");
                });
        });
    }

    async AppendData(filename:string, newData:DataObject, sortOnSave:FieldSort) : Promise<void> {

        return new Promise<void>( (resolve, reject) => {
            // Load the data
            this.ReadData(filename)
                .then(array => {
                    array.push(newData);

                    //Sort array if required
                    if (sortOnSave != undefined) {
                        let sortField:string = sortOnSave.sortFieldName;
                        let sortDirection:string = sortOnSave.sortDirection;

                        if (sortField != null) {
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
                        .catch(() => {
                            reject("Unable to write appended data.");
                        });
                })
                .catch(() => {
                    reject("Unable to append data.");
                });
        });
    }
}