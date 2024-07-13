import React, { useState, MouseEvent } from "react";
import { Form, Button, FieldGroup } from "datocms-react-ui";

import StylingItem from "./partials/StylingItem";
import Helpers from "./../../utils/helpers";

import styles from "./../../styles/styles.StylingSettings.module.css";

const { getCtxParams, getDefaultValue } = Helpers();

type PropTypes = { ctx: any; configType: string };
type KeyValuePairType = { id: number; label: string; value: string };
type StylingType = { label: string; value: string };

const StylingSettings: React.FC<PropTypes> = ({ ctx, configType }) => {
	const ctxParameters: any = getCtxParams(ctx, configType);

	const stylingOptions =
		(getDefaultValue(
			ctxParameters,
			"stylingOptions",
			[],
		) as StylingType[]) ?? [];
	const [keyValueList, setKeyValueList] = useState<KeyValuePairType[]>(
		stylingOptions.map((i, index) => ({
			id: index,
			label: i.label,
			value: i.value,
		})),
	);

	const updateCtx = async () => {
		const stylingOptions: { label: string; value: string }[] = [];
		keyValueList.forEach((item: KeyValuePairType) => {
			stylingOptions.push({
				label: item.label,
				value: item.value,
			});
		});
		const settings = { ...ctxParameters, stylingOptions };

		if (configType === "plugin_settings") {
			ctx.updatePluginParameters(settings);
		} else if (configType === "field_settings") {
			ctx.setParameters({ field_settings: settings });
		}
	};

	const updateKeyValueList = (value: KeyValuePairType[]) => {
		const sortedArray = value.sort((a, b) => {
			if (a.label < b.label) {
				return -1;
			}
			if (a.label > b.label) {
				return 1;
			}
			return 0;
		});
		setKeyValueList(sortedArray);
	};

	const handleIdChange = (value: number, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].id = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const handleLabelChange = (value: string, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].label = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const handleValueChange = (value: string, id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList[id].value = value;
		updateKeyValueList(updatedKeyValueList);
	};

	const deleteItem = (id: number) => {
		const updatedKeyValueList = [...keyValueList];
		updatedKeyValueList.splice(id, 1);
		updateKeyValueList(updatedKeyValueList);
	};

	function findDuplicates(items: KeyValuePairType[]): {
		duplicateIds: number[];
		duplicateLabels: string[];
		duplicateValues: string[];
	} {
		const idSet = new Set<number>();
		const labelSet = new Set<string>();
		const valueSet = new Set<string>();

		const duplicateIds: number[] = [];
		const duplicateLabels: string[] = [];
		const duplicateValues: string[] = [];

		for (const item of items) {
			idSet.has(item.id)
				? duplicateIds.push(item.id)
				: idSet.add(item.id);
			labelSet.has(item.label)
				? duplicateLabels.push(item.label)
				: labelSet.add(item.label);
			valueSet.has(item.value)
				? duplicateValues.push(item.value)
				: valueSet.add(item.value);
		}

		return {
			duplicateIds,
			duplicateLabels,
			duplicateValues,
		};
	}

	const duplicateArrays = () => {
		const { duplicateIds, duplicateLabels, duplicateValues } =
			findDuplicates(keyValueList);
		return { duplicateIds, duplicateLabels, duplicateValues };
	};

	const containsDuplicates = () => {
		const { duplicateIds, duplicateLabels, duplicateValues } =
			duplicateArrays();
		return (
			duplicateIds.length > 0 ||
			duplicateLabels.length > 0 ||
			duplicateValues.length > 0
		);
	};

	const handleAddItem = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!containsDuplicates()) {
			const currentTimestamp = Date.now();
			const newList: KeyValuePairType[] = [
				...keyValueList,
				{ id: currentTimestamp, label: "", value: "" },
			];
			updateKeyValueList(newList);
		}
	};

	return (
		<div>
			<Form
				onSubmit={updateCtx}
				className={styles["style-settings__form"]}
			>
				<FieldGroup className={styles["style-settings__controlls"]}>
					{keyValueList.map(
						(item: KeyValuePairType, index: number) => (
							<StylingItem
								key={item.id}
								item={item}
								onIdChange={(value: number) =>
									handleIdChange(value, index)
								}
								onLabelChange={(value: string) =>
									handleLabelChange(value, index)
								}
								onValueChange={(value: string) =>
									handleValueChange(value, index)
								}
								onDelete={() => deleteItem(index)}
								duplicateArrays={duplicateArrays()}
								isRequired={true}
							/>
						),
					)}
				</FieldGroup>

				<FieldGroup className={styles["style-settings__buttons"]}>
					<Button
						fullWidth
						buttonType="muted"
						leftIcon={
							<svg
								aria-hidden="true"
								viewBox="0 0 448 512"
								width="1em"
								height="1em"
							>
								<path
									d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
									fill="currentColor"
								></path>
							</svg>
						}
						disabled={containsDuplicates()}
						onClick={handleAddItem}
					>
						<span>Add item</span>
					</Button>
					<Button
						fullWidth
						type="submit"
						buttonType="primary"
						className={styles["style-settings__submit"]}
					>
						Save styling settings
					</Button>
				</FieldGroup>

				{containsDuplicates() && (
					<FieldGroup className={styles["style-settings__warinig"]}>
						<p className={styles["style-settings__error"]}>
							All keys need to be unique. Saving this can result
							in data loss.
						</p>
					</FieldGroup>
				)}
			</Form>
		</div>
	);
};

export default StylingSettings;
