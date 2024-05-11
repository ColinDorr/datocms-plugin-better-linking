import {
    RenderFieldExtensionCtx,
} from 'datocms-plugin-sdk';
import { 
    Canvas, 
    Form,
    FieldGroup,
    SelectField,
    SwitchField,
    TextField
} from 'datocms-react-ui';

import styles from './styles.module.css';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function LinkitEditor({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
        <Form className={ styles.linkit } onSubmit={() => console.log('onSubmit')}>
            <FieldGroup className={ styles.linkit__column }>
                <SelectField
                    name="type"
                    id="type"
                    label="Type"
                    value={{ label: 'Record', value: 'record' }}
                    selectInputProps={{
                    options: [
                        { label: 'Record', value: 'record' },
                        { label: 'URL', value: 'url' },
                        { label: 'Telephone', value: 'tel' },
                        { label: 'Emailadress', value: 'email' },
                    ],
                    }}
                    onChange={(newValue) => console.log(newValue)}
                />
                <SelectField
                    name="styling"
                    id="styling"
                    label="Styling"
                    value={{ label: 'Default', value: 'default' }}
                    selectInputProps={{
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Tertiary', value: 'tertiary' },
                        { label: 'Quaternary', value: 'quaternary' },
                    ],
                    }}
                    onChange={(newValue) => console.log(newValue)}
                />
            </FieldGroup>
            <FieldGroup className={ styles.linkit__column }>
                <TextField
                    name="link"
                    id="link"
                    label="Link"
                    value="https://wwww.nu.nl"
                    textInputProps={{ monospaced: true }}
                    onChange={(newValue) => console.log(newValue)}
                />
                <TextField
                    name="custom_text"
                    id="custom_text"
                    label="Custom text (Optional)"
                    value=""
                    textInputProps={{ monospaced: true }}
                    onChange={(newValue) => console.log(newValue)}
                />
            </FieldGroup>
            <FieldGroup className={ styles.linkit__column_top }>
                <SwitchField
                    name="open_in_new_window"
                    id="open_in_new_window"
                    label="Open in new window"
                    value={true}
                    onChange={(newValue) => console.log(newValue)}
                />
            </FieldGroup>
        </Form>
    </Canvas>
  );
}
