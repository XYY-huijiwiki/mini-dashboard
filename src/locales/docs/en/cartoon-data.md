# Cartoon Episode Data

Cartoon episode data is stored separately from normal wiki pages for the convenience of batch editing. You can export cartoon episode data to a spreadsheet file, edit it, and then import it back to the wiki.

## Export Data

Select the cartoon series you want to export, and click the "Export" button to export the episode data of that series to a spreadsheet file.

## Import Data

Upload the modified spreadsheet file, and click the "Import" button to import the modified episode data to the wiki. Please note that:

- You need to log in with a bot account to import data.
- You need to write down the reason for the modification so that other editors can review it.

## Create Data

The easiest way is to export a cartoon episode data spreadsheet, modify it thoroughly, and then import it. You can also create a spreadsheet file manually, the format is as follows (using _Mighty Little Defenders_ as an example):

|                                                            | Page Name                                        | Title                      | ... |
| ---------------------------------------------------------- | ------------------------------------------------ | -------------------------- | --- |
| Data:The Fall of Goats' Village.json                       | The Fall of Goats' Village                       | The Fall of Goats' Village | ... |
| Data:Night of the Full Moon (Mighty Little Defenders).json | Night of the Full Moon (Mighty Little Defenders) | Night of the Full Moon     | ... |
| ...                                                        | ...                                              | ...                        | ... |

- Column 1: The name of the data page, in the format `Data:Page Name.json`. Note that `Page Name` may contain a disambiguation suffix, such as `Night of the Full Moon (Mighty Little Defenders)` refers to _Night of the Full Moon_ in _Mighty Little Defenders_, which will be used to distinguish episodes with the same name in other cartoon series.
- Column 2: The title of the wiki page, in the format `Page Name`.
- Column 3: The title of the episode, in the format `Title`. `Title` will not contain a disambiguation suffix.

## Settings

In [Settings](#/settings) you can choose the format of the data to import and export: XLSX or JSON. The default is XLSX format. You can also choose whether to export two data files, one for editing and one for backup. The default is no backup.
