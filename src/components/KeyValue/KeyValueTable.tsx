import React, { useState, MouseEvent } from 'react';
import KeyValuePair from './KeyValuePair';
import { Form, Button } from 'datocms-react-ui';
import Log from "./../../utils/develop";


const KeyValueTable = (
  { ctx, configType }: any,
) => {
  const ctxParameters = ctx.plugin.attributes.parameters as any;
  const stylingTypes = ctxParameters?.field_settings?.stylingOptions 
  || ctxParameters?.plugin_settings?.stylingOptions 
  || [];

  const [keyValueList, setKeyValueList] = useState<{ key: string; value: string; }[]>(stylingTypes);

  const updateKeyValueList = (value: { key: string; value: string; }[]) => {
    setKeyValueList(value);
    const updatedParameters = {
      ...ctxParameters,
      [configType]: {
        ...(ctxParameters?.[configType] || {}),
        stylingOptions: value || []
      }
    };
    ctx.updatePluginParameters(updatedParameters);
    Log(updatedParameters)
  };

  const handleKeyChange = (key: string, index: number) => {
    const updatedKeyValueList = [...keyValueList];
    updatedKeyValueList[index].key = key;
    updateKeyValueList(updatedKeyValueList);
  };

  const handleValueChange = (value: string, index: number) => {
    const updatedKeyValueList = [...keyValueList];
    updatedKeyValueList[index].value = value;
    updateKeyValueList(updatedKeyValueList);
  };

  const deleteItem = (index: number) => {
    const updatedKeyValueList = [...keyValueList];
    updatedKeyValueList.splice(index, 1);
    updateKeyValueList(updatedKeyValueList);
  };

  const handleAddItem = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!containsDuplicateKeys()) {
      const updatedKeyValueList = [...keyValueList, { key: '', value: '' }];
      updateKeyValueList(updatedKeyValueList);
    }
  };

  const duplicateKeysArray = () => {
    const duplicateKeys: string[] = [];
    const keysSet = new Set<string>();
    for (const item of keyValueList) {
      if (keysSet.has(item.key)) {
        duplicateKeys.push(item.key);
      }
      keysSet.add(item.key);
    }
    return duplicateKeys;
  };

  const containsDuplicateKeys = () => {
    return duplicateKeysArray().length > 0;
  };

  return (
    <>
      <Form>
        <ul>
          {keyValueList.map((item, index) => (
            <KeyValuePair
              key={item.key}
              id={item.key}
              keyPair={item.key}
              valuePair={item.value}
              onValueChange={(value: string) => handleValueChange(value, index)}
              onKeyChange={(value: string) => handleKeyChange(value, index)}
              onDeleteKey={() => deleteItem(index)}
              isExisting={duplicateKeysArray().includes(item.key)}
              isRequired={true}
            />
          ))}
        </ul>
        <Button
          buttonSize="xs"
          leftIcon={<svg aria-hidden="true" viewBox="0 0 448 512" width="1em" height="1em">
            <path
              d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
              fill="currentColor"
            ></path>
          </svg>}
          disabled={containsDuplicateKeys()}
          onClick={handleAddItem}
        >
          <span>Add item</span>
        </Button>
      </Form>

      {containsDuplicateKeys() && (
        <p>
          All keys need to be unique. Saving this can result in data loss.
        </p>
      )}
    </>
  );
};

export default KeyValueTable;
