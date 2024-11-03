import React from "react";
import { createRoot } from "react-dom/client";
import {
	connect,
	OnBootCtx,
	Field,
	IntentCtx,
	FieldIntentCtx,
	FieldAppearanceChange,
	RenderFieldExtensionCtx,
	RenderManualFieldExtensionConfigScreenCtx,
} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { render } from "./utils/render";

import PluginConfigScreen from "./entrypoints/PluginConfigScreen";
import FieldConfigScreen from "./entrypoints/FieldConfigScreen";
import ContentConfigScreen from "./entrypoints/ContentConfigScreen";

const fieldSettings = {
	id: "betterLinkingDev",
	name: "Better Linking Dev",
};

connect({
	
	async onBoot(ctx: OnBootCtx) {
		const { version } = require('../package.json');
		// if(ctx.plugin.attributes.parameters?.version === version ){
		//   return;
		// }

		console.log({
			verson: ctx.plugin.attributes.parameters?.version,
			ctx,
		})
		const fields = await ctx.loadFieldsUsingPlugin();
	  
		// ... and for each of them...
		await Promise.all(
		  fields.map(async (field) => {  
			const { appearance } = field.attributes;
			const changes: FieldAppearanceChange[] = [];

			// find where our plugin is used...
			appearance.addons.forEach((addon, index) => {
			// set the fieldExtensionId to be the new one
			changes.push({
				operation: 'updateAddon',
				index,
				// newFieldExtensionId: 'myExtension',
			});
			});
			await ctx.updateFieldAppearance(field.id, changes);
		  }),
		);
		
		// save in configuration the fact that we already performed the migration
		ctx.plugin.attributes.parameters = {
			...ctx.plugin.attributes.parameters,
			version: "0.2.0"
		};
	  },
	renderConfigScreen(ctx) {
		return render(<PluginConfigScreen ctx={ctx} />);
	},
	manualFieldExtensions(ctx: IntentCtx) {
		return [
			{
				id: fieldSettings.id,
				name: fieldSettings.name,
				type: "editor",
				fieldTypes: ["json"],
				configurable: true,
			},
		];
	},

	// Add field editor "Linkit" to link field appearences
	overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
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

	// Render field configuration screens
	renderManualFieldExtensionConfigScreen(
		fieldExtensionId: string,
		ctx: RenderManualFieldExtensionConfigScreenCtx,
	) {
		const container = document.getElementById("root") as HTMLElement;
		const root = createRoot(container);

		root.render(
			<React.StrictMode>
				<FieldConfigScreen ctx={ctx} />
			</React.StrictMode>,
		);
	},

	// Render Field in records
	renderFieldExtension(
		fieldExtensionId: string,
		ctx: RenderFieldExtensionCtx,
	) {
		switch (fieldExtensionId) {
			case fieldSettings.id:
				return render(<ContentConfigScreen ctx={ctx} />);
		}
	},
});
