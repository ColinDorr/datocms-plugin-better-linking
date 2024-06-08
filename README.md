

# DatoCMS plugin: Better Linking
Welcome to the `Better Linking` plugin!
This DatoCMS plugin allows you to easily create a complex link field, containing different link types (records, assets, URLs, email links, or telephone numbers), custom styling, control over the link target, and the ability to override the link text with a custom value.

![](https://raw.githubusercontent.com/ColinDorr/datocms-plugin-better-linking/main/docs/cover.png)

## Installation
1. Install the plugin.
2. Go to the plugin and fill in the `Link Settings` and `Styling Settings`. These values will be your default link field values.
3. Create a new JSON field.
4. Fill in your preferred name, fieldId, and localization (leave all other fields empty for now).
5. Go to `Presentation` and choose the `Better Linking` appearance.
6. Optionally, go to the `Link Settings` and `Styling Settings` to override the default values.
7. Save the settings and the field.
8. You can now add this field to your site and start using it.

![cms plugin settings](https://raw.githubusercontent.com/ColinDorr/datocms-plugin-better-linking/main/docs/cms-settings.png)

## How it works
After installing the plugin and creating a new field (see installation instructions), you can start using the new `Better Linking` field. `Better Linking` allows you to set default settings in the plugin window and customize those settings for each field in the field appearance window. The settings of the plugin, field, and its content will be saved as a JSON object.
The JSON data will be hidden in the CMS/frontend and will be replaced with a user-friendly UI, which helps the user to easily create a link with customized data, giving them more control over their links.

![preview userfriendly link ui](https://raw.githubusercontent.com/ColinDorr/datocms-plugin-better-linking/main/docs/preview.png)

## Development
When using the plugin, a JSON data object will be generated with all the settings and filled-in content. This data will be hidden in the CMS/frontend but is accessible using GraphQL and the CDA Playground.
When querying the data of a `Better Linking` field, the whole JSON data object will be returned, containing all the data and selected options, allowing developers full access to the detailed information of the link.
This might look a bit intimidating at first glance, but don't be scared. In the JSON data object, you will also find an object called `formatted`. This object contains a minimized representation of all link data. In most cases, this data will be more than enough to handle your links.

![formatted response](https://raw.githubusercontent.com/ColinDorr/datocms-plugin-better-linking/main/docs/formatted-response.png)