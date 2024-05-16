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
import { render } from './utils/render';

import PluginConfigScreen from './entrypoints/PluginConfigScreen';
import FieldConfigScreen from "./entrypoints/FieldConfigScreen";
import ContentConfigScreen from "./entrypoints/ContentConfigScreen";

connect({
  renderConfigScreen(ctx) {
    return render(<PluginConfigScreen ctx={ctx} />);
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

  // Add field editor "Linkit" to link field appearences
  overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
    if (
      field.attributes.field_type === "link" 
      && field.attributes.appearance?.field_extension === "linkit"
    ) {
      return {
        editor: { id: 'linkit' },
      };
    }
  },

  // Render field configuration screens 
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) {
    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
        <FieldConfigScreen ctx={ctx} />
      </React.StrictMode>,
    );
  },

  // Render Field in records 
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'linkit':
        console.log(ctx)
        return render(<ContentConfigScreen ctx={ctx} />);
    }
  },
});