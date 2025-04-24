const Helpers = () => {
	// Return parametes object form the current context (Ctx)
	function getCtxParams(ctx: any, configType: string) {
		const isLocalizedField = ctx.field?.attributes?.localized;
		const fieldPath = ctx.fieldPath ? ctx.fieldPath.split('.') : [];
		const formFieldValues = fieldPath.reduce((acc:any, part:any) => acc?.[part], ctx?.formValues);

		console.log({
			ctx,
			fieldPath,
			formFieldValues
			// ctx,
			// fieldPath: ctx.fieldPath,
			// configType,
			// isLocalizedField,
			// isLocalizedModel,
			// formFieldValues
		})
		
		if ( configType === "content_settings" && formFieldValues ) {
			const data = formFieldValues;
			return JSON.parse(data);
		}
		// Use when configType is field_setting or when content_settings is empty
		if (
			configType !== "plugin_settings" &&
			ctx?.parameters?.field_settings &&
			Object.keys(ctx.parameters.field_settings).length > 0
		) {
			return ctx.parameters?.field_settings;
		}
		// Use when configType is field_setting or when content_settings is empty
		if (
			configType !== "plugin_settings" &&
			ctx?.field?.attributes?.appearance?.parameters?.field_settings &&
			Object.keys(
				ctx.field?.attributes.appearance.parameters.field_settings,
			).length > 0
		) {
			return ctx.field.attributes.appearance.parameters.field_settings;
		}
		// Use as plugin_settings when field_settings and content_settings are empty
		if (
			ctx?.plugin?.attributes?.parameters &&
			Object.keys(ctx.plugin.attributes.parameters).length > 0
		) {
			return ctx.plugin.attributes.parameters;
		}
		return {};
	}

	// Get value ctxParameters
	const getDefaultValue = (
		ctxParameters: any,
		key: string,
		fallback: any,
	) => {
		return ctxParameters?.[key] !== undefined
			? ctxParameters?.[key]
			: fallback;
	};

	return {
		getCtxParams,
		getDefaultValue,
	};
};

export default Helpers;
