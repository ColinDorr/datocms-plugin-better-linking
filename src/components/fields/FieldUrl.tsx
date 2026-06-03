import React, { useState } from "react";
import { TextField } from "datocms-react-ui";
import { isValidUrl } from "../../utils/urlValidation";

type FieldSettings = {
	title: string | undefined;
	url: string | undefined;
};

const resetObject: FieldSettings = {
	title: "URL",
	url: "",
};

type Props = {
	ctx: any;
	savedFieldSettings: FieldSettings;
	onValueUpdate: (value: any) => void;
};

const FieldUrl: React.FC<Props> = ({
	ctx,
	savedFieldSettings,
	onValueUpdate,
}) => {
	const [fieldSettings, setFieldSettings] =
		useState<FieldSettings>(savedFieldSettings);

	// Store exactly what the editor types. Destructively filtering characters
	// on every keystroke is what dropped `%` in issue #18; instead we keep the
	// raw value and let `isValidUrl` flag anything malformed below.
	const updateValue = (newObject: any) => {
		const urlData: FieldSettings = {
			...resetObject,
			url: newObject.url ?? "",
		};

		setFieldSettings(urlData);
		onValueUpdate(urlData);
	};

	const url = fieldSettings?.url ?? "";
	const hasInvalidUrl = url.length > 0 && !isValidUrl(url);

	return (
		<TextField
			name="link"
			id="link"
			label={fieldSettings?.title || resetObject.title}
			value={url}
			error={
				hasInvalidUrl
					? "This doesn't look like a valid URL."
					: undefined
			}
			textInputProps={{ monospaced: true }}
			onChange={(newValue) => {
				updateValue({ url: newValue });
			}}
		/>
	);
};

export default FieldUrl;
