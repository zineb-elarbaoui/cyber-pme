globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/AppShell-ZaQLulEp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147b-daWbizhLylG+j+I91UgzzmAcREc\"",
		"mtime": "2026-08-07T10:52:38.184Z",
		"size": 5243,
		"path": "../public/assets/AppShell-ZaQLulEp.js"
	},
	"/assets/arrow-left-D5efLaLs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-XJxBRNJMUtBbrQxxy5gOphzTSrk\"",
		"mtime": "2026-08-07T10:52:38.186Z",
		"size": 157,
		"path": "../public/assets/arrow-left-D5efLaLs.js"
	},
	"/assets/arrow-right-BwCJE6Ed.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-zsA1NgXEq67wTNOG16PO5o1hRbE\"",
		"mtime": "2026-08-07T10:52:38.187Z",
		"size": 157,
		"path": "../public/assets/arrow-right-BwCJE6Ed.js"
	},
	"/assets/assessment-COPej3bO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1687-Yg+5TBincBUWV3UeiDKyNuGPEL0\"",
		"mtime": "2026-08-07T10:52:38.188Z",
		"size": 5767,
		"path": "../public/assets/assessment-COPej3bO.js"
	},
	"/assets/circle-check-4vJZt7_6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa-/zKsSJECnAhtsy2p9mgxaWxb4sc\"",
		"mtime": "2026-08-07T10:52:38.189Z",
		"size": 170,
		"path": "../public/assets/circle-check-4vJZt7_6.js"
	},
	"/assets/Badges-DwRW0i71.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65e-T/UDWENSPfDO0ijZMzhpq40sYjw\"",
		"mtime": "2026-08-07T10:52:38.185Z",
		"size": 1630,
		"path": "../public/assets/Badges-DwRW0i71.js"
	},
	"/assets/clock-O2fy0fNS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1-4mVYqqL6+ryczJyjJ9mKBVdVkuQ\"",
		"mtime": "2026-08-07T10:52:38.190Z",
		"size": 161,
		"path": "../public/assets/clock-O2fy0fNS.js"
	},
	"/assets/history-BU07VdJj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c7a9-AGPgQngZNfUYvnHh03+7FTOJa3c\"",
		"mtime": "2026-08-07T10:52:38.193Z",
		"size": 51113,
		"path": "../public/assets/history-BU07VdJj.js"
	},
	"/assets/generateCategoricalChart-BTZLDoMc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"548c7-A83+txdratvLZXwTMI0SHxCZoQc\"",
		"mtime": "2026-08-07T10:52:38.191Z",
		"size": 346311,
		"path": "../public/assets/generateCategoricalChart-BTZLDoMc.js"
	},
	"/assets/profile-2EmXVFoD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"264c-sNZts8jB0BkekGGaNcErgqE9884\"",
		"mtime": "2026-08-07T10:52:38.194Z",
		"size": 9804,
		"path": "../public/assets/profile-2EmXVFoD.js"
	},
	"/assets/results-f3Q53W9q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a656-eOK9uQ8rAlvRoPYUPHUuvb9Y+RI\"",
		"mtime": "2026-08-07T10:52:38.197Z",
		"size": 42582,
		"path": "../public/assets/results-f3Q53W9q.js"
	},
	"/assets/recommendation._id-vyPRu7mi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"210c-EcEg2Jjcrs5LUg7KqcdqLjdPvQE\"",
		"mtime": "2026-08-07T10:52:38.196Z",
		"size": 8460,
		"path": "../public/assets/recommendation._id-vyPRu7mi.js"
	},
	"/assets/index-vv0okfGu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56418-HvzGFfuYfqdtHzi2LNzWl7FRBvE\"",
		"mtime": "2026-08-07T10:52:38.183Z",
		"size": 353304,
		"path": "../public/assets/index-vv0okfGu.js"
	},
	"/assets/routers-DVoui1Ed.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b3e-E4x0fXoVaAvBWQNpAh9ucmozpss\"",
		"mtime": "2026-08-07T10:52:38.198Z",
		"size": 11070,
		"path": "../public/assets/routers-DVoui1Ed.js"
	},
	"/assets/shield-check-C1hm4zgx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138-fDAOP3lc++Pzy0H+xZCIrrOd2zs\"",
		"mtime": "2026-08-07T10:52:38.199Z",
		"size": 312,
		"path": "../public/assets/shield-check-C1hm4zgx.js"
	},
	"/assets/styles-g4kxM_Qj.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"157ce-fevu62zvy1TxGDTJvYQeKlCIU5w\"",
		"mtime": "2026-08-07T10:52:38.200Z",
		"size": 88014,
		"path": "../public/assets/styles-g4kxM_Qj.css"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_0g9PDA = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_0g9PDA
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
