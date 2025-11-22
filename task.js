// script.js
const http = require('http')
const { URL } = require('url')

const API_URL = 'https://test.icorp.uz/interview.php'
const CALLBACK_PORT = 5050
const CALLBACK_URL = `https://dakota-renounceable-farcically.ngrok-free.dev/callback` // here should be your ngrok link

console.log('Starting callback server...')

// STEP 1: Start local HTTP server to receive second part of code
let secondPart = null

const server = http.createServer((req, res) => {
	if (req.method === 'POST' && req.url === '/callback') {
		let body = ''

		req.on('data', (chunk) => {
			body += chunk
		})
		req.on('end', () => {
			try {
				const data = JSON.parse(body)
				secondPart = data.part2
				console.log('\n[✔] Received second part:', secondPart)
			} catch (e) {
				console.error('[!] Invalid JSON in callback:', body)
			}

			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify({ status: 'ok' }))
		})
	} else {
		res.writeHead(404)
		res.end()
	}
})

server.listen(CALLBACK_PORT, async () => {
	console.log(`[✔] Callback server running at ${CALLBACK_URL}`)

	// STEP 2: Make POST request to get first part of code
	console.log('\nSending POST request to API...')

	const payload = {
		msg: 'Hello test API!',
		url: CALLBACK_URL,
	}

	const postRes = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	const postData = await postRes.json()
	const firstPart = postData.part1

	console.log('[✔] First part received:', firstPart)
	console.log('[…] Waiting for second part...')

	// STEP 3: Wait for second part to arrive via callback
	await waitForSecondPart()

	// STEP 4: Concatenate code
	const fullCode = firstPart + secondPart
	console.log('\n[✔] Combined code:', fullCode)

	// STEP 5: Send GET with full code
	console.log('\nSending GET request with combined code...')

	const finalUrl = new URL(API_URL)
	finalUrl.searchParams.set('code', fullCode)

	const getRes = await fetch(finalUrl)
	const finalData = await getRes.json()
  console.log(finalData)
	console.log('\n===== FINAL RESULT =====')
	console.log('Message:', finalData)
	console.log('Combined Code:', fullCode)
	console.log('========================\n')

	server.close()
})

// Utility: wait for second part
function waitForSecondPart() {
	return new Promise((resolve) => {
		const check = setInterval(() => {
			if (secondPart !== null) {
				clearInterval(check)
				resolve()
			}
		}, 200)
	})
}
