import { i18n } from '@/main'

let { t } = i18n.global

async function querySQL(query: string, token?: string): Promise<any> {
  try {
    let url = new URL('https://sql-query.karsten-zhou.workers.dev/')
    url.searchParams.set('query', query)
    token && url.searchParams.set('token', token)
    let response = await fetch(url)
    let data = await response.json()

    // error handling
    if (data.success === false) {
      console.log(`===== Error =====`, `\nSQL: ${query}`, data)
      throw new Error(data.errors[0].message)
    }

    return data[0].results
  } catch (error) {
    $notification.error({
      title: t('general.error'),
      content: `${error}`,
      meta: new Date().toLocaleString(),
    })
    console.log(error)
    throw new Error(`${error}`)
  }
}

export default querySQL
