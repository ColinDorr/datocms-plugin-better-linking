import { useState } from 'react';
import { Canvas, Form, FieldGroup, SelectField, SwitchField, TextField } from "datocms-react-ui";
import Helpers from "../utils/helpers";

import FieldAsset from "../components/fields/FieldAsset";
import FieldRecord from "../components/fields/FieldRecord";
import FieldTel from "../components/fields/FieldTel";
import FieldEmail from "../components/fields/FieldEmail";
import FieldUrl from "../components/fields/FieldUrl";

import styles from "../styles/styles.ContentConfigScreen.module.css";

const { getCtxParams, getDefaultValue } = Helpers();

type PropTypes = {
  ctx: any;
};

type LinkType = { label: string, api_key?: string, value: string };
type StylingType = { label: string, value: string };

type ContentSettings = {
    linkType: LinkType, 
    stylingType: StylingType, 
    open_in_new_window: boolean,
    custom_text: string,
    aria_label:string,

    record: any, 
    asset: any, 
    url: any, 
    tel: any, 
    email: any,
 };

export default function ContentConigScreen({ ctx }: PropTypes) {
    // Retrieve parameters from context
    const ctxFieldParameters: any = getCtxParams(ctx, "field_settings");
    const ctxPluginParameters: any = getCtxParams(ctx, "plugin_settings");
    const ctxParameters: any = getCtxParams(ctx, "content_settings");

    // List field settings data
    const itemTypes = ctxFieldParameters.itemTypes || ctxPluginParameters.itemTypes || [];
    let linkTypeOptions: LinkType[] = ctxFieldParameters?.linkTypeOptions || []; // record, assets, url, mail, tel

    if( itemTypes.length === 0) {
        linkTypeOptions = linkTypeOptions.filter(e => e.value !== "record")
    }

    const locale: string = ctx?.locale;
    const defaultLinkType = { label: "--select--", value: "", api_key: "" };
    const stylingOptions = ctxFieldParameters?.stylingOptions ?? []

    const allowNewTarget = ctxFieldParameters?.allow_new_target ?? true;
    const allowCustomText = ctxFieldParameters?.allow_custom_text ?? true;
    const allowAriaLabel = ctxFieldParameters?.allow_aria_label ?? true;

    const defaultRecord = { "id": null,  "title": null,  "cms_url": null, "slug": null, "status": null,  "url": null };
    const defaultAsset = { "id": null,  "title": null,  "cms_url": null, "slug": null, "status": null,  "url": null };
    const defaultUrl = { "title": null, "url": null };
    const defaultTel = { "title": null, "url": null };
    const defaultEmail = { "title": null, "url": null };

    const columnLayout = allowAriaLabel || allowNewTarget ? 'col-3' : "col-2";

    const savedContentSettings: ContentSettings = {
        linkType: getDefaultValue(ctxParameters, "linkType", linkTypeOptions?.[0] || defaultLinkType ), 
        stylingType: stylingOptions && stylingOptions.length > 0 ? getDefaultValue(ctxParameters, "stylingType", stylingOptions?.[0] || "" ) : "", 
        
        open_in_new_window: allowNewTarget ? getDefaultValue(ctxParameters, "open_in_new_window", false ) : false,
        custom_text: allowCustomText ? getDefaultValue(ctxParameters, "custom_text", "" ) : null,
        aria_label: allowAriaLabel ? getDefaultValue(ctxParameters, "aria_label", "" ) : null,
        
        record: getDefaultValue(ctxParameters, "record", defaultRecord ), 
        asset: getDefaultValue(ctxParameters, "asset", defaultAsset ), 
        url: getDefaultValue(ctxParameters, "url", defaultUrl ), 
        tel: getDefaultValue(ctxParameters, "tel", defaultTel ), 
        email: getDefaultValue(ctxParameters, "email", defaultEmail ),  
    };
    
    const [contentSettings, setContentSettings] = useState<ContentSettings>(savedContentSettings);

    const updateContentSettings = async ( valueObject: object ) => {
        const data = {
            ...contentSettings,
            ...valueObject
        } as any;
      
        const selectedType: string = data.linkType.value;

        const getText = (data: any, selectedType: string) => {
            switch (selectedType) {
                case "tel":
                    return data?.custom_text || (data?.[selectedType]?.url ? data?.[selectedType]?.url.replace("tel:", "") : null) || null;
                case "email":
                    return data?.custom_text || (data?.[selectedType]?.url ? data?.[selectedType]?.url.replace("mailto:", "") : null) || null;
                case "url":
                    return data?.custom_text || data?.[selectedType]?.url || null;
                default:
                    return data?.custom_text || data?.[selectedType]?.title || null;
            }
        }

        const formatted = {
            isValid: false,
            type: selectedType,
            text: getText(data, selectedType),
            ariaLabel: data.aria_label ?? getText(data, selectedType),
            url: data?.[selectedType]?.url || null,
            target: data?.open_in_new_window ? '_blank' : '_self',
            class: data?.stylingType?.value || null,
        };

        formatted.isValid = formatted.text && formatted.url ? true : false;

        const newSettings = {
            ...data, 
            isValid: formatted.isValid,
            formatted : formatted
        }

        setContentSettings(newSettings);

        ctx.setFieldValue(ctx.fieldPath, JSON.stringify(newSettings) );
    }

    return (
        <Canvas ctx={ctx}>
            {contentSettings.linkType?.value ? (
                <Form className={[styles["link-field"], styles[`link-field--${columnLayout}`]].join(' ')}>
                    <FieldGroup className={ styles["link-filed__type-styling"] }>
                        <SelectField
                            name="type"
                            id="type"
                            label="Type"
                            value={ contentSettings.linkType }
                            selectInputProps={{
                                options: linkTypeOptions as LinkType[],
                            }}
                            onChange={(newValue) => {
                                updateContentSettings({"linkType": newValue})
                            }}
                        />
                        {stylingOptions && stylingOptions.length > 0 && (
                            <SelectField
                                name="styling"
                                id="styling"
                                label="Styling"
                                value={ contentSettings.stylingType }
                                selectInputProps={{
                                    options: stylingOptions as StylingType[],
                                }}
                                onChange={(newValue) => {
                                    updateContentSettings({"stylingType": newValue})
                                }}
                            />
                        )}
                    </FieldGroup>
                    <FieldGroup className={ styles["link-field__link-text"] }>
                        {contentSettings.linkType.value === "record" ? (
                            <FieldRecord
                                ctx={ctx} 
                                ctxFieldParameters={ctxFieldParameters}
                                ctxPluginParameters={ctxPluginParameters}
                                savedFieldSettings={contentSettings.record}
                                onValueUpdate={(value: any) => updateContentSettings({"record": value})}
                                locale={locale} 
                            />                          
                        ) : contentSettings?.linkType?.value === "asset" ? (
                            <FieldAsset 
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.asset}
                                onValueUpdate={(value: any) => updateContentSettings({"asset": value})}
                                locale={locale} 
                            />
                            
                        ) : contentSettings?.linkType?.value === "url" ? (
                            <FieldUrl
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.url}
                                onValueUpdate={(value: any) => updateContentSettings({"url": value})}
                            />
                        ) : contentSettings?.linkType?.value === "tel" ? (
                            <FieldTel
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.tel}
                                onValueUpdate={(value: any) => updateContentSettings({"tel": value})}
                            />
                        ) : contentSettings?.linkType?.value === "email" ? (
                            <FieldEmail
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.email}
                                onValueUpdate={(value: any) => updateContentSettings({"email": value})}
                            />
                        ) : null }

                        { allowCustomText && (
                            <TextField
                                name="custom_text"
                                id="custom_text"
                                label="Custom text (Optional)"
                                value={ contentSettings.custom_text }
                                textInputProps={{ monospaced: true }}
                                onChange={(newValue) => {
                                    updateContentSettings({"custom_text": newValue})
                                }}
                            />
                        )}
                    </FieldGroup>

                    { (allowNewTarget || allowAriaLabel) && (
                        <FieldGroup className={ styles["link-field__target-column"] }>
                            { allowNewTarget && (
                                <div className={styles["link-field__target-container"]}>
                                    <p className={ styles["link-field__target-label"] }>Window (Optional)</p>
                                    <SwitchField
                                        name="open_in_new_window"
                                        id="open_in_new_window"
                                        label="Open in new window"
                                        value={ contentSettings.open_in_new_window }
                                        onChange={(newValue) => {
                                            contentSettings.open_in_new_window = newValue
                                            updateContentSettings({"open_in_new_window": newValue})
                                        }}
                                    />
                                </div>
                            )}
                            { allowAriaLabel && (
                                <TextField
                                    name="aria_label"
                                    id="aria_label"
                                    label="Aria-label (Optional)"
                                    value={ contentSettings.aria_label }
                                    textInputProps={{ monospaced: true }}
                                    onChange={(newValue) => {
                                        updateContentSettings({"aria_label": newValue})
                                    }}
                                />
                            )}
                        </FieldGroup>
                    )}
                </Form>
            ) : (
                <div>
                    <p className={ styles["link-field__error"] }><strong>Error!</strong> No valid link types could be found for this field.<br/>Please add the wanted link types to the field appearence settings or the plugin settings</p>
                </div>
            )}
        </Canvas>
    );
}
