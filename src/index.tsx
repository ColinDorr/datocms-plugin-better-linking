import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  connect, 
  Field, 
  IntentCtx, 
  FieldIntentCtx,
  RenderFieldExtensionCtx,
  RenderManualFieldExtensionConfigScreenCtx
 } from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import ConfigScreen from './entrypoints/ConfigScreen';
import { render } from './utils/render';
import LinkitConfigScreen from "./configuration/LinkitConfigScreen";
import LinkitEditor from "./components/LinkitEditor";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'linkit',
        name: 'Linkit',
        type: 'editor',
        fieldTypes: ['link'],
        configurable: true,
      },
    ];
  },
  overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
    if (field.attributes.field_type === 'link') {
      return {
        addons: [{ id: 'linkit' }],
      };
    }
  },

  // Render Configuration screens
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) {
    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
        <LinkitConfigScreen ctx={ctx} />
      </React.StrictMode>,
    );
  },


  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'linkit':
        return render(<LinkitEditor ctx={ctx} />);
    }
  },
});