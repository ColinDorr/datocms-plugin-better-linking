import React, { useState } from 'react';
import { FieldGroup, Button } from "datocms-react-ui";

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
    savedFieldSettings: FieldSettings;
    locale: string | null;
    onValueUpdate: (value: any) => void;
};

const FieldAsset: React.FC<Props> = ({ ctx, savedFieldSettings, locale, onValueUpdate }) => {
    const [fieldSettings, setFieldSettings] = useState<FieldSettings>(savedFieldSettings);

    // Manipulate Assets
    const updateAssetValue = (asset: any) => {
       let assetData: FieldSettings = { ...resetObject };
        const id = asset?.id || null;
        const title = (locale ? asset?.attributes?.filename?.[locale] : asset?.attributes?.filename) || asset?.attributes?.filename || null;
        const cms_url = ctx?.site?.attributes?.internal_domain && asset?.id ? `https://${ctx.site.attributes.internal_domain}/media/assets/${asset.id}` : null;
        const slug = asset?.attributes?.url || null;
        const status = "published";
        const url = slug;

        if (id && title && cms_url && slug && status && url) {
            assetData = { id, title, cms_url, slug, status, url };
        }
        
        setFieldSettings(assetData);
        onValueUpdate(assetData);
    }

    const editAssetOfId = async (uploadId: string) => {
        const asset = await ctx.editUpload(uploadId);
        if (asset) { updateAssetValue(asset); }
    }

    const getAsset = async () => {
        const asset = await ctx.selectUpload({ multiple: false });
        updateAssetValue(asset);
    }

    return (
        fieldSettings?.id ? (
            <FieldGroup>
                <Button onClick={() => editAssetOfId(fieldSettings.id!)}>
                    <span className={`status-${fieldSettings.status}`}>{fieldSettings.status}</span>
                    <span>{fieldSettings.title}</span>
                </Button>
                <Button
                    buttonType="primary"
                    onClick={() => updateAssetValue(null)}
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
            <Button
                buttonType="primary"
                leftIcon={
                    <>
                        <span className="sr-only">Asset</span>
                    </>
                }
                onClick={getAsset}
            />
        )
    );
}

export default FieldAsset;
