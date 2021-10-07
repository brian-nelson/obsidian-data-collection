import {parseYaml, Plugin} from 'obsidian';
import {FormSpec, GraphSpec} from "./types";
import {FormRenderer} from "./formrenderer";
import {GraphRenderer} from "./graphrenderer"

export default class ObsidianDataCollection extends Plugin {
	async onload() {
		console.log('loading Obsidian Form Data plugin');

		this.registerMarkdownCodeBlockProcessor("datacollection-form", async (specification: string,
				   element, ctx) => {
				try {
					let formSpec: FormSpec = {
						source: ''
					};

					try {
						formSpec = parseYaml(specification);
					} catch (e1) {
						throw new Error(`Could not parse Form Spec: ${e1.message}`);
					}

					if (!formSpec.source) {
						throw new Error("Parameter 'source' is required.");
					}

					ctx.addChild(new FormRenderer(this.app, formSpec, element));
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
				console.log(e);
				return;
			}
		});
	}

	onunload() {
		console.log('unloading plugin');
	}
}
