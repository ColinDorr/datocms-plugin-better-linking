import { Button, TextField, FieldGroup } from "datocms-react-ui";
import styles from "./../../../styles/styles.StylingSettings.module.css";

type ItemType = { id: number; label: string; value: string };
type Props = {
	item: ItemType;
	onIdChange: (value: number) => void;
	onLabelChange: (value: string) => void;
	onValueChange: (value: string) => void;
	onDelete: (value: number) => void;
	duplicateArrays: {
		duplicateIds: number[];
		duplicateLabels: string[];
		duplicateValues: string[];
	};
	isRequired: boolean;
};

export default function StylingItem({
	item,
	onIdChange,
	onLabelChange,
	onValueChange,
	onDelete,
	duplicateArrays,
	isRequired,
}: Props) {
	const { duplicateIds, duplicateLabels, duplicateValues } = duplicateArrays;
	const exsistingId = duplicateIds.includes(item.id);
	const exsistingLabel = duplicateLabels.includes(item.label);
	const exsistingValue = duplicateValues.includes(item.value);

	if (exsistingId) {
		const newId = item.id * 1000000;
		onIdChange(newId);
	}

	return (
		<div className={styles["style-settings__controll-item"]}>
			<FieldGroup className={styles["style-settings__controll-texts"]}>
				<TextField
					required={isRequired}
					error={
						(isRequired && item.label === "") || exsistingLabel
							? "Label already exists"
							: ""
					}
					name={`${item.id}-label`}
					id={`${item.id}-label`}
					label="Label"
					placeholder="Label"
					value={item.label}
					onChange={onLabelChange}
					formLabelProps={{
						children: <></>,
						htmlFor: `${item.id}-label`,
						className: "sr-only",
					}}
				/>
				<TextField
					required={isRequired}
					error={
						(isRequired && item.value === "") || exsistingValue
							? "Value is required"
							: ""
					}
					name={`${item.id}-value`}
					id={`${item.id}-value`}
					label="Value"
					placeholder="Value"
					value={item.value}
					onChange={onValueChange}
					formLabelProps={{
						children: <></>,
						htmlFor: `${item.id}-value`,
						className: "sr-only",
					}}
				/>
			</FieldGroup>

			<FieldGroup>
				<Button
					buttonSize="xs"
					buttonType="negative"
					leftIcon={
						<>
							<span className="sr-only">Delete </span>
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
					onClick={() => onDelete(item.id)}
				/>
			</FieldGroup>
		</div>
	);
}
