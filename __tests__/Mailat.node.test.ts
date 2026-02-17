import { Mailat } from '../nodes/Mailat/Mailat.node';

describe('Mailat Node', () => {
	let node: Mailat;

	beforeEach(() => {
		node = new Mailat();
	});

	it('should have correct node description', () => {
		expect(node.description.displayName).toBe('Mailat');
		expect(node.description.name).toBe('mailat');
		expect(node.description.version).toBe(1);
		expect(node.description.group).toContain('transform');
	});

	it('should require mailatApi credentials', () => {
		const creds = node.description.credentials;
		expect(creds).toBeDefined();
		expect(creds!.length).toBe(1);
		expect(creds![0].name).toBe('mailatApi');
		expect(creds![0].required).toBe(true);
	});

	it('should have all resources defined', () => {
		const resourceProp = node.description.properties.find(
			(p) => p.name === 'resource',
		);
		expect(resourceProp).toBeDefined();
		expect(resourceProp!.type).toBe('options');

		const resourceOptions = (resourceProp as any).options.map(
			(o: any) => o.value,
		);
		expect(resourceOptions).toContain('email');
		expect(resourceOptions).toContain('inbox');
		expect(resourceOptions).toContain('domain');
		expect(resourceOptions).toContain('identity');
	});

	it('should have email operations', () => {
		const operationProp = node.description.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('email'),
		);
		expect(operationProp).toBeDefined();

		const operationOptions = (operationProp as any).options.map(
			(o: any) => o.value,
		);
		expect(operationOptions).toContain('send');
		expect(operationOptions).toContain('sendBatch');
		expect(operationOptions).toContain('get');
		expect(operationOptions).toContain('cancel');
	});

	it('should have inbox operations', () => {
		const operationProp = node.description.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('inbox'),
		);
		expect(operationProp).toBeDefined();

		const operationOptions = (operationProp as any).options.map(
			(o: any) => o.value,
		);
		expect(operationOptions).toContain('list');
		expect(operationOptions).toContain('get');
		expect(operationOptions).toContain('getThread');
		expect(operationOptions).toContain('search');
		expect(operationOptions).toContain('reply');
		expect(operationOptions).toContain('markRead');
		expect(operationOptions).toContain('delete');
		expect(operationOptions).toContain('star');
	});

	it('should have domain operations', () => {
		const operationProp = node.description.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('domain'),
		);
		expect(operationProp).toBeDefined();

		const operationOptions = (operationProp as any).options.map(
			(o: any) => o.value,
		);
		expect(operationOptions).toContain('list');
		expect(operationOptions).toContain('get');
	});

	it('should have identity operations', () => {
		const operationProp = node.description.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('identity'),
		);
		expect(operationProp).toBeDefined();

		const operationOptions = (operationProp as any).options.map(
			(o: any) => o.value,
		);
		expect(operationOptions).toContain('list');
		expect(operationOptions).toContain('get');
	});

	it('should have an execute method', () => {
		expect(typeof node.execute).toBe('function');
	});

	it('should use correct icon', () => {
		expect(node.description.icon).toBe('file:mailat.svg');
	});
});
