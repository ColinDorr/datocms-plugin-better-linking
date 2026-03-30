import { useState } from "react";
import {
	Canvas,
	Form,
	SelectField,
	SwitchField,
	TextField,
} from "datocms-react-ui";
import Helpers from "./../utils/helpers";

import FieldAsset from "./../components/fields/FieldAsset";
import FieldRecord from "./../components/fields/FieldRecord";
import FieldTel from "./../components/fields/FieldTel";
import FieldEmail from "./../components/fields/FieldEmail";
import FieldUrl from "./../components/fields/FieldUrl";

import styles from "./../styles/styles.ContentConfigScreen.module.css";

const { getCtxParams, getDefaultValue } = Helpers();

type PropTypes = {
	ctx: any;
};

type LinkTypeSting = "record" | "asset" | "url" | "tel" | "email" | "";
type LinkTypeData = { label: string; value: LinkTypeSting };
type StylingTypeData = { label: string; value: string };
type RecordData = {
	cms_url: string | undefined;
	id: string | undefined;
	slug: string | undefined;
	status: string | undefined;
	title: string | undefined;
	url: string | undefined;
	modelApiKey?: string | undefined;
	modelData?:
		| {
				id: string;
				api_key: string;
				label: string;
				type: string;
		  }
		| undefined;
};

type AssetData = {
	alt: string | undefined;
	cms_url: string | undefined;
	id: string | undefined;
	status: string | undefined;
	title: string | undefined;
	url: string | undefined;
};

type UrlData = {
	title: string | undefined;
	url: string | undefined;
};
type TelData = {
	title: string | undefined;
	url: string | undefined;
};
type MailData = {
	title: string | undefined;
	url: string | undefined;
};

type StoredData = {
	linkType: LinkTypeData;
	stylingType: StylingTypeData;
	record: RecordData;
	asset: AssetData;
	url: UrlData;
	tel: TelData;
	email: MailData;
	custom_text: string | number | readonly string[] | undefined;
	aria_label: string | number | readonly string[] | undefined;
	open_in_new_window: boolean;
	formatted: any;
	isValid: boolean;
	plugin_version: string;
};

let storedData = {
	linkType: {},
	stylingType: {},
	record: {},
	asset: {},
	url: {},
	tel: {},
	email: {},
	formatted: {},
	custom_text: undefined,
	aria_label: undefined,
	open_in_new_window: false,
	isValid: false,
} as StoredData;

export default function ContentConigScreen({ ctx }: PropTypes) {
	// Retrieve parameters from context
	const locale: string = ctx?.locale;
	const ctxFieldParameters: any = getCtxParams(ctx, "field_settings");
	const ctxPluginParameters: any = getCtxParams(ctx, "plugin_settings");
	const ctxParameters: any = getCtxParams(ctx, "content_settings");

	// List field settings data
	const itemTypes =
		ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];
	let linkTypeOptions: LinkTypeData[] =
		ctxFieldParameters?.linkTypeOptions || []; // record, assets, url, mail, tel

	if (itemTypes.length === 0) {
		linkTypeOptions = linkTypeOptions.filter((e) => e.value !== "record");
	}

	// Set default values
	const defaultLinkType = { label: "--select--", value: "" } as LinkTypeData;
	let stylingOptions = ctxFieldParameters?.stylingOptions ?? [];
	const allowNewTarget = ctxFieldParameters?.allow_new_target ?? true;
	const allowCustomText = ctxFieldParameters?.allow_custom_text ?? true;
	const allowAriaLabel = ctxFieldParameters?.allow_aria_label ?? true;
	const defaultRecord = {
		cms_url: undefined,
		id: undefined,
		slug: undefined,
		status: undefined,
		title: undefined,
		url: undefined,
		modelApiKey: undefined,
		modelData: undefined,
	};
	const defaultAsset = {
		alt: undefined,
		cms_url: undefined,
		id: undefined,
		status: undefined,
		title: undefined,
		url: undefined,
	};
	const defaultUrl = { title: undefined, url: undefined };
	const defaultTel = { title: undefined, url: undefined };
	const defaultEmail = { title: undefined, url: undefined };

	const hasStyling = stylingOptions && stylingOptions.length > 0;

	const getRecordModel = (source: any) => {
		const url = source?.cms_url || "";
		// Updated regex to match alphanumeric item type IDs with dashes and underscores
		const match = url.match(/item_types\/([A-Za-z0-9_-]+)/);
		const recordItemType = match ? match[1] : null;

		if (!recordItemType) {
			return null;
		}

		const matchingItemType =
			itemTypes.find((itemType: any) => itemType.id === recordItemType) ||
			null;

		return matchingItemType;
	};

	const getRecordModelDetails = (sourceRecord: any) => {
		if (!sourceRecord?.cms_url) {
			return null;
		}

		const recordModel = getRecordModel(sourceRecord);

		// Ensure modelApiKey is set
		let apiKey = undefined;
		if (recordModel && recordModel.api_key) {
			apiKey = String(recordModel.api_key);
		} else if (
			recordModel &&
			recordModel.attributes &&
			recordModel.attributes.api_key
		) {
			apiKey = String(recordModel.attributes.api_key);
		} else {
			// Fallback: try direct extraction from URL if needed
			const directMatch = sourceRecord.cms_url.match(
				/item_types\/([A-Za-z0-9_-]+)/,
			);
			if (directMatch && directMatch[1]) {
				const directItemTypeId = directMatch[1];
				const directMatchingItemType = itemTypes.find(
					(it: any) => it.id === directItemTypeId,
				);
				if (directMatchingItemType && directMatchingItemType.api_key) {
					apiKey = String(directMatchingItemType.api_key);
				}
			}
		}

		return {
			...sourceRecord,
			modelApiKey: apiKey,
			modelData:
				apiKey && recordModel
					? {
							id: recordModel?.id,
							api_key: apiKey,
							label: recordModel?.label,
							type: recordModel?.type,
						}
					: undefined,
		};
	};

	const getText = (data: any, selectedType: string) => {
		switch (selectedType) {
			case "tel":
				return (
					data?.custom_text ||
					(data?.[selectedType]?.url
						? data?.[selectedType]?.url.replace("tel:", "")
						: undefined) ||
					undefined
				);
			case "email":
				return (
					data?.custom_text ||
					(data?.[selectedType]?.url
						? data?.[selectedType]?.url.replace("mailto:", "")
						: undefined) ||
					undefined
				);
			case "url":
				return (
					data?.custom_text || data?.[selectedType]?.url || undefined
				);
			default:
				return (
					data?.custom_text ||
					data?.[selectedType]?.title ||
					undefined
				);
		}
	};

	// Store field settings
	const savedContentSettings: StoredData = {
		linkType: getDefaultValue(
			ctxParameters,
			"linkType",
			linkTypeOptions?.[0] || defaultLinkType,
		),
		stylingType:
			stylingOptions && stylingOptions.length > 0
				? getDefaultValue(
						ctxParameters,
						"stylingType",
						stylingOptions?.[0] || undefined,
					)
				: undefined,
		record: getRecordModelDetails(
			getDefaultValue(ctxParameters, "record", defaultRecord),
		),
		asset: getDefaultValue(ctxParameters, "asset", defaultAsset),
		url: getDefaultValue(ctxParameters, "url", defaultUrl),
		tel: getDefaultValue(ctxParameters, "tel", defaultTel),
		email: getDefaultValue(ctxParameters, "email", defaultEmail),
		formatted: getDefaultValue(ctxParameters, "formatted", {}),
		custom_text: allowCustomText
			? getDefaultValue(ctxParameters, "custom_text", undefined)
			: undefined,
		aria_label: allowAriaLabel
			? getDefaultValue(ctxParameters, "aria_label", undefined)
			: undefined,
		open_in_new_window: allowNewTarget
			? getDefaultValue(ctxParameters, "open_in_new_window", false)
			: false,
		isValid: getDefaultValue(ctxParameters, "isValid", false),
		plugin_version: getDefaultValue(
			ctxPluginParameters,
			"version",
			undefined,
		),
	};
	const [contentSettings, setContentSettings] =
		useState<StoredData>(savedContentSettings);

	// Update field setting on change
	const updateContentSettings = async (valueObject: any) => {
		storedData = { ...storedData, ...contentSettings, ...valueObject };

		// Process record to ensure modelApiKey is available
		if (storedData?.record && Object.keys(storedData.record).length > 0) {
			const record = getRecordModelDetails(storedData.record);
			if (record) {
				storedData.record = { ...record };
			}
		}

		const selectedType: LinkTypeSting = storedData.linkType.value;

		storedData = {
			...storedData,
			record:
				selectedType === "record" ? storedData.record : defaultRecord,
			asset: selectedType === "asset" ? storedData.asset : defaultAsset,
			url: selectedType === "url" ? storedData.url : defaultUrl,
			tel: selectedType === "tel" ? storedData.tel : defaultTel,
			email: selectedType === "email" ? storedData.email : defaultEmail,
		};

		// Ensure modelApiKey is up-to-date
		if (selectedType === "record" && storedData?.record?.id) {
			storedData.record =
				getRecordModelDetails(storedData.record) || storedData.record;
		}

		const formatted = {
			isValid: false,
			type: selectedType,
			modelApiKey:
				selectedType === "record"
					? storedData?.record?.modelApiKey
					: undefined,
			text: getText(storedData, selectedType),
			ariaLabel:
				storedData.aria_label ?? getText(storedData, selectedType),
			url:
				selectedType !== ""
					? storedData?.[selectedType]?.url || null
					: null,
			target: storedData?.open_in_new_window ? "_blank" : "_self",
			class: storedData?.stylingType?.value || null,
		};

		formatted.isValid = formatted.text && formatted.url ? true : false;

		const newSettings = {
			...storedData,
			isValid: formatted.isValid,
			formatted: formatted,
		};

		setContentSettings(newSettings);

		ctx.setFieldValue(ctx.fieldPath, JSON.stringify(newSettings));
	};

	return (
		<Canvas ctx={ctx}>
			{contentSettings.linkType?.value ? (
				<Form className={styles["link-field"]}>
					<div className={styles["link-field__type"]}>
						<SelectField
							name="type"
							id="type"
							label="Type"
							value={contentSettings.linkType}
							selectInputProps={{
								options: linkTypeOptions as LinkTypeData[],
							}}
							onChange={(newValue) => {
								updateContentSettings({ linkType: newValue });
							}}
						/>
					</div>

					<div className={styles["link-field__link"]}>
						{contentSettings.linkType.value === "record" ? (
							<FieldRecord
								ctx={ctx}
								ctxFieldParameters={ctxFieldParameters}
								ctxPluginParameters={ctxPluginParameters}
								savedFieldSettings={contentSettings.record}
								onValueUpdate={(value: any) =>
									updateContentSettings({ record: value })
								}
								locale={locale}
							/>
						) : contentSettings?.linkType?.value === "asset" ? (
							<FieldAsset
								ctx={ctx}
								savedFieldSettings={contentSettings.asset}
								onValueUpdate={(value: any) =>
									updateContentSettings({ asset: value })
								}
								locale={locale}
							/>
						) : contentSettings?.linkType?.value === "url" ? (
							<FieldUrl
								ctx={ctx}
								savedFieldSettings={contentSettings.url}
								onValueUpdate={(value: any) =>
									updateContentSettings({ url: value })
								}
							/>
						) : contentSettings?.linkType?.value === "tel" ? (
							<FieldTel
								ctx={ctx}
								savedFieldSettings={contentSettings.tel}
								onValueUpdate={(value: any) =>
									updateContentSettings({ tel: value })
								}
							/>
						) : contentSettings?.linkType?.value === "email" ? (
							<FieldEmail
								ctx={ctx}
								savedFieldSettings={contentSettings.email}
								onValueUpdate={(value: any) =>
									updateContentSettings({ email: value })
								}
							/>
						) : null}
					</div>

					{hasStyling && (
						<div className={styles["link-field__styling"]}>
							<SelectField
								name="styling"
								id="styling"
								label="Styling"
								value={contentSettings.stylingType}
								selectInputProps={{
									options:
										stylingOptions as StylingTypeData[],
								}}
								onChange={(newValue) => {
									updateContentSettings({
										stylingType: newValue,
									});
								}}
							/>
						</div>
					)}

					{allowCustomText && (
						<div
							className={[
								styles["link-field__custom-text"],
								!hasStyling
									? styles["link-field__custom-text--full"]
									: "",
							]
								.filter(Boolean)
								.join(" ")}
						>
							<TextField
								name="custom_text"
								id="custom_text"
								label="Custom text (Optional)"
								value={contentSettings.custom_text}
								textInputProps={{ monospaced: true }}
								onChange={(newValue) => {
									updateContentSettings({
										custom_text: newValue,
									});
								}}
							/>
						</div>
					)}

					{(allowNewTarget || allowAriaLabel) && (
						<div className={styles["link-field__bottom-row"]}>
							{allowNewTarget && (
								<SwitchField
									name="open_in_new_window"
									id="open_in_new_window"
									label="Open in new window"
									value={
										contentSettings.open_in_new_window
									}
									onChange={(newValue) => {
										contentSettings.open_in_new_window =
											newValue;
										updateContentSettings({
											open_in_new_window: newValue,
										});
									}}
								/>
							)}
							{allowAriaLabel && (
								<TextField
									name="aria_label"
									id="aria_label"
									label="Aria-label (Optional)"
									value={contentSettings.aria_label}
									textInputProps={{ monospaced: true }}
									onChange={(newValue) => {
										updateContentSettings({
											aria_label: newValue,
										});
									}}
								/>
							)}
						</div>
					)}
				</Form>
			) : (
				<div>
					<p className={styles["link-field__error"]}>
						<strong>Error!</strong> No valid link types could be
						found for this field.
						<br />
						Please add the wanted link types to the field
						appearance settings or the plugin settings
					</p>
				</div>
			)}
		</Canvas>
	);
}
