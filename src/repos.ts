import {Vault} from "obsidian";
import {DataObject, Repo} from "./types";

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
                        let array : DataObject[];
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

    async AppendData(filename:string, newData:DataObject) : Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            this.ReadData(filename)
                .then(array => {
                    array.push(newData);

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