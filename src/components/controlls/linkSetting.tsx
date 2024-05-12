import { SwitchField} from "datocms-react-ui";
import Log from "./../../utils/develop";

const parameters = [
    { label: "Allow Records", value: true, key: "allow_record" },
    { label: "Allow URL", value: true, key: "allow_url" },
    { label: "Allow Telephone numbers", value: true, key: "allow_tel" },
    { label: "Allow Email addresses", value: true, key: "allow_email" },
    { label: "Allow Target control", value: true, key: "allow_new_target" },
];

export default function linkSetting( { ctx, configType }: any ) {
    const ctxParameters = ctx.plugin.attributes.parameters as any;

    const updateCtx = (
        valueObject: object
    ) => {
        const updatedParameters = {
            ...ctxParameters,
            [configType]: {
              ...(ctxParameters?.[configType] || {}),
             ...valueObject
            }
          };

        ctx.updatePluginParameters(updatedParameters);
        Log(updatedParameters);
    };

    return (
        <div>
            {parameters.map((param) => (
                <div key={param.key}>
                    <SwitchField
                        id={param.key}
                        name={param.key}
                        label={param.label}
                        value={ctxParameters?.[configType]?.[param.key] || ctxParameters?.["plugin_settings"]?.[param.key] || false}
                        onChange={(newValue) => {
                            updateCtx({[param.key]: newValue});
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
