import { MailatApi } from '../credentials/MailatApi.credentials';

describe('MailatApi Credentials', () => {
	let credentials: MailatApi;

	beforeEach(() => {
		credentials = new MailatApi();
	});

	it('should have correct name', () => {
		expect(credentials.name).toBe('mailatApi');
		expect(credentials.displayName).toBe('Mailat API');
	});

	it('should have baseUrl and apiKey properties', () => {
		const props = credentials.properties;
		expect(props.length).toBe(2);

		const baseUrl = props.find((p) => p.name === 'baseUrl');
		expect(baseUrl).toBeDefined();
		expect(baseUrl!.type).toBe('string');
		expect(baseUrl!.required).toBe(true);

		const apiKey = props.find((p) => p.name === 'apiKey');
		expect(apiKey).toBeDefined();
		expect(apiKey!.type).toBe('string');
		expect(apiKey!.required).toBe(true);
	});

	it('should use Bearer auth in Authorization header', () => {
		expect(credentials.authenticate).toBeDefined();
		expect(credentials.authenticate.type).toBe('generic');
		expect(
			(credentials.authenticate as any).properties.headers.Authorization,
		).toContain('Bearer');
	});

	it('should have credential test request', () => {
		expect(credentials.test).toBeDefined();
		expect(credentials.test!.request.url).toBe('/api/v1/domains');
		expect(credentials.test!.request.method).toBe('GET');
	});
});
