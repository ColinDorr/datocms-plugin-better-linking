const Helpers = () => {
    // Return parametes object form the current context (Ctx)
    function getCtxParams(
        ctx: any, 
        configType: string
    ) {
        // console.log({
        //     ctx,
        //     params: ctx.parameters,
        //     configType,
        //     content: configType === "content_settings" && ctx?.parameters && Object.keys(ctx.parameters).length > 0,
        //     field: configType !== "plugin_settings" && ctx?.parameters?.field_settings && Object.keys(ctx.parameters.field_settings).length > 0,
        //     field_2: configType !== "plugin_settings" && ctx?.field?.attributes?.appearance?.parameters?.field_settings && Object.keys(ctx?.field?.attributes?.appearance?.parameters?.field_settings).length > 0,
        //     fallback: ctx?.plugin?.attributes?.parameters && Object.keys(ctx.plugin.attributes.parameters).length > 0
        // })
        if (configType === "content_settings" && ctx?.parameters && Object.keys(ctx.parameters).length > 0) {
            return ctx.parameters;
        }
        // Use when configType is field_setting or when content_settings is empty
        if (configType !== "plugin_settings" && ctx?.parameters?.field_settings && Object.keys(ctx.parameters.field_settings).length > 0) {
            return ctx.parameters?.field_settings
        }
        // Use when configType is field_setting or when content_settings is empty
        if (configType !== "plugin_settings" && ctx?.field?.attributes?.appearance?.parameters?.field_settings && Object.keys(ctx.field?.attributes.appearance.parameters.field_settings).length > 0) {
            return ctx.field.attributes.appearance.parameters.field_settings
        }
        // Use as plugin_settings when field_settings and content_settings are empty
        if (ctx?.plugin?.attributes?.parameters && Object.keys(ctx.plugin.attributes.parameters).length > 0 ) {
            return ctx.plugin.attributes.parameters
        }
        return {}
    }

    // Get value ctxParameters 
    const getDefaultValue = (ctxParameters:any, key: string, fallback: any) => {
        return ctxParameters?.[key] !== undefined ? ctxParameters?.[key] : fallback;
    }

    return {
        getCtxParams,
        getDefaultValue
    };
}

export default Helpers;
