import { useState } from "react";
import { Canvas, Section } from "datocms-react-ui";

import LinkSettings from './../components/controlls/LinkSettings';
import StylingSettings from './../components/controlls/StylingSettings';

import styles from "../styles/styles.PluginConfigScreen.module.css";

type Props = {
    ctx: any;
};

export default function PluginConfigScreen({ ctx }: Props) {
    const [linkSettingIsOpen, setLinkSettingIsOpen] = useState(true);
    const [stylingSettingIsOpen, setStylingSettingIsOpen] = useState(true);

    return (
        <Canvas ctx={ctx}>
            <p>Welcome to your plugin! This is your config screen!</p>

            <h2>Usage</h2>
            {/* <div>
                <ContextInspector />
            </div> */}

            <h2>Settings</h2>
            <div>
                <Section
                    title="Link setting"
                    collapsible={{ 
                        isOpen: linkSettingIsOpen, 
                        onToggle: () => setLinkSettingIsOpen((prev) => !prev) 
                    }}
                >
                    <LinkSettings 
                        ctx={ctx} 
                        configType="plugin_settings" 
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
                        configType="plugin_settings"
                    />
                </Section>
            </div>
        </Canvas>
    );
}






