import { MailatTrigger } from '../nodes/Mailat/MailatTrigger.node';

describe('MailatTrigger Node', () => {
	let node: MailatTrigger;

	beforeEach(() => {
		node = new MailatTrigger();
	});

	it('should have correct node description', () => {
		expect(node.description.displayName).toBe('Mailat Trigger');
		expect(node.description.name).toBe('mailatTrigger');
		expect(node.description.version).toBe(1);
		expect(node.description.group).toContain('trigger');
	});

	it('should require mailatApi credentials', () => {
		const creds = node.description.credentials;
		expect(creds).toBeDefined();
		expect(creds!.length).toBe(1);
		expect(creds![0].name).toBe('mailatApi');
		expect(creds![0].required).toBe(true);
	});

	it('should have webhook configuration', () => {
		expect(node.description.webhooks).toBeDefined();
		expect(node.description.webhooks!.length).toBe(1);
		expect(node.description.webhooks![0].httpMethod).toBe('POST');
		expect(node.description.webhooks![0].responseMode).toBe('onReceived');
	});

	it('should have events multiOptions property', () => {
		const eventsProp = node.description.properties.find(
			(p) => p.name === 'events',
		);
		expect(eventsProp).toBeDefined();
		expect(eventsProp!.type).toBe('multiOptions');
		expect(eventsProp!.required).toBe(true);
	});

	it('should support all 8 implemented event types', () => {
		const eventsProp = node.description.properties.find(
			(p) => p.name === 'events',
		);
		const options = (eventsProp as any).options;
		expect(options.length).toBe(8);

		const eventValues = options.map((o: any) => o.value);
		expect(eventValues).toContain('email_received');
		expect(eventValues).toContain('email_sent');
		expect(eventValues).toContain('contact_created');
		expect(eventValues).toContain('contact_updated');
		expect(eventValues).toContain('contact_deleted');
		expect(eventValues).toContain('campaign_sent');
		expect(eventValues).toContain('bounce_received');
		expect(eventValues).toContain('complaint_received');
	});

	it('should have webhook lifecycle methods', () => {
		expect(node.webhookMethods).toBeDefined();
		expect(node.webhookMethods.default).toBeDefined();
		expect(typeof node.webhookMethods.default.checkExists).toBe('function');
		expect(typeof node.webhookMethods.default.create).toBe('function');
		expect(typeof node.webhookMethods.default.delete).toBe('function');
	});

	it('should have a webhook handler method', () => {
		expect(typeof node.webhook).toBe('function');
	});

	it('should have no inputs (trigger node)', () => {
		expect(node.description.inputs).toEqual([]);
	});

	it('should use correct icon', () => {
		expect(node.description.icon).toBe('file:mailat.svg');
	});
});
