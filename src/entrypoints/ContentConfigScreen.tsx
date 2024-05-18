import React, { useState } from 'react';
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, Form, FieldGroup, SelectField, SwitchField, TextField, Button } from "datocms-react-ui";
import Log from "./../utils/develop";
import Helpers from "./../utils/helpers";
import styles from "./styles/styles.ContentConfigScreen.module.css";

const { getCtxParams, getDefaultValue } = Helpers();

type PropTypes = {
  ctx: any;
};

type LinkType = { label: string, api_key?: string, value: string };
type LinkData = { title: string, status: string, url: string };
type StylingType = { label: string, value: string };

type ContentSettings = {
    linkType: LinkType, 
    linkData: any, 
    stylingType: StylingType, 
    custom_text: string,
    open_in_new_window: boolean
 };

 type LinkNotation = {
    id: string | null,
    title: string,
    url: string; //item_types/{item_type.id}/items/{ id }/edit or asset: https://dato-plugin-test-enviroment.admin.datocms.com/media/assets/{ id } or https:// or tel: or mailto: 
    status: string | null; //meta.status
    target: boolean,
 }


export default function ContentConigScreen({ ctx }: PropTypes) {
    // Retrieve parameters from context
    const ctxFieldParameters: any = getCtxParams(ctx, "field_settings");
    const ctxParameters: any = getCtxParams(ctx, "content_settings");

    // List field settings data
    const boundSchemaModels: string[] = ctx?.field?.attributes?.validators?.item_item_type?.item_types || [] // Homepage, singles etc.
    let linkTypeOptions: LinkType[] = ctxFieldParameters?.linkTypeOptions || []; // record, assets, url, mail, tel

    if( boundSchemaModels.length === 0) {
        linkTypeOptions = linkTypeOptions.filter(e => e.value !== "record")
    }

    const localized: boolean = ctx?.field?.attributes?.localized ?? false;
    const locale: string = ctx?.locale;
    const defaultLinkType = { label: "--select--", value: "", api_key: "" };
    const itemTypes = ctx.itemTypes || []
    const stylingOptions = ctxFieldParameters?.stylingOptions || []

    // Generate record dropdown to toggle corresponding search modal
    const RecordDropdownOptions: LinkType[] = (() => {
        const optionsWithApi_key: LinkType[] = [];
        boundSchemaModels.forEach(model => {
            if (itemTypes?.[model] !== undefined) {
                optionsWithApi_key.push({
                    label: itemTypes[model].attributes.name,
                    value: itemTypes[model].id,
                    api_key: itemTypes[model].attributes.api_key
                });
            }
        });

        const sortedOptions = optionsWithApi_key.sort((a:any, b:any) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
          });

        return [ defaultLinkType, ...sortedOptions ]
    })();

    // List content settings/defaults
    const allowNewTarget = ctxFieldParameters?.allow_new_target || true;
    const allowCustomText = ctxFieldParameters?.allow_custom_text || true;
    // const stylingOptions = [] as StylingType[]; // TODO get style types
    const allowedLinkTypeOptions = (() => { return [defaultLinkType, ...linkTypeOptions]; })(); // --select-- record, assets, url, mail, tel

    const savedContentSettings: ContentSettings = {
        linkType: getDefaultValue(ctxParameters, "linkType", linkTypeOptions?.[0] || defaultLinkType ), 
        linkData: getDefaultValue(ctxParameters, "linkData", "" ), 
        stylingType: getDefaultValue(ctxParameters, "stylingType", stylingOptions?.[0] || "" ), 
        custom_text: getDefaultValue(ctxParameters, "custom_text", "" ),
        open_in_new_window: getDefaultValue(ctxParameters, "open_in_new_window", false )
    };
    const [contentSettings, setContentSettings] = useState<ContentSettings>(savedContentSettings);

    // Log({
    //     ctxFieldParameters,
    //     contentSettings,
    //     ctxParameters,
    //     linkTypeOptions,
    //     locale,
    //     localized,
    //     boundSchemaModels,
    //     allowedLinkTypeOptions
    // })

    // // TODO
    // // Save the values and allow graphql access

    // // Function to get default value based on priority
    // const getDefaultValue = (key: string, fallback: any) => {
    //     if(ctxParameters?.[configType]?.[key] !== undefined){
    //         return ctxParameters?.[configType]?.[key]
    //       } else if (ctxParameters?.["field_settings"]?.[key] !== undefined) {
    //         return ctxParameters["field_settings"][key];
    //       } else if (ctxParameters?.["plugin_settings"]?.[key] !== undefined) {
    //           return ctxParameters["plugin_settings"][key];
    //       }
    //       return fallback;
    // }



    // // Default settings for content
    // const defaultSettings: ContentSettings = {
    //     linkType: linkTypeOptions ? linkTypeOptions[0] : { label: "", value: "" },
    //     stylingType: stylingOptions ? stylingOptions[0] : { label: "", value: "" },
    //     link: getDefaultValue("link", ""),
    //     custom_text: getDefaultValue("custom_text", ""),
    //     open_in_new_window: getDefaultValue("open_in_new_window", false) 
    // }

    // // State to manage content settings
    // const [contentSettings, setContentSettings] = useState<ContentSettings>(defaultSettings);

    // // Function to update content settings
    const updateContentSettings = async ( valueObject: object ) => {
        const newSettings = {
            ...contentSettings,
            ...valueObject
        }
        setContentSettings(newSettings);
        Log({newSettings,ctx});

        Log(valueObject)
        // await ctx.setFieldValue(valueObject)
        // ctx.parameters = newSettings
        console.log({params: ctx.parameters })
        

        // console.log({contentSettings})
        // const updatedParameters = {
        //     ...ctxParameters,
        //     contentSettings: {
        //         ...contentSettings
        //     }
        // };
        // ctx.updatePluginParameters(updatedParameters);
        // ctx.parameters = updatedParameters
        // // ctx.setParameters({
        // //     contentSettings: contentSettings
        // // });
        // Log({
        //     parameters : ctx.parameters
        // })
        // Log({ctx, updatedParameters, contentSettings})
    }

    
    const getRecordOfType = async (item: any) => {
        let record = null;
        if(item.value !== "" ) {
            record = await ctx.selectItem(item.value, { multiple: false });
        }
        updateContentSettings({ linkData: record })
        console.log({record});
    }
    const getAsset = async () => {
        const item = await ctx.selectUpload({ multiple: false });
        updateContentSettings({ linkData: item })
        console.log({item});
    }

    return (
        <Canvas ctx={ctx}>
            {/* {linkTypeOptions && linkTypeOptions.length > 0 ? ( */}
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
                                value={contentSettings.linkData}
                                textInputProps={{ monospaced: true }}
                                onChange={(newValue) => {
                                    updateContentSettings({"linkData": newValue})
                                }}
                            />
                        ) : contentSettings.linkType && ["asset"].includes(contentSettings?.linkType?.value) ? (
                            <Button
                                buttonType="primary"
                                leftIcon={
                                    <>
                                        <span className="sr-only">Asset </span>
                                    </>
                                }
                                onClick={ () => getAsset() }
                            />
                        ) : contentSettings.linkType && ["record"].includes(contentSettings?.linkType?.value) ? (
                            <SelectField
                                name="styling"
                                id="styling"
                                label="Record"
                                value={ contentSettings.linkData?.url ? contentSettings.linkData : defaultLinkType }
                                selectInputProps={{
                                    options: RecordDropdownOptions,
                                }}
                                onChange={(newValue) => {
                                    getRecordOfType(newValue)
                                }}
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
            {/* ) : (
                <div>
                    <p><strong>Error!</strong><br/>No valid link types could be found for this field.<br/>Please add the wanted link types to the field appearence settings or the plugin settings</p>
                </div>
            )} */}
        </Canvas>
    );
}
