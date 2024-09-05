import Anthropic from '@anthropic-ai/sdk'

const corsHeaders = {
	'Access-Control-Allow-Origin': 'https://thedescriber.pages.dev',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
	async fetch(request, env, ctx) {
		const anthropic = new Anthropic({
			apiKey: env.ANTHROPIC_API_KEY,
		})

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 200,
				headers: corsHeaders
			})
		}

		try {
			const messages = await request.json()
			const msg = await anthropic.messages.create({
				model: 'claude-3-5-sonnet-20240620',
				max_tokens: 300,
				system: 'You are an image describer. When asked to describe an image, provide an accurate description.',
				messages: messages
			})
			return new Response(JSON.stringify(msg.content[0].text), { headers: corsHeaders })
		} catch (error) {
			return new Response(JSON.stringify({ error: error.error.error.message }), { status: 500, headers: corsHeaders })
		}
	},
}
