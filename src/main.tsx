import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { render } from "./utils/render";

import PluginConfigScreen from "./entrypoints/PluginConfigScreen";
import FieldConfigScreen from "./entrypoints/FieldConfigScreen";
import ContentConfigScreen from "./entrypoints/ContentConfigScreen";
import packageJson from "../package.json";

const fieldSettings = {
	id: "buttonExtended",
	name: "Button Extended",
};

connect({
	async onBoot(ctx) {
		const version = packageJson.version;

		if (ctx.plugin.attributes.parameters?.version === version) {
			return;
		}

		ctx.plugin.attributes.parameters = {
			...ctx.plugin.attributes.parameters,
			version: version,
		};
	},
	renderConfigScreen(ctx) {
		return render(<PluginConfigScreen ctx={ctx} />);
	},
	manualFieldExtensions() {
		return [
			{
				id: fieldSettings.id,
				name: fieldSettings.name,
				type: "editor" as const,
				fieldTypes: ["json" as const],
				configurable: true,
			},
		];
	},
	overrideFieldExtensions(field) {
		if (
			field.attributes.field_type === "json" &&
			field.attributes.appearance?.field_extension === fieldSettings.id
		) {
			return {
				editor: {
					id: fieldSettings.id,
				},
			};
		}
	},
	renderManualFieldExtensionConfigScreen(_fieldExtensionId, ctx) {
		return render(<FieldConfigScreen ctx={ctx} />);
	},
	renderFieldExtension(fieldExtensionId, ctx) {
		switch (fieldExtensionId) {
			case fieldSettings.id:
				return render(<ContentConfigScreen ctx={ctx} />);
		}
	},
});
