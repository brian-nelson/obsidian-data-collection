import {parseYaml, Plugin} from 'obsidian';
import {FormSpec, GraphSpec, TableSpec} from "./types";
import {FormRenderer} from "./formRenderer";
import {GraphRenderer} from "./graphRenderer"
import {TableRenderer} from "./tableRenderer";
import {JsonView} from "./jsonView";

export default class ObsidianDataCollection extends Plugin {
    async onload() {
        super.onload();

        const JSON_VIEW_TYPE: string = 'data-collection-json';

        console.log('loading Obsidian Data Collection plugin');

        this.registerView(JSON_VIEW_TYPE, (leaf) => new JsonView(leaf, this));
        this.registerExtensions(["json"], JSON_VIEW_TYPE);

        this.registerMarkdownCodeBlockProcessor("datacollection-form", async (specification: string,
                                                                              element, ctx) => {
            try {
                let formSpec: FormSpec = {
                    source: ''
                };

                try {
                    formSpec = parseYaml(specification);

                    // Fix any missing values
                    for (const field of formSpec.fields) {
                        if (field.required == undefined) {
                            field.required = false;
                        }
                    }

                } catch (e1) {
                    throw new Error(`Could not parse Form Spec: ${e1.message}`);
                }

                if (!formSpec.source) {
                    throw new Error("Parameter 'source' is required.");
                }

                //ctx.addChild(new FormRenderer(this.app, formSpec, element));
            } catch (e) {
                console.log(e);
                return;
            }
        });

        this.registerMarkdownCodeBlockProcessor("datacollection-graph", async (specification: string,
                                                                               element, ctx) => {
            try {
                let graphSpec: GraphSpec = {
                    source: '',
                    type: ''
                }

                try {
                    graphSpec = parseYaml(specification);
                } catch (e1) {
                    throw new Error(`Could not parse Graph Spec: ${e1.message}`);
                }

                if (!graphSpec.source) {
                    throw new Error("Parameter 'source' is required.")
                }

                ctx.addChild(new GraphRenderer(this.app, graphSpec, element));
            } catch (e) {
                console.log(e.message);
                return;
            }
        });

        this.registerMarkdownCodeBlockProcessor("datacollection-table", async (specification: string,
                                                                               element, ctx) => {
            try {
                let tableSpec: TableSpec = {
                    source: ''
                };

                try {
                    tableSpec = parseYaml(specification);
                } catch (e1) {
                    throw new Error(`Could not parse Form Spec: ${e1.message}`);
                }

                if (!tableSpec.source) {
                    throw new Error("Parameter 'source' is required.");
                }

                ctx.addChild(new TableRenderer(this.app, tableSpec, element));
            } catch (e) {
                console.log(e);
                return;
            }
        });
    }

    onunload() {
        console.log('unloading plugin');
    }
}
