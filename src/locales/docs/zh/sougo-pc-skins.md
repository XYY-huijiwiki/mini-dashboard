# 搜狗皮肤数据收集指南

本指南概述了从搜狗输入法的 API 和网站收集皮肤信息和图片的步骤。

## 0. 已知的一些 Passport ID

- 为及：`RQsCsu5nO-8YnGGsv2j1bZZ3z7ojyK99z8EAjTW0q20`
- 汉仪字库：`tRUVLCakzjqNaAZv7yxLjEy2jJTpbf9SNMQQVigjL2A`
- CYKON赛肯：`cYVEBSnv5WwOTi8immuv_Ey2jJTpbf9SNMQQVigjL2A`
- 麦拉风设计师：`lgb0KVFovPH7iWeIbUVmzmmO7iRJnvox5hqq_TRsJC0scj5vRajLs2_dPSYDlqGk`

## 1. 获取初始皮肤列表

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

- 将 `{passportId}` 替换为已知的 ID 之一
- 修改 `pageNo` 进行分页
- 从 `data.modules[].containers[]` 提取 `skinId`、`skinName` 和 `pic`
- 主图保存为 `搜狗输入法 ${skinName}0.{ext}`

## 2. 获取皮肤详情

对于每个 `skinId`：

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

- 提取：
  - `data.modules[0].container.data.price` 获取 `price`
  - `data.modules[0].container.data.desc` 获取 `desc`
  - `data.modules[0].container.data.authorInfo.authorName` 获取 `author`
  - `data.modules[0].container.data.pic[]` 获取额外图片
- 额外图片保存为 `搜狗输入法 ${skinName}{index}.{ext}`

## 3. 抓取发布时间

对于每个 `skinId`：

```bash
curl 'https://pinyin.sogou.com/skins/detail/view/info/{skinId}'
```

- 从 CSS 选择器提取时间：
  ```ts
  '#skin_info_content > div.skin_info_list > ul > li:nth-child(3) > div'
  ```
- 预期格式：`YYYY-MM-DD HH:mm:ss`

## 4. 生成 Wikitext

对于每个皮肤，生成：

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

## 注意事项

- 清理文件名：替换 `[<>:"/\\|?*]` 为 `_`
- 从 URL 确定文件扩展名：
  ```ts
  url.split('.').pop()?.split(/[#?]/)[0] || 'jpg'
  ```
- 所有图片保存在 `downloads/` 目录
- 最终输出文件为 `skins.wikitext`

此过程收集所有必要的信息和图片，并保持良好的组织，以便未来参考。
