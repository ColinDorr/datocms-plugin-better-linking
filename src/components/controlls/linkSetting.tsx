import React, { useState, } from 'react';
import { Form, FieldGroup, Button, SwitchField} from "datocms-react-ui";
import Log from "./../../utils/develop";
import Helpers from "./../../utils/helpers";

const { getCtxParams, getDefaultValue } = Helpers();

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
    const ctxParameters:any = getCtxParams(ctx,configType);

    const savedLinkFieldSettings: ConfigSetting[] = [
        { id: "allow_record",       label: "Allow Records",                 value: getDefaultValue(ctxParameters,"allow_record", true)        },
        { id: "allow_assets",       label: "Allow Assets",                  value: getDefaultValue(ctxParameters,"allow_assets", true)        },
        { id: "allow_url",          label: "Allow URL",                     value: getDefaultValue(ctxParameters,"allow_url", true)           },
        { id: "allow_tel",          label: "Allow Telephone numbers",       value: getDefaultValue(ctxParameters,"allow_tel", true)           },
        { id: "allow_email",        label: "Allow Email addresses",         value: getDefaultValue(ctxParameters,"allow_email", true)         },
        { id: "allow_custom_text",  label: "Allow Custom text",             value: getDefaultValue(ctxParameters,"allow_custom_text", true)   },
        { id: "allow_new_target",   label: "Allow Target control",          value: getDefaultValue(ctxParameters,"allow_new_target", true)    },
    ];
    const linkFieldValues: any = {
        allow_record:   { label: "Record",              value: "record" },
        allow_assets:   { label: "Asset",               value: "asset"  },
        allow_url:      { label: "URL",                 value: "url"    },
        allow_tel:      { label: "Telephone number",    value: "tel"    },
        allow_email:    { label: "Email address",       value: "email"  }
    };

    const [configSettings, setConfigSettings] = useState<ConfigSetting[]>(savedLinkFieldSettings);

    const updateCtx = async () => {
        const settings: { [key: string]: any } = {};
        const linkTypeOptions: string[] = [];

        configSettings.forEach((item: ConfigSetting) => {
            if (item.value === true) {  
                linkTypeOptions.push(linkFieldValues[item.id]); 
            }
            settings[item.id] = item.value;
        });
 
        settings.linkTypeOptions = linkTypeOptions.filter(e => e !== undefined);

        if (configType === "plugin_settings") {
            ctx.updatePluginParameters(settings);
        } else if (configType === "field_settings") {
            ctx.setParameters({ field_settings: settings });
        }
        
        Log({[`New Settings: ${configType}`] : settings });
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
