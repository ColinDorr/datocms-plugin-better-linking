import React, { useState } from 'react';
import { Canvas, Form, FieldGroup, SelectField, SwitchField, TextField } from "datocms-react-ui";
import Log from "./../utils/develop";
import Helpers from "./../utils/helpers";
import styles from "./styles/styles.ContentConfigScreen.module.css";

import FieldAsset from "./../components/fields/FieldAsset";
import FieldRecord from "./../components/fields/FieldRecord";
import FieldTel from "./../components/fields/FieldTel";
import FieldEmail from "./../components/fields/FieldEmail";
import FieldUrl from "./../components/fields/FieldUrl";

const { getCtxParams, getDefaultValue } = Helpers();

type PropTypes = {
  ctx: any;
};

type LinkType = { label: string, api_key?: string, value: string };
type StylingType = { label: string, value: string };

type ContentSettings = {
    linkType: LinkType, 
    recordData: any, 
    assetData: any, 
    urlData: any, 
    telData: any, 
    emailData: any, 
    stylingType: StylingType, 
    custom_text: string,
    open_in_new_window: boolean
 };

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

    const locale: string = ctx?.locale;
    const defaultLinkType = { label: "--select--", value: "", api_key: "" };
    const stylingOptions = ctxFieldParameters?.stylingOptions || []

    const allowNewTarget = ctxFieldParameters?.allow_new_target || true;
    const allowCustomText = ctxFieldParameters?.allow_custom_text || true;

    const savedContentSettings: ContentSettings = {
        linkType: getDefaultValue(ctxParameters, "linkType", linkTypeOptions?.[0] || defaultLinkType ), 
        recordData: getDefaultValue(ctxParameters, "recordData", "" ), 
        assetData: getDefaultValue(ctxParameters, "assetData", "" ), 
        urlData: getDefaultValue(ctxParameters, "urlData", "" ), 
        telData: getDefaultValue(ctxParameters, "telData", "" ), 
        emailData: getDefaultValue(ctxParameters, "emailData", "" ),  
        stylingType: getDefaultValue(ctxParameters, "stylingType", stylingOptions?.[0] || "" ), 
        custom_text: getDefaultValue(ctxParameters, "custom_text", "" ),
        open_in_new_window: getDefaultValue(ctxParameters, "open_in_new_window", false )
    };
    const [contentSettings, setContentSettings] = useState<ContentSettings>(savedContentSettings);

    // // Function to update content settings
    const updateContentSettings = async ( valueObject: object ) => {
        const newSettings = {
            ...contentSettings,
            ...valueObject
        }
        setContentSettings(newSettings);

        Log({
            call : "updateContentSettings",
            valueObject,
            newSettings,
            ctx
        });

        // Log(valueObject)
        // await ctx.setFieldValue(valueObject)
        // ctx.parameters = newSettings
        // console.log({params: ctx.parameters })
        

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

    return (
        <Canvas ctx={ctx}>
            {contentSettings.linkType?.value ? (
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
                        {contentSettings.linkType.value === "record" ? (
                            <FieldRecord
                                ctx={ctx} 
                                ctxFieldParameters={ctxFieldParameters}
                                savedFieldSettings={contentSettings.recordData}
                                onValueUpdate={(value: any) => updateContentSettings({"recordData": value})}
                                locale={locale} 
                            />                          
                        ) : contentSettings?.linkType?.value === "asset" ? (
                            // <p>asset</p>
                            <FieldAsset 
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.assetData}
                                onValueUpdate={(value: any) => updateContentSettings({"assetData": value})}
                                locale={locale} 
                            />
                            
                        ) : contentSettings?.linkType?.value === "url" ? (
                            <FieldUrl
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.urlData}
                                onValueUpdate={(value: any) => updateContentSettings({"urlData": value})}
                            />
                        ) : contentSettings?.linkType?.value === "tel" ? (
                            <FieldTel
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.telData}
                                onValueUpdate={(value: any) => updateContentSettings({"telData": value})}
                            />
                        ) : contentSettings?.linkType?.value === "email" ? (
                            <FieldEmail
                                ctx={ctx} 
                                savedFieldSettings={contentSettings.emailData}
                                onValueUpdate={(value: any) => updateContentSettings({"emailData": value})}
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
            ) : (
                <div>
                    <p><strong>Error!</strong><br/>No valid link types could be found for this field.<br/>Please add the wanted link types to the field appearence settings or the plugin settings</p>
                </div>
            )}
        </Canvas>
    );
}
