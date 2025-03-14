# Sogou Skin Data Collection Guide

This guide outlines the steps to collect skin information and images from Sogou Input Method's API and website.

## 0. Some Known Passport IDs

- 为及：`RQsCsu5nO-8YnGGsv2j1bZZ3z7ojyK99z8EAjTW0q20`
- 汉仪字库：`tRUVLCakzjqNaAZv7yxLjEy2jJTpbf9SNMQQVigjL2A`
- CYKON赛肯：`cYVEBSnv5WwOTi8immuv_Ey2jJTpbf9SNMQQVigjL2A`
- 麦拉风设计师：`lgb0KVFovPH7iWeIbUVmzmmO7iRJnvox5hqq_TRsJC0scj5vRajLs2_dPSYDlqGk`

## 1. Fetch Initial Skin List

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

- Replace `{passportId}` with one of the known IDs
- Change `pageNo` for pagination
- Extract `skinId`, `skinName`, and `pic` from each container in `data.modules[].containers[]`
- Save main image as `搜狗输入法 ${skinName}0.{ext}`

## 2. Fetch Skin Details

For each skinId:

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

- Extract:
  - `price` from `data.modules[0].container.data.price`
  - `desc` from `data.modules[0].container.data.desc`
  - `author` from `data.modules[0].container.data.authorInfo.authorName`
  - Additional images from `data.modules[0].container.data.pic[]`
- Save additional images as `搜狗输入法 ${skinName}{index}.{ext}`

## 3. Scrape Publish Time

For each skinId:

```bash
curl 'https://pinyin.sogou.com/skins/detail/view/info/{skinId}'
```

- Extract time from CSS selector:
  ```ts
  '#skin_info_content > div.skin_info_list > ul > li:nth-child(3) > div'
  ```
- Expected format: `YYYY-MM-DD HH:mm:ss`

## 4. Generate Wikitext

For each skin, generate:

```markdown
===${skinName}===

- {{mi|schedule}} 日期：{{#time:Y年m月d日|${time}}}
- {{mi|account_circle}} 作者：[[${author}]]
- {{mi|currency_yen}} 定价：${price}元
- {{mi|article}} 描述：${desc}
- {{mi|link}} 链接：[https://pinyin.sogou.com/skins/detail/view/info/${skinId} ${skinName}]

<gallery>
搜狗输入法 ${skinName}0.{ext}
搜狗输入法 ${skinName}1.{ext}
...
</gallery>
```

## Notes

- Sanitize filenames: replace `[<>:"/\\|?*]` with `_`
- Determine file extension from URL:
  ```ts
  url.split('.').pop()?.split(/[#?]/)[0] || 'jpg'
  ```
- Save all images in `downloads/` directory
- Final output in `skins.wikitext`

This process collects all necessary information and images while maintaining proper organization for future reference.
