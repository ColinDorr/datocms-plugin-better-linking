import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Section } from "datocms-react-ui";
import { useState } from "react";


import LinkSettings from './../components/controlls/linkSetting';
import StylingSettings from './../components/controlls/stylingSettings';

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function FieldConfigScreen({ ctx }: PropTypes) {
    const [linkSettingIsOpen, setLinkSettingIsOpen] = useState(true);
    const [stylingSettingIsOpen, setStylingSettingIsOpen] = useState(true);

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
            {/* <Section
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
            </Section> */}
        </Canvas>
    );
}
