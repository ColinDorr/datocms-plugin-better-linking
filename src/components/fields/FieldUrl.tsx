import React, { useState } from 'react';
import {TextField } from "datocms-react-ui";

type FieldSettings = {
    title: string;
    url: string;
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

const FieldUrl: React.FC<Props> = ({ ctx, savedFieldSettings, onValueUpdate }) => {
    const [fieldSettings, setFieldSettings] = useState<FieldSettings>(savedFieldSettings);

    // Manipulate Assets
    const updateValue = (newObject: any) => {
        let url = newObject.url.replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g, '');

        const urlData: FieldSettings = { 
            ...resetObject,
            url
        };
        
        setFieldSettings(urlData);
        onValueUpdate(urlData);
    }

    return (
        <TextField
            name="link"
            id="link"
            label={ fieldSettings?.title || resetObject.title }
            value={ fieldSettings?.url || resetObject.url }
            textInputProps={{ monospaced: true }}
            onChange={(newValue) => {
                updateValue({url: newValue})
            }}
        />
    );
}

export default FieldUrl;
