import React, { useState } from 'react';
import {TextField } from "datocms-react-ui";

type FieldSettings = {
    title: string;
    url: string;
};

const resetObject: FieldSettings = {
    title: "Email address",
    url: "mailto:",
};

type Props = {
    ctx: any;
    savedFieldSettings: FieldSettings;
    onValueUpdate: (value: any) => void;
};

const FieldEmail: React.FC<Props> = ({ ctx, savedFieldSettings, onValueUpdate }) => {
    const [fieldSettings, setFieldSettings] = useState<FieldSettings>(savedFieldSettings);

    // Manipulate Assets
    const updateValue = (newObject: any) => {
        let url = newObject.url ? newObject.url.replace(/[^\w@.-]/g, '').replace("mailto",""): "";
        url = `mailto:${url}`;

        const emailData: FieldSettings = { 
            ...resetObject,
            ...newObject,
            url
        };
        
        setFieldSettings(emailData);
        onValueUpdate(emailData);
    }

    return (
        <TextField
            name="link"
            id="link"
            label={ fieldSettings.title || resetObject.title }
            value={ fieldSettings.url || resetObject.url }
            textInputProps={{ monospaced: true }}
            onChange={(newValue) => {
                updateValue({url: newValue})
            }}
        />
    );
}

export default FieldEmail;
