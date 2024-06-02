import React, { useState } from 'react';
import { FieldGroup, Button } from "datocms-react-ui";
import styles from "./../../styles/styles.FieldRecordAsset.module.css";

type FieldSettings = {
    id: string | null,
    title: string | null;
    alt: string | null;
    url?: string | null;
    cms_url: string | null;
    status: string | null;
};

const resetObject: FieldSettings = {
    id: null,
    title: null,
    alt: null,
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
        const title = (locale ? asset?.attributes?.default_field_metadata?.[locale]?.title : asset?.attributes?.default_field_metadata?.title ) || asset?.attributes?.filename || null;
        const altText = (locale ? asset?.attributes?.default_field_metadata?.[locale]?.alt : asset?.attributes?.default_field_metadata?.alt ) || null;
        const filename =  asset?.attributes?.filename || null;
        const cms_url = asset?.attributes?.url || (ctx?.site?.attributes?.internal_domain && asset?.id ? `https://${ctx.site.attributes.internal_domain}/media/assets/${asset.id}` : null);
        const url = asset?.attributes?.url || null;
        const status = "published";

        if (id && (title || filename) && cms_url && status && url) {
            assetData = { 
                id, 
                title: title || filename,
                alt: altText || title || filename,
                cms_url,
                status, 
                url 
            };
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
            <FieldGroup className={styles["field__selection-group"]}>
                <p className={styles["field__selection-group__label"]}>Record</p>
                <div className={styles["field__selection-group__content"]}>
                    <Button 
                        buttonType='muted'
                        onClick={() => editAssetOfId(fieldSettings.id!)}
                        className={styles["field__selection-group__result"]}
                    >
                        <span className={ styles[`${ fieldSettings.status || "published" }`] }>{fieldSettings.status}</span>
                        <span className={styles["field__selection-group__result-title"]}>{fieldSettings.title}</span>
                    </Button>

                    <Button
                        buttonSize="xs"
                        buttonType="negative"
                        leftIcon={
                            <>
                                <span hidden className="sr-only">Delete </span>
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
                        onClick={() => updateAssetValue(null)}
                    />
                </div>
            </FieldGroup>
        ) : (
            <FieldGroup className={styles["field__selection-group"]}>
                <p className={styles["field__selection-group__label"]}>Record</p>
                <Button
                    buttonType="primary"
                    className={styles["field__selection-group__button"] }
                    leftIcon={
                        <>
                            <span className="sr-only">Asset</span>
                        </>
                    }
                    onClick={getAsset}
                />
            </FieldGroup>
        )
    );
}

export default FieldAsset;
