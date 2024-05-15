import React, { useState, MouseEvent } from 'react';
import { Form, Button } from 'datocms-react-ui';
import Log from "./../../utils/develop";
import KeyValuePair from '../KeyValue/KeyValuePair';

type PropTypes = { ctx: any; configType: string; };
type KeyValuePairType = { id: number; label: string; value: string; };
type StylingType = { label: string; value: string; };

const StylingSettings: React.FC<PropTypes> = ({ ctx, configType }) => {
  const ctxParameters = ctx.plugin.attributes.parameters as any;

    // Function to get default value based on priority
    const getDefaultValue = (key: string, fallback: any) => {
        if (ctxParameters?.["field_settings"]?.[key] !== null) {
        return ctxParameters["field_settings"][key];
        } else if (ctxParameters?.["plugin_settings"]?.[key] !== null) {
        return ctxParameters["plugin_settings"][key];
        }
        return fallback;
    };

    const stylingOptions = getDefaultValue("stylingOptions", []) as StylingType[] ?? [];

    const [keyValueList, setKeyValueList] = useState<KeyValuePairType[]>(
        stylingOptions.map((i, index) => ({
        id: index,
        label: i.label,
        value: i.value,
        }))
    );

    Log({ keyValueList });

    const updateCtx = () => {
        // Create stylingOptions from keyValueList
        const stylingOptions: { label: string, value: string }[] = [];
        keyValueList.forEach((item: KeyValuePairType) => {
            stylingOptions.push({
            label: item.label,
            value: item.value,
            });
        });

        const updatedParameters = {
          ...ctxParameters,
          [configType]: {
            ...(ctxParameters?.[configType] || {}),
            stylingOptions: stylingOptions || []
          }
        };
        ctx.updatePluginParameters(updatedParameters);
        Log(updatedParameters);
    }

    const updateKeyValueList = (value: KeyValuePairType[]) => {
        const sortedArray = value.sort((a, b) => {
            if (a.label < b.label) { return -1; }
            if (a.label > b.label) { return 1;  }
            return 0;
        });
        setKeyValueList(sortedArray);
    };

    const handleLabelChange = (id: number, label: string) => {
      const updatedKeyValueList = [...keyValueList];
      updatedKeyValueList[id].label = label;
      updateKeyValueList(updatedKeyValueList);
    };

    const handleValueChange = (id: number, value: string) => {
      const updatedKeyValueList = [...keyValueList];
      updatedKeyValueList[id].value = value;
      updateKeyValueList(updatedKeyValueList);
    };

    const deleteItem = (id: number) => {
      const updatedKeyValueList = [...keyValueList];
      updatedKeyValueList.splice(id, 1);
      updateKeyValueList(updatedKeyValueList);
    };

    const duplicateArrays = () => {
        const duplicateArray: string[] = [];
        const duplicatesSet = new Set<string>();
        for (const item of keyValueList) {
          const itemString = `${item.id}-${item.label}-${item.value}`;
          if (duplicatesSet.has(itemString)) {
            duplicateArray.push(itemString);
          }
          duplicatesSet.add(itemString);
        }
        return duplicateArray;
      };

    const containsDuplicates = () => {
        return duplicateArrays().length > 0;
    };

    const handleAddItem = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!containsDuplicates()) {
            const currentTimestamp = Date.now();
            const newList: KeyValuePairType[] = [
                ...keyValueList,
                { id: currentTimestamp, label: `test ${currentTimestamp}`, value: "" }
            ];
            updateKeyValueList(newList);
        }
    };

    return (
        <>
        <Form>
            <ul>
            {keyValueList.map((item, index) => (
                <p>test</p>
            ))}
            </ul>

            <Button
            buttonSize="xs"
            leftIcon={
                <svg aria-hidden="true" viewBox="0 0 448 512" width="1em" height="1em">
                <path
                    d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                    fill="currentColor"
                ></path>
                </svg>
            }
            disabled={containsDuplicates()}
            onClick={handleAddItem}
            >
            <span>Add item</span>
            </Button>
        </Form>

        {containsDuplicates() && (
            <p>
            All keys need to be unique. Saving this can result in data loss.
            </p>
        )}
        </>
    );
};

export default StylingSettings;
