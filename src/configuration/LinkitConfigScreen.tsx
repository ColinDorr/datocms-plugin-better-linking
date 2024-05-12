import { Field, RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, SwitchField } from "datocms-react-ui";
import { CSSProperties, useCallback, useState } from "react";
import Log from "./../utils/develop";

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

const parameters = [
    { label: "Allow Records", value: true, key: "allow_record" },
    { label: "Allow URL", value: true, key: "allow_url" },
    { label: "Allow Telephone numbers", value: true, key: "allow_tel" },
    { label: "Allow Emailadresses", value: true, key: "allow_email" },
    { label: "Allow Target control", value: true, key: "allow_new_target" },
];

export default function LinkitConfigScreen({ ctx }: PropTypes) {
    const ctxParameters = ctx.plugin.attributes.parameters as any;

    return (
        <Canvas ctx={ctx}>
            {parameters.map((param) => (
                <SwitchField
                    key={param.key}
                    id={param.key}
                    name={param.key}
                    label={param.label}
                    value={ctxParameters[param.key] || false}
                    onChange={(newValue) => {
                        const updatedParameters = { ...ctxParameters, [param.key]: newValue };
                        ctx.updatePluginParameters(updatedParameters);
                        Log(updatedParameters)
                    }}
                />
            ))}
        </Canvas>
    );
}
