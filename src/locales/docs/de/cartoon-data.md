# Animationsfolgendaten

Animationsfolgendaten werden getrennt von normalen Wiki-Seiten gespeichert, um das Stapelbearbeiten zu erleichtern. Sie können Animationsfolgendaten in eine Tabellenkalkulationsdatei exportieren, bearbeiten und dann wieder in das Wiki importieren.

## Daten exportieren

Wählen Sie die Zeichentrickserie aus, die Sie exportieren möchten, und klicken Sie auf die Schaltfläche "Exportieren", um die Folgendaten dieser Serie in eine Tabellenkalkulationsdatei zu exportieren.

## Daten importieren

Laden Sie die geänderte Tabellenkalkulationsdatei hoch und klicken Sie auf die Schaltfläche "Importieren", um die geänderten Folgendaten in das Wiki zu importieren. Bitte beachten Sie, dass:

- Sie müssen sich mit einem Bot-Konto anmelden, um Daten zu importieren.
- Sie müssen den Grund für die Änderung aufschreiben, damit andere Redakteure sie überprüfen können.

## Daten erstellen

Am einfachsten ist es, eine Tabellenkalkulationsdatei für Animationsfolgen zu exportieren, sie gründlich zu bearbeiten und dann zu importieren. Sie können auch manuell eine Tabellenkalkulationsdatei erstellen, das Format ist wie folgt (am Beispiel von _Mighty Little Defenders_):

|                                                   | Seitenname                              | Titel                       | ... |
| ------------------------------------------------- | --------------------------------------- | --------------------------- | --- |
| Data:Der Fall von Goats' Village.json             | Der Fall von Goats' Village             | Der Fall von Goats' Village | ... |
| Data:Vollmondnacht (Mighty Little Defenders).json | Vollmondnacht (Mighty Little Defenders) | Vollmondnacht               | ... |
| ...                                               | ...                                     | ...                         | ... |

- Spalten 1: Der Name der Datenseite im Format `Data:Seitenname.json`. Beachten Sie, dass `Seitenname` einen Disambiguierungssuffix enthalten kann, z. B. bezieht sich `Vollmondnacht (Mighty Little Defenders)` auf _Vollmondnacht_ in _Mighty Little Defenders_, der verwendet wird, um Folgen mit demselben Namen in anderen Zeichentrickserien zu unterscheiden.
- Spalte 2: Der Titel der Wiki-Seite im Format `Seitenname`.
- Spalte 3: Der Titel der Folge im Format `Titel`. `Titel` enthält keinen Disambiguierungssuffix.

## Einstellungen

In [Einstellungen](#/settings) können Sie das Format der zu importierenden und zu exportierenden Daten auswählen: XLSX oder JSON. Die Standardeinstellung ist das XLSX-Format. Sie können auch auswählen, ob zwei Datendateien exportiert werden sollen, eine zum Bearbeiten und eine zum Sichern. Die Standardeinstellung ist kein Backup.
