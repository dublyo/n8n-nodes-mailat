import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Make an authenticated API request to the Mailat instance.
 * Automatically extracts the `data` field from Mailat's `{ code, message, data }` wrapper.
 */
export async function mailatApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: object,
	query?: Record<string, string | number | boolean>,
): Promise<any> {
	const credentials = await this.getCredentials('mailatApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/api/v1${endpoint}`,
		json: true,
		body,
		qs: query,
	};

	if (!body || Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'mailatApi',
			options,
		);

		// Mailat wraps responses in { code, message, data }
		// Return the data field if present, otherwise the full response
		if (response && typeof response === 'object' && 'data' in response) {
			return response.data;
		}

		return response;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error, {
			message: error.message,
		});
	}
}

/**
 * Fetch all pages for a paginated endpoint.
 * Mailat uses `page` / `pageSize` params and returns `hasMore` or `totalPages`.
 */
export async function mailatApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	dataKey: string,
	query: Record<string, string | number | boolean> = {},
): Promise<any[]> {
	const returnData: any[] = [];
	let page = 1;
	const pageSize = 100;

	let responseData: any;
	do {
		responseData = await mailatApiRequest.call(this, method, endpoint, undefined, {
			...query,
			page,
			pageSize,
		});

		const items = responseData?.[dataKey];
		if (Array.isArray(items)) {
			returnData.push(...items);
		} else if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			break;
		}

		page++;
	} while (responseData?.hasMore === true);

	return returnData;
}
