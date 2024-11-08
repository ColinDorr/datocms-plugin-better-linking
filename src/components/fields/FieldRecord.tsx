import React, { useState } from "react";
import { FieldGroup, Button, SelectField } from "datocms-react-ui";
import styles from "./../../styles/styles.FieldRecordAsset.module.css";

type LinkType = { label: string; api_key?: string; value: string };

type FieldSettings = {
	id: string | undefined;
	title: string | undefined;
	slug: string | undefined;
	url?: string | undefined;
	cms_url: string | undefined;
	status: string | undefined;
};

const resetObject: FieldSettings = {
	id: undefined,
	title: undefined,
	slug: undefined,
	url: undefined,
	cms_url: undefined,
	status: undefined,
};

type Props = {
	ctx: any;
	ctxFieldParameters: any;
	ctxPluginParameters: any;
	savedFieldSettings: FieldSettings;
	locale: string | null;
	onValueUpdate: (value: any) => void;
};

const defaultLinkType: LinkType = {
	label: "--select--",
	value: "",
	api_key: "",
};

const FieldRecord: React.FC<Props> = ({
	ctx,
	ctxFieldParameters,
	ctxPluginParameters,
	savedFieldSettings,
	locale,
	onValueUpdate,
}) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);

	const itemTypes =
		ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];

	const getLocalizedData = (
		source: { [key: string]: any } | string,
		locale: string | null,
	): any => {
		return locale && typeof source === "object" ? source[locale] : source;
	};
	const joinArrayWithCommaAndAmpersand = (arr: string[]) => {
		return arr.length > 1
			? arr.slice(0, -1).join(", ") + " & " + arr[arr.length - 1]
			: arr[0] || "";
	};

	const updateRecordValue = async (record: any) => {
		let recordData: FieldSettings = { ...resetObject };
		const id = record?.id || null;
		const slug =
			getLocalizedData(record?.attributes?.slug, locale) ||
			getLocalizedData(record?.attributes?.uri, locale) ||
			getLocalizedData(record?.attributes?.url, locale) ||
			null;
		const title =
			getLocalizedData(record?.attributes?.title, locale) || slug || null;
		const cms_url =
			ctx?.site?.attributes?.internal_domain &&
			record?.relationships?.item_type?.data?.id &&
			record?.id
				? `https://${ctx.site.attributes.internal_domain}/editor/item_types/${record.relationships.item_type.data.id}/items/${record.id}/edit`
				: null;
		const status = record?.meta?.status || null;
		const url = slug;

		if (id && title && cms_url && slug && status && url) {
			recordData = { id, title, cms_url, slug, status, url };
		} else if (record !== null) {
			const errors = [];
			if (id === null) {
				errors.push("`ID`");
			}
			if (title === null) {
				errors.push("`Title`");
			}
			if (slug === null) {
				errors.push("`Slug`");
			}
			await ctx.alert(
				`Record ${joinArrayWithCommaAndAmpersand(errors)} could not be found`,
			);
		}

		setFieldSettings(recordData);
		onValueUpdate(recordData);
	};

	const editRecordOfId = async (uploadId: string) => {
		const record = await ctx.editItem(uploadId);
		if (record) {
			updateRecordValue(record);
		}
	};

	const getRecordOfType = async (item: LinkType) => {
		let record = null;
		if (item.value !== "") {
			record = await ctx.selectItem(item.value, { multiple: false });
		}
		updateRecordValue(record);
	};

	return fieldSettings?.id ? (
		<FieldGroup className={styles["field__selection-group"]}>
			<p className={styles["field__selection-group__label"]}>Record</p>
			<div className={styles["field__selection-group__content"]}>
				<Button
					buttonType="muted"
					onClick={() => editRecordOfId(fieldSettings.id!)}
					className={styles["field__selection-group__result"]}
				>
					<span
						className={
							styles[`${fieldSettings.status || "published"}`]
						}
					>
						{fieldSettings.status}
					</span>
					<span
						className={
							styles["field__selection-group__result-title"]
						}
					>
						{fieldSettings.title}
					</span>
				</Button>

				<Button
					buttonSize="xs"
					buttonType="negative"
					leftIcon={
						<>
							<span hidden className="sr-only">
								Delete{" "}
							</span>
							<svg
								aria-hidden="true"
								viewBox="0 0 448 512"
								width="1em"
								height="1em"
							>
								<path
									d="M432 32H312l-9.4-18.7A24 24 0 00281.1 0H166.8a23.72 23.72 0 00-21.4 13.3L136 32H16A16 16 0 000 48v32a16 16 0 0016 16h416a16 16 0 0016-16V48a16 16 0 00-16-16zM53.2 467a48 48 0 0047.9 45h245.8a48 48 0 0047.9-45L416 128H32z"
									fill="currentColor"
								></path>
							</svg>
						</>
					}
					onClick={() => updateRecordValue(null)}
				/>
			</div>
		</FieldGroup>
	) : (
		<SelectField
			name="styling"
			id="styling"
			label="Record"
			value={defaultLinkType}
			selectInputProps={{
				options: itemTypes,
			}}
			onChange={(newValue: any) => getRecordOfType(newValue)}
		/>
	);
};

export default FieldRecord;
