import React, { useState } from 'react';
import { Form, FieldGroup, Button, SwitchField } from "datocms-react-ui";
import Log from "./../../utils/develop";

type PropTypes = {
    ctx: any;
    configType: string;
};

type ConfigSetting = { 
    id: string, 
    label: string; 
    value: string | boolean; 
};

const LinkSetting: React.FC<PropTypes> = ({ ctx, configType }) => {
    const ctxParameters = ctx.plugin.attributes.parameters as any;

    const getDefaultValue = (key: string, fallback: string | boolean) => {
        if(ctxParameters?.[configType]?.[key] !== null){
            return ctxParameters?.[configType]?.[key]
        } else if (ctxParameters?.["plugin_settings"]?.[key] !== null ){
            return ctxParameters?.["plugin_settings"]?.[key]
        } return {
            fallback
        }
    }
    
    const parameters: ConfigSetting[] = [
        { id: "allow_record",       label: "Allow Records",                 value: getDefaultValue("allow_record", true)        },
        { id: "allow_url",          label: "Allow URL",                     value: getDefaultValue("allow_url", true)           },
        { id: "allow_tel",          label: "Allow Telephone numbers",       value: getDefaultValue("allow_tel", true)           },
        { id: "allow_email",        label: "Allow Email addresses",         value: getDefaultValue("allow_email", true)         },
        { id: "allow_custom_text",  label: "Allow Custom text",             value: getDefaultValue("allow_custom_text", true)   },
        { id: "allow_new_target",   label: "Allow Target control",          value: getDefaultValue("allow_new_target", true)    },
    ];

    const linkValues: any = {
        allow_record: { label: "Record", value: "record" },
        allow_url: { label: "URL", value: "url" },
        allow_tel: { label: "Telephone number", value: "tel" },
        allow_email: { label: "Email address", value: "email" }
    };

    const [configSettings, setConfigSettings] = useState<ConfigSetting[]>(parameters);

    const updateCtx = () => {
        // Generate list with setting booleans
        const updatedConfigSettings = configSettings.reduce((
            acc: { [label: string]: boolean }, 
            obj: ConfigSetting
        ) => {
            acc[obj.id] = obj.value as boolean;
            return acc;
        }, {});

        // Generate Array of linkTypeOptions (record, url, email, tel)
        const linkTypeOptions: {label:string, value:string}[] = [];
        Object.keys(updatedConfigSettings).forEach(id => {
            if (linkValues[id]) {
                linkTypeOptions.push({
                    label: linkValues[id].label,
                    value: linkValues[id].value
                })
            }
        });

        const newCtxParameters = {
            ...ctxParameters,
            [configType]: {
                ...(ctxParameters?.[configType] || {}),
                ...updatedConfigSettings,
                linkTypeOptions: linkTypeOptions
            }
        }

        ctx.updatePluginParameters(newCtxParameters);
        Log({ newCtxParameters });
    };

    return (
        <div>
            <Form onSubmit={updateCtx}>
                <FieldGroup>
                    {configSettings.slice(0, -2).map((param: ConfigSetting) => (
                        <div key={param.id}>
                            <SwitchField
                                id={param.id}
                                name={param.id}
                                label={param.label}
                                value={param.value as boolean}
                                onChange={(newValue) => {
                                    setConfigSettings(prevSettings =>
                                        prevSettings.map(setting => 
                                            setting.id === param.id 
                                            ? { ...setting, value: newValue } 
                                            : setting
                                        )
                                    );
                                }}
                            />
                        </div>
                    ))}
                </FieldGroup>
                <br/>
                <FieldGroup>
                    {configSettings.slice(-2).map((param: ConfigSetting) => (
                        <div key={param.id}>
                            <SwitchField
                                id={param.id}
                                name={param.id}
                                label={param.label}
                                value={param.value as boolean}
                                onChange={(newValue) => {
                                    setConfigSettings(prevSettings =>
                                        prevSettings.map(setting => 
                                            setting.id === param.id 
                                            ? { ...setting, value: newValue } 
                                            : setting
                                        )
                                    );
                                }}
                            />
                        </div>
                    ))}
                </FieldGroup>

                <FieldGroup>
                    <Button onClick={updateCtx} fullWidth buttonType="primary">
                        Save link settings
                    </Button>
                </FieldGroup>
            </Form>
        </div>
    );
}

export default LinkSetting;
