import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

export type QiscusCredentials = {
	appId: string;
	appSecret: string;
	baseUrl: string;
	sdkBaseUrl: string;
};

export async function qiscusOmnichannelApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	credentials: QiscusCredentials,
	method: IHttpRequestMethods,
	path: string,
	body: IDataObject = {},
	query: IDataObject = {},
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		method,
		qs: query,
		url: `${credentials.baseUrl}/${path}`,
		body,
		json: true,
		headers: {
			'Qiscus-App-Id': credentials.appId,
			'Qiscus-Secret-Key': credentials.appSecret,
		},
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'qiscusCredentialsApi', options);
}

export async function qiscusOmnichannelPublicApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	credentials: QiscusCredentials,
	method: IHttpRequestMethods,
	path: string,
	body: IDataObject = {},
	query: IDataObject = {},
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		method,
		qs: query,
		url: `${credentials.baseUrl}/${path}`,
		body,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	return await this.helpers.httpRequest.call(this, options);
}

export async function qiscusOmnichannelAdminApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	credentials: QiscusCredentials,
	adminToken: string,
	method: IHttpRequestMethods,
	path: string,
	body: IDataObject = {},
	query: IDataObject = {},
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		method,
		qs: query,
		url: `${credentials.baseUrl}/${path}`,
		body,
		json: true,
		headers: {
			Authorization: adminToken,
			'Qiscus-App-Id': credentials.appId,
		},
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'qiscusCredentialsApi', options);
}

export async function qiscusSDKApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	credentials: QiscusCredentials,
	method: IHttpRequestMethods,
	path: string,
	body: IDataObject = {},
	query: IDataObject = {},
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		method,
		qs: query,
		url: `${credentials.sdkBaseUrl}/${path}`,
		body,
		json: true,
		headers: {
			QISCUS_SDK_APP_ID: credentials.appId,
			QISCUS_SDK_SECRET: credentials.appSecret,
		},
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'qiscusCredentialsApi', options);
}
