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

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function LinkitEditor({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
        <Form onSubmit={() => console.log('onSubmit')}>
            <FieldGroup>
                <SelectField
                    name="type"
                    id="type"
                    label="Type"
                    hint="Select your prefferd link type"
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
                    hint="Select your prefferd styling"
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
            <FieldGroup>
                <TextField
                    name="link"
                    id="link"
                    label="Link"
                    value="https://wwww.nu.nl"
                    hint="Your link"
                    textInputProps={{ monospaced: true }}
                    onChange={(newValue) => console.log(newValue)}
                />
                <TextField
                    name="custom_text"
                    id="custom_text"
                    label="Custom text"
                    value=""
                    hint="Overwrite link text (optional)"
                    textInputProps={{ monospaced: true }}
                    onChange={(newValue) => console.log(newValue)}
                />
            </FieldGroup>
            <FieldGroup>
                <SwitchField
                    name="open_in_new_window"
                    id="open_in_new_window"
                    label="Open in new window"
                    hint="Choose if link needs to open in an new window"
                    value={true}
                    onChange={(newValue) => console.log(newValue)}
                />
            </FieldGroup>
        </Form>
    </Canvas>
  );
}
