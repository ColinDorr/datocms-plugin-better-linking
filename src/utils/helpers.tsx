/**
 * Plugin settings store "allowed record models" as compact select options
 * `{ label, api_key?, value }` (`value` is the item type id). Older saves may
 * still contain full Dato item type objects with `id` and `attributes`.
 */
export type NormalizedItemType = {
	id: string;
	api_key?: string;
	label?: string;
	type?: string;
};

export function normalizeItemTypeEntry(itemType: any): NormalizedItemType | null {
	if (!itemType) {
		return null;
	}

	// Compact shape from LinkSettings (post 0.2.7): { label, api_key?, value }
	if (itemType.value !== undefined && itemType.value !== null) {
		return {
			id: String(itemType.value),
			api_key: itemType.api_key,
			label: itemType.label,
		};
	}

	// Full Dato item type resource (legacy saved params)
	if (itemType.id) {
		return {
			id: String(itemType.id),
			api_key: itemType.api_key ?? itemType.attributes?.api_key,
			label: itemType.label ?? itemType.attributes?.name,
			type: itemType.type ?? itemType.attributes?.kind,
		};
	}

	return null;
}

export function findItemTypeById(
	itemTypes: any[],
	itemTypeId: string | null | undefined,
): NormalizedItemType | null {
	if (itemTypeId == null || itemTypeId === "") {
		return null;
	}
	const id = String(itemTypeId);
	for (const entry of itemTypes) {
		const normalized = normalizeItemTypeEntry(entry);
		if (normalized && normalized.id === id) {
			return normalized;
		}
	}
	return null;
}

const Helpers = () => {
	// Return parametes object form the current context (Ctx)
	function getCtxParams(ctx: any, configType: string) {
		const fieldPath = ctx.fieldPath ? ctx.fieldPath.split(".") : [];
		const formFieldValues = fieldPath.reduce(
			(acc: any, part: any) => acc?.[part],
			ctx?.formValues,
		);

		if (configType === "content_settings" && formFieldValues) {
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
		normalizeItemTypeEntry,
		findItemTypeById,
	};
};

export default Helpers;
