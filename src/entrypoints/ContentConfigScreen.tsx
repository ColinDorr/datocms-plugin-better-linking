import React, { useState } from 'react';
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, Form, FieldGroup, SelectField, SwitchField, TextField } from "datocms-react-ui";
import Log from "./../utils/develop";
import styles from "./styles/styles.ContentConfigScreen.module.css";

type PropTypes = {
  ctx: any;
};

type LinkType = { label: string, value: string };
type StylingType = { label: string, value: string };
type ContentSettings = {
    linkType: LinkType, 
    stylingType: StylingType, 
    link: string,
    custom_text: string,
    open_in_new_window: boolean
 };

export default function ContentConigScreen({ ctx }: PropTypes) {
    // Retrieve parameters from context
    const ctxParameters = ctx.plugin.attributes.parameters as any;
    const ctxLinkSettings = {
        locale: ctx?.locale,
        itemTypes: ctx?.field?.attributes?.validators?.item_item_type?.item_types,
        localized: ctx?.field?.attributes?.validators?.localized || ctx?.locale,
    }
    const configType = "content_settings";


    // TODO
    // Use the ctxLinkSettings to query all selected records in cms in a model view
    console.log({
        ctxParameters,
        ctxLinkSettings
    })

    // TODO
    // Save the values and allow graphql access

    // Function to get default value based on priority
    const getDefaultValue = (key: string, fallback: any) => {
        if(ctxParameters?.[configType]?.[key] !== undefined){
            return ctxParameters?.[configType]?.[key]
          } else if (ctxParameters?.["field_settings"]?.[key] !== undefined) {
            return ctxParameters["field_settings"][key];
          } else if (ctxParameters?.["plugin_settings"]?.[key] !== undefined) {
              return ctxParameters["plugin_settings"][key];
          }
          return fallback;
    }

    // Extract parameters with default values
    const allowNewTarget = getDefaultValue("allow_new_target", false );
    const allowCustomText = getDefaultValue("allow_custom_text", false );
    const linkTypeOptions = getDefaultValue("linkTypeOptions", [] ) as LinkType[];
    const stylingOptions = getDefaultValue("stylingOptions", [] ) as StylingType[];

    // Default settings for content
    const defaultSettings: ContentSettings = {
        linkType: linkTypeOptions ? linkTypeOptions[0] : { label: "", value: "" },
        stylingType: stylingOptions ? stylingOptions[0] : { label: "", value: "" },
        link: getDefaultValue("link", ""),
        custom_text: getDefaultValue("custom_text", ""),
        open_in_new_window: getDefaultValue("open_in_new_window", false) 
    }

    // State to manage content settings
    const [contentSettings, setContentSettings] = useState<ContentSettings>(defaultSettings);

    // Function to update content settings
    const updateContentSettings = ( valueObject: object ) => {
        setContentSettings({
            ...contentSettings,
            ...valueObject
        })
        const updatedParameters = {
            ...ctxParameters,
            contentSettings: {
                ...contentSettings
            }
        };
        ctx.updatePluginParameters(updatedParameters);
        Log({updatedParameters})
    }

    return (
        <Canvas ctx={ctx}>
            {linkTypeOptions && linkTypeOptions.length > 0 ? (
                <Form className={ styles.linkit } onSubmit={() => console.log("onSubmit")}>
                    <FieldGroup className={ styles.linkit__column }>
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
                    <FieldGroup className={ styles.linkit__column }>
                        {contentSettings.linkType && ["url", "tel", "email"].includes(contentSettings?.linkType?.value) ? (
                            <TextField
                                name="link"
                                id="link"
                                label={contentSettings.linkType.label}
                                value={contentSettings.link}
                                textInputProps={{ monospaced: true }}
                                onChange={(newValue) => {
                                    updateContentSettings({"link": newValue})
                                }}
                            />
                        ) : (
                            contentSettings.linkType && ["record"].includes(contentSettings?.linkType?.value) ? (
                                <TextField
                                    name="link"
                                    id="link"
                                    label={contentSettings.linkType.label}
                                    value={contentSettings.link}
                                    textInputProps={{ monospaced: true }}
                                    onChange={(newValue) => {
                                        updateContentSettings({"link": newValue})
                                    }}
                                />
                            ) : null
                        )}
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
                    <FieldGroup className={ styles.linkit__column_top }>
                        { allowNewTarget && (
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
                        )}
                    </FieldGroup>
                </Form>
            ) : (
                <div>
                    <p><strong>Error!</strong><br/>No valid link types could be found for this field.<br/>Please add the wanted link types to the field appearence settings or the plugin settings</p>
                </div>
            )}
        </Canvas>
    );
}
