import { useState } from "react";
import {
	Canvas,
	Form,
	FieldGroup,
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
	modelData?: {
		id: string;
		api_key: string;
		label: string;
		type: string;
	} | undefined;
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
	plugin_version: string
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
	const defaultRecord = { cms_url: undefined, id: undefined, slug: undefined, status: undefined, title: undefined, url: undefined, modelApiKey: undefined, modelData: undefined, };
	const defaultAsset = { alt: undefined, cms_url: undefined, id: undefined, status: undefined, title: undefined, url: undefined };
	const defaultUrl = { title: undefined, url: undefined };
	const defaultTel = { title: undefined, url: undefined };
	const defaultEmail = { title: undefined, url: undefined };

	// Set layout
	const columnLayout = allowAriaLabel || allowNewTarget ? "col-3" : "col-2";

	const getRecordModel = (source: any) => {
		const url = source?.cms_url || "";
		const match = url.match(/item_types\/(\d+)/);
		const recordItemType = match ? match[1] : null;

		if (!recordItemType) {
			return null;
		}

		return (
			itemTypes.filter(
				(itemType: any) => itemType.id === recordItemType,
			)[0] ?? null
		);
	};

	const getRecordModelDetails = (sourceRecord: any) => {
		if (!sourceRecord?.cms_url) {
			return null;
		}
		const recordModel = getRecordModel(sourceRecord);
		return {
			...sourceRecord,
			modelApiKey: recordModel?.api_key ? recordModel.api_key : undefined,
			modelData: recordModel?.api_key
				? {
						id: recordModel?.id,
						api_key: recordModel?.api_key,
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
				return data?.custom_text || data?.[selectedType]?.url || undefined;
			default:
				return data?.custom_text || data?.[selectedType]?.title || undefined;
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
				? getDefaultValue(ctxParameters,"stylingType", stylingOptions?.[0] || undefined,)
				:undefined,
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
		plugin_version: getDefaultValue(ctxPluginParameters, "version", undefined),
	};
	const [contentSettings, setContentSettings] =
		useState<StoredData>(savedContentSettings);

	// Update field setting on change
	const updateContentSettings = async (valueObject: any) => {
		storedData = { ...storedData, ...contentSettings, ...valueObject };
		if (storedData?.record) {
			const record = getRecordModelDetails(storedData.record);
			if (record) {
				storedData.record = { ...record };
			}
		}

		const selectedType: LinkTypeSting = storedData.linkType.value;

		storedData = {
			...storedData,
			record: selectedType === "record" ? storedData.record : defaultRecord,
			asset: selectedType === "asset" ? storedData.asset : defaultAsset,
			url: selectedType === "url" ? storedData.url : defaultUrl,
			tel: selectedType === "tel" ? storedData.tel : defaultTel,
			email: selectedType === "email" ? storedData.email : defaultEmail,
		}


		const formatted = {
			isValid: false,
			type: selectedType,
			modelApiKey: storedData?.record?.modelApiKey ?? undefined,
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
				<Form
					className={[
						styles["link-field"],
						styles[`link-field--${columnLayout}`],
					].join(" ")}
				>
					<FieldGroup className={styles["link-filed__type-styling"]}>
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
						{stylingOptions && stylingOptions.length > 0 && (
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
						)}
					</FieldGroup>
					<FieldGroup className={styles["link-field__link-text"]}>
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

						{allowCustomText && (
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
						)}
					</FieldGroup>

					{(allowNewTarget || allowAriaLabel) && (
						<FieldGroup
							className={styles["link-field__target-column"]}
						>
							{allowNewTarget && (
								<div
									className={
										styles["link-field__target-container"]
									}
								>
									<p
										className={
											styles["link-field__target-label"]
										}
									>
										Window (Optional)
									</p>
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
								</div>
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
						</FieldGroup>
					)}
				</Form>
			) : (
				<div>
					<p className={styles["link-field__error"]}>
						<strong>Error!</strong> No valid link types could be
						found for this field.
						<br />
						Please add the wanted link types to the field appearence
						settings or the plugin settings
					</p>
				</div>
			)}
		</Canvas>
	);
}
