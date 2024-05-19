import React, { useState } from 'react';
import { FieldGroup, Button, SelectField } from "datocms-react-ui";

type LinkType = { label: string, api_key?: string, value: string };

type FieldSettings = {
    id: string | null,
    title: string | null;
    slug: string | null;
    url?: string | null;
    cms_url: string | null;
    status: string | null;
};

const resetObject: FieldSettings = {
    id: null,
    title: null,
    slug: null,
    url: null,
    cms_url: null,
    status: null,
};

type Props = {
    ctx: any;
    ctxFieldParameters: any;
    ctxPluginParameters: any;
    savedFieldSettings: FieldSettings;
    locale: string | null;
    onValueUpdate: (value: any) => void;
};

const defaultLinkType: LinkType = { label: "--select--", value: "", api_key: "" };

const FieldRecord: React.FC<Props> = ({ ctx, ctxFieldParameters, ctxPluginParameters, savedFieldSettings, locale, onValueUpdate }) => {
    const [fieldSettings, setFieldSettings] = useState<FieldSettings>(savedFieldSettings);

    const itemTypes = ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];

    const updateRecordValue = (record: any) => {
        let recordData: FieldSettings = { ...resetObject };
        const id = record?.id || null;
        const title = (locale ? record?.attributes?.title?.[locale] : record?.attributes?.title) || record?.attributes?.title || null;
        const cms_url = ctx?.site?.attributes?.internal_domain && record?.relationships?.item_type?.data?.id && record?.id ? `https://${ctx.site.attributes.internal_domain}/editor/item_types/${record.relationships.item_type.data.id}/items/${record.id}/edit` : null;
        const slug = (locale ? record?.attributes?.slug?.[locale] : record?.attributes?.slug) || record?.attributes?.slug || null;
        const status = record?.meta?.status || null;
        const url = slug;

        if (id && title && cms_url && slug && status && url) {
            recordData = { id, title, cms_url, slug, status, url };
        }

        setFieldSettings(recordData);
        onValueUpdate(recordData);
    }

    const editRecordOfId = async (uploadId: string) => {
        const record = await ctx.editItem(uploadId);
        if (record) {
            updateRecordValue(record);
        }
    }

    const getRecordOfType = async (item: LinkType) => {
        let record = null;
        if (item.value !== "") {
            record = await ctx.selectItem(item.value, { multiple: false });
        }
        updateRecordValue(record);
    }

    return (
        fieldSettings?.id ? (
            <FieldGroup>
                <Button onClick={() => editRecordOfId(fieldSettings.id!)}>
                    <span className={`status-${fieldSettings.status}`}>{fieldSettings.status}</span>
                    <span>{fieldSettings.title}</span>
                </Button>
                <Button
                    buttonType="primary"
                    onClick={() => updateRecordValue(null)}
                >
                    <span hidden className="sr-only">Remove</span>
                    <svg
                        aria-hidden="true"
                        width="1em"
                        height="1em"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                    >
                        <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                </Button>
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
        )
    );
}

export default FieldRecord;
