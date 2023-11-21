# Destroy and Rescue

Batch delete or restore pages.

## Search and Destroy (batch delete pages)

Select a page selection method, click the "Search" button, and all pages that meet the conditions will be listed. There are two ways to select pages:

- **Text document (.txt)**: One page title per line in the text document, for example:

  ```
  Weslie
  File:Weslie.png
  Data:Weslie.json
  ```

- **Microsoft Excel Worksheet (.xlsx)**: The first column of the worksheet is the page title (including the first row), for example:

  | Weslie           | The second column will not be deleted           |
  | ---------------- | ----------------------------------------------- |
  | File:Weslie.png  | File:The second column will not be deleted.png  |
  | Data:Weslie.json | Data:The second column will not be deleted.json |

After selecting the pages, fill in the reason for deletion, and then click the "Destroy" button to delete all the pages listed.

## Search and Rescue (batch restore pages)

Select a page selection method, click the "Search" button, and all pages that meet the conditions will be listed. The page selection method is the same as the _Search and Destroy_.

After selecting the pages, fill in the reason for recovery, and then click the "Rescue" button to restore all the pages listed.
