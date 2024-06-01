import { useState } from "react";
import { Canvas, Section, Button } from "datocms-react-ui";
import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import Helpers from "./../utils/helpers";

import LinkSettings from './../components/controlls/LinkSettings';
import StylingSettings from './../components/controlls/StylingSettings';

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};
const { getCtxParams } = Helpers();

export default function FieldConfigScreen({ ctx }: PropTypes) {
    const [linkSettingIsOpen, setLinkSettingIsOpen] = useState(false);
    const [stylingSettingIsOpen, setStylingSettingIsOpen] = useState(false);
    const ctxPluginParameters: any = getCtxParams(ctx, "plugin_settings");

    console.log({ctxPluginParameters})
    return (
        <Canvas ctx={ctx}>
            <Section
                title="Link setting"
                collapsible={{ 
                    isOpen: linkSettingIsOpen, 
                    onToggle: () => setLinkSettingIsOpen((prev) => !prev) 
                }}
            >
                <LinkSettings 
                    ctx={ctx} 
                    configType="field_settings" 
                />
            </Section>
            <Section
                title="Styling settings"
                collapsible={{ 
                    isOpen: stylingSettingIsOpen, 
                    onToggle: () => setStylingSettingIsOpen((prev) => !prev) 
                }}
            >
                <StylingSettings 
                    ctx={ctx} 
                    configType="field_settings"
                />
            </Section>

            <Button 
                    fullWidth
                    buttonType="primary"
                    onClick={
                        () => {
                            ctx.setParameters({ field_settings: ctxPluginParameters });
                            console.log(ctx)
                        }
                    }
                >
                    Reset to Plugin default settings
                </Button>
        </Canvas>
    );
}
