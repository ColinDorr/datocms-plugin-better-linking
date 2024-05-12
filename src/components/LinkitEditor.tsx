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
    const allowNewTarget = ctxParameters?.allow_new_target || false;

    if(!allowNewTarget){
        const updatedParameters = { ...ctxParameters, "open_in_new_window": false };
        ctx.updatePluginParameters(updatedParameters);
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
                        value={ ctxParameters.type || typeOptions[0] }
                        selectInputProps={{
                            options: typeOptions,
                        }}
                        onChange={(newValue) => {
                            const updatedParameters = { ...ctxParameters, "type": newValue,  "link": null };
                            ctx.updatePluginParameters(updatedParameters);
                            Log(updatedParameters)
                        }}
                    />
                    <SelectField
                        name="styling"
                        id="styling"
                        label="Styling"
                        value={ ctxParameters.styling || stylingOptions[0] }
                        selectInputProps={{
                        options: stylingOptions,
                        }}
                        onChange={(newValue) => {
                            const updatedParameters = { ...ctxParameters, "styling": newValue };
                            ctx.updatePluginParameters(updatedParameters);
                            Log(updatedParameters)
                        }}
                    />
                </FieldGroup>
                <FieldGroup className={ styles.linkit__column }>
                    {["url", "tel", "email"].includes(ctxParameters?.type?.value || typeOptions[0].value) && (
                        <TextField
                            name="link"
                            id="link"
                            label={ctxParameters?.type?.label || typeOptions[0].label}
                            value={ctxParameters.link || ""}
                            textInputProps={{ monospaced: true }}
                            onChange={(newValue) => {
                                const updatedParameters = { ...ctxParameters, "link": newValue };
                                ctx.updatePluginParameters(updatedParameters);
                                Log(updatedParameters);
                            }}
                        />
                    )}
                    {["record"].includes(ctxParameters?.type?.value || typeOptions[0].value) && (
                        <TextField
                            name="link"
                            id="link"
                            label={ctxParameters?.type?.label || typeOptions[0].label}
                            value={ctxParameters.link || ""}
                            textInputProps={{ monospaced: true }}
                            onChange={(newValue) => {
                                const updatedParameters = { ...ctxParameters, "link": newValue };
                                ctx.updatePluginParameters(updatedParameters);
                                Log(updatedParameters);
                            }}
                        />
                    )}
                    <TextField
                        name="custom_text"
                        id="custom_text"
                        label="Custom text (Optional)"
                        value={ ctxParameters.custom_text || null }
                        textInputProps={{ monospaced: true }}
                        onChange={(newValue) => {
                            const updatedParameters = { ...ctxParameters, "custom_text": newValue };
                            ctx.updatePluginParameters(updatedParameters);
                            Log(updatedParameters)
                        }}
                    />
                </FieldGroup>
                <FieldGroup className={ styles.linkit__column_top }>
                    { allowNewTarget ? (
                        <SwitchField
                            name="open_in_new_window"
                            id="open_in_new_window"
                            label="Open in new window"
                            value={ctxParameters.open_in_new_window || false}
                            onChange={(newValue) => {
                                const updatedParameters = { ...ctxParameters, "open_in_new_window": newValue };
                                ctx.updatePluginParameters(updatedParameters);
                                Log(updatedParameters);
                            }}
                        />
                    ) : null}
                </FieldGroup>
            </Form>
        </Canvas>
    );
}
