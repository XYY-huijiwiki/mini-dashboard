export default {
  async fetch(res, env, ctx) {
    let url = new URL(res.url)
    if (url.pathname === '/login') {
      return login(res, env, ctx)
    } else if (url.pathname === '/callback') {
      return callback(res, env, ctx)
    } else {
      return new Response('Hello World!')
    }
  },
}

const CLIENT_ID = 'Ov23liXwSttWUEILSEqe'
const CLIENT_SECRET = 'fc399f6fadb618400b4b0079920cf1a824aec873'

// Function to handle login
export function login(req, env, ctx) {
  let url = new URL(`https://github.com/login/oauth/authorize`)
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', new URL(req.url).searchParams.get('redirect_uri'))
  url.searchParams.set('scope', new URL(req.url).searchParams.get('scope'))
  // redirect to GitHub login page
  return Response.redirect(url.href, 302)
}

// Function to handle callback
export async function callback(req, env, ctx) {
  let url = new URL(`https://github.com/login/oauth/access_token`)
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('client_secret', CLIENT_SECRET)
  url.searchParams.set('code', new URL(req.url).searchParams.get('code'))
  try {
    let tokenResponse = await fetch(url.href, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
    let token = await tokenResponse.json()
    let headers = new Headers()
    headers.set('Access-Control-Allow-Origin', 'https://xyy.huijiwiki.com')
    headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    let response = new Response(JSON.stringify(token), { headers })
    return response
  } catch {
    return new Response('Error', { status: 500 })
  }
}
