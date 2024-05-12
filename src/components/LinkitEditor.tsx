import {
    RenderFieldExtensionCtx,
} from "datocms-plugin-sdk";
import { 
    Canvas, 
    Form,
    FieldGroup,
    SelectField,
    SwitchField,
    TextField
} from "datocms-react-ui";
import Log from "./../utils/develop";

import styles from "./styles.module.css";

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function LinkitEditor({ ctx }: PropTypes) {
    const ctxParameters = ctx.plugin.attributes.parameters as any;
    const allowNewTarget = ctxParameters?.contentSettings?.allow_new_target || false;

    const updateContentSettings = ( valueObject: object ) => {
        const updatedParameters = {
            ...ctxParameters,
            contentSettings: {
                ...ctxParameters.contentSettings,
                ...valueObject
            }
        };
        ctx.updatePluginParameters(updatedParameters);
        Log(updatedParameters)
    }

    // Set target, when allow_target is false
    if(!allowNewTarget){
        const open_in_new_window_value = { ...ctxParameters?.contentSettings?.open_in_new_window || false };
        updateContentSettings({"open_in_new_window": open_in_new_window_value});
    }

    // Set typeOptions array
    const parameterMappings = {
        allow_record: { label: "Record", value: "record" },
        allow_url: { label: "URL", value: "url" },
        allow_tel: { label: "Telephone number", value: "tel" },
        allow_mail: { label: "Email address", value: "email" }
    };
    const typeOptions = Object.entries(parameterMappings)
        .filter(([key]) => ctxParameters?.[key])
        .map(([, value]) => value);

    // Set stylingOptions Array
    const stylingOptions = [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Tertiary", value: "tertiary" },
        { label: "Quaternary", value: "quaternary" },
    ]

    return (
        <Canvas ctx={ctx}>
            <Form className={ styles.linkit } onSubmit={() => console.log("onSubmit")}>
                <FieldGroup className={ styles.linkit__column }>
                    <SelectField
                        name="type"
                        id="type"
                        label="Type"
                        value={ ctxParameters?.contentSettings?.type || typeOptions[0] }
                        selectInputProps={{
                            options: typeOptions,
                        }}
                        onChange={(newValue) => {
                            updateContentSettings({ 
                                "type": newValue, 
                                "link": null 
                            })
                        }}
                    />
                    <SelectField
                        name="styling"
                        id="styling"
                        label="Styling"
                        value={ ctxParameters?.contentSettings?.styling || stylingOptions[0] }
                        selectInputProps={{
                        options: stylingOptions,
                        }}
                        onChange={(newValue) => {
                            updateContentSettings({"styling": newValue})
                        }}
                    />
                </FieldGroup>
                <FieldGroup className={ styles.linkit__column }>
                    {["url", "tel", "email"].includes(ctxParameters?.contentSettings?.type?.value || typeOptions[0].value) && (
                        <TextField
                            name="link"
                            id="link"
                            label={ctxParameters?.contentSettings?.type?.label || typeOptions[0].label}
                            value={ctxParameters?.contentSettings?.link || ""}
                            textInputProps={{ monospaced: true }}
                            onChange={(newValue) => {
                                updateContentSettings({"link": newValue})
                            }}
                        />
                    )}
                    {["record"].includes(ctxParameters?.contentSettings?.type?.value || typeOptions[0].value) && (
                        <TextField
                            name="link"
                            id="link"
                            label={ctxParameters?.contentSettings?.type?.label || typeOptions[0].label}
                            value={ctxParameters?.contentSettings?.link || ""}
                            textInputProps={{ monospaced: true }}
                            onChange={(newValue) => {
                                updateContentSettings({"link": newValue})
                            }}
                        />
                    )}
                    <TextField
                        name="custom_text"
                        id="custom_text"
                        label="Custom text (Optional)"
                        value={ ctxParameters?.contentSettings?.custom_text || null }
                        textInputProps={{ monospaced: true }}
                        onChange={(newValue) => {
                            updateContentSettings({"custom_text": newValue})
                        }}
                    />
                </FieldGroup>
                <FieldGroup className={ styles.linkit__column_top }>
                    { allowNewTarget ? (
                        <SwitchField
                            name="open_in_new_window"
                            id="open_in_new_window"
                            label="Open in new window"
                            value={ctxParameters?.contentSettings?.open_in_new_window || false}
                            onChange={(newValue) => {
                                updateContentSettings({"open_in_new_window": newValue})
                            }}
                        />
                    ) : null}
                </FieldGroup>
            </Form>
        </Canvas>
    );
}
