# Sogou Skin Daten-Sammlungsanleitung

Diese Anleitung beschreibt die Schritte zur Erfassung von Hautinformationen und Bildern aus der Sogou-Eingabemethoden-API und der Website.

## 0. Einige bekannte Passport-IDs

- 为及：`RQsCsu5nO-8YnGGsv2j1bZZ3z7ojyK99z8EAjTW0q20`
- 汉仪字库：`tRUVLCakzjqNaAZv7yxLjEy2jJTpbf9SNMQQVigjL2A`
- CYKON赛肯：`cYVEBSnv5WwOTi8immuv_Ey2jJTpbf9SNMQQVigjL2A`
- 麦拉风设计师：`lgb0KVFovPH7iWeIbUVmzmmO7iRJnvox5hqq_TRsJC0scj5vRajLs2_dPSYDlqGk`

## 1. Erste Skin-Liste abrufen

```bash
curl --location 'https://h5api.sginput.qq.com/v1/page' \
--header 'X-Ime-Server: pc.store.ime.local' \
--header 'Content-Type: application/json' \
--data '{
    "pageId": "PAGE_AUTHORDETAIL_FEED_V1",
    "pageNo": 1,
    "passportId": "{passportId}",
    "fe_version": 3,
    "front_pkg_version": "2024123000",
    "h": "0152C8E55F732C710B09120EB4ED2EF9",
    "r": "1111_sogou_pinyin_guanwang_15.2b",
    "v": "15.2.0.1758",
}'
```

- Ersetze `{passportId}` mit einer der bekannten IDs
- Ändere `pageNo` für die Paginierung
- Extrahiere `skinId`, `skinName` und `pic` aus jedem Container in `data.modules[].containers[]`
- Speichere das Hauptbild als `搜狗输入法 ${skinName}0.{ext}`

## 2. Skin-Details abrufen

Für jede `skinId`:

```bash
curl --location 'https://h5api.sginput.qq.com/v1/page' \
--header 'X-Ime-Server: pc.store.ime.local' \
--header 'Content-Type: application/json' \
--data '{
    "pageId": "PAGE_SKINDETAIL_FIX_V1",
    "skinId":"{skinId}",
    "front_pkg_version": "2024123000"
}'
```

- Extrahiere:
  - `price` aus `data.modules[0].container.data.price`
  - `desc` aus `data.modules[0].container.data.desc`
  - `author` aus `data.modules[0].container.data.authorInfo.authorName`
  - Zusätzliche Bilder aus `data.modules[0].container.data.pic[]`
- Speichere zusätzliche Bilder als `搜狗输入法 ${skinName}{index}.{ext}`

## 3. Veröffentlichungszeit auslesen

Für jede `skinId`:

```bash
curl 'https://pinyin.sogou.com/skins/detail/view/info/{skinId}'
```

- Extrahiere die Zeit aus dem CSS-Selektor:
  ```ts
  '#skin_info_content > div.skin_info_list > ul > li:nth-child(3) > div'
  ```
- Erwartetes Format: `YYYY-MM-DD HH:mm:ss`

## 4. Wikitext generieren

Für jede Skin erstelle:

```markdown
===${skinName}===

- {{mi|schedule}} Datum: {{#time:Y年m月d日|${time}}}
- {{mi|account_circle}} Autor: [[${author}]]
- {{mi|currency_yen}} Preis: ${price}元
- {{mi|article}} Beschreibung: ${desc}
- {{mi|link}} Link: [https://pinyin.sogou.com/skins/detail/view/info/${skinId} ${skinName}]

<gallery>
搜狗输入法 ${skinName}0.{ext}
搜狗输入法 ${skinName}1.{ext}
...
</gallery>
```

## Hinweise

- Dateinamen bereinigen: Ersetze `[<>:"/\\|?*]` durch `_`
- Bestimme die Dateierweiterung aus der URL:
  ```ts
  url.split('.').pop()?.split(/[#?]/)[0] || 'jpg'
  ```
- Speichere alle Bilder im Verzeichnis `downloads/`
- Endgültige Ausgabe in `skins.wikitext`

Dieser Prozess sammelt alle notwendigen Informationen und Bilder und sorgt für eine ordnungsgemäße Organisation für zukünftige Referenzen.
