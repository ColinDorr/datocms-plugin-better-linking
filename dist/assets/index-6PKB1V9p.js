var e = Object.create,
	t = Object.defineProperty,
	n = Object.getOwnPropertyDescriptor,
	r = Object.getOwnPropertyNames,
	i = Object.getPrototypeOf,
	a = Object.prototype.hasOwnProperty,
	o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
	s = (e, i, o, s) => {
		if ((i && typeof i == `object`) || typeof i == `function`)
			for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
				((d = c[l]),
					!a.call(e, d) &&
						d !== o &&
						t(e, d, {
							get: ((e) => i[e]).bind(null, d),
							enumerable: !(s = n(i, d)) || s.enumerable,
						}));
		return e;
	},
	c = (n, r, a) => (
		(a = n == null ? {} : e(i(n))),
		s(
			r || !n || !n.__esModule
				? t(a, `default`, { value: n, enumerable: !0 })
				: a,
			n,
		)
	);
(function () {
	let e = document.createElement(`link`).relList;
	if (e && e.supports && e.supports(`modulepreload`)) return;
	for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
	new MutationObserver((e) => {
		for (let t of e)
			if (t.type === `childList`)
				for (let e of t.addedNodes)
					e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
	}).observe(document, { childList: !0, subtree: !0 });
	function t(e) {
		let t = {};
		return (
			e.integrity && (t.integrity = e.integrity),
			e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
			e.crossOrigin === `use-credentials`
				? (t.credentials = `include`)
				: e.crossOrigin === `anonymous`
					? (t.credentials = `omit`)
					: (t.credentials = `same-origin`),
			t
		);
	}
	function n(e) {
		if (e.ep) return;
		e.ep = !0;
		let n = t(e);
		fetch(e.href, n);
	}
})();
var l = o((e) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.DATA_CLONE_ERROR =
				e.MESSAGE =
				e.REJECTED =
				e.FULFILLED =
				e.REPLY =
				e.CALL =
				e.HANDSHAKE_REPLY =
				e.HANDSHAKE =
					void 0),
			(e.HANDSHAKE = `handshake`),
			(e.HANDSHAKE_REPLY = `handshake-reply`),
			(e.CALL = `call`),
			(e.REPLY = `reply`),
			(e.FULFILLED = `fulfilled`),
			(e.REJECTED = `rejected`),
			(e.MESSAGE = `message`),
			(e.DATA_CLONE_ERROR = `DataCloneError`));
	}),
	u = o((e) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.ERR_NO_IFRAME_SRC =
				e.ERR_NOT_IN_IFRAME =
				e.ERR_CONNECTION_TIMEOUT =
				e.ERR_CONNECTION_DESTROYED =
					void 0),
			(e.ERR_CONNECTION_DESTROYED = `ConnectionDestroyed`),
			(e.ERR_CONNECTION_TIMEOUT = `ConnectionTimeout`),
			(e.ERR_NOT_IN_IFRAME = `NotInIframe`),
			(e.ERR_NO_IFRAME_SRC = `NoIframeSrc`));
	}),
	d = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0),
			(e.default = () => {
				let e = [],
					t = !1;
				return {
					destroy() {
						((t = !0),
							e.forEach((e) => {
								e();
							}));
					},
					onDestroy(n) {
						t ? n() : e.push(n);
					},
				};
			}),
			(t.exports = e.default));
	}),
	f = o((e) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.deserializeError = e.serializeError = void 0),
			(e.serializeError = (e) => ({
				name: e.name,
				message: e.message,
				stack: e.stack,
			})),
			(e.deserializeError = (e) => {
				let t = Error();
				return (Object.keys(e).forEach((n) => (t[n] = e[n])), t);
			}));
	}),
	p = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0));
		var n = l(),
			r = f();
		((e.default = (e, t, i) => {
			let a = e.localName,
				o = e.local,
				s = e.remote,
				c = e.originForSending,
				l = e.originForReceiving,
				u = !1;
			i(`${a}: Connecting call receiver`);
			let d = (e) => {
				if (e.source !== s || e.data.penpal !== n.CALL) return;
				if (e.origin !== l) {
					i(
						`${a} received message from origin ${e.origin} which did not match expected origin ${l}`,
					);
					return;
				}
				let o = e.data,
					d = o.methodName,
					f = o.args,
					p = o.id;
				i(`${a}: Received ${d}() call`);
				let m = (e) => (t) => {
					if ((i(`${a}: Sending ${d}() reply`), u)) {
						i(
							`${a}: Unable to send ${d}() reply due to destroyed connection`,
						);
						return;
					}
					let o = {
						penpal: n.REPLY,
						id: p,
						resolution: e,
						returnValue: t,
					};
					e === n.REJECTED &&
						t instanceof Error &&
						((o.returnValue = (0, r.serializeError)(t)),
						(o.returnValueIsError = !0));
					try {
						s.postMessage(o, c);
					} catch (e) {
						throw (
							e.name === n.DATA_CLONE_ERROR &&
								s.postMessage(
									{
										penpal: n.REPLY,
										id: p,
										resolution: n.REJECTED,
										returnValue: (0, r.serializeError)(e),
										returnValueIsError: !0,
									},
									c,
								),
							e
						);
					}
				};
				new Promise((e) => e(t[d].apply(t, f))).then(
					m(n.FULFILLED),
					m(n.REJECTED),
				);
			};
			return (
				o.addEventListener(n.MESSAGE, d),
				() => {
					((u = !0), o.removeEventListener(n.MESSAGE, d));
				}
			);
		}),
			(t.exports = e.default));
	}),
	m = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0));
		var n = 0;
		((e.default = () => ++n), (t.exports = e.default));
	}),
	h = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0));
		var n = l(),
			r = u(),
			i = o(m()),
			a = f();
		function o(e) {
			return e && e.__esModule ? e : { default: e };
		}
		((e.default = (e, t, o, s, c) => {
			let l = t.localName,
				u = t.local,
				d = t.remote,
				f = t.originForSending,
				p = t.originForReceiving,
				m = !1;
			c(`${l}: Connecting call sender`);
			let h = (e) =>
				function () {
					var t = [...arguments];
					c(`${l}: Sending ${e}() call`);
					let o;
					try {
						d.closed && (o = !0);
					} catch {
						o = !0;
					}
					if ((o && s(), m)) {
						let t = Error(
							`Unable to send ${e}() call due to destroyed connection`,
						);
						throw ((t.code = r.ERR_CONNECTION_DESTROYED), t);
					}
					return new Promise((r, o) => {
						let s = (0, i.default)(),
							m = (t) => {
								if (
									t.source !== d ||
									t.data.penpal !== n.REPLY ||
									t.data.id !== s
								)
									return;
								if (t.origin !== p) {
									c(
										`${l} received message from origin ${t.origin} which did not match expected origin ${p}`,
									);
									return;
								}
								(c(`${l}: Received ${e}() reply`),
									u.removeEventListener(n.MESSAGE, m));
								let i = t.data.returnValue;
								(t.data.returnValueIsError &&
									(i = (0, a.deserializeError)(i)),
									(t.data.resolution === n.FULFILLED ? r : o)(
										i,
									));
							};
						(u.addEventListener(n.MESSAGE, m),
							d.postMessage(
								{
									penpal: n.CALL,
									id: s,
									methodName: e,
									args: t,
								},
								f,
							));
					});
				};
			return (
				o.reduce((e, t) => ((e[t] = h(t)), e), e),
				() => {
					m = !0;
				}
			);
		}),
			(t.exports = e.default));
	}),
	g = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0),
			(e.default = (e) =>
				function () {
					e && console.log(`[Penpal]`, ...arguments);
				}),
			(t.exports = e.default));
	}),
	_ = o((e, t) => {
		(Object.defineProperty(e, `__esModule`, { value: !0 }),
			(e.default = void 0));
		var n = l(),
			r = u(),
			i = c(d()),
			a = c(p()),
			o = c(h()),
			s = c(g());
		function c(e) {
			return e && e.__esModule ? e : { default: e };
		}
		((e.default = function () {
			let e =
					arguments.length > 0 && arguments[0] !== void 0
						? arguments[0]
						: {},
				t = e.parentOrigin,
				c = t === void 0 ? `*` : t,
				l = e.methods,
				u = l === void 0 ? {} : l,
				d = e.timeout,
				f = e.debug,
				p = (0, s.default)(f);
			if (window === window.top) {
				let e = Error(
					`connectToParent() must be called within an iframe`,
				);
				throw ((e.code = r.ERR_NOT_IN_IFRAME), e);
			}
			let m = (0, i.default)(),
				h = m.destroy,
				g = m.onDestroy,
				_ = window,
				v = _.parent;
			return {
				promise: new Promise((e, t) => {
					let i;
					d !== void 0 &&
						(i = setTimeout(() => {
							let e = Error(
								`Connection to parent timed out after ${d}ms`,
							);
							((e.code = r.ERR_CONNECTION_TIMEOUT), t(e), h());
						}, d));
					let s = (t) => {
						try {
							clearTimeout();
						} catch {
							return;
						}
						if (
							t.source !== v ||
							t.data.penpal !== n.HANDSHAKE_REPLY
						)
							return;
						if (c !== `*` && c !== t.origin) {
							p(
								`Child received handshake reply from origin ${t.origin} which did not match expected origin ${c}`,
							);
							return;
						}
						(p(`Child: Received handshake reply`),
							_.removeEventListener(n.MESSAGE, s));
						let r = {
								localName: `Child`,
								local: _,
								remote: v,
								originForSending:
									t.origin === `null` ? `*` : t.origin,
								originForReceiving: t.origin,
							},
							l = {};
						(g((0, a.default)(r, u, p)),
							g((0, o.default)(l, r, t.data.methodNames, h, p)),
							clearTimeout(i),
							e(l));
					};
					(_.addEventListener(n.MESSAGE, s),
						g(() => {
							_.removeEventListener(n.MESSAGE, s);
							let e = Error(`Connection destroyed`);
							((e.code = r.ERR_CONNECTION_DESTROYED), t(e));
						}),
						p(`Child: Sending handshake`),
						v.postMessage(
							{
								penpal: n.HANDSHAKE,
								methodNames: Object.keys(u),
							},
							c,
						));
				}),
				destroy: h,
			};
		}),
			(t.exports = e.default));
	}),
	v = function () {
		return (
			(v =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			v.apply(this, arguments)
		);
	};
function y(e, t) {
	for (var n = v({}, e), r = 0, i = t; r < i.length; r++) {
		var a = i[r];
		delete n[a];
	}
	return n;
}
function b(e) {
	return function (t, n) {
		if (e) {
			for (var r = {}, i = 0, a = t; i < a.length; i++) {
				var o = a[i],
					s = n.itemTypes[o.relationships.item_type.data.id];
				r[o.id] = e(o, v(v({}, n), { itemType: s }));
			}
			return r;
		}
	};
}
function x(e, t) {
	var n = function (n, r, i) {
		if (i.mode === e) {
			var a = w(r),
				o = function (e) {
					t(n, v(v(v({}, r), e), a));
				};
			return (o(i), o);
		}
	};
	return ((n.mode = e), n);
}
function S(e, t) {
	var n = function (n, r, i) {
		if (i.mode === e) {
			var a = function (e) {
				t(n, v(v({}, r), e));
			};
			return (a(i), a);
		}
	};
	return ((n.mode = e), n);
}
function C() {
	for (
		var e = document.querySelectorAll(`body *`), t = 0, n = 0;
		n < e.length;
		n++
	)
		t = Math.max(e[n].getBoundingClientRect().bottom, t);
	return t;
}
var w = function (e) {
		var t = null,
			n = function (n) {
				var r =
					n === void 0
						? Math.max(
								document.body.scrollHeight,
								document.body.offsetHeight,
								document.documentElement.getBoundingClientRect()
									.height,
								C(),
							)
						: n;
				r !== t && (e.setHeight(r), (t = r));
			},
			r = null,
			i = null,
			a = function () {
				return n();
			};
		return {
			updateHeight: n,
			startAutoResizer: function () {
				(n(),
					r ||
						((r = new ResizeObserver(a)),
						r.observe(document.documentElement)),
					i ||
						((i = new MutationObserver(a)),
						i.observe(window.document.body, {
							attributes: !0,
							childList: !0,
							subtree: !0,
							characterData: !0,
						})));
			},
			stopAutoResizer: function () {
				((r &&= (r.disconnect(), null)),
					(i &&= (i.disconnect(), null)));
			},
			isAutoResizerActive: function () {
				return !!r;
			},
		};
	},
	ee = x(`renderAssetSource`, function (e, t) {
		e.renderAssetSource && e.renderAssetSource(t.assetSourceId, t);
	}),
	T = x(`renderConfigScreen`, function (e, t) {
		e.renderConfigScreen && e.renderConfigScreen(t);
	}),
	te = x(`renderFieldExtension`, function (e, t) {
		e.renderFieldExtension && e.renderFieldExtension(t.fieldExtensionId, t);
	}),
	ne = S(`renderInspector`, function (e, t) {
		e.renderInspector && e.renderInspector(t.inspectorId, t);
	}),
	re = S(`renderInspectorPanel`, function (e, t) {
		e.renderInspectorPanel && e.renderInspectorPanel(t.panelId, t);
	}),
	ie = x(`renderItemCollectionOutlet`, function (e, t) {
		e.renderItemCollectionOutlet &&
			e.renderItemCollectionOutlet(t.itemCollectionOutletId, t);
	}),
	ae = x(`renderItemFormOutlet`, function (e, t) {
		e.renderItemFormOutlet && e.renderItemFormOutlet(t.itemFormOutletId, t);
	}),
	oe = S(`renderItemFormSidebar`, function (e, t) {
		e.renderItemFormSidebar && e.renderItemFormSidebar(t.sidebarId, t);
	}),
	E = x(`renderItemFormSidebarPanel`, function (e, t) {
		e.renderItemFormSidebarPanel &&
			e.renderItemFormSidebarPanel(t.sidebarPaneId, t);
	}),
	D = x(`renderManualFieldExtensionConfigScreen`, function (e, t) {
		e.renderManualFieldExtensionConfigScreen &&
			e.renderManualFieldExtensionConfigScreen(t.fieldExtensionId, t);
	}),
	se = x(`renderModal`, function (e, t) {
		e.renderModal && e.renderModal(t.modalId, t);
	}),
	ce = S(`renderPage`, function (e, t) {
		e.renderPage && e.renderPage(t.pageId, t);
	}),
	le = S(`renderUploadSidebar`, function (e, t) {
		e.renderUploadSidebar && e.renderUploadSidebar(t.sidebarId, t);
	}),
	ue = x(`renderUploadSidebarPanel`, function (e, t) {
		e.renderUploadSidebarPanel &&
			e.renderUploadSidebarPanel(t.sidebarPaneId, t);
	}),
	de = c(_()),
	O = function () {
		return (
			(O =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			O.apply(this, arguments)
		);
	},
	fe = function (e, t, n, r) {
		function i(e) {
			return e instanceof n
				? e
				: new n(function (t) {
						t(e);
					});
		}
		return new (n ||= Promise)(function (n, a) {
			function o(e) {
				try {
					c(r.next(e));
				} catch (e) {
					a(e);
				}
			}
			function s(e) {
				try {
					c(r.throw(e));
				} catch (e) {
					a(e);
				}
			}
			function c(e) {
				e.done ? n(e.value) : i(e.value).then(o, s);
			}
			c((r = r.apply(e, t || [])).next());
		});
	},
	pe = function (e, t) {
		var n = {
				label: 0,
				sent: function () {
					if (a[0] & 1) throw a[1];
					return a[1];
				},
				trys: [],
				ops: [],
			},
			r,
			i,
			a,
			o = Object.create(
				(typeof Iterator == `function` ? Iterator : Object).prototype,
			);
		return (
			(o.next = s(0)),
			(o.throw = s(1)),
			(o.return = s(2)),
			typeof Symbol == `function` &&
				(o[Symbol.iterator] = function () {
					return this;
				}),
			o
		);
		function s(e) {
			return function (t) {
				return c([e, t]);
			};
		}
		function c(s) {
			if (r) throw TypeError(`Generator is already executing.`);
			for (; o && ((o = 0), s[0] && (n = 0)), n; )
				try {
					if (
						((r = 1),
						i &&
							(a =
								s[0] & 2
									? i.return
									: s[0]
										? i.throw ||
											((a = i.return) && a.call(i), 0)
										: i.next) &&
							!(a = a.call(i, s[1])).done)
					)
						return a;
					switch (((i = 0), a && (s = [s[0] & 2, a.value]), s[0])) {
						case 0:
						case 1:
							a = s;
							break;
						case 4:
							return (n.label++, { value: s[1], done: !1 });
						case 5:
							(n.label++, (i = s[1]), (s = [0]));
							continue;
						case 7:
							((s = n.ops.pop()), n.trys.pop());
							continue;
						default:
							if (
								((a = n.trys),
								!(a = a.length > 0 && a[a.length - 1])) &&
								(s[0] === 6 || s[0] === 2)
							) {
								n = 0;
								continue;
							}
							if (
								s[0] === 3 &&
								(!a || (s[1] > a[0] && s[1] < a[3]))
							) {
								n.label = s[1];
								break;
							}
							if (s[0] === 6 && n.label < a[1]) {
								((n.label = a[1]), (a = s));
								break;
							}
							if (a && n.label < a[2]) {
								((n.label = a[2]), n.ops.push(s));
								break;
							}
							(a[2] && n.ops.pop(), n.trys.pop());
							continue;
					}
					s = t.call(e, n);
				} catch (e) {
					((s = [6, e]), (i = 0));
				} finally {
					r = a = 0;
				}
			if (s[0] & 5) throw s[1];
			return { value: s[0] ? s[1] : void 0, done: !0 };
		}
	},
	me = function (e, t, n) {
		if (n || arguments.length === 2)
			for (var r = 0, i = t.length, a; r < i; r++)
				(a || !(r in t)) &&
					((a ||= Array.prototype.slice.call(t, 0, r)),
					(a[r] = t[r]));
		return e.concat(a || Array.prototype.slice.call(t));
	};
function he() {
	return fe(this, arguments, void 0, function (e) {
		var t, n, r, i, a, o, s, c, l, u, d, f;
		return (
			e === void 0 && (e = {}),
			pe(this, function (p) {
				switch (p.label) {
					case 0:
						return (
							(t = null),
							(n = null),
							(r = O(O({}, e), {
								overrideFieldExtensions: b(
									e.overrideFieldExtensions,
								),
								customMarksForStructuredTextField: b(
									e.customMarksForStructuredTextField,
								),
								customBlockStylesForStructuredTextField: b(
									e.customBlockStylesForStructuredTextField,
								),
							})),
							(i = (0, de.default)({
								methods: O(
									O(
										{
											sdkVersion: function () {
												return `0.3.0`;
											},
											implementedHooks: function () {
												return Object.fromEntries(
													Object.keys(e).map(
														function (e) {
															return [e, !0];
														},
													),
												);
											},
										},
										Object.fromEntries(
											Object.entries(r).filter(
												function (e) {
													return !e[0].startsWith(
														`render`,
													);
												},
											),
										),
									),
									{
										onChange: function (e) {
											t && t(e);
										},
										callMethodMergingBootCtx: function (
											e,
											t,
											r,
											i,
											a,
										) {
											return n ? n(e, t, r, i, a) : null;
										},
									},
								),
							})),
							[4, i.promise]
						);
					case 1:
						return ((a = p.sent()), [4, a.getSettings()]);
					case 2:
						for (
							o = p.sent(),
								o.mode === `onBoot` &&
									((s = o),
									(t = function (e) {
										s = e;
									}),
									(n = function (e, t, n, i, o) {
										var c;
										if ((e in r))
											return (c = r)[e].apply(
												c,
												me(
													me([], t, !1),
													[
														O(
															O(
																O(
																	O(
																		{},
																		y(a, [
																			`getSettings`,
																			`setHeight`,
																		]),
																	),
																	y(s, [
																		`mode`,
																		`bodyPadding`,
																	]),
																),
																Object.fromEntries(
																	i.map(
																		function (
																			e,
																		) {
																			return [
																				e,
																				function () {
																					var t =
																						[
																							...arguments,
																						];
																					return a.callAdditionalCtxMethod(
																						o,
																						e,
																						t,
																					);
																				},
																			];
																		},
																	),
																),
															),
															n,
														),
													],
													!1,
												),
											);
									}),
									r.onBoot && r.onBoot(O(O({}, a), s))),
								c = {
									renderAssetSource: ee,
									renderConfigScreen: T,
									renderFieldExtension: te,
									renderItemCollectionOutlet: ie,
									renderItemFormOutlet: ae,
									renderItemFormSidebar: oe,
									renderItemFormSidebarPanel: E,
									renderManualFieldExtensionConfigScreen: D,
									renderModal: se,
									renderPage: ce,
									renderInspector: ne,
									renderInspectorPanel: re,
									renderUploadSidebar: le,
									renderUploadSidebarPanel: ue,
								},
								l = 0,
								u = Object.values(c);
							l < u.length;
							l++
						)
							if (((d = u[l]), (f = d(r, a, o)), f)) {
								t = f;
								break;
							}
						return [2];
				}
			})
		);
	});
}
var ge = o((e) => {
		var t = Symbol.for(`react.transitional.element`),
			n = Symbol.for(`react.portal`),
			r = Symbol.for(`react.fragment`),
			i = Symbol.for(`react.strict_mode`),
			a = Symbol.for(`react.profiler`),
			o = Symbol.for(`react.consumer`),
			s = Symbol.for(`react.context`),
			c = Symbol.for(`react.forward_ref`),
			l = Symbol.for(`react.suspense`),
			u = Symbol.for(`react.memo`),
			d = Symbol.for(`react.lazy`),
			f = Symbol.for(`react.activity`),
			p = Symbol.iterator;
		function m(e) {
			return typeof e != `object` || !e
				? null
				: ((e = (p && e[p]) || e[`@@iterator`]),
					typeof e == `function` ? e : null);
		}
		var h = {
				isMounted: function () {
					return !1;
				},
				enqueueForceUpdate: function () {},
				enqueueReplaceState: function () {},
				enqueueSetState: function () {},
			},
			g = Object.assign,
			_ = {};
		function v(e, t, n) {
			((this.props = e),
				(this.context = t),
				(this.refs = _),
				(this.updater = n || h));
		}
		((v.prototype.isReactComponent = {}),
			(v.prototype.setState = function (e, t) {
				if (typeof e != `object` && typeof e != `function` && e != null)
					throw Error(
						`takes an object of state variables to update or a function which returns an object of state variables.`,
					);
				this.updater.enqueueSetState(this, e, t, `setState`);
			}),
			(v.prototype.forceUpdate = function (e) {
				this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
			}));
		function y() {}
		y.prototype = v.prototype;
		function b(e, t, n) {
			((this.props = e),
				(this.context = t),
				(this.refs = _),
				(this.updater = n || h));
		}
		var x = (b.prototype = new y());
		((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0));
		var S = Array.isArray;
		function C() {}
		var w = { H: null, A: null, T: null, S: null },
			ee = Object.prototype.hasOwnProperty;
		function T(e, n, r) {
			var i = r.ref;
			return {
				$$typeof: t,
				type: e,
				key: n,
				ref: i === void 0 ? null : i,
				props: r,
			};
		}
		function te(e, t) {
			return T(e.type, t, e.props);
		}
		function ne(e) {
			return typeof e == `object` && !!e && e.$$typeof === t;
		}
		function re(e) {
			var t = { "=": `=0`, ":": `=2` };
			return (
				`$` +
				e.replace(/[=:]/g, function (e) {
					return t[e];
				})
			);
		}
		var ie = /\/+/g;
		function ae(e, t) {
			return typeof e == `object` && e && e.key != null
				? re(`` + e.key)
				: t.toString(36);
		}
		function oe(e) {
			switch (e.status) {
				case `fulfilled`:
					return e.value;
				case `rejected`:
					throw e.reason;
				default:
					switch (
						(typeof e.status == `string`
							? e.then(C, C)
							: ((e.status = `pending`),
								e.then(
									function (t) {
										e.status === `pending` &&
											((e.status = `fulfilled`),
											(e.value = t));
									},
									function (t) {
										e.status === `pending` &&
											((e.status = `rejected`),
											(e.reason = t));
									},
								)),
						e.status)
					) {
						case `fulfilled`:
							return e.value;
						case `rejected`:
							throw e.reason;
					}
			}
			throw e;
		}
		function E(e, r, i, a, o) {
			var s = typeof e;
			(s === `undefined` || s === `boolean`) && (e = null);
			var c = !1;
			if (e === null) c = !0;
			else
				switch (s) {
					case `bigint`:
					case `string`:
					case `number`:
						c = !0;
						break;
					case `object`:
						switch (e.$$typeof) {
							case t:
							case n:
								c = !0;
								break;
							case d:
								return (
									(c = e._init),
									E(c(e._payload), r, i, a, o)
								);
						}
				}
			if (c)
				return (
					(o = o(e)),
					(c = a === `` ? `.` + ae(e, 0) : a),
					S(o)
						? ((i = ``),
							c != null && (i = c.replace(ie, `$&/`) + `/`),
							E(o, r, i, ``, function (e) {
								return e;
							}))
						: o != null &&
							(ne(o) &&
								(o = te(
									o,
									i +
										(o.key == null || (e && e.key === o.key)
											? ``
											: (`` + o.key).replace(ie, `$&/`) +
												`/`) +
										c,
								)),
							r.push(o)),
					1
				);
			c = 0;
			var l = a === `` ? `.` : a + `:`;
			if (S(e))
				for (var u = 0; u < e.length; u++)
					((a = e[u]), (s = l + ae(a, u)), (c += E(a, r, i, s, o)));
			else if (((u = m(e)), typeof u == `function`))
				for (e = u.call(e), u = 0; !(a = e.next()).done; )
					((a = a.value),
						(s = l + ae(a, u++)),
						(c += E(a, r, i, s, o)));
			else if (s === `object`) {
				if (typeof e.then == `function`) return E(oe(e), r, i, a, o);
				throw (
					(r = String(e)),
					Error(
						`Objects are not valid as a React child (found: ` +
							(r === `[object Object]`
								? `object with keys {` +
									Object.keys(e).join(`, `) +
									`}`
								: r) +
							`). If you meant to render a collection of children, use an array instead.`,
					)
				);
			}
			return c;
		}
		function D(e, t, n) {
			if (e == null) return e;
			var r = [],
				i = 0;
			return (
				E(e, r, ``, ``, function (e) {
					return t.call(n, e, i++);
				}),
				r
			);
		}
		function se(e) {
			if (e._status === -1) {
				var t = e._result;
				((t = t()),
					t.then(
						function (t) {
							(e._status === 0 || e._status === -1) &&
								((e._status = 1), (e._result = t));
						},
						function (t) {
							(e._status === 0 || e._status === -1) &&
								((e._status = 2), (e._result = t));
						},
					),
					e._status === -1 && ((e._status = 0), (e._result = t)));
			}
			if (e._status === 1) return e._result.default;
			throw e._result;
		}
		var ce =
				typeof reportError == `function`
					? reportError
					: function (e) {
							if (
								typeof window == `object` &&
								typeof window.ErrorEvent == `function`
							) {
								var t = new window.ErrorEvent(`error`, {
									bubbles: !0,
									cancelable: !0,
									message:
										typeof e == `object` &&
										e &&
										typeof e.message == `string`
											? String(e.message)
											: String(e),
									error: e,
								});
								if (!window.dispatchEvent(t)) return;
							} else if (
								typeof process == `object` &&
								typeof process.emit == `function`
							) {
								process.emit(`uncaughtException`, e);
								return;
							}
							console.error(e);
						},
			le = {
				map: D,
				forEach: function (e, t, n) {
					D(
						e,
						function () {
							t.apply(this, arguments);
						},
						n,
					);
				},
				count: function (e) {
					var t = 0;
					return (
						D(e, function () {
							t++;
						}),
						t
					);
				},
				toArray: function (e) {
					return (
						D(e, function (e) {
							return e;
						}) || []
					);
				},
				only: function (e) {
					if (!ne(e))
						throw Error(
							`React.Children.only expected to receive a single React element child.`,
						);
					return e;
				},
			};
		((e.Activity = f),
			(e.Children = le),
			(e.Component = v),
			(e.Fragment = r),
			(e.Profiler = a),
			(e.PureComponent = b),
			(e.StrictMode = i),
			(e.Suspense = l),
			(e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
				w),
			(e.__COMPILER_RUNTIME = {
				__proto__: null,
				c: function (e) {
					return w.H.useMemoCache(e);
				},
			}),
			(e.cache = function (e) {
				return function () {
					return e.apply(null, arguments);
				};
			}),
			(e.cacheSignal = function () {
				return null;
			}),
			(e.cloneElement = function (e, t, n) {
				if (e == null)
					throw Error(
						`The argument must be a React element, but you passed ` +
							e +
							`.`,
					);
				var r = g({}, e.props),
					i = e.key;
				if (t != null)
					for (a in (t.key !== void 0 && (i = `` + t.key), t))
						!ee.call(t, a) ||
							a === `key` ||
							a === `__self` ||
							a === `__source` ||
							(a === `ref` && t.ref === void 0) ||
							(r[a] = t[a]);
				var a = arguments.length - 2;
				if (a === 1) r.children = n;
				else if (1 < a) {
					for (var o = Array(a), s = 0; s < a; s++)
						o[s] = arguments[s + 2];
					r.children = o;
				}
				return T(e.type, i, r);
			}),
			(e.createContext = function (e) {
				return (
					(e = {
						$$typeof: s,
						_currentValue: e,
						_currentValue2: e,
						_threadCount: 0,
						Provider: null,
						Consumer: null,
					}),
					(e.Provider = e),
					(e.Consumer = { $$typeof: o, _context: e }),
					e
				);
			}),
			(e.createElement = function (e, t, n) {
				var r,
					i = {},
					a = null;
				if (t != null)
					for (r in (t.key !== void 0 && (a = `` + t.key), t))
						ee.call(t, r) &&
							r !== `key` &&
							r !== `__self` &&
							r !== `__source` &&
							(i[r] = t[r]);
				var o = arguments.length - 2;
				if (o === 1) i.children = n;
				else if (1 < o) {
					for (var s = Array(o), c = 0; c < o; c++)
						s[c] = arguments[c + 2];
					i.children = s;
				}
				if (e && e.defaultProps)
					for (r in ((o = e.defaultProps), o))
						i[r] === void 0 && (i[r] = o[r]);
				return T(e, a, i);
			}),
			(e.createRef = function () {
				return { current: null };
			}),
			(e.forwardRef = function (e) {
				return { $$typeof: c, render: e };
			}),
			(e.isValidElement = ne),
			(e.lazy = function (e) {
				return {
					$$typeof: d,
					_payload: { _status: -1, _result: e },
					_init: se,
				};
			}),
			(e.memo = function (e, t) {
				return {
					$$typeof: u,
					type: e,
					compare: t === void 0 ? null : t,
				};
			}),
			(e.startTransition = function (e) {
				var t = w.T,
					n = {};
				w.T = n;
				try {
					var r = e(),
						i = w.S;
					(i !== null && i(n, r),
						typeof r == `object` &&
							r &&
							typeof r.then == `function` &&
							r.then(C, ce));
				} catch (e) {
					ce(e);
				} finally {
					(t !== null && n.types !== null && (t.types = n.types),
						(w.T = t));
				}
			}),
			(e.unstable_useCacheRefresh = function () {
				return w.H.useCacheRefresh();
			}),
			(e.use = function (e) {
				return w.H.use(e);
			}),
			(e.useActionState = function (e, t, n) {
				return w.H.useActionState(e, t, n);
			}),
			(e.useCallback = function (e, t) {
				return w.H.useCallback(e, t);
			}),
			(e.useContext = function (e) {
				return w.H.useContext(e);
			}),
			(e.useDebugValue = function () {}),
			(e.useDeferredValue = function (e, t) {
				return w.H.useDeferredValue(e, t);
			}),
			(e.useEffect = function (e, t) {
				return w.H.useEffect(e, t);
			}),
			(e.useEffectEvent = function (e) {
				return w.H.useEffectEvent(e);
			}),
			(e.useId = function () {
				return w.H.useId();
			}),
			(e.useImperativeHandle = function (e, t, n) {
				return w.H.useImperativeHandle(e, t, n);
			}),
			(e.useInsertionEffect = function (e, t) {
				return w.H.useInsertionEffect(e, t);
			}),
			(e.useLayoutEffect = function (e, t) {
				return w.H.useLayoutEffect(e, t);
			}),
			(e.useMemo = function (e, t) {
				return w.H.useMemo(e, t);
			}),
			(e.useOptimistic = function (e, t) {
				return w.H.useOptimistic(e, t);
			}),
			(e.useReducer = function (e, t, n) {
				return w.H.useReducer(e, t, n);
			}),
			(e.useRef = function (e) {
				return w.H.useRef(e);
			}),
			(e.useState = function (e) {
				return w.H.useState(e);
			}),
			(e.useSyncExternalStore = function (e, t, n) {
				return w.H.useSyncExternalStore(e, t, n);
			}),
			(e.useTransition = function () {
				return w.H.useTransition();
			}),
			(e.version = `19.2.4`));
	}),
	_e = o((e, t) => {
		t.exports = ge();
	}),
	ve = o((e) => {
		function t(e, t) {
			var n = e.length;
			e.push(t);
			a: for (; 0 < n; ) {
				var r = (n - 1) >>> 1,
					a = e[r];
				if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
				else break a;
			}
		}
		function n(e) {
			return e.length === 0 ? null : e[0];
		}
		function r(e) {
			if (e.length === 0) return null;
			var t = e[0],
				n = e.pop();
			if (n !== t) {
				e[0] = n;
				a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
					var s = 2 * (r + 1) - 1,
						c = e[s],
						l = s + 1,
						u = e[l];
					if (0 > i(c, n))
						l < a && 0 > i(u, c)
							? ((e[r] = u), (e[l] = n), (r = l))
							: ((e[r] = c), (e[s] = n), (r = s));
					else if (l < a && 0 > i(u, n))
						((e[r] = u), (e[l] = n), (r = l));
					else break a;
				}
			}
			return t;
		}
		function i(e, t) {
			var n = e.sortIndex - t.sortIndex;
			return n === 0 ? e.id - t.id : n;
		}
		if (
			((e.unstable_now = void 0),
			typeof performance == `object` &&
				typeof performance.now == `function`)
		) {
			var a = performance;
			e.unstable_now = function () {
				return a.now();
			};
		} else {
			var o = Date,
				s = o.now();
			e.unstable_now = function () {
				return o.now() - s;
			};
		}
		var c = [],
			l = [],
			u = 1,
			d = null,
			f = 3,
			p = !1,
			m = !1,
			h = !1,
			g = !1,
			_ = typeof setTimeout == `function` ? setTimeout : null,
			v = typeof clearTimeout == `function` ? clearTimeout : null,
			y = typeof setImmediate < `u` ? setImmediate : null;
		function b(e) {
			for (var i = n(l); i !== null; ) {
				if (i.callback === null) r(l);
				else if (i.startTime <= e)
					(r(l), (i.sortIndex = i.expirationTime), t(c, i));
				else break;
				i = n(l);
			}
		}
		function x(e) {
			if (((h = !1), b(e), !m))
				if (n(c) !== null) ((m = !0), S || ((S = !0), ne()));
				else {
					var t = n(l);
					t !== null && ae(x, t.startTime - e);
				}
		}
		var S = !1,
			C = -1,
			w = 5,
			ee = -1;
		function T() {
			return g ? !0 : !(e.unstable_now() - ee < w);
		}
		function te() {
			if (((g = !1), S)) {
				var t = e.unstable_now();
				ee = t;
				var i = !0;
				try {
					a: {
						((m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0));
						var a = f;
						try {
							b: {
								for (
									b(t), d = n(c);
									d !== null &&
									!(d.expirationTime > t && T());
								) {
									var o = d.callback;
									if (typeof o == `function`) {
										((d.callback = null),
											(f = d.priorityLevel));
										var s = o(d.expirationTime <= t);
										if (
											((t = e.unstable_now()),
											typeof s == `function`)
										) {
											((d.callback = s), b(t), (i = !0));
											break b;
										}
										(d === n(c) && r(c), b(t));
									} else r(c);
									d = n(c);
								}
								if (d !== null) i = !0;
								else {
									var u = n(l);
									(u !== null && ae(x, u.startTime - t),
										(i = !1));
								}
							}
							break a;
						} finally {
							((d = null), (f = a), (p = !1));
						}
						i = void 0;
					}
				} finally {
					i ? ne() : (S = !1);
				}
			}
		}
		var ne;
		if (typeof y == `function`)
			ne = function () {
				y(te);
			};
		else if (typeof MessageChannel < `u`) {
			var re = new MessageChannel(),
				ie = re.port2;
			((re.port1.onmessage = te),
				(ne = function () {
					ie.postMessage(null);
				}));
		} else
			ne = function () {
				_(te, 0);
			};
		function ae(t, n) {
			C = _(function () {
				t(e.unstable_now());
			}, n);
		}
		((e.unstable_IdlePriority = 5),
			(e.unstable_ImmediatePriority = 1),
			(e.unstable_LowPriority = 4),
			(e.unstable_NormalPriority = 3),
			(e.unstable_Profiling = null),
			(e.unstable_UserBlockingPriority = 2),
			(e.unstable_cancelCallback = function (e) {
				e.callback = null;
			}),
			(e.unstable_forceFrameRate = function (e) {
				0 > e || 125 < e
					? console.error(
							`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
						)
					: (w = 0 < e ? Math.floor(1e3 / e) : 5);
			}),
			(e.unstable_getCurrentPriorityLevel = function () {
				return f;
			}),
			(e.unstable_next = function (e) {
				switch (f) {
					case 1:
					case 2:
					case 3:
						var t = 3;
						break;
					default:
						t = f;
				}
				var n = f;
				f = t;
				try {
					return e();
				} finally {
					f = n;
				}
			}),
			(e.unstable_requestPaint = function () {
				g = !0;
			}),
			(e.unstable_runWithPriority = function (e, t) {
				switch (e) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						break;
					default:
						e = 3;
				}
				var n = f;
				f = e;
				try {
					return t();
				} finally {
					f = n;
				}
			}),
			(e.unstable_scheduleCallback = function (r, i, a) {
				var o = e.unstable_now();
				switch (
					(typeof a == `object` && a
						? ((a = a.delay),
							(a = typeof a == `number` && 0 < a ? o + a : o))
						: (a = o),
					r)
				) {
					case 1:
						var s = -1;
						break;
					case 2:
						s = 250;
						break;
					case 5:
						s = 1073741823;
						break;
					case 4:
						s = 1e4;
						break;
					default:
						s = 5e3;
				}
				return (
					(s = a + s),
					(r = {
						id: u++,
						callback: i,
						priorityLevel: r,
						startTime: a,
						expirationTime: s,
						sortIndex: -1,
					}),
					a > o
						? ((r.sortIndex = a),
							t(l, r),
							n(c) === null &&
								r === n(l) &&
								(h ? (v(C), (C = -1)) : (h = !0), ae(x, a - o)))
						: ((r.sortIndex = s),
							t(c, r),
							m || p || ((m = !0), S || ((S = !0), ne()))),
					r
				);
			}),
			(e.unstable_shouldYield = T),
			(e.unstable_wrapCallback = function (e) {
				var t = f;
				return function () {
					var n = f;
					f = t;
					try {
						return e.apply(this, arguments);
					} finally {
						f = n;
					}
				};
			}));
	}),
	ye = o((e, t) => {
		t.exports = ve();
	}),
	be = o((e) => {
		var t = _e();
		function n(e) {
			var t = `https://react.dev/errors/` + e;
			if (1 < arguments.length) {
				t += `?args[]=` + encodeURIComponent(arguments[1]);
				for (var n = 2; n < arguments.length; n++)
					t += `&args[]=` + encodeURIComponent(arguments[n]);
			}
			return (
				`Minified React error #` +
				e +
				`; visit ` +
				t +
				` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
			);
		}
		function r() {}
		var i = {
				d: {
					f: r,
					r: function () {
						throw Error(n(522));
					},
					D: r,
					C: r,
					L: r,
					m: r,
					X: r,
					S: r,
					M: r,
				},
				p: 0,
				findDOMNode: null,
			},
			a = Symbol.for(`react.portal`);
		function o(e, t, n) {
			var r =
				3 < arguments.length && arguments[3] !== void 0
					? arguments[3]
					: null;
			return {
				$$typeof: a,
				key: r == null ? null : `` + r,
				children: e,
				containerInfo: t,
				implementation: n,
			};
		}
		var s =
			t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
		function c(e, t) {
			if (e === `font`) return ``;
			if (typeof t == `string`) return t === `use-credentials` ? t : ``;
		}
		((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
			(e.createPortal = function (e, t) {
				var r =
					2 < arguments.length && arguments[2] !== void 0
						? arguments[2]
						: null;
				if (
					!t ||
					(t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
				)
					throw Error(n(299));
				return o(e, t, null, r);
			}),
			(e.flushSync = function (e) {
				var t = s.T,
					n = i.p;
				try {
					if (((s.T = null), (i.p = 2), e)) return e();
				} finally {
					((s.T = t), (i.p = n), i.d.f());
				}
			}),
			(e.preconnect = function (e, t) {
				typeof e == `string` &&
					(t
						? ((t = t.crossOrigin),
							(t =
								typeof t == `string`
									? t === `use-credentials`
										? t
										: ``
									: void 0))
						: (t = null),
					i.d.C(e, t));
			}),
			(e.prefetchDNS = function (e) {
				typeof e == `string` && i.d.D(e);
			}),
			(e.preinit = function (e, t) {
				if (typeof e == `string` && t && typeof t.as == `string`) {
					var n = t.as,
						r = c(n, t.crossOrigin),
						a =
							typeof t.integrity == `string`
								? t.integrity
								: void 0,
						o =
							typeof t.fetchPriority == `string`
								? t.fetchPriority
								: void 0;
					n === `style`
						? i.d.S(
								e,
								typeof t.precedence == `string`
									? t.precedence
									: void 0,
								{
									crossOrigin: r,
									integrity: a,
									fetchPriority: o,
								},
							)
						: n === `script` &&
							i.d.X(e, {
								crossOrigin: r,
								integrity: a,
								fetchPriority: o,
								nonce:
									typeof t.nonce == `string`
										? t.nonce
										: void 0,
							});
				}
			}),
			(e.preinitModule = function (e, t) {
				if (typeof e == `string`)
					if (typeof t == `object` && t) {
						if (t.as == null || t.as === `script`) {
							var n = c(t.as, t.crossOrigin);
							i.d.M(e, {
								crossOrigin: n,
								integrity:
									typeof t.integrity == `string`
										? t.integrity
										: void 0,
								nonce:
									typeof t.nonce == `string`
										? t.nonce
										: void 0,
							});
						}
					} else t ?? i.d.M(e);
			}),
			(e.preload = function (e, t) {
				if (
					typeof e == `string` &&
					typeof t == `object` &&
					t &&
					typeof t.as == `string`
				) {
					var n = t.as,
						r = c(n, t.crossOrigin);
					i.d.L(e, n, {
						crossOrigin: r,
						integrity:
							typeof t.integrity == `string`
								? t.integrity
								: void 0,
						nonce: typeof t.nonce == `string` ? t.nonce : void 0,
						type: typeof t.type == `string` ? t.type : void 0,
						fetchPriority:
							typeof t.fetchPriority == `string`
								? t.fetchPriority
								: void 0,
						referrerPolicy:
							typeof t.referrerPolicy == `string`
								? t.referrerPolicy
								: void 0,
						imageSrcSet:
							typeof t.imageSrcSet == `string`
								? t.imageSrcSet
								: void 0,
						imageSizes:
							typeof t.imageSizes == `string`
								? t.imageSizes
								: void 0,
						media: typeof t.media == `string` ? t.media : void 0,
					});
				}
			}),
			(e.preloadModule = function (e, t) {
				if (typeof e == `string`)
					if (t) {
						var n = c(t.as, t.crossOrigin);
						i.d.m(e, {
							as:
								typeof t.as == `string` && t.as !== `script`
									? t.as
									: void 0,
							crossOrigin: n,
							integrity:
								typeof t.integrity == `string`
									? t.integrity
									: void 0,
						});
					} else i.d.m(e);
			}),
			(e.requestFormReset = function (e) {
				i.d.r(e);
			}),
			(e.unstable_batchedUpdates = function (e, t) {
				return e(t);
			}),
			(e.useFormState = function (e, t, n) {
				return s.H.useFormState(e, t, n);
			}),
			(e.useFormStatus = function () {
				return s.H.useHostTransitionStatus();
			}),
			(e.version = `19.2.4`));
	}),
	xe = o((e, t) => {
		function n() {
			if (
				!(
					typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
					typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
				)
			)
				try {
					__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
				} catch (e) {
					console.error(e);
				}
		}
		(n(), (t.exports = be()));
	}),
	Se = o((e) => {
		var t = ye(),
			n = _e(),
			r = xe();
		function i(e) {
			var t = `https://react.dev/errors/` + e;
			if (1 < arguments.length) {
				t += `?args[]=` + encodeURIComponent(arguments[1]);
				for (var n = 2; n < arguments.length; n++)
					t += `&args[]=` + encodeURIComponent(arguments[n]);
			}
			return (
				`Minified React error #` +
				e +
				`; visit ` +
				t +
				` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
			);
		}
		function a(e) {
			return !(
				!e ||
				(e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
			);
		}
		function o(e) {
			var t = e,
				n = e;
			if (e.alternate) for (; t.return; ) t = t.return;
			else {
				e = t;
				do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
				while (e);
			}
			return t.tag === 3 ? n : null;
		}
		function s(e) {
			if (e.tag === 13) {
				var t = e.memoizedState;
				if (
					(t === null &&
						((e = e.alternate),
						e !== null && (t = e.memoizedState)),
					t !== null)
				)
					return t.dehydrated;
			}
			return null;
		}
		function c(e) {
			if (e.tag === 31) {
				var t = e.memoizedState;
				if (
					(t === null &&
						((e = e.alternate),
						e !== null && (t = e.memoizedState)),
					t !== null)
				)
					return t.dehydrated;
			}
			return null;
		}
		function l(e) {
			if (o(e) !== e) throw Error(i(188));
		}
		function u(e) {
			var t = e.alternate;
			if (!t) {
				if (((t = o(e)), t === null)) throw Error(i(188));
				return t === e ? e : null;
			}
			for (var n = e, r = t; ; ) {
				var a = n.return;
				if (a === null) break;
				var s = a.alternate;
				if (s === null) {
					if (((r = a.return), r !== null)) {
						n = r;
						continue;
					}
					break;
				}
				if (a.child === s.child) {
					for (s = a.child; s; ) {
						if (s === n) return (l(a), e);
						if (s === r) return (l(a), t);
						s = s.sibling;
					}
					throw Error(i(188));
				}
				if (n.return !== r.return) ((n = a), (r = s));
				else {
					for (var c = !1, u = a.child; u; ) {
						if (u === n) {
							((c = !0), (n = a), (r = s));
							break;
						}
						if (u === r) {
							((c = !0), (r = a), (n = s));
							break;
						}
						u = u.sibling;
					}
					if (!c) {
						for (u = s.child; u; ) {
							if (u === n) {
								((c = !0), (n = s), (r = a));
								break;
							}
							if (u === r) {
								((c = !0), (r = s), (n = a));
								break;
							}
							u = u.sibling;
						}
						if (!c) throw Error(i(189));
					}
				}
				if (n.alternate !== r) throw Error(i(190));
			}
			if (n.tag !== 3) throw Error(i(188));
			return n.stateNode.current === n ? e : t;
		}
		function d(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e;
			for (e = e.child; e !== null; ) {
				if (((t = d(e)), t !== null)) return t;
				e = e.sibling;
			}
			return null;
		}
		var f = Object.assign,
			p = Symbol.for(`react.element`),
			m = Symbol.for(`react.transitional.element`),
			h = Symbol.for(`react.portal`),
			g = Symbol.for(`react.fragment`),
			_ = Symbol.for(`react.strict_mode`),
			v = Symbol.for(`react.profiler`),
			y = Symbol.for(`react.consumer`),
			b = Symbol.for(`react.context`),
			x = Symbol.for(`react.forward_ref`),
			S = Symbol.for(`react.suspense`),
			C = Symbol.for(`react.suspense_list`),
			w = Symbol.for(`react.memo`),
			ee = Symbol.for(`react.lazy`),
			T = Symbol.for(`react.activity`),
			te = Symbol.for(`react.memo_cache_sentinel`),
			ne = Symbol.iterator;
		function re(e) {
			return typeof e != `object` || !e
				? null
				: ((e = (ne && e[ne]) || e[`@@iterator`]),
					typeof e == `function` ? e : null);
		}
		var ie = Symbol.for(`react.client.reference`);
		function ae(e) {
			if (e == null) return null;
			if (typeof e == `function`)
				return e.$$typeof === ie
					? null
					: e.displayName || e.name || null;
			if (typeof e == `string`) return e;
			switch (e) {
				case g:
					return `Fragment`;
				case v:
					return `Profiler`;
				case _:
					return `StrictMode`;
				case S:
					return `Suspense`;
				case C:
					return `SuspenseList`;
				case T:
					return `Activity`;
			}
			if (typeof e == `object`)
				switch (e.$$typeof) {
					case h:
						return `Portal`;
					case b:
						return e.displayName || `Context`;
					case y:
						return (
							(e._context.displayName || `Context`) + `.Consumer`
						);
					case x:
						var t = e.render;
						return (
							(e = e.displayName),
							(e ||=
								((e = t.displayName || t.name || ``),
								e === ``
									? `ForwardRef`
									: `ForwardRef(` + e + `)`)),
							e
						);
					case w:
						return (
							(t = e.displayName || null),
							t === null ? ae(e.type) || `Memo` : t
						);
					case ee:
						((t = e._payload), (e = e._init));
						try {
							return ae(e(t));
						} catch {}
				}
			return null;
		}
		var oe = Array.isArray,
			E =
				n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
			D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
			se = { pending: !1, data: null, method: null, action: null },
			ce = [],
			le = -1;
		function ue(e) {
			return { current: e };
		}
		function de(e) {
			0 > le || ((e.current = ce[le]), (ce[le] = null), le--);
		}
		function O(e, t) {
			(le++, (ce[le] = e.current), (e.current = t));
		}
		var fe = ue(null),
			pe = ue(null),
			me = ue(null),
			he = ue(null);
		function ge(e, t) {
			switch ((O(me, t), O(pe, e), O(fe, null), t.nodeType)) {
				case 9:
				case 11:
					e =
						(e = t.documentElement) && (e = e.namespaceURI)
							? Vd(e)
							: 0;
					break;
				default:
					if (((e = t.tagName), (t = t.namespaceURI)))
						((t = Vd(t)), (e = Hd(t, e)));
					else
						switch (e) {
							case `svg`:
								e = 1;
								break;
							case `math`:
								e = 2;
								break;
							default:
								e = 0;
						}
			}
			(de(fe), O(fe, e));
		}
		function ve() {
			(de(fe), de(pe), de(me));
		}
		function be(e) {
			e.memoizedState !== null && O(he, e);
			var t = fe.current,
				n = Hd(t, e.type);
			t !== n && (O(pe, e), O(fe, n));
		}
		function Se(e) {
			(pe.current === e && (de(fe), de(pe)),
				he.current === e && (de(he), (Qf._currentValue = se)));
		}
		var Ce, we;
		function Te(e) {
			if (Ce === void 0)
				try {
					throw Error();
				} catch (e) {
					var t = e.stack.trim().match(/\n( *(at )?)/);
					((Ce = (t && t[1]) || ``),
						(we =
							-1 <
							e.stack.indexOf(`
    at`)
								? ` (<anonymous>)`
								: -1 < e.stack.indexOf(`@`)
									? `@unknown:0:0`
									: ``));
				}
			return (
				`
` +
				Ce +
				e +
				we
			);
		}
		var k = !1;
		function Ee(e, t) {
			if (!e || k) return ``;
			k = !0;
			var n = Error.prepareStackTrace;
			Error.prepareStackTrace = void 0;
			try {
				var r = {
					DetermineComponentFrameRoot: function () {
						try {
							if (t) {
								var n = function () {
									throw Error();
								};
								if (
									(Object.defineProperty(
										n.prototype,
										`props`,
										{
											set: function () {
												throw Error();
											},
										},
									),
									typeof Reflect == `object` &&
										Reflect.construct)
								) {
									try {
										Reflect.construct(n, []);
									} catch (e) {
										var r = e;
									}
									Reflect.construct(e, [], n);
								} else {
									try {
										n.call();
									} catch (e) {
										r = e;
									}
									e.call(n.prototype);
								}
							} else {
								try {
									throw Error();
								} catch (e) {
									r = e;
								}
								(n = e()) &&
									typeof n.catch == `function` &&
									n.catch(function () {});
							}
						} catch (e) {
							if (e && r && typeof e.stack == `string`)
								return [e.stack, r.stack];
						}
						return [null, null];
					},
				};
				r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
				var i = Object.getOwnPropertyDescriptor(
					r.DetermineComponentFrameRoot,
					`name`,
				);
				i &&
					i.configurable &&
					Object.defineProperty(
						r.DetermineComponentFrameRoot,
						`name`,
						{ value: `DetermineComponentFrameRoot` },
					);
				var a = r.DetermineComponentFrameRoot(),
					o = a[0],
					s = a[1];
				if (o && s) {
					var c = o.split(`
`),
						l = s.split(`
`);
					for (
						i = r = 0;
						r < c.length &&
						!c[r].includes(`DetermineComponentFrameRoot`);
					)
						r++;
					for (
						;
						i < l.length &&
						!l[i].includes(`DetermineComponentFrameRoot`);
					)
						i++;
					if (r === c.length || i === l.length)
						for (
							r = c.length - 1, i = l.length - 1;
							1 <= r && 0 <= i && c[r] !== l[i];
						)
							i--;
					for (; 1 <= r && 0 <= i; r--, i--)
						if (c[r] !== l[i]) {
							if (r !== 1 || i !== 1)
								do
									if ((r--, i--, 0 > i || c[r] !== l[i])) {
										var u =
											`
` + c[r].replace(` at new `, ` at `);
										return (
											e.displayName &&
												u.includes(`<anonymous>`) &&
												(u = u.replace(
													`<anonymous>`,
													e.displayName,
												)),
											u
										);
									}
								while (1 <= r && 0 <= i);
							break;
						}
				}
			} finally {
				((k = !1), (Error.prepareStackTrace = n));
			}
			return (n = e ? e.displayName || e.name : ``) ? Te(n) : ``;
		}
		function A(e, t) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5:
					return Te(e.type);
				case 16:
					return Te(`Lazy`);
				case 13:
					return e.child !== t && t !== null
						? Te(`Suspense Fallback`)
						: Te(`Suspense`);
				case 19:
					return Te(`SuspenseList`);
				case 0:
				case 15:
					return Ee(e.type, !1);
				case 11:
					return Ee(e.type.render, !1);
				case 1:
					return Ee(e.type, !0);
				case 31:
					return Te(`Activity`);
				default:
					return ``;
			}
		}
		function De(e) {
			try {
				var t = ``,
					n = null;
				do ((t += A(e, n)), (n = e), (e = e.return));
				while (e);
				return t;
			} catch (e) {
				return (
					`
Error generating stack: ` +
					e.message +
					`
` +
					e.stack
				);
			}
		}
		var Oe = Object.prototype.hasOwnProperty,
			ke = t.unstable_scheduleCallback,
			Ae = t.unstable_cancelCallback,
			je = t.unstable_shouldYield,
			Me = t.unstable_requestPaint,
			Ne = t.unstable_now,
			Pe = t.unstable_getCurrentPriorityLevel,
			Fe = t.unstable_ImmediatePriority,
			Ie = t.unstable_UserBlockingPriority,
			Le = t.unstable_NormalPriority,
			Re = t.unstable_LowPriority,
			ze = t.unstable_IdlePriority,
			Be = t.log,
			Ve = t.unstable_setDisableYieldValue,
			He = null,
			Ue = null;
		function We(e) {
			if (
				(typeof Be == `function` && Ve(e),
				Ue && typeof Ue.setStrictMode == `function`)
			)
				try {
					Ue.setStrictMode(He, e);
				} catch {}
		}
		var Ge = Math.clz32 ? Math.clz32 : Je,
			Ke = Math.log,
			qe = Math.LN2;
		function Je(e) {
			return ((e >>>= 0), e === 0 ? 32 : (31 - ((Ke(e) / qe) | 0)) | 0);
		}
		var Ye = 256,
			Xe = 262144,
			Ze = 4194304;
		function Qe(e) {
			var t = e & 42;
			if (t !== 0) return t;
			switch (e & -e) {
				case 1:
					return 1;
				case 2:
					return 2;
				case 4:
					return 4;
				case 8:
					return 8;
				case 16:
					return 16;
				case 32:
					return 32;
				case 64:
					return 64;
				case 128:
					return 128;
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
					return e & 261888;
				case 262144:
				case 524288:
				case 1048576:
				case 2097152:
					return e & 3932160;
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432:
					return e & 62914560;
				case 67108864:
					return 67108864;
				case 134217728:
					return 134217728;
				case 268435456:
					return 268435456;
				case 536870912:
					return 536870912;
				case 1073741824:
					return 0;
				default:
					return e;
			}
		}
		function $e(e, t, n) {
			var r = e.pendingLanes;
			if (r === 0) return 0;
			var i = 0,
				a = e.suspendedLanes,
				o = e.pingedLanes;
			e = e.warmLanes;
			var s = r & 134217727;
			return (
				s === 0
					? ((s = r & ~a),
						s === 0
							? o === 0
								? n || ((n = r & ~e), n !== 0 && (i = Qe(n)))
								: (i = Qe(o))
							: (i = Qe(s)))
					: ((r = s & ~a),
						r === 0
							? ((o &= s),
								o === 0
									? n ||
										((n = s & ~e), n !== 0 && (i = Qe(n)))
									: (i = Qe(o)))
							: (i = Qe(r))),
				i === 0
					? 0
					: t !== 0 &&
						  t !== i &&
						  (t & a) === 0 &&
						  ((a = i & -i),
						  (n = t & -t),
						  a >= n || (a === 32 && n & 4194048))
						? t
						: i
			);
		}
		function et(e, t) {
			return (
				(e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) ===
				0
			);
		}
		function tt(e, t) {
			switch (e) {
				case 1:
				case 2:
				case 4:
				case 8:
				case 64:
					return t + 250;
				case 16:
				case 32:
				case 128:
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
				case 262144:
				case 524288:
				case 1048576:
				case 2097152:
					return t + 5e3;
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432:
					return -1;
				case 67108864:
				case 134217728:
				case 268435456:
				case 536870912:
				case 1073741824:
					return -1;
				default:
					return -1;
			}
		}
		function nt() {
			var e = Ze;
			return ((Ze <<= 1), !(Ze & 62914560) && (Ze = 4194304), e);
		}
		function rt(e) {
			for (var t = [], n = 0; 31 > n; n++) t.push(e);
			return t;
		}
		function it(e, t) {
			((e.pendingLanes |= t),
				t !== 268435456 &&
					((e.suspendedLanes = 0),
					(e.pingedLanes = 0),
					(e.warmLanes = 0)));
		}
		function at(e, t, n, r, i, a) {
			var o = e.pendingLanes;
			((e.pendingLanes = n),
				(e.suspendedLanes = 0),
				(e.pingedLanes = 0),
				(e.warmLanes = 0),
				(e.expiredLanes &= n),
				(e.entangledLanes &= n),
				(e.errorRecoveryDisabledLanes &= n),
				(e.shellSuspendCounter = 0));
			var s = e.entanglements,
				c = e.expirationTimes,
				l = e.hiddenUpdates;
			for (n = o & ~n; 0 < n; ) {
				var u = 31 - Ge(n),
					d = 1 << u;
				((s[u] = 0), (c[u] = -1));
				var f = l[u];
				if (f !== null)
					for (l[u] = null, u = 0; u < f.length; u++) {
						var p = f[u];
						p !== null && (p.lane &= -536870913);
					}
				n &= ~d;
			}
			(r !== 0 && ot(e, r, 0),
				a !== 0 &&
					i === 0 &&
					e.tag !== 0 &&
					(e.suspendedLanes |= a & ~(o & ~t)));
		}
		function ot(e, t, n) {
			((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
			var r = 31 - Ge(t);
			((e.entangledLanes |= t),
				(e.entanglements[r] =
					e.entanglements[r] | 1073741824 | (n & 261930)));
		}
		function st(e, t) {
			var n = (e.entangledLanes |= t);
			for (e = e.entanglements; n; ) {
				var r = 31 - Ge(n),
					i = 1 << r;
				((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
			}
		}
		function ct(e, t) {
			var n = t & -t;
			return (
				(n = n & 42 ? 1 : lt(n)),
				(n & (e.suspendedLanes | t)) === 0 ? n : 0
			);
		}
		function lt(e) {
			switch (e) {
				case 2:
					e = 1;
					break;
				case 8:
					e = 4;
					break;
				case 32:
					e = 16;
					break;
				case 256:
				case 512:
				case 1024:
				case 2048:
				case 4096:
				case 8192:
				case 16384:
				case 32768:
				case 65536:
				case 131072:
				case 262144:
				case 524288:
				case 1048576:
				case 2097152:
				case 4194304:
				case 8388608:
				case 16777216:
				case 33554432:
					e = 128;
					break;
				case 268435456:
					e = 134217728;
					break;
				default:
					e = 0;
			}
			return e;
		}
		function ut(e) {
			return (
				(e &= -e),
				2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
			);
		}
		function dt() {
			var e = D.p;
			return e === 0
				? ((e = window.event), e === void 0 ? 32 : mp(e.type))
				: e;
		}
		function ft(e, t) {
			var n = D.p;
			try {
				return ((D.p = e), t());
			} finally {
				D.p = n;
			}
		}
		var pt = Math.random().toString(36).slice(2),
			mt = `__reactFiber$` + pt,
			ht = `__reactProps$` + pt,
			gt = `__reactContainer$` + pt,
			_t = `__reactEvents$` + pt,
			vt = `__reactListeners$` + pt,
			yt = `__reactHandles$` + pt,
			bt = `__reactResources$` + pt,
			xt = `__reactMarker$` + pt;
		function St(e) {
			(delete e[mt],
				delete e[ht],
				delete e[_t],
				delete e[vt],
				delete e[yt]);
		}
		function Ct(e) {
			var t = e[mt];
			if (t) return t;
			for (var n = e.parentNode; n; ) {
				if ((t = n[gt] || n[mt])) {
					if (
						((n = t.alternate),
						t.child !== null || (n !== null && n.child !== null))
					)
						for (e = df(e); e !== null; ) {
							if ((n = e[mt])) return n;
							e = df(e);
						}
					return t;
				}
				((e = n), (n = e.parentNode));
			}
			return null;
		}
		function wt(e) {
			if ((e = e[mt] || e[gt])) {
				var t = e.tag;
				if (
					t === 5 ||
					t === 6 ||
					t === 13 ||
					t === 31 ||
					t === 26 ||
					t === 27 ||
					t === 3
				)
					return e;
			}
			return null;
		}
		function Tt(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
			throw Error(i(33));
		}
		function Et(e) {
			var t = e[bt];
			return (
				(t ||= e[bt] =
					{
						hoistableStyles: new Map(),
						hoistableScripts: new Map(),
					}),
				t
			);
		}
		function j(e) {
			e[xt] = !0;
		}
		var Dt = new Set(),
			Ot = {};
		function kt(e, t) {
			(At(e, t), At(e + `Capture`, t));
		}
		function At(e, t) {
			for (Ot[e] = t, e = 0; e < t.length; e++) Dt.add(t[e]);
		}
		var jt = RegExp(
				`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
			),
			Mt = {},
			Nt = {};
		function Pt(e) {
			return Oe.call(Nt, e)
				? !0
				: Oe.call(Mt, e)
					? !1
					: jt.test(e)
						? (Nt[e] = !0)
						: ((Mt[e] = !0), !1);
		}
		function Ft(e, t, n) {
			if (Pt(t))
				if (n === null) e.removeAttribute(t);
				else {
					switch (typeof n) {
						case `undefined`:
						case `function`:
						case `symbol`:
							e.removeAttribute(t);
							return;
						case `boolean`:
							var r = t.toLowerCase().slice(0, 5);
							if (r !== `data-` && r !== `aria-`) {
								e.removeAttribute(t);
								return;
							}
					}
					e.setAttribute(t, `` + n);
				}
		}
		function It(e, t, n) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case `undefined`:
					case `function`:
					case `symbol`:
					case `boolean`:
						e.removeAttribute(t);
						return;
				}
				e.setAttribute(t, `` + n);
			}
		}
		function M(e, t, n, r) {
			if (r === null) e.removeAttribute(n);
			else {
				switch (typeof r) {
					case `undefined`:
					case `function`:
					case `symbol`:
					case `boolean`:
						e.removeAttribute(n);
						return;
				}
				e.setAttributeNS(t, n, `` + r);
			}
		}
		function Lt(e) {
			switch (typeof e) {
				case `bigint`:
				case `boolean`:
				case `number`:
				case `string`:
				case `undefined`:
					return e;
				case `object`:
					return e;
				default:
					return ``;
			}
		}
		function Rt(e) {
			var t = e.type;
			return (
				(e = e.nodeName) &&
				e.toLowerCase() === `input` &&
				(t === `checkbox` || t === `radio`)
			);
		}
		function zt(e, t, n) {
			var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
			if (
				!e.hasOwnProperty(t) &&
				r !== void 0 &&
				typeof r.get == `function` &&
				typeof r.set == `function`
			) {
				var i = r.get,
					a = r.set;
				return (
					Object.defineProperty(e, t, {
						configurable: !0,
						get: function () {
							return i.call(this);
						},
						set: function (e) {
							((n = `` + e), a.call(this, e));
						},
					}),
					Object.defineProperty(e, t, { enumerable: r.enumerable }),
					{
						getValue: function () {
							return n;
						},
						setValue: function (e) {
							n = `` + e;
						},
						stopTracking: function () {
							((e._valueTracker = null), delete e[t]);
						},
					}
				);
			}
		}
		function Bt(e) {
			if (!e._valueTracker) {
				var t = Rt(e) ? `checked` : `value`;
				e._valueTracker = zt(e, t, `` + e[t]);
			}
		}
		function Vt(e) {
			if (!e) return !1;
			var t = e._valueTracker;
			if (!t) return !0;
			var n = t.getValue(),
				r = ``;
			return (
				e && (r = Rt(e) ? (e.checked ? `true` : `false`) : e.value),
				(e = r),
				e === n ? !1 : (t.setValue(e), !0)
			);
		}
		function Ht(e) {
			if (
				((e ||= typeof document < `u` ? document : void 0),
				e === void 0)
			)
				return null;
			try {
				return e.activeElement || e.body;
			} catch {
				return e.body;
			}
		}
		var Ut = /[\n"\\]/g;
		function Wt(e) {
			return e.replace(Ut, function (e) {
				return `\\` + e.charCodeAt(0).toString(16) + ` `;
			});
		}
		function Gt(e, t, n, r, i, a, o, s) {
			((e.name = ``),
				o != null &&
				typeof o != `function` &&
				typeof o != `symbol` &&
				typeof o != `boolean`
					? (e.type = o)
					: e.removeAttribute(`type`),
				t == null
					? (o !== `submit` && o !== `reset`) ||
						e.removeAttribute(`value`)
					: o === `number`
						? ((t === 0 && e.value === ``) || e.value != t) &&
							(e.value = `` + Lt(t))
						: e.value !== `` + Lt(t) && (e.value = `` + Lt(t)),
				t == null
					? n == null
						? r != null && e.removeAttribute(`value`)
						: qt(e, o, Lt(n))
					: qt(e, o, Lt(t)),
				i == null && a != null && (e.defaultChecked = !!a),
				i != null &&
					(e.checked =
						i && typeof i != `function` && typeof i != `symbol`),
				s != null &&
				typeof s != `function` &&
				typeof s != `symbol` &&
				typeof s != `boolean`
					? (e.name = `` + Lt(s))
					: e.removeAttribute(`name`));
		}
		function Kt(e, t, n, r, i, a, o, s) {
			if (
				(a != null &&
					typeof a != `function` &&
					typeof a != `symbol` &&
					typeof a != `boolean` &&
					(e.type = a),
				t != null || n != null)
			) {
				if (!((a !== `submit` && a !== `reset`) || t != null)) {
					Bt(e);
					return;
				}
				((n = n == null ? `` : `` + Lt(n)),
					(t = t == null ? n : `` + Lt(t)),
					s || t === e.value || (e.value = t),
					(e.defaultValue = t));
			}
			((r ??= i),
				(r = typeof r != `function` && typeof r != `symbol` && !!r),
				(e.checked = s ? e.checked : !!r),
				(e.defaultChecked = !!r),
				o != null &&
					typeof o != `function` &&
					typeof o != `symbol` &&
					typeof o != `boolean` &&
					(e.name = o),
				Bt(e));
		}
		function qt(e, t, n) {
			(t === `number` && Ht(e.ownerDocument) === e) ||
				e.defaultValue === `` + n ||
				(e.defaultValue = `` + n);
		}
		function Jt(e, t, n, r) {
			if (((e = e.options), t)) {
				t = {};
				for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
				for (n = 0; n < e.length; n++)
					((i = t.hasOwnProperty(`$` + e[n].value)),
						e[n].selected !== i && (e[n].selected = i),
						i && r && (e[n].defaultSelected = !0));
			} else {
				for (n = `` + Lt(n), t = null, i = 0; i < e.length; i++) {
					if (e[i].value === n) {
						((e[i].selected = !0),
							r && (e[i].defaultSelected = !0));
						return;
					}
					t !== null || e[i].disabled || (t = e[i]);
				}
				t !== null && (t.selected = !0);
			}
		}
		function Yt(e, t, n) {
			if (
				t != null &&
				((t = `` + Lt(t)), t !== e.value && (e.value = t), n == null)
			) {
				e.defaultValue !== t && (e.defaultValue = t);
				return;
			}
			e.defaultValue = n == null ? `` : `` + Lt(n);
		}
		function Xt(e, t, n, r) {
			if (t == null) {
				if (r != null) {
					if (n != null) throw Error(i(92));
					if (oe(r)) {
						if (1 < r.length) throw Error(i(93));
						r = r[0];
					}
					n = r;
				}
				((n ??= ``), (t = n));
			}
			((n = Lt(t)),
				(e.defaultValue = n),
				(r = e.textContent),
				r === n && r !== `` && r !== null && (e.value = r),
				Bt(e));
		}
		function Zt(e, t) {
			if (t) {
				var n = e.firstChild;
				if (n && n === e.lastChild && n.nodeType === 3) {
					n.nodeValue = t;
					return;
				}
			}
			e.textContent = t;
		}
		var Qt = new Set(
			`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
				` `,
			),
		);
		function $t(e, t, n) {
			var r = t.indexOf(`--`) === 0;
			n == null || typeof n == `boolean` || n === ``
				? r
					? e.setProperty(t, ``)
					: t === `float`
						? (e.cssFloat = ``)
						: (e[t] = ``)
				: r
					? e.setProperty(t, n)
					: typeof n != `number` || n === 0 || Qt.has(t)
						? t === `float`
							? (e.cssFloat = n)
							: (e[t] = (`` + n).trim())
						: (e[t] = n + `px`);
		}
		function en(e, t, n) {
			if (t != null && typeof t != `object`) throw Error(i(62));
			if (((e = e.style), n != null)) {
				for (var r in n)
					!n.hasOwnProperty(r) ||
						(t != null && t.hasOwnProperty(r)) ||
						(r.indexOf(`--`) === 0
							? e.setProperty(r, ``)
							: r === `float`
								? (e.cssFloat = ``)
								: (e[r] = ``));
				for (var a in t)
					((r = t[a]),
						t.hasOwnProperty(a) && n[a] !== r && $t(e, a, r));
			} else for (var o in t) t.hasOwnProperty(o) && $t(e, o, t[o]);
		}
		function tn(e) {
			if (e.indexOf(`-`) === -1) return !1;
			switch (e) {
				case `annotation-xml`:
				case `color-profile`:
				case `font-face`:
				case `font-face-src`:
				case `font-face-uri`:
				case `font-face-format`:
				case `font-face-name`:
				case `missing-glyph`:
					return !1;
				default:
					return !0;
			}
		}
		var nn = new Map([
				[`acceptCharset`, `accept-charset`],
				[`htmlFor`, `for`],
				[`httpEquiv`, `http-equiv`],
				[`crossOrigin`, `crossorigin`],
				[`accentHeight`, `accent-height`],
				[`alignmentBaseline`, `alignment-baseline`],
				[`arabicForm`, `arabic-form`],
				[`baselineShift`, `baseline-shift`],
				[`capHeight`, `cap-height`],
				[`clipPath`, `clip-path`],
				[`clipRule`, `clip-rule`],
				[`colorInterpolation`, `color-interpolation`],
				[`colorInterpolationFilters`, `color-interpolation-filters`],
				[`colorProfile`, `color-profile`],
				[`colorRendering`, `color-rendering`],
				[`dominantBaseline`, `dominant-baseline`],
				[`enableBackground`, `enable-background`],
				[`fillOpacity`, `fill-opacity`],
				[`fillRule`, `fill-rule`],
				[`floodColor`, `flood-color`],
				[`floodOpacity`, `flood-opacity`],
				[`fontFamily`, `font-family`],
				[`fontSize`, `font-size`],
				[`fontSizeAdjust`, `font-size-adjust`],
				[`fontStretch`, `font-stretch`],
				[`fontStyle`, `font-style`],
				[`fontVariant`, `font-variant`],
				[`fontWeight`, `font-weight`],
				[`glyphName`, `glyph-name`],
				[`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
				[`glyphOrientationVertical`, `glyph-orientation-vertical`],
				[`horizAdvX`, `horiz-adv-x`],
				[`horizOriginX`, `horiz-origin-x`],
				[`imageRendering`, `image-rendering`],
				[`letterSpacing`, `letter-spacing`],
				[`lightingColor`, `lighting-color`],
				[`markerEnd`, `marker-end`],
				[`markerMid`, `marker-mid`],
				[`markerStart`, `marker-start`],
				[`overlinePosition`, `overline-position`],
				[`overlineThickness`, `overline-thickness`],
				[`paintOrder`, `paint-order`],
				[`panose-1`, `panose-1`],
				[`pointerEvents`, `pointer-events`],
				[`renderingIntent`, `rendering-intent`],
				[`shapeRendering`, `shape-rendering`],
				[`stopColor`, `stop-color`],
				[`stopOpacity`, `stop-opacity`],
				[`strikethroughPosition`, `strikethrough-position`],
				[`strikethroughThickness`, `strikethrough-thickness`],
				[`strokeDasharray`, `stroke-dasharray`],
				[`strokeDashoffset`, `stroke-dashoffset`],
				[`strokeLinecap`, `stroke-linecap`],
				[`strokeLinejoin`, `stroke-linejoin`],
				[`strokeMiterlimit`, `stroke-miterlimit`],
				[`strokeOpacity`, `stroke-opacity`],
				[`strokeWidth`, `stroke-width`],
				[`textAnchor`, `text-anchor`],
				[`textDecoration`, `text-decoration`],
				[`textRendering`, `text-rendering`],
				[`transformOrigin`, `transform-origin`],
				[`underlinePosition`, `underline-position`],
				[`underlineThickness`, `underline-thickness`],
				[`unicodeBidi`, `unicode-bidi`],
				[`unicodeRange`, `unicode-range`],
				[`unitsPerEm`, `units-per-em`],
				[`vAlphabetic`, `v-alphabetic`],
				[`vHanging`, `v-hanging`],
				[`vIdeographic`, `v-ideographic`],
				[`vMathematical`, `v-mathematical`],
				[`vectorEffect`, `vector-effect`],
				[`vertAdvY`, `vert-adv-y`],
				[`vertOriginX`, `vert-origin-x`],
				[`vertOriginY`, `vert-origin-y`],
				[`wordSpacing`, `word-spacing`],
				[`writingMode`, `writing-mode`],
				[`xmlnsXlink`, `xmlns:xlink`],
				[`xHeight`, `x-height`],
			]),
			N =
				/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
		function rn(e) {
			return N.test(`` + e)
				? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
				: e;
		}
		function an() {}
		var on = null;
		function sn(e) {
			return (
				(e = e.target || e.srcElement || window),
				e.correspondingUseElement && (e = e.correspondingUseElement),
				e.nodeType === 3 ? e.parentNode : e
			);
		}
		var cn = null,
			ln = null;
		function un(e) {
			var t = wt(e);
			if (t && (e = t.stateNode)) {
				var n = e[ht] || null;
				a: switch (((e = t.stateNode), t.type)) {
					case `input`:
						if (
							(Gt(
								e,
								n.value,
								n.defaultValue,
								n.defaultValue,
								n.checked,
								n.defaultChecked,
								n.type,
								n.name,
							),
							(t = n.name),
							n.type === `radio` && t != null)
						) {
							for (n = e; n.parentNode; ) n = n.parentNode;
							for (
								n = n.querySelectorAll(
									`input[name="` +
										Wt(`` + t) +
										`"][type="radio"]`,
								),
									t = 0;
								t < n.length;
								t++
							) {
								var r = n[t];
								if (r !== e && r.form === e.form) {
									var a = r[ht] || null;
									if (!a) throw Error(i(90));
									Gt(
										r,
										a.value,
										a.defaultValue,
										a.defaultValue,
										a.checked,
										a.defaultChecked,
										a.type,
										a.name,
									);
								}
							}
							for (t = 0; t < n.length; t++)
								((r = n[t]), r.form === e.form && Vt(r));
						}
						break a;
					case `textarea`:
						Yt(e, n.value, n.defaultValue);
						break a;
					case `select`:
						((t = n.value),
							t != null && Jt(e, !!n.multiple, t, !1));
				}
			}
		}
		var dn = !1;
		function fn(e, t, n) {
			if (dn) return e(t, n);
			dn = !0;
			try {
				return e(t);
			} finally {
				if (
					((dn = !1),
					(cn !== null || ln !== null) &&
						(bu(),
						cn && ((t = cn), (e = ln), (ln = cn = null), un(t), e)))
				)
					for (t = 0; t < e.length; t++) un(e[t]);
			}
		}
		function pn(e, t) {
			var n = e.stateNode;
			if (n === null) return null;
			var r = n[ht] || null;
			if (r === null) return null;
			n = r[t];
			a: switch (t) {
				case `onClick`:
				case `onClickCapture`:
				case `onDoubleClick`:
				case `onDoubleClickCapture`:
				case `onMouseDown`:
				case `onMouseDownCapture`:
				case `onMouseMove`:
				case `onMouseMoveCapture`:
				case `onMouseUp`:
				case `onMouseUpCapture`:
				case `onMouseEnter`:
					((r = !r.disabled) ||
						((e = e.type),
						(r = !(
							e === `button` ||
							e === `input` ||
							e === `select` ||
							e === `textarea`
						))),
						(e = !r));
					break a;
				default:
					e = !1;
			}
			if (e) return null;
			if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
			return n;
		}
		var mn = !(
				typeof window > `u` ||
				window.document === void 0 ||
				window.document.createElement === void 0
			),
			hn = !1;
		if (mn)
			try {
				var P = {};
				(Object.defineProperty(P, `passive`, {
					get: function () {
						hn = !0;
					},
				}),
					window.addEventListener(`test`, P, P),
					window.removeEventListener(`test`, P, P));
			} catch {
				hn = !1;
			}
		var gn = null,
			_n = null,
			vn = null;
		function yn() {
			if (vn) return vn;
			var e,
				t = _n,
				n = t.length,
				r,
				i = `value` in gn ? gn.value : gn.textContent,
				a = i.length;
			for (e = 0; e < n && t[e] === i[e]; e++);
			var o = n - e;
			for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
			return (vn = i.slice(e, 1 < r ? 1 - r : void 0));
		}
		function bn(e) {
			var t = e.keyCode;
			return (
				`charCode` in e
					? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
					: (e = t),
				e === 10 && (e = 13),
				32 <= e || e === 13 ? e : 0
			);
		}
		function xn() {
			return !0;
		}
		function Sn() {
			return !1;
		}
		function Cn(e) {
			function t(t, n, r, i, a) {
				for (var o in ((this._reactName = t),
				(this._targetInst = r),
				(this.type = n),
				(this.nativeEvent = i),
				(this.target = a),
				(this.currentTarget = null),
				e))
					e.hasOwnProperty(o) &&
						((t = e[o]), (this[o] = t ? t(i) : i[o]));
				return (
					(this.isDefaultPrevented = (
						i.defaultPrevented == null
							? !1 === i.returnValue
							: i.defaultPrevented
					)
						? xn
						: Sn),
					(this.isPropagationStopped = Sn),
					this
				);
			}
			return (
				f(t.prototype, {
					preventDefault: function () {
						this.defaultPrevented = !0;
						var e = this.nativeEvent;
						e &&
							(e.preventDefault
								? e.preventDefault()
								: typeof e.returnValue != `unknown` &&
									(e.returnValue = !1),
							(this.isDefaultPrevented = xn));
					},
					stopPropagation: function () {
						var e = this.nativeEvent;
						e &&
							(e.stopPropagation
								? e.stopPropagation()
								: typeof e.cancelBubble != `unknown` &&
									(e.cancelBubble = !0),
							(this.isPropagationStopped = xn));
					},
					persist: function () {},
					isPersistent: xn,
				}),
				t
			);
		}
		var wn = {
				eventPhase: 0,
				bubbles: 0,
				cancelable: 0,
				timeStamp: function (e) {
					return e.timeStamp || Date.now();
				},
				defaultPrevented: 0,
				isTrusted: 0,
			},
			Tn = Cn(wn),
			En = f({}, wn, { view: 0, detail: 0 }),
			Dn = Cn(En),
			On,
			kn,
			An,
			jn = f({}, En, {
				screenX: 0,
				screenY: 0,
				clientX: 0,
				clientY: 0,
				pageX: 0,
				pageY: 0,
				ctrlKey: 0,
				shiftKey: 0,
				altKey: 0,
				metaKey: 0,
				getModifierState: Hn,
				button: 0,
				buttons: 0,
				relatedTarget: function (e) {
					return e.relatedTarget === void 0
						? e.fromElement === e.srcElement
							? e.toElement
							: e.fromElement
						: e.relatedTarget;
				},
				movementX: function (e) {
					return `movementX` in e
						? e.movementX
						: (e !== An &&
								(An && e.type === `mousemove`
									? ((On = e.screenX - An.screenX),
										(kn = e.screenY - An.screenY))
									: (kn = On = 0),
								(An = e)),
							On);
				},
				movementY: function (e) {
					return `movementY` in e ? e.movementY : kn;
				},
			}),
			Mn = Cn(jn),
			Nn = Cn(f({}, jn, { dataTransfer: 0 })),
			Pn = Cn(f({}, En, { relatedTarget: 0 })),
			Fn = Cn(
				f({}, wn, {
					animationName: 0,
					elapsedTime: 0,
					pseudoElement: 0,
				}),
			),
			In = Cn(
				f({}, wn, {
					clipboardData: function (e) {
						return `clipboardData` in e
							? e.clipboardData
							: window.clipboardData;
					},
				}),
			),
			Ln = Cn(f({}, wn, { data: 0 })),
			Rn = {
				Esc: `Escape`,
				Spacebar: ` `,
				Left: `ArrowLeft`,
				Up: `ArrowUp`,
				Right: `ArrowRight`,
				Down: `ArrowDown`,
				Del: `Delete`,
				Win: `OS`,
				Menu: `ContextMenu`,
				Apps: `ContextMenu`,
				Scroll: `ScrollLock`,
				MozPrintableKey: `Unidentified`,
			},
			zn = {
				8: `Backspace`,
				9: `Tab`,
				12: `Clear`,
				13: `Enter`,
				16: `Shift`,
				17: `Control`,
				18: `Alt`,
				19: `Pause`,
				20: `CapsLock`,
				27: `Escape`,
				32: ` `,
				33: `PageUp`,
				34: `PageDown`,
				35: `End`,
				36: `Home`,
				37: `ArrowLeft`,
				38: `ArrowUp`,
				39: `ArrowRight`,
				40: `ArrowDown`,
				45: `Insert`,
				46: `Delete`,
				112: `F1`,
				113: `F2`,
				114: `F3`,
				115: `F4`,
				116: `F5`,
				117: `F6`,
				118: `F7`,
				119: `F8`,
				120: `F9`,
				121: `F10`,
				122: `F11`,
				123: `F12`,
				144: `NumLock`,
				145: `ScrollLock`,
				224: `Meta`,
			},
			Bn = {
				Alt: `altKey`,
				Control: `ctrlKey`,
				Meta: `metaKey`,
				Shift: `shiftKey`,
			};
		function Vn(e) {
			var t = this.nativeEvent;
			return t.getModifierState
				? t.getModifierState(e)
				: (e = Bn[e])
					? !!t[e]
					: !1;
		}
		function Hn() {
			return Vn;
		}
		var Un = Cn(
				f({}, En, {
					key: function (e) {
						if (e.key) {
							var t = Rn[e.key] || e.key;
							if (t !== `Unidentified`) return t;
						}
						return e.type === `keypress`
							? ((e = bn(e)),
								e === 13 ? `Enter` : String.fromCharCode(e))
							: e.type === `keydown` || e.type === `keyup`
								? zn[e.keyCode] || `Unidentified`
								: ``;
					},
					code: 0,
					location: 0,
					ctrlKey: 0,
					shiftKey: 0,
					altKey: 0,
					metaKey: 0,
					repeat: 0,
					locale: 0,
					getModifierState: Hn,
					charCode: function (e) {
						return e.type === `keypress` ? bn(e) : 0;
					},
					keyCode: function (e) {
						return e.type === `keydown` || e.type === `keyup`
							? e.keyCode
							: 0;
					},
					which: function (e) {
						return e.type === `keypress`
							? bn(e)
							: e.type === `keydown` || e.type === `keyup`
								? e.keyCode
								: 0;
					},
				}),
			),
			Wn = Cn(
				f({}, jn, {
					pointerId: 0,
					width: 0,
					height: 0,
					pressure: 0,
					tangentialPressure: 0,
					tiltX: 0,
					tiltY: 0,
					twist: 0,
					pointerType: 0,
					isPrimary: 0,
				}),
			),
			Gn = Cn(
				f({}, En, {
					touches: 0,
					targetTouches: 0,
					changedTouches: 0,
					altKey: 0,
					metaKey: 0,
					ctrlKey: 0,
					shiftKey: 0,
					getModifierState: Hn,
				}),
			),
			Kn = Cn(
				f({}, wn, {
					propertyName: 0,
					elapsedTime: 0,
					pseudoElement: 0,
				}),
			),
			qn = Cn(
				f({}, jn, {
					deltaX: function (e) {
						return `deltaX` in e
							? e.deltaX
							: `wheelDeltaX` in e
								? -e.wheelDeltaX
								: 0;
					},
					deltaY: function (e) {
						return `deltaY` in e
							? e.deltaY
							: `wheelDeltaY` in e
								? -e.wheelDeltaY
								: `wheelDelta` in e
									? -e.wheelDelta
									: 0;
					},
					deltaZ: 0,
					deltaMode: 0,
				}),
			),
			Jn = Cn(f({}, wn, { newState: 0, oldState: 0 })),
			Yn = [9, 13, 27, 32],
			Xn = mn && `CompositionEvent` in window,
			Zn = null;
		mn && `documentMode` in document && (Zn = document.documentMode);
		var Qn = mn && `TextEvent` in window && !Zn,
			$n = mn && (!Xn || (Zn && 8 < Zn && 11 >= Zn)),
			er = ` `,
			tr = !1;
		function nr(e, t) {
			switch (e) {
				case `keyup`:
					return Yn.indexOf(t.keyCode) !== -1;
				case `keydown`:
					return t.keyCode !== 229;
				case `keypress`:
				case `mousedown`:
				case `focusout`:
					return !0;
				default:
					return !1;
			}
		}
		function rr(e) {
			return (
				(e = e.detail),
				typeof e == `object` && `data` in e ? e.data : null
			);
		}
		var ir = !1;
		function ar(e, t) {
			switch (e) {
				case `compositionend`:
					return rr(t);
				case `keypress`:
					return t.which === 32 ? ((tr = !0), er) : null;
				case `textInput`:
					return ((e = t.data), e === er && tr ? null : e);
				default:
					return null;
			}
		}
		function or(e, t) {
			if (ir)
				return e === `compositionend` || (!Xn && nr(e, t))
					? ((e = yn()), (vn = _n = gn = null), (ir = !1), e)
					: null;
			switch (e) {
				case `paste`:
					return null;
				case `keypress`:
					if (
						!(t.ctrlKey || t.altKey || t.metaKey) ||
						(t.ctrlKey && t.altKey)
					) {
						if (t.char && 1 < t.char.length) return t.char;
						if (t.which) return String.fromCharCode(t.which);
					}
					return null;
				case `compositionend`:
					return $n && t.locale !== `ko` ? null : t.data;
				default:
					return null;
			}
		}
		var sr = {
			color: !0,
			date: !0,
			datetime: !0,
			"datetime-local": !0,
			email: !0,
			month: !0,
			number: !0,
			password: !0,
			range: !0,
			search: !0,
			tel: !0,
			text: !0,
			time: !0,
			url: !0,
			week: !0,
		};
		function cr(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t === `input` ? !!sr[e.type] : t === `textarea`;
		}
		function lr(e, t, n, r) {
			(cn ? (ln ? ln.push(r) : (ln = [r])) : (cn = r),
				(t = Ed(t, `onChange`)),
				0 < t.length &&
					((n = new Tn(`onChange`, `change`, null, n, r)),
					e.push({ event: n, listeners: t })));
		}
		var ur = null,
			dr = null;
		function fr(e) {
			yd(e, 0);
		}
		function pr(e) {
			if (Vt(Tt(e))) return e;
		}
		function mr(e, t) {
			if (e === `change`) return t;
		}
		var hr = !1;
		if (mn) {
			var gr;
			if (mn) {
				var _r = `oninput` in document;
				if (!_r) {
					var vr = document.createElement(`div`);
					(vr.setAttribute(`oninput`, `return;`),
						(_r = typeof vr.oninput == `function`));
				}
				gr = _r;
			} else gr = !1;
			hr = gr && (!document.documentMode || 9 < document.documentMode);
		}
		function yr() {
			ur && (ur.detachEvent(`onpropertychange`, br), (dr = ur = null));
		}
		function br(e) {
			if (e.propertyName === `value` && pr(dr)) {
				var t = [];
				(lr(t, dr, e, sn(e)), fn(fr, t));
			}
		}
		function xr(e, t, n) {
			e === `focusin`
				? (yr(),
					(ur = t),
					(dr = n),
					ur.attachEvent(`onpropertychange`, br))
				: e === `focusout` && yr();
		}
		function Sr(e) {
			if (e === `selectionchange` || e === `keyup` || e === `keydown`)
				return pr(dr);
		}
		function Cr(e, t) {
			if (e === `click`) return pr(t);
		}
		function wr(e, t) {
			if (e === `input` || e === `change`) return pr(t);
		}
		function Tr(e, t) {
			return (
				(e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t)
			);
		}
		var Er = typeof Object.is == `function` ? Object.is : Tr;
		function Dr(e, t) {
			if (Er(e, t)) return !0;
			if (typeof e != `object` || !e || typeof t != `object` || !t)
				return !1;
			var n = Object.keys(e),
				r = Object.keys(t);
			if (n.length !== r.length) return !1;
			for (r = 0; r < n.length; r++) {
				var i = n[r];
				if (!Oe.call(t, i) || !Er(e[i], t[i])) return !1;
			}
			return !0;
		}
		function Or(e) {
			for (; e && e.firstChild; ) e = e.firstChild;
			return e;
		}
		function kr(e, t) {
			var n = Or(e);
			e = 0;
			for (var r; n; ) {
				if (n.nodeType === 3) {
					if (((r = e + n.textContent.length), e <= t && r >= t))
						return { node: n, offset: t - e };
					e = r;
				}
				a: {
					for (; n; ) {
						if (n.nextSibling) {
							n = n.nextSibling;
							break a;
						}
						n = n.parentNode;
					}
					n = void 0;
				}
				n = Or(n);
			}
		}
		function Ar(e, t) {
			return e && t
				? e === t
					? !0
					: e && e.nodeType === 3
						? !1
						: t && t.nodeType === 3
							? Ar(e, t.parentNode)
							: `contains` in e
								? e.contains(t)
								: e.compareDocumentPosition
									? !!(e.compareDocumentPosition(t) & 16)
									: !1
				: !1;
		}
		function jr(e) {
			e =
				e != null &&
				e.ownerDocument != null &&
				e.ownerDocument.defaultView != null
					? e.ownerDocument.defaultView
					: window;
			for (var t = Ht(e.document); t instanceof e.HTMLIFrameElement; ) {
				try {
					var n = typeof t.contentWindow.location.href == `string`;
				} catch {
					n = !1;
				}
				if (n) e = t.contentWindow;
				else break;
				t = Ht(e.document);
			}
			return t;
		}
		function Mr(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return (
				t &&
				((t === `input` &&
					(e.type === `text` ||
						e.type === `search` ||
						e.type === `tel` ||
						e.type === `url` ||
						e.type === `password`)) ||
					t === `textarea` ||
					e.contentEditable === `true`)
			);
		}
		var Nr =
				mn && `documentMode` in document && 11 >= document.documentMode,
			Pr = null,
			Fr = null,
			Ir = null,
			Lr = !1;
		function Rr(e, t, n) {
			var r =
				n.window === n
					? n.document
					: n.nodeType === 9
						? n
						: n.ownerDocument;
			Lr ||
				Pr == null ||
				Pr !== Ht(r) ||
				((r = Pr),
				`selectionStart` in r && Mr(r)
					? (r = { start: r.selectionStart, end: r.selectionEnd })
					: ((r = (
							(r.ownerDocument && r.ownerDocument.defaultView) ||
							window
						).getSelection()),
						(r = {
							anchorNode: r.anchorNode,
							anchorOffset: r.anchorOffset,
							focusNode: r.focusNode,
							focusOffset: r.focusOffset,
						})),
				(Ir && Dr(Ir, r)) ||
					((Ir = r),
					(r = Ed(Fr, `onSelect`)),
					0 < r.length &&
						((t = new Tn(`onSelect`, `select`, null, t, n)),
						e.push({ event: t, listeners: r }),
						(t.target = Pr))));
		}
		function zr(e, t) {
			var n = {};
			return (
				(n[e.toLowerCase()] = t.toLowerCase()),
				(n[`Webkit` + e] = `webkit` + t),
				(n[`Moz` + e] = `moz` + t),
				n
			);
		}
		var Br = {
				animationend: zr(`Animation`, `AnimationEnd`),
				animationiteration: zr(`Animation`, `AnimationIteration`),
				animationstart: zr(`Animation`, `AnimationStart`),
				transitionrun: zr(`Transition`, `TransitionRun`),
				transitionstart: zr(`Transition`, `TransitionStart`),
				transitioncancel: zr(`Transition`, `TransitionCancel`),
				transitionend: zr(`Transition`, `TransitionEnd`),
			},
			Vr = {},
			Hr = {};
		mn &&
			((Hr = document.createElement(`div`).style),
			`AnimationEvent` in window ||
				(delete Br.animationend.animation,
				delete Br.animationiteration.animation,
				delete Br.animationstart.animation),
			`TransitionEvent` in window || delete Br.transitionend.transition);
		function Ur(e) {
			if (Vr[e]) return Vr[e];
			if (!Br[e]) return e;
			var t = Br[e],
				n;
			for (n in t)
				if (t.hasOwnProperty(n) && n in Hr) return (Vr[e] = t[n]);
			return e;
		}
		var F = Ur(`animationend`),
			Wr = Ur(`animationiteration`),
			Gr = Ur(`animationstart`),
			Kr = Ur(`transitionrun`),
			qr = Ur(`transitionstart`),
			Jr = Ur(`transitioncancel`),
			Yr = Ur(`transitionend`),
			Xr = new Map(),
			Zr =
				`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
					` `,
				);
		Zr.push(`scrollEnd`);
		function Qr(e, t) {
			(Xr.set(e, t), kt(t, [e]));
		}
		var $r =
				typeof reportError == `function`
					? reportError
					: function (e) {
							if (
								typeof window == `object` &&
								typeof window.ErrorEvent == `function`
							) {
								var t = new window.ErrorEvent(`error`, {
									bubbles: !0,
									cancelable: !0,
									message:
										typeof e == `object` &&
										e &&
										typeof e.message == `string`
											? String(e.message)
											: String(e),
									error: e,
								});
								if (!window.dispatchEvent(t)) return;
							} else if (
								typeof process == `object` &&
								typeof process.emit == `function`
							) {
								process.emit(`uncaughtException`, e);
								return;
							}
							console.error(e);
						},
			ei = [],
			ti = 0,
			ni = 0;
		function ri() {
			for (var e = ti, t = (ni = ti = 0); t < e; ) {
				var n = ei[t];
				ei[t++] = null;
				var r = ei[t];
				ei[t++] = null;
				var i = ei[t];
				ei[t++] = null;
				var a = ei[t];
				if (((ei[t++] = null), r !== null && i !== null)) {
					var o = r.pending;
					(o === null
						? (i.next = i)
						: ((i.next = o.next), (o.next = i)),
						(r.pending = i));
				}
				a !== 0 && si(n, i, a);
			}
		}
		function ii(e, t, n, r) {
			((ei[ti++] = e),
				(ei[ti++] = t),
				(ei[ti++] = n),
				(ei[ti++] = r),
				(ni |= r),
				(e.lanes |= r),
				(e = e.alternate),
				e !== null && (e.lanes |= r));
		}
		function ai(e, t, n, r) {
			return (ii(e, t, n, r), ci(e));
		}
		function oi(e, t) {
			return (ii(e, null, null, t), ci(e));
		}
		function si(e, t, n) {
			e.lanes |= n;
			var r = e.alternate;
			r !== null && (r.lanes |= n);
			for (var i = !1, a = e.return; a !== null; )
				((a.childLanes |= n),
					(r = a.alternate),
					r !== null && (r.childLanes |= n),
					a.tag === 22 &&
						((e = a.stateNode),
						e === null || e._visibility & 1 || (i = !0)),
					(e = a),
					(a = a.return));
			return e.tag === 3
				? ((a = e.stateNode),
					i &&
						t !== null &&
						((i = 31 - Ge(n)),
						(e = a.hiddenUpdates),
						(r = e[i]),
						r === null ? (e[i] = [t]) : r.push(t),
						(t.lane = n | 536870912)),
					a)
				: null;
		}
		function ci(e) {
			if (50 < du) throw ((du = 0), (fu = null), Error(i(185)));
			for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
			return e.tag === 3 ? e.stateNode : null;
		}
		var li = {};
		function ui(e, t, n, r) {
			((this.tag = e),
				(this.key = n),
				(this.sibling =
					this.child =
					this.return =
					this.stateNode =
					this.type =
					this.elementType =
						null),
				(this.index = 0),
				(this.refCleanup = this.ref = null),
				(this.pendingProps = t),
				(this.dependencies =
					this.memoizedState =
					this.updateQueue =
					this.memoizedProps =
						null),
				(this.mode = r),
				(this.subtreeFlags = this.flags = 0),
				(this.deletions = null),
				(this.childLanes = this.lanes = 0),
				(this.alternate = null));
		}
		function di(e, t, n, r) {
			return new ui(e, t, n, r);
		}
		function fi(e) {
			return ((e = e.prototype), !(!e || !e.isReactComponent));
		}
		function pi(e, t) {
			var n = e.alternate;
			return (
				n === null
					? ((n = di(e.tag, t, e.key, e.mode)),
						(n.elementType = e.elementType),
						(n.type = e.type),
						(n.stateNode = e.stateNode),
						(n.alternate = e),
						(e.alternate = n))
					: ((n.pendingProps = t),
						(n.type = e.type),
						(n.flags = 0),
						(n.subtreeFlags = 0),
						(n.deletions = null)),
				(n.flags = e.flags & 65011712),
				(n.childLanes = e.childLanes),
				(n.lanes = e.lanes),
				(n.child = e.child),
				(n.memoizedProps = e.memoizedProps),
				(n.memoizedState = e.memoizedState),
				(n.updateQueue = e.updateQueue),
				(t = e.dependencies),
				(n.dependencies =
					t === null
						? null
						: { lanes: t.lanes, firstContext: t.firstContext }),
				(n.sibling = e.sibling),
				(n.index = e.index),
				(n.ref = e.ref),
				(n.refCleanup = e.refCleanup),
				n
			);
		}
		function mi(e, t) {
			e.flags &= 65011714;
			var n = e.alternate;
			return (
				n === null
					? ((e.childLanes = 0),
						(e.lanes = t),
						(e.child = null),
						(e.subtreeFlags = 0),
						(e.memoizedProps = null),
						(e.memoizedState = null),
						(e.updateQueue = null),
						(e.dependencies = null),
						(e.stateNode = null))
					: ((e.childLanes = n.childLanes),
						(e.lanes = n.lanes),
						(e.child = n.child),
						(e.subtreeFlags = 0),
						(e.deletions = null),
						(e.memoizedProps = n.memoizedProps),
						(e.memoizedState = n.memoizedState),
						(e.updateQueue = n.updateQueue),
						(e.type = n.type),
						(t = n.dependencies),
						(e.dependencies =
							t === null
								? null
								: {
										lanes: t.lanes,
										firstContext: t.firstContext,
									})),
				e
			);
		}
		function hi(e, t, n, r, a, o) {
			var s = 0;
			if (((r = e), typeof e == `function`)) fi(e) && (s = 1);
			else if (typeof e == `string`)
				s = Uf(e, n, fe.current)
					? 26
					: e === `html` || e === `head` || e === `body`
						? 27
						: 5;
			else
				a: switch (e) {
					case T:
						return (
							(e = di(31, n, t, a)),
							(e.elementType = T),
							(e.lanes = o),
							e
						);
					case g:
						return gi(n.children, a, o, t);
					case _:
						((s = 8), (a |= 24));
						break;
					case v:
						return (
							(e = di(12, n, t, a | 2)),
							(e.elementType = v),
							(e.lanes = o),
							e
						);
					case S:
						return (
							(e = di(13, n, t, a)),
							(e.elementType = S),
							(e.lanes = o),
							e
						);
					case C:
						return (
							(e = di(19, n, t, a)),
							(e.elementType = C),
							(e.lanes = o),
							e
						);
					default:
						if (typeof e == `object` && e)
							switch (e.$$typeof) {
								case b:
									s = 10;
									break a;
								case y:
									s = 9;
									break a;
								case x:
									s = 11;
									break a;
								case w:
									s = 14;
									break a;
								case ee:
									((s = 16), (r = null));
									break a;
							}
						((s = 29),
							(n = Error(
								i(130, e === null ? `null` : typeof e, ``),
							)),
							(r = null));
				}
			return (
				(t = di(s, n, t, a)),
				(t.elementType = e),
				(t.type = r),
				(t.lanes = o),
				t
			);
		}
		function gi(e, t, n, r) {
			return ((e = di(7, e, r, t)), (e.lanes = n), e);
		}
		function _i(e, t, n) {
			return ((e = di(6, e, null, t)), (e.lanes = n), e);
		}
		function vi(e) {
			var t = di(18, null, null, 0);
			return ((t.stateNode = e), t);
		}
		function yi(e, t, n) {
			return (
				(t = di(4, e.children === null ? [] : e.children, e.key, t)),
				(t.lanes = n),
				(t.stateNode = {
					containerInfo: e.containerInfo,
					pendingChildren: null,
					implementation: e.implementation,
				}),
				t
			);
		}
		var bi = new WeakMap();
		function xi(e, t) {
			if (typeof e == `object` && e) {
				var n = bi.get(e);
				return n === void 0
					? ((t = { value: e, source: t, stack: De(t) }),
						bi.set(e, t),
						t)
					: n;
			}
			return { value: e, source: t, stack: De(t) };
		}
		var Si = [],
			Ci = 0,
			wi = null,
			Ti = 0,
			Ei = [],
			Di = 0,
			Oi = null,
			ki = 1,
			Ai = ``;
		function ji(e, t) {
			((Si[Ci++] = Ti), (Si[Ci++] = wi), (wi = e), (Ti = t));
		}
		function Mi(e, t, n) {
			((Ei[Di++] = ki), (Ei[Di++] = Ai), (Ei[Di++] = Oi), (Oi = e));
			var r = ki;
			e = Ai;
			var i = 32 - Ge(r) - 1;
			((r &= ~(1 << i)), (n += 1));
			var a = 32 - Ge(t) + i;
			if (30 < a) {
				var o = i - (i % 5);
				((a = (r & ((1 << o) - 1)).toString(32)),
					(r >>= o),
					(i -= o),
					(ki = (1 << (32 - Ge(t) + i)) | (n << i) | r),
					(Ai = a + e));
			} else ((ki = (1 << a) | (n << i) | r), (Ai = e));
		}
		function Ni(e) {
			e.return !== null && (ji(e, 1), Mi(e, 1, 0));
		}
		function I(e) {
			for (; e === wi; )
				((wi = Si[--Ci]),
					(Si[Ci] = null),
					(Ti = Si[--Ci]),
					(Si[Ci] = null));
			for (; e === Oi; )
				((Oi = Ei[--Di]),
					(Ei[Di] = null),
					(Ai = Ei[--Di]),
					(Ei[Di] = null),
					(ki = Ei[--Di]),
					(Ei[Di] = null));
		}
		function Pi(e, t) {
			((Ei[Di++] = ki),
				(Ei[Di++] = Ai),
				(Ei[Di++] = Oi),
				(ki = t.id),
				(Ai = t.overflow),
				(Oi = e));
		}
		var Fi = null,
			L = null,
			R = !1,
			Ii = null,
			Li = !1,
			Ri = Error(i(519));
		function zi(e) {
			throw (
				Gi(
					xi(
						Error(
							i(
								418,
								1 < arguments.length &&
									arguments[1] !== void 0 &&
									arguments[1]
									? `text`
									: `HTML`,
								``,
							),
						),
						e,
					),
				),
				Ri
			);
		}
		function Bi(e) {
			var t = e.stateNode,
				n = e.type,
				r = e.memoizedProps;
			switch (((t[mt] = e), (t[ht] = r), n)) {
				case `dialog`:
					(Q(`cancel`, t), Q(`close`, t));
					break;
				case `iframe`:
				case `object`:
				case `embed`:
					Q(`load`, t);
					break;
				case `video`:
				case `audio`:
					for (n = 0; n < _d.length; n++) Q(_d[n], t);
					break;
				case `source`:
					Q(`error`, t);
					break;
				case `img`:
				case `image`:
				case `link`:
					(Q(`error`, t), Q(`load`, t));
					break;
				case `details`:
					Q(`toggle`, t);
					break;
				case `input`:
					(Q(`invalid`, t),
						Kt(
							t,
							r.value,
							r.defaultValue,
							r.checked,
							r.defaultChecked,
							r.type,
							r.name,
							!0,
						));
					break;
				case `select`:
					Q(`invalid`, t);
					break;
				case `textarea`:
					(Q(`invalid`, t),
						Xt(t, r.value, r.defaultValue, r.children));
			}
			((n = r.children),
				(typeof n != `string` &&
					typeof n != `number` &&
					typeof n != `bigint`) ||
				t.textContent === `` + n ||
				!0 === r.suppressHydrationWarning ||
				Md(t.textContent, n)
					? (r.popover != null &&
							(Q(`beforetoggle`, t), Q(`toggle`, t)),
						r.onScroll != null && Q(`scroll`, t),
						r.onScrollEnd != null && Q(`scrollend`, t),
						r.onClick != null && (t.onclick = an),
						(t = !0))
					: (t = !1),
				t || zi(e, !0));
		}
		function Vi(e) {
			for (Fi = e.return; Fi; )
				switch (Fi.tag) {
					case 5:
					case 31:
					case 13:
						Li = !1;
						return;
					case 27:
					case 3:
						Li = !0;
						return;
					default:
						Fi = Fi.return;
				}
		}
		function Hi(e) {
			if (e !== Fi) return !1;
			if (!R) return (Vi(e), (R = !0), !1);
			var t = e.tag,
				n;
			if (
				((n = t !== 3 && t !== 27) &&
					((n = t === 5) &&
						((n = e.type),
						(n =
							!(n !== `form` && n !== `button`) ||
							Ud(e.type, e.memoizedProps))),
					(n = !n)),
				n && L && zi(e),
				Vi(e),
				t === 13)
			) {
				if (
					((e = e.memoizedState),
					(e = e === null ? null : e.dehydrated),
					!e)
				)
					throw Error(i(317));
				L = uf(e);
			} else if (t === 31) {
				if (
					((e = e.memoizedState),
					(e = e === null ? null : e.dehydrated),
					!e)
				)
					throw Error(i(317));
				L = uf(e);
			} else
				t === 27
					? ((t = L),
						Zd(e.type) ? ((e = lf), (lf = null), (L = e)) : (L = t))
					: (L = Fi ? cf(e.stateNode.nextSibling) : null);
			return !0;
		}
		function Ui() {
			((L = Fi = null), (R = !1));
		}
		function Wi() {
			var e = Ii;
			return (
				e !== null &&
					(Zl === null ? (Zl = e) : Zl.push.apply(Zl, e),
					(Ii = null)),
				e
			);
		}
		function Gi(e) {
			Ii === null ? (Ii = [e]) : Ii.push(e);
		}
		var Ki = ue(null),
			qi = null,
			Ji = null;
		function Yi(e, t, n) {
			(O(Ki, t._currentValue), (t._currentValue = n));
		}
		function Xi(e) {
			((e._currentValue = Ki.current), de(Ki));
		}
		function Zi(e, t, n) {
			for (; e !== null; ) {
				var r = e.alternate;
				if (
					((e.childLanes & t) === t
						? r !== null &&
							(r.childLanes & t) !== t &&
							(r.childLanes |= t)
						: ((e.childLanes |= t),
							r !== null && (r.childLanes |= t)),
					e === n)
				)
					break;
				e = e.return;
			}
		}
		function Qi(e, t, n, r) {
			var a = e.child;
			for (a !== null && (a.return = e); a !== null; ) {
				var o = a.dependencies;
				if (o !== null) {
					var s = a.child;
					o = o.firstContext;
					a: for (; o !== null; ) {
						var c = o;
						o = a;
						for (var l = 0; l < t.length; l++)
							if (c.context === t[l]) {
								((o.lanes |= n),
									(c = o.alternate),
									c !== null && (c.lanes |= n),
									Zi(o.return, n, e),
									r || (s = null));
								break a;
							}
						o = c.next;
					}
				} else if (a.tag === 18) {
					if (((s = a.return), s === null)) throw Error(i(341));
					((s.lanes |= n),
						(o = s.alternate),
						o !== null && (o.lanes |= n),
						Zi(s, n, e),
						(s = null));
				} else s = a.child;
				if (s !== null) s.return = a;
				else
					for (s = a; s !== null; ) {
						if (s === e) {
							s = null;
							break;
						}
						if (((a = s.sibling), a !== null)) {
							((a.return = s.return), (s = a));
							break;
						}
						s = s.return;
					}
				a = s;
			}
		}
		function $i(e, t, n, r) {
			e = null;
			for (var a = t, o = !1; a !== null; ) {
				if (!o) {
					if (a.flags & 524288) o = !0;
					else if (a.flags & 262144) break;
				}
				if (a.tag === 10) {
					var s = a.alternate;
					if (s === null) throw Error(i(387));
					if (((s = s.memoizedProps), s !== null)) {
						var c = a.type;
						Er(a.pendingProps.value, s.value) ||
							(e === null ? (e = [c]) : e.push(c));
					}
				} else if (a === he.current) {
					if (((s = a.alternate), s === null)) throw Error(i(387));
					s.memoizedState.memoizedState !==
						a.memoizedState.memoizedState &&
						(e === null ? (e = [Qf]) : e.push(Qf));
				}
				a = a.return;
			}
			(e !== null && Qi(t, e, n, r), (t.flags |= 262144));
		}
		function ea(e) {
			for (e = e.firstContext; e !== null; ) {
				if (!Er(e.context._currentValue, e.memoizedValue)) return !0;
				e = e.next;
			}
			return !1;
		}
		function ta(e) {
			((qi = e),
				(Ji = null),
				(e = e.dependencies),
				e !== null && (e.firstContext = null));
		}
		function na(e) {
			return ia(qi, e);
		}
		function ra(e, t) {
			return (qi === null && ta(e), ia(e, t));
		}
		function ia(e, t) {
			var n = t._currentValue;
			if (
				((t = { context: t, memoizedValue: n, next: null }),
				Ji === null)
			) {
				if (e === null) throw Error(i(308));
				((Ji = t),
					(e.dependencies = { lanes: 0, firstContext: t }),
					(e.flags |= 524288));
			} else Ji = Ji.next = t;
			return n;
		}
		var aa =
				typeof AbortController < `u`
					? AbortController
					: function () {
							var e = [],
								t = (this.signal = {
									aborted: !1,
									addEventListener: function (t, n) {
										e.push(n);
									},
								});
							this.abort = function () {
								((t.aborted = !0),
									e.forEach(function (e) {
										return e();
									}));
							};
						},
			oa = t.unstable_scheduleCallback,
			sa = t.unstable_NormalPriority,
			ca = {
				$$typeof: b,
				Consumer: null,
				Provider: null,
				_currentValue: null,
				_currentValue2: null,
				_threadCount: 0,
			};
		function la() {
			return { controller: new aa(), data: new Map(), refCount: 0 };
		}
		function ua(e) {
			(e.refCount--,
				e.refCount === 0 &&
					oa(sa, function () {
						e.controller.abort();
					}));
		}
		var da = null,
			fa = 0,
			pa = 0,
			ma = null;
		function ha(e, t) {
			if (da === null) {
				var n = (da = []);
				((fa = 0),
					(pa = dd()),
					(ma = {
						status: `pending`,
						value: void 0,
						then: function (e) {
							n.push(e);
						},
					}));
			}
			return (fa++, t.then(ga, ga), t);
		}
		function ga() {
			if (--fa === 0 && da !== null) {
				ma !== null && (ma.status = `fulfilled`);
				var e = da;
				((da = null), (pa = 0), (ma = null));
				for (var t = 0; t < e.length; t++) (0, e[t])();
			}
		}
		function _a(e, t) {
			var n = [],
				r = {
					status: `pending`,
					value: null,
					reason: null,
					then: function (e) {
						n.push(e);
					},
				};
			return (
				e.then(
					function () {
						((r.status = `fulfilled`), (r.value = t));
						for (var e = 0; e < n.length; e++) (0, n[e])(t);
					},
					function (e) {
						for (
							r.status = `rejected`, r.reason = e, e = 0;
							e < n.length;
							e++
						)
							(0, n[e])(void 0);
					},
				),
				r
			);
		}
		var va = E.S;
		E.S = function (e, t) {
			((eu = Ne()),
				typeof t == `object` &&
					t &&
					typeof t.then == `function` &&
					ha(e, t),
				va !== null && va(e, t));
		};
		var ya = ue(null);
		function ba() {
			var e = ya.current;
			return e === null ? q.pooledCache : e;
		}
		function xa(e, t) {
			t === null ? O(ya, ya.current) : O(ya, t.pool);
		}
		function Sa() {
			var e = ba();
			return e === null ? null : { parent: ca._currentValue, pool: e };
		}
		var Ca = Error(i(460)),
			wa = Error(i(474)),
			Ta = Error(i(542)),
			Ea = { then: function () {} };
		function Da(e) {
			return ((e = e.status), e === `fulfilled` || e === `rejected`);
		}
		function Oa(e, t, n) {
			switch (
				((n = e[n]),
				n === void 0 ? e.push(t) : n !== t && (t.then(an, an), (t = n)),
				t.status)
			) {
				case `fulfilled`:
					return t.value;
				case `rejected`:
					throw ((e = t.reason), Ma(e), e);
				default:
					if (typeof t.status == `string`) t.then(an, an);
					else {
						if (
							((e = q), e !== null && 100 < e.shellSuspendCounter)
						)
							throw Error(i(482));
						((e = t),
							(e.status = `pending`),
							e.then(
								function (e) {
									if (t.status === `pending`) {
										var n = t;
										((n.status = `fulfilled`),
											(n.value = e));
									}
								},
								function (e) {
									if (t.status === `pending`) {
										var n = t;
										((n.status = `rejected`),
											(n.reason = e));
									}
								},
							));
					}
					switch (t.status) {
						case `fulfilled`:
							return t.value;
						case `rejected`:
							throw ((e = t.reason), Ma(e), e);
					}
					throw ((Aa = t), Ca);
			}
		}
		function ka(e) {
			try {
				var t = e._init;
				return t(e._payload);
			} catch (e) {
				throw typeof e == `object` && e && typeof e.then == `function`
					? ((Aa = e), Ca)
					: e;
			}
		}
		var Aa = null;
		function ja() {
			if (Aa === null) throw Error(i(459));
			var e = Aa;
			return ((Aa = null), e);
		}
		function Ma(e) {
			if (e === Ca || e === Ta) throw Error(i(483));
		}
		var Na = null,
			Pa = 0;
		function Fa(e) {
			var t = Pa;
			return ((Pa += 1), Na === null && (Na = []), Oa(Na, e, t));
		}
		function Ia(e, t) {
			((t = t.props.ref), (e.ref = t === void 0 ? null : t));
		}
		function La(e, t) {
			throw t.$$typeof === p
				? Error(i(525))
				: ((e = Object.prototype.toString.call(t)),
					Error(
						i(
							31,
							e === `[object Object]`
								? `object with keys {` +
										Object.keys(t).join(`, `) +
										`}`
								: e,
						),
					));
		}
		function Ra(e) {
			function t(t, n) {
				if (e) {
					var r = t.deletions;
					r === null
						? ((t.deletions = [n]), (t.flags |= 16))
						: r.push(n);
				}
			}
			function n(n, r) {
				if (!e) return null;
				for (; r !== null; ) (t(n, r), (r = r.sibling));
				return null;
			}
			function r(e) {
				for (var t = new Map(); e !== null; )
					(e.key === null ? t.set(e.index, e) : t.set(e.key, e),
						(e = e.sibling));
				return t;
			}
			function a(e, t) {
				return ((e = pi(e, t)), (e.index = 0), (e.sibling = null), e);
			}
			function o(t, n, r) {
				return (
					(t.index = r),
					e
						? ((r = t.alternate),
							r === null
								? ((t.flags |= 67108866), n)
								: ((r = r.index),
									r < n ? ((t.flags |= 67108866), n) : r))
						: ((t.flags |= 1048576), n)
				);
			}
			function s(t) {
				return (e && t.alternate === null && (t.flags |= 67108866), t);
			}
			function c(e, t, n, r) {
				return t === null || t.tag !== 6
					? ((t = _i(n, e.mode, r)), (t.return = e), t)
					: ((t = a(t, n)), (t.return = e), t);
			}
			function l(e, t, n, r) {
				var i = n.type;
				return i === g
					? d(e, t, n.props.children, r, n.key)
					: t !== null &&
						  (t.elementType === i ||
								(typeof i == `object` &&
									i &&
									i.$$typeof === ee &&
									ka(i) === t.type))
						? ((t = a(t, n.props)), Ia(t, n), (t.return = e), t)
						: ((t = hi(n.type, n.key, n.props, null, e.mode, r)),
							Ia(t, n),
							(t.return = e),
							t);
			}
			function u(e, t, n, r) {
				return t === null ||
					t.tag !== 4 ||
					t.stateNode.containerInfo !== n.containerInfo ||
					t.stateNode.implementation !== n.implementation
					? ((t = yi(n, e.mode, r)), (t.return = e), t)
					: ((t = a(t, n.children || [])), (t.return = e), t);
			}
			function d(e, t, n, r, i) {
				return t === null || t.tag !== 7
					? ((t = gi(n, e.mode, r, i)), (t.return = e), t)
					: ((t = a(t, n)), (t.return = e), t);
			}
			function f(e, t, n) {
				if (
					(typeof t == `string` && t !== ``) ||
					typeof t == `number` ||
					typeof t == `bigint`
				)
					return ((t = _i(`` + t, e.mode, n)), (t.return = e), t);
				if (typeof t == `object` && t) {
					switch (t.$$typeof) {
						case m:
							return (
								(n = hi(
									t.type,
									t.key,
									t.props,
									null,
									e.mode,
									n,
								)),
								Ia(n, t),
								(n.return = e),
								n
							);
						case h:
							return ((t = yi(t, e.mode, n)), (t.return = e), t);
						case ee:
							return ((t = ka(t)), f(e, t, n));
					}
					if (oe(t) || re(t))
						return (
							(t = gi(t, e.mode, n, null)),
							(t.return = e),
							t
						);
					if (typeof t.then == `function`) return f(e, Fa(t), n);
					if (t.$$typeof === b) return f(e, ra(e, t), n);
					La(e, t);
				}
				return null;
			}
			function p(e, t, n, r) {
				var i = t === null ? null : t.key;
				if (
					(typeof n == `string` && n !== ``) ||
					typeof n == `number` ||
					typeof n == `bigint`
				)
					return i === null ? c(e, t, `` + n, r) : null;
				if (typeof n == `object` && n) {
					switch (n.$$typeof) {
						case m:
							return n.key === i ? l(e, t, n, r) : null;
						case h:
							return n.key === i ? u(e, t, n, r) : null;
						case ee:
							return ((n = ka(n)), p(e, t, n, r));
					}
					if (oe(n) || re(n))
						return i === null ? d(e, t, n, r, null) : null;
					if (typeof n.then == `function`) return p(e, t, Fa(n), r);
					if (n.$$typeof === b) return p(e, t, ra(e, n), r);
					La(e, n);
				}
				return null;
			}
			function _(e, t, n, r, i) {
				if (
					(typeof r == `string` && r !== ``) ||
					typeof r == `number` ||
					typeof r == `bigint`
				)
					return ((e = e.get(n) || null), c(t, e, `` + r, i));
				if (typeof r == `object` && r) {
					switch (r.$$typeof) {
						case m:
							return (
								(e = e.get(r.key === null ? n : r.key) || null),
								l(t, e, r, i)
							);
						case h:
							return (
								(e = e.get(r.key === null ? n : r.key) || null),
								u(t, e, r, i)
							);
						case ee:
							return ((r = ka(r)), _(e, t, n, r, i));
					}
					if (oe(r) || re(r))
						return ((e = e.get(n) || null), d(t, e, r, i, null));
					if (typeof r.then == `function`)
						return _(e, t, n, Fa(r), i);
					if (r.$$typeof === b) return _(e, t, n, ra(t, r), i);
					La(t, r);
				}
				return null;
			}
			function v(i, a, s, c) {
				for (
					var l = null, u = null, d = a, m = (a = 0), h = null;
					d !== null && m < s.length;
					m++
				) {
					d.index > m ? ((h = d), (d = null)) : (h = d.sibling);
					var g = p(i, d, s[m], c);
					if (g === null) {
						d === null && (d = h);
						break;
					}
					(e && d && g.alternate === null && t(i, d),
						(a = o(g, a, m)),
						u === null ? (l = g) : (u.sibling = g),
						(u = g),
						(d = h));
				}
				if (m === s.length) return (n(i, d), R && ji(i, m), l);
				if (d === null) {
					for (; m < s.length; m++)
						((d = f(i, s[m], c)),
							d !== null &&
								((a = o(d, a, m)),
								u === null ? (l = d) : (u.sibling = d),
								(u = d)));
					return (R && ji(i, m), l);
				}
				for (d = r(d); m < s.length; m++)
					((h = _(d, i, m, s[m], c)),
						h !== null &&
							(e &&
								h.alternate !== null &&
								d.delete(h.key === null ? m : h.key),
							(a = o(h, a, m)),
							u === null ? (l = h) : (u.sibling = h),
							(u = h)));
				return (
					e &&
						d.forEach(function (e) {
							return t(i, e);
						}),
					R && ji(i, m),
					l
				);
			}
			function y(a, s, c, l) {
				if (c == null) throw Error(i(151));
				for (
					var u = null,
						d = null,
						m = s,
						h = (s = 0),
						g = null,
						v = c.next();
					m !== null && !v.done;
					h++, v = c.next()
				) {
					m.index > h ? ((g = m), (m = null)) : (g = m.sibling);
					var y = p(a, m, v.value, l);
					if (y === null) {
						m === null && (m = g);
						break;
					}
					(e && m && y.alternate === null && t(a, m),
						(s = o(y, s, h)),
						d === null ? (u = y) : (d.sibling = y),
						(d = y),
						(m = g));
				}
				if (v.done) return (n(a, m), R && ji(a, h), u);
				if (m === null) {
					for (; !v.done; h++, v = c.next())
						((v = f(a, v.value, l)),
							v !== null &&
								((s = o(v, s, h)),
								d === null ? (u = v) : (d.sibling = v),
								(d = v)));
					return (R && ji(a, h), u);
				}
				for (m = r(m); !v.done; h++, v = c.next())
					((v = _(m, a, h, v.value, l)),
						v !== null &&
							(e &&
								v.alternate !== null &&
								m.delete(v.key === null ? h : v.key),
							(s = o(v, s, h)),
							d === null ? (u = v) : (d.sibling = v),
							(d = v)));
				return (
					e &&
						m.forEach(function (e) {
							return t(a, e);
						}),
					R && ji(a, h),
					u
				);
			}
			function x(e, r, o, c) {
				if (
					(typeof o == `object` &&
						o &&
						o.type === g &&
						o.key === null &&
						(o = o.props.children),
					typeof o == `object` && o)
				) {
					switch (o.$$typeof) {
						case m:
							a: {
								for (var l = o.key; r !== null; ) {
									if (r.key === l) {
										if (((l = o.type), l === g)) {
											if (r.tag === 7) {
												(n(e, r.sibling),
													(c = a(
														r,
														o.props.children,
													)),
													(c.return = e),
													(e = c));
												break a;
											}
										} else if (
											r.elementType === l ||
											(typeof l == `object` &&
												l &&
												l.$$typeof === ee &&
												ka(l) === r.type)
										) {
											(n(e, r.sibling),
												(c = a(r, o.props)),
												Ia(c, o),
												(c.return = e),
												(e = c));
											break a;
										}
										n(e, r);
										break;
									} else t(e, r);
									r = r.sibling;
								}
								o.type === g
									? ((c = gi(
											o.props.children,
											e.mode,
											c,
											o.key,
										)),
										(c.return = e),
										(e = c))
									: ((c = hi(
											o.type,
											o.key,
											o.props,
											null,
											e.mode,
											c,
										)),
										Ia(c, o),
										(c.return = e),
										(e = c));
							}
							return s(e);
						case h:
							a: {
								for (l = o.key; r !== null; ) {
									if (r.key === l)
										if (
											r.tag === 4 &&
											r.stateNode.containerInfo ===
												o.containerInfo &&
											r.stateNode.implementation ===
												o.implementation
										) {
											(n(e, r.sibling),
												(c = a(r, o.children || [])),
												(c.return = e),
												(e = c));
											break a;
										} else {
											n(e, r);
											break;
										}
									else t(e, r);
									r = r.sibling;
								}
								((c = yi(o, e.mode, c)),
									(c.return = e),
									(e = c));
							}
							return s(e);
						case ee:
							return ((o = ka(o)), x(e, r, o, c));
					}
					if (oe(o)) return v(e, r, o, c);
					if (re(o)) {
						if (((l = re(o)), typeof l != `function`))
							throw Error(i(150));
						return ((o = l.call(o)), y(e, r, o, c));
					}
					if (typeof o.then == `function`) return x(e, r, Fa(o), c);
					if (o.$$typeof === b) return x(e, r, ra(e, o), c);
					La(e, o);
				}
				return (typeof o == `string` && o !== ``) ||
					typeof o == `number` ||
					typeof o == `bigint`
					? ((o = `` + o),
						r !== null && r.tag === 6
							? (n(e, r.sibling),
								(c = a(r, o)),
								(c.return = e),
								(e = c))
							: (n(e, r),
								(c = _i(o, e.mode, c)),
								(c.return = e),
								(e = c)),
						s(e))
					: n(e, r);
			}
			return function (e, t, n, r) {
				try {
					Pa = 0;
					var i = x(e, t, n, r);
					return ((Na = null), i);
				} catch (t) {
					if (t === Ca || t === Ta) throw t;
					var a = di(29, t, null, e.mode);
					return ((a.lanes = r), (a.return = e), a);
				}
			};
		}
		var za = Ra(!0),
			Ba = Ra(!1),
			Va = !1;
		function Ha(e) {
			e.updateQueue = {
				baseState: e.memoizedState,
				firstBaseUpdate: null,
				lastBaseUpdate: null,
				shared: { pending: null, lanes: 0, hiddenCallbacks: null },
				callbacks: null,
			};
		}
		function Ua(e, t) {
			((e = e.updateQueue),
				t.updateQueue === e &&
					(t.updateQueue = {
						baseState: e.baseState,
						firstBaseUpdate: e.firstBaseUpdate,
						lastBaseUpdate: e.lastBaseUpdate,
						shared: e.shared,
						callbacks: null,
					}));
		}
		function Wa(e) {
			return {
				lane: e,
				tag: 0,
				payload: null,
				callback: null,
				next: null,
			};
		}
		function Ga(e, t, n) {
			var r = e.updateQueue;
			if (r === null) return null;
			if (((r = r.shared), K & 2)) {
				var i = r.pending;
				return (
					i === null
						? (t.next = t)
						: ((t.next = i.next), (i.next = t)),
					(r.pending = t),
					(t = ci(e)),
					si(e, null, n),
					t
				);
			}
			return (ii(e, r, t, n), ci(e));
		}
		function Ka(e, t, n) {
			if (
				((t = t.updateQueue),
				t !== null && ((t = t.shared), n & 4194048))
			) {
				var r = t.lanes;
				((r &= e.pendingLanes), (n |= r), (t.lanes = n), st(e, n));
			}
		}
		function qa(e, t) {
			var n = e.updateQueue,
				r = e.alternate;
			if (r !== null && ((r = r.updateQueue), n === r)) {
				var i = null,
					a = null;
				if (((n = n.firstBaseUpdate), n !== null)) {
					do {
						var o = {
							lane: n.lane,
							tag: n.tag,
							payload: n.payload,
							callback: null,
							next: null,
						};
						(a === null ? (i = a = o) : (a = a.next = o),
							(n = n.next));
					} while (n !== null);
					a === null ? (i = a = t) : (a = a.next = t);
				} else i = a = t;
				((n = {
					baseState: r.baseState,
					firstBaseUpdate: i,
					lastBaseUpdate: a,
					shared: r.shared,
					callbacks: r.callbacks,
				}),
					(e.updateQueue = n));
				return;
			}
			((e = n.lastBaseUpdate),
				e === null ? (n.firstBaseUpdate = t) : (e.next = t),
				(n.lastBaseUpdate = t));
		}
		var Ja = !1;
		function Ya() {
			if (Ja) {
				var e = ma;
				if (e !== null) throw e;
			}
		}
		function Xa(e, t, n, r) {
			Ja = !1;
			var i = e.updateQueue;
			Va = !1;
			var a = i.firstBaseUpdate,
				o = i.lastBaseUpdate,
				s = i.shared.pending;
			if (s !== null) {
				i.shared.pending = null;
				var c = s,
					l = c.next;
				((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
				var u = e.alternate;
				u !== null &&
					((u = u.updateQueue),
					(s = u.lastBaseUpdate),
					s !== o &&
						(s === null ? (u.firstBaseUpdate = l) : (s.next = l),
						(u.lastBaseUpdate = c)));
			}
			if (a !== null) {
				var d = i.baseState;
				((o = 0), (u = l = c = null), (s = a));
				do {
					var p = s.lane & -536870913,
						m = p !== s.lane;
					if (m ? (Y & p) === p : (r & p) === p) {
						(p !== 0 && p === pa && (Ja = !0),
							u !== null &&
								(u = u.next =
									{
										lane: 0,
										tag: s.tag,
										payload: s.payload,
										callback: null,
										next: null,
									}));
						a: {
							var h = e,
								g = s;
							p = t;
							var _ = n;
							switch (g.tag) {
								case 1:
									if (
										((h = g.payload),
										typeof h == `function`)
									) {
										d = h.call(_, d, p);
										break a;
									}
									d = h;
									break a;
								case 3:
									h.flags = (h.flags & -65537) | 128;
								case 0:
									if (
										((h = g.payload),
										(p =
											typeof h == `function`
												? h.call(_, d, p)
												: h),
										p == null)
									)
										break a;
									d = f({}, d, p);
									break a;
								case 2:
									Va = !0;
							}
						}
						((p = s.callback),
							p !== null &&
								((e.flags |= 64),
								m && (e.flags |= 8192),
								(m = i.callbacks),
								m === null ? (i.callbacks = [p]) : m.push(p)));
					} else
						((m = {
							lane: p,
							tag: s.tag,
							payload: s.payload,
							callback: s.callback,
							next: null,
						}),
							u === null
								? ((l = u = m), (c = d))
								: (u = u.next = m),
							(o |= p));
					if (((s = s.next), s === null)) {
						if (((s = i.shared.pending), s === null)) break;
						((m = s),
							(s = m.next),
							(m.next = null),
							(i.lastBaseUpdate = m),
							(i.shared.pending = null));
					}
				} while (1);
				(u === null && (c = d),
					(i.baseState = c),
					(i.firstBaseUpdate = l),
					(i.lastBaseUpdate = u),
					a === null && (i.shared.lanes = 0),
					(Gl |= o),
					(e.lanes = o),
					(e.memoizedState = d));
			}
		}
		function Za(e, t) {
			if (typeof e != `function`) throw Error(i(191, e));
			e.call(t);
		}
		function Qa(e, t) {
			var n = e.callbacks;
			if (n !== null)
				for (e.callbacks = null, e = 0; e < n.length; e++) Za(n[e], t);
		}
		var $a = ue(null),
			eo = ue(0);
		function to(e, t) {
			((e = Ul), O(eo, e), O($a, t), (Ul = e | t.baseLanes));
		}
		function no() {
			(O(eo, Ul), O($a, $a.current));
		}
		function ro() {
			((Ul = eo.current), de($a), de(eo));
		}
		var io = ue(null),
			ao = null;
		function oo(e) {
			var t = e.alternate;
			(O(fo, fo.current & 1),
				O(io, e),
				ao === null &&
					(t === null ||
						$a.current !== null ||
						t.memoizedState !== null) &&
					(ao = e));
		}
		function so(e) {
			(O(fo, fo.current), O(io, e), ao === null && (ao = e));
		}
		function co(e) {
			e.tag === 22
				? (O(fo, fo.current), O(io, e), ao === null && (ao = e))
				: lo(e);
		}
		function lo() {
			(O(fo, fo.current), O(io, io.current));
		}
		function uo(e) {
			(de(io), ao === e && (ao = null), de(fo));
		}
		var fo = ue(0);
		function po(e) {
			for (var t = e; t !== null; ) {
				if (t.tag === 13) {
					var n = t.memoizedState;
					if (
						n !== null &&
						((n = n.dehydrated), n === null || af(n) || of(n))
					)
						return t;
				} else if (
					t.tag === 19 &&
					(t.memoizedProps.revealOrder === `forwards` ||
						t.memoizedProps.revealOrder === `backwards` ||
						t.memoizedProps.revealOrder ===
							`unstable_legacy-backwards` ||
						t.memoizedProps.revealOrder === `together`)
				) {
					if (t.flags & 128) return t;
				} else if (t.child !== null) {
					((t.child.return = t), (t = t.child));
					continue;
				}
				if (t === e) break;
				for (; t.sibling === null; ) {
					if (t.return === null || t.return === e) return null;
					t = t.return;
				}
				((t.sibling.return = t.return), (t = t.sibling));
			}
			return null;
		}
		var mo = 0,
			z = null,
			B = null,
			ho = null,
			go = !1,
			_o = !1,
			vo = !1,
			yo = 0,
			bo = 0,
			xo = null,
			So = 0;
		function V() {
			throw Error(i(321));
		}
		function Co(e, t) {
			if (t === null) return !1;
			for (var n = 0; n < t.length && n < e.length; n++)
				if (!Er(e[n], t[n])) return !1;
			return !0;
		}
		function wo(e, t, n, r, i, a) {
			return (
				(mo = a),
				(z = t),
				(t.memoizedState = null),
				(t.updateQueue = null),
				(t.lanes = 0),
				(E.H = e === null || e.memoizedState === null ? Bs : Vs),
				(vo = !1),
				(a = n(r, i)),
				(vo = !1),
				_o && (a = Eo(t, n, r, i)),
				To(e),
				a
			);
		}
		function To(e) {
			E.H = zs;
			var t = B !== null && B.next !== null;
			if (
				((mo = 0),
				(ho = B = z = null),
				(go = !1),
				(bo = 0),
				(xo = null),
				t)
			)
				throw Error(i(300));
			e === null ||
				U ||
				((e = e.dependencies), e !== null && ea(e) && (U = !0));
		}
		function Eo(e, t, n, r) {
			z = e;
			var a = 0;
			do {
				if ((_o && (xo = null), (bo = 0), (_o = !1), 25 <= a))
					throw Error(i(301));
				if (((a += 1), (ho = B = null), e.updateQueue != null)) {
					var o = e.updateQueue;
					((o.lastEffect = null),
						(o.events = null),
						(o.stores = null),
						o.memoCache != null && (o.memoCache.index = 0));
				}
				((E.H = Hs), (o = t(n, r)));
			} while (_o);
			return o;
		}
		function Do() {
			var e = E.H,
				t = e.useState()[0];
			return (
				(t = typeof t.then == `function` ? Po(t) : t),
				(e = e.useState()[0]),
				(B === null ? null : B.memoizedState) !== e &&
					(z.flags |= 1024),
				t
			);
		}
		function Oo() {
			var e = yo !== 0;
			return ((yo = 0), e);
		}
		function ko(e, t, n) {
			((t.updateQueue = e.updateQueue),
				(t.flags &= -2053),
				(e.lanes &= ~n));
		}
		function Ao(e) {
			if (go) {
				for (e = e.memoizedState; e !== null; ) {
					var t = e.queue;
					(t !== null && (t.pending = null), (e = e.next));
				}
				go = !1;
			}
			((mo = 0),
				(ho = B = z = null),
				(_o = !1),
				(bo = yo = 0),
				(xo = null));
		}
		function jo() {
			var e = {
				memoizedState: null,
				baseState: null,
				baseQueue: null,
				queue: null,
				next: null,
			};
			return (
				ho === null ? (z.memoizedState = ho = e) : (ho = ho.next = e),
				ho
			);
		}
		function Mo() {
			if (B === null) {
				var e = z.alternate;
				e = e === null ? null : e.memoizedState;
			} else e = B.next;
			var t = ho === null ? z.memoizedState : ho.next;
			if (t !== null) ((ho = t), (B = e));
			else {
				if (e === null)
					throw z.alternate === null ? Error(i(467)) : Error(i(310));
				((B = e),
					(e = {
						memoizedState: B.memoizedState,
						baseState: B.baseState,
						baseQueue: B.baseQueue,
						queue: B.queue,
						next: null,
					}),
					ho === null
						? (z.memoizedState = ho = e)
						: (ho = ho.next = e));
			}
			return ho;
		}
		function No() {
			return {
				lastEffect: null,
				events: null,
				stores: null,
				memoCache: null,
			};
		}
		function Po(e) {
			var t = bo;
			return (
				(bo += 1),
				xo === null && (xo = []),
				(e = Oa(xo, e, t)),
				(t = z),
				(ho === null ? t.memoizedState : ho.next) === null &&
					((t = t.alternate),
					(E.H = t === null || t.memoizedState === null ? Bs : Vs)),
				e
			);
		}
		function Fo(e) {
			if (typeof e == `object` && e) {
				if (typeof e.then == `function`) return Po(e);
				if (e.$$typeof === b) return na(e);
			}
			throw Error(i(438, String(e)));
		}
		function Io(e) {
			var t = null,
				n = z.updateQueue;
			if ((n !== null && (t = n.memoCache), t == null)) {
				var r = z.alternate;
				r !== null &&
					((r = r.updateQueue),
					r !== null &&
						((r = r.memoCache),
						r != null &&
							(t = {
								data: r.data.map(function (e) {
									return e.slice();
								}),
								index: 0,
							})));
			}
			if (
				((t ??= { data: [], index: 0 }),
				n === null && ((n = No()), (z.updateQueue = n)),
				(n.memoCache = t),
				(n = t.data[t.index]),
				n === void 0)
			)
				for (n = t.data[t.index] = Array(e), r = 0; r < e; r++)
					n[r] = te;
			return (t.index++, n);
		}
		function Lo(e, t) {
			return typeof t == `function` ? t(e) : t;
		}
		function Ro(e) {
			return zo(Mo(), B, e);
		}
		function zo(e, t, n) {
			var r = e.queue;
			if (r === null) throw Error(i(311));
			r.lastRenderedReducer = n;
			var a = e.baseQueue,
				o = r.pending;
			if (o !== null) {
				if (a !== null) {
					var s = a.next;
					((a.next = o.next), (o.next = s));
				}
				((t.baseQueue = a = o), (r.pending = null));
			}
			if (((o = e.baseState), a === null)) e.memoizedState = o;
			else {
				t = a.next;
				var c = (s = null),
					l = null,
					u = t,
					d = !1;
				do {
					var f = u.lane & -536870913;
					if (f === u.lane ? (mo & f) === f : (Y & f) === f) {
						var p = u.revertLane;
						if (p === 0)
							(l !== null &&
								(l = l.next =
									{
										lane: 0,
										revertLane: 0,
										gesture: null,
										action: u.action,
										hasEagerState: u.hasEagerState,
										eagerState: u.eagerState,
										next: null,
									}),
								f === pa && (d = !0));
						else if ((mo & p) === p) {
							((u = u.next), p === pa && (d = !0));
							continue;
						} else
							((f = {
								lane: 0,
								revertLane: u.revertLane,
								gesture: null,
								action: u.action,
								hasEagerState: u.hasEagerState,
								eagerState: u.eagerState,
								next: null,
							}),
								l === null
									? ((c = l = f), (s = o))
									: (l = l.next = f),
								(z.lanes |= p),
								(Gl |= p));
						((f = u.action),
							vo && n(o, f),
							(o = u.hasEagerState ? u.eagerState : n(o, f)));
					} else
						((p = {
							lane: f,
							revertLane: u.revertLane,
							gesture: u.gesture,
							action: u.action,
							hasEagerState: u.hasEagerState,
							eagerState: u.eagerState,
							next: null,
						}),
							l === null
								? ((c = l = p), (s = o))
								: (l = l.next = p),
							(z.lanes |= f),
							(Gl |= f));
					u = u.next;
				} while (u !== null && u !== t);
				if (
					(l === null ? (s = o) : (l.next = c),
					!Er(o, e.memoizedState) &&
						((U = !0), d && ((n = ma), n !== null)))
				)
					throw n;
				((e.memoizedState = o),
					(e.baseState = s),
					(e.baseQueue = l),
					(r.lastRenderedState = o));
			}
			return (a === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
		}
		function Bo(e) {
			var t = Mo(),
				n = t.queue;
			if (n === null) throw Error(i(311));
			n.lastRenderedReducer = e;
			var r = n.dispatch,
				a = n.pending,
				o = t.memoizedState;
			if (a !== null) {
				n.pending = null;
				var s = (a = a.next);
				do ((o = e(o, s.action)), (s = s.next));
				while (s !== a);
				(Er(o, t.memoizedState) || (U = !0),
					(t.memoizedState = o),
					t.baseQueue === null && (t.baseState = o),
					(n.lastRenderedState = o));
			}
			return [o, r];
		}
		function Vo(e, t, n) {
			var r = z,
				a = Mo(),
				o = R;
			if (o) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else n = t();
			var s = !Er((B || a).memoizedState, n);
			if (
				(s && ((a.memoizedState = n), (U = !0)),
				(a = a.queue),
				fs(Wo.bind(null, r, a, e), [e]),
				a.getSnapshot !== t ||
					s ||
					(ho !== null && ho.memoizedState.tag & 1))
			) {
				if (
					((r.flags |= 2048),
					ss(9, { destroy: void 0 }, Uo.bind(null, r, a, n, t), null),
					q === null)
				)
					throw Error(i(349));
				o || mo & 127 || Ho(r, t, n);
			}
			return n;
		}
		function Ho(e, t, n) {
			((e.flags |= 16384),
				(e = { getSnapshot: t, value: n }),
				(t = z.updateQueue),
				t === null
					? ((t = No()), (z.updateQueue = t), (t.stores = [e]))
					: ((n = t.stores),
						n === null ? (t.stores = [e]) : n.push(e)));
		}
		function Uo(e, t, n, r) {
			((t.value = n), (t.getSnapshot = r), Go(t) && Ko(e));
		}
		function Wo(e, t, n) {
			return n(function () {
				Go(t) && Ko(e);
			});
		}
		function Go(e) {
			var t = e.getSnapshot;
			e = e.value;
			try {
				var n = t();
				return !Er(e, n);
			} catch {
				return !0;
			}
		}
		function Ko(e) {
			var t = oi(e, 2);
			t !== null && hu(t, e, 2);
		}
		function qo(e) {
			var t = jo();
			if (typeof e == `function`) {
				var n = e;
				if (((e = n()), vo)) {
					We(!0);
					try {
						n();
					} finally {
						We(!1);
					}
				}
			}
			return (
				(t.memoizedState = t.baseState = e),
				(t.queue = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Lo,
					lastRenderedState: e,
				}),
				t
			);
		}
		function Jo(e, t, n, r) {
			return (
				(e.baseState = n),
				zo(e, B, typeof r == `function` ? r : Lo)
			);
		}
		function Yo(e, t, n, r, a) {
			if (Is(e)) throw Error(i(485));
			if (((e = t.action), e !== null)) {
				var o = {
					payload: a,
					action: e,
					next: null,
					isTransition: !0,
					status: `pending`,
					value: null,
					reason: null,
					listeners: [],
					then: function (e) {
						o.listeners.push(e);
					},
				};
				(E.T === null ? (o.isTransition = !1) : n(!0),
					r(o),
					(n = t.pending),
					n === null
						? ((o.next = t.pending = o), Xo(t, o))
						: ((o.next = n.next), (t.pending = n.next = o)));
			}
		}
		function Xo(e, t) {
			var n = t.action,
				r = t.payload,
				i = e.state;
			if (t.isTransition) {
				var a = E.T,
					o = {};
				E.T = o;
				try {
					var s = n(i, r),
						c = E.S;
					(c !== null && c(o, s), Zo(e, t, s));
				} catch (n) {
					$o(e, t, n);
				} finally {
					(a !== null && o.types !== null && (a.types = o.types),
						(E.T = a));
				}
			} else
				try {
					((a = n(i, r)), Zo(e, t, a));
				} catch (n) {
					$o(e, t, n);
				}
		}
		function Zo(e, t, n) {
			typeof n == `object` && n && typeof n.then == `function`
				? n.then(
						function (n) {
							Qo(e, t, n);
						},
						function (n) {
							return $o(e, t, n);
						},
					)
				: Qo(e, t, n);
		}
		function Qo(e, t, n) {
			((t.status = `fulfilled`),
				(t.value = n),
				es(t),
				(e.state = n),
				(t = e.pending),
				t !== null &&
					((n = t.next),
					n === t
						? (e.pending = null)
						: ((n = n.next), (t.next = n), Xo(e, n))));
		}
		function $o(e, t, n) {
			var r = e.pending;
			if (((e.pending = null), r !== null)) {
				r = r.next;
				do
					((t.status = `rejected`),
						(t.reason = n),
						es(t),
						(t = t.next));
				while (t !== r);
			}
			e.action = null;
		}
		function es(e) {
			e = e.listeners;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
		function ts(e, t) {
			return t;
		}
		function ns(e, t) {
			if (R) {
				var n = q.formState;
				if (n !== null) {
					a: {
						var r = z;
						if (R) {
							if (L) {
								b: {
									for (
										var i = L, a = Li;
										i.nodeType !== 8;
									) {
										if (!a) {
											i = null;
											break b;
										}
										if (
											((i = cf(i.nextSibling)),
											i === null)
										) {
											i = null;
											break b;
										}
									}
									((a = i.data),
										(i =
											a === `F!` || a === `F`
												? i
												: null));
								}
								if (i) {
									((L = cf(i.nextSibling)),
										(r = i.data === `F!`));
									break a;
								}
							}
							zi(r);
						}
						r = !1;
					}
					r && (t = n[0]);
				}
			}
			return (
				(n = jo()),
				(n.memoizedState = n.baseState = t),
				(r = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: ts,
					lastRenderedState: t,
				}),
				(n.queue = r),
				(n = Ns.bind(null, z, r)),
				(r.dispatch = n),
				(r = qo(!1)),
				(a = Fs.bind(null, z, !1, r.queue)),
				(r = jo()),
				(i = { state: t, dispatch: null, action: e, pending: null }),
				(r.queue = i),
				(n = Yo.bind(null, z, i, a, n)),
				(i.dispatch = n),
				(r.memoizedState = e),
				[t, n, !1]
			);
		}
		function rs(e) {
			return is(Mo(), B, e);
		}
		function is(e, t, n) {
			if (
				((t = zo(e, t, ts)[0]),
				(e = Ro(Lo)[0]),
				typeof t == `object` && t && typeof t.then == `function`)
			)
				try {
					var r = Po(t);
				} catch (e) {
					throw e === Ca ? Ta : e;
				}
			else r = t;
			t = Mo();
			var i = t.queue,
				a = i.dispatch;
			return (
				n !== t.memoizedState &&
					((z.flags |= 2048),
					ss(9, { destroy: void 0 }, as.bind(null, i, n), null)),
				[r, a, e]
			);
		}
		function as(e, t) {
			e.action = t;
		}
		function os(e) {
			var t = Mo(),
				n = B;
			if (n !== null) return is(t, n, e);
			(Mo(), (t = t.memoizedState), (n = Mo()));
			var r = n.queue.dispatch;
			return ((n.memoizedState = e), [t, r, !1]);
		}
		function ss(e, t, n, r) {
			return (
				(e = { tag: e, create: n, deps: r, inst: t, next: null }),
				(t = z.updateQueue),
				t === null && ((t = No()), (z.updateQueue = t)),
				(n = t.lastEffect),
				n === null
					? (t.lastEffect = e.next = e)
					: ((r = n.next),
						(n.next = e),
						(e.next = r),
						(t.lastEffect = e)),
				e
			);
		}
		function cs() {
			return Mo().memoizedState;
		}
		function ls(e, t, n, r) {
			var i = jo();
			((z.flags |= e),
				(i.memoizedState = ss(
					1 | t,
					{ destroy: void 0 },
					n,
					r === void 0 ? null : r,
				)));
		}
		function us(e, t, n, r) {
			var i = Mo();
			r = r === void 0 ? null : r;
			var a = i.memoizedState.inst;
			B !== null && r !== null && Co(r, B.memoizedState.deps)
				? (i.memoizedState = ss(t, a, n, r))
				: ((z.flags |= e), (i.memoizedState = ss(1 | t, a, n, r)));
		}
		function ds(e, t) {
			ls(8390656, 8, e, t);
		}
		function fs(e, t) {
			us(2048, 8, e, t);
		}
		function ps(e) {
			z.flags |= 4;
			var t = z.updateQueue;
			if (t === null) ((t = No()), (z.updateQueue = t), (t.events = [e]));
			else {
				var n = t.events;
				n === null ? (t.events = [e]) : n.push(e);
			}
		}
		function ms(e) {
			var t = Mo().memoizedState;
			return (
				ps({ ref: t, nextImpl: e }),
				function () {
					if (K & 2) throw Error(i(440));
					return t.impl.apply(void 0, arguments);
				}
			);
		}
		function hs(e, t) {
			return us(4, 2, e, t);
		}
		function gs(e, t) {
			return us(4, 4, e, t);
		}
		function _s(e, t) {
			if (typeof t == `function`) {
				e = e();
				var n = t(e);
				return function () {
					typeof n == `function` ? n() : t(null);
				};
			}
			if (t != null)
				return (
					(e = e()),
					(t.current = e),
					function () {
						t.current = null;
					}
				);
		}
		function vs(e, t, n) {
			((n = n == null ? null : n.concat([e])),
				us(4, 4, _s.bind(null, t, e), n));
		}
		function ys() {}
		function bs(e, t) {
			var n = Mo();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			return t !== null && Co(t, r[1])
				? r[0]
				: ((n.memoizedState = [e, t]), e);
		}
		function xs(e, t) {
			var n = Mo();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			if (t !== null && Co(t, r[1])) return r[0];
			if (((r = e()), vo)) {
				We(!0);
				try {
					e();
				} finally {
					We(!1);
				}
			}
			return ((n.memoizedState = [r, t]), r);
		}
		function Ss(e, t, n) {
			return n === void 0 || (mo & 1073741824 && !(Y & 261930))
				? (e.memoizedState = t)
				: ((e.memoizedState = n),
					(e = mu()),
					(z.lanes |= e),
					(Gl |= e),
					n);
		}
		function Cs(e, t, n, r) {
			return Er(n, t)
				? n
				: $a.current === null
					? !(mo & 42) || (mo & 1073741824 && !(Y & 261930))
						? ((U = !0), (e.memoizedState = n))
						: ((e = mu()), (z.lanes |= e), (Gl |= e), t)
					: ((e = Ss(e, n, r)), Er(e, t) || (U = !0), e);
		}
		function ws(e, t, n, r, i) {
			var a = D.p;
			D.p = a !== 0 && 8 > a ? a : 8;
			var o = E.T,
				s = {};
			((E.T = s), Fs(e, !1, t, n));
			try {
				var c = i(),
					l = E.S;
				(l !== null && l(s, c),
					typeof c == `object` && c && typeof c.then == `function`
						? Ps(e, t, _a(c, r), pu(e))
						: Ps(e, t, r, pu(e)));
			} catch (n) {
				Ps(
					e,
					t,
					{ then: function () {}, status: `rejected`, reason: n },
					pu(),
				);
			} finally {
				((D.p = a),
					o !== null && s.types !== null && (o.types = s.types),
					(E.T = o));
			}
		}
		function Ts() {}
		function Es(e, t, n, r) {
			if (e.tag !== 5) throw Error(i(476));
			var a = Ds(e).queue;
			ws(
				e,
				a,
				t,
				se,
				n === null
					? Ts
					: function () {
							return (Os(e), n(r));
						},
			);
		}
		function Ds(e) {
			var t = e.memoizedState;
			if (t !== null) return t;
			t = {
				memoizedState: se,
				baseState: se,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Lo,
					lastRenderedState: se,
				},
				next: null,
			};
			var n = {};
			return (
				(t.next = {
					memoizedState: n,
					baseState: n,
					baseQueue: null,
					queue: {
						pending: null,
						lanes: 0,
						dispatch: null,
						lastRenderedReducer: Lo,
						lastRenderedState: n,
					},
					next: null,
				}),
				(e.memoizedState = t),
				(e = e.alternate),
				e !== null && (e.memoizedState = t),
				t
			);
		}
		function Os(e) {
			var t = Ds(e);
			(t.next === null && (t = e.alternate.memoizedState),
				Ps(e, t.next.queue, {}, pu()));
		}
		function ks() {
			return na(Qf);
		}
		function As() {
			return Mo().memoizedState;
		}
		function js() {
			return Mo().memoizedState;
		}
		function H(e) {
			for (var t = e.return; t !== null; ) {
				switch (t.tag) {
					case 24:
					case 3:
						var n = pu();
						e = Wa(n);
						var r = Ga(t, e, n);
						(r !== null && (hu(r, t, n), Ka(r, t, n)),
							(t = { cache: la() }),
							(e.payload = t));
						return;
				}
				t = t.return;
			}
		}
		function Ms(e, t, n) {
			var r = pu();
			((n = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null,
			}),
				Is(e)
					? Ls(t, n)
					: ((n = ai(e, t, n, r)),
						n !== null && (hu(n, e, r), Rs(n, t, r))));
		}
		function Ns(e, t, n) {
			Ps(e, t, n, pu());
		}
		function Ps(e, t, n, r) {
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null,
			};
			if (Is(e)) Ls(t, i);
			else {
				var a = e.alternate;
				if (
					e.lanes === 0 &&
					(a === null || a.lanes === 0) &&
					((a = t.lastRenderedReducer), a !== null)
				)
					try {
						var o = t.lastRenderedState,
							s = a(o, n);
						if (
							((i.hasEagerState = !0),
							(i.eagerState = s),
							Er(s, o))
						)
							return (ii(e, t, i, 0), q === null && ri(), !1);
					} catch {}
				if (((n = ai(e, t, i, r)), n !== null))
					return (hu(n, e, r), Rs(n, t, r), !0);
			}
			return !1;
		}
		function Fs(e, t, n, r) {
			if (
				((r = {
					lane: 2,
					revertLane: dd(),
					gesture: null,
					action: r,
					hasEagerState: !1,
					eagerState: null,
					next: null,
				}),
				Is(e))
			) {
				if (t) throw Error(i(479));
			} else ((t = ai(e, n, r, 2)), t !== null && hu(t, e, 2));
		}
		function Is(e) {
			var t = e.alternate;
			return e === z || (t !== null && t === z);
		}
		function Ls(e, t) {
			_o = go = !0;
			var n = e.pending;
			(n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
				(e.pending = t));
		}
		function Rs(e, t, n) {
			if (n & 4194048) {
				var r = t.lanes;
				((r &= e.pendingLanes), (n |= r), (t.lanes = n), st(e, n));
			}
		}
		var zs = {
			readContext: na,
			use: Fo,
			useCallback: V,
			useContext: V,
			useEffect: V,
			useImperativeHandle: V,
			useLayoutEffect: V,
			useInsertionEffect: V,
			useMemo: V,
			useReducer: V,
			useRef: V,
			useState: V,
			useDebugValue: V,
			useDeferredValue: V,
			useTransition: V,
			useSyncExternalStore: V,
			useId: V,
			useHostTransitionStatus: V,
			useFormState: V,
			useActionState: V,
			useOptimistic: V,
			useMemoCache: V,
			useCacheRefresh: V,
		};
		zs.useEffectEvent = V;
		var Bs = {
				readContext: na,
				use: Fo,
				useCallback: function (e, t) {
					return (
						(jo().memoizedState = [e, t === void 0 ? null : t]),
						e
					);
				},
				useContext: na,
				useEffect: ds,
				useImperativeHandle: function (e, t, n) {
					((n = n == null ? null : n.concat([e])),
						ls(4194308, 4, _s.bind(null, t, e), n));
				},
				useLayoutEffect: function (e, t) {
					return ls(4194308, 4, e, t);
				},
				useInsertionEffect: function (e, t) {
					ls(4, 2, e, t);
				},
				useMemo: function (e, t) {
					var n = jo();
					t = t === void 0 ? null : t;
					var r = e();
					if (vo) {
						We(!0);
						try {
							e();
						} finally {
							We(!1);
						}
					}
					return ((n.memoizedState = [r, t]), r);
				},
				useReducer: function (e, t, n) {
					var r = jo();
					if (n !== void 0) {
						var i = n(t);
						if (vo) {
							We(!0);
							try {
								n(t);
							} finally {
								We(!1);
							}
						}
					} else i = t;
					return (
						(r.memoizedState = r.baseState = i),
						(e = {
							pending: null,
							lanes: 0,
							dispatch: null,
							lastRenderedReducer: e,
							lastRenderedState: i,
						}),
						(r.queue = e),
						(e = e.dispatch = Ms.bind(null, z, e)),
						[r.memoizedState, e]
					);
				},
				useRef: function (e) {
					var t = jo();
					return ((e = { current: e }), (t.memoizedState = e));
				},
				useState: function (e) {
					e = qo(e);
					var t = e.queue,
						n = Ns.bind(null, z, t);
					return ((t.dispatch = n), [e.memoizedState, n]);
				},
				useDebugValue: ys,
				useDeferredValue: function (e, t) {
					return Ss(jo(), e, t);
				},
				useTransition: function () {
					var e = qo(!1);
					return (
						(e = ws.bind(null, z, e.queue, !0, !1)),
						(jo().memoizedState = e),
						[!1, e]
					);
				},
				useSyncExternalStore: function (e, t, n) {
					var r = z,
						a = jo();
					if (R) {
						if (n === void 0) throw Error(i(407));
						n = n();
					} else {
						if (((n = t()), q === null)) throw Error(i(349));
						Y & 127 || Ho(r, t, n);
					}
					a.memoizedState = n;
					var o = { value: n, getSnapshot: t };
					return (
						(a.queue = o),
						ds(Wo.bind(null, r, o, e), [e]),
						(r.flags |= 2048),
						ss(
							9,
							{ destroy: void 0 },
							Uo.bind(null, r, o, n, t),
							null,
						),
						n
					);
				},
				useId: function () {
					var e = jo(),
						t = q.identifierPrefix;
					if (R) {
						var n = Ai,
							r = ki;
						((n = (r & ~(1 << (32 - Ge(r) - 1))).toString(32) + n),
							(t = `_` + t + `R_` + n),
							(n = yo++),
							0 < n && (t += `H` + n.toString(32)),
							(t += `_`));
					} else
						((n = So++),
							(t = `_` + t + `r_` + n.toString(32) + `_`));
					return (e.memoizedState = t);
				},
				useHostTransitionStatus: ks,
				useFormState: ns,
				useActionState: ns,
				useOptimistic: function (e) {
					var t = jo();
					t.memoizedState = t.baseState = e;
					var n = {
						pending: null,
						lanes: 0,
						dispatch: null,
						lastRenderedReducer: null,
						lastRenderedState: null,
					};
					return (
						(t.queue = n),
						(t = Fs.bind(null, z, !0, n)),
						(n.dispatch = t),
						[e, t]
					);
				},
				useMemoCache: Io,
				useCacheRefresh: function () {
					return (jo().memoizedState = H.bind(null, z));
				},
				useEffectEvent: function (e) {
					var t = jo(),
						n = { impl: e };
					return (
						(t.memoizedState = n),
						function () {
							if (K & 2) throw Error(i(440));
							return n.impl.apply(void 0, arguments);
						}
					);
				},
			},
			Vs = {
				readContext: na,
				use: Fo,
				useCallback: bs,
				useContext: na,
				useEffect: fs,
				useImperativeHandle: vs,
				useInsertionEffect: hs,
				useLayoutEffect: gs,
				useMemo: xs,
				useReducer: Ro,
				useRef: cs,
				useState: function () {
					return Ro(Lo);
				},
				useDebugValue: ys,
				useDeferredValue: function (e, t) {
					return Cs(Mo(), B.memoizedState, e, t);
				},
				useTransition: function () {
					var e = Ro(Lo)[0],
						t = Mo().memoizedState;
					return [typeof e == `boolean` ? e : Po(e), t];
				},
				useSyncExternalStore: Vo,
				useId: As,
				useHostTransitionStatus: ks,
				useFormState: rs,
				useActionState: rs,
				useOptimistic: function (e, t) {
					return Jo(Mo(), B, e, t);
				},
				useMemoCache: Io,
				useCacheRefresh: js,
			};
		Vs.useEffectEvent = ms;
		var Hs = {
			readContext: na,
			use: Fo,
			useCallback: bs,
			useContext: na,
			useEffect: fs,
			useImperativeHandle: vs,
			useInsertionEffect: hs,
			useLayoutEffect: gs,
			useMemo: xs,
			useReducer: Bo,
			useRef: cs,
			useState: function () {
				return Bo(Lo);
			},
			useDebugValue: ys,
			useDeferredValue: function (e, t) {
				var n = Mo();
				return B === null ? Ss(n, e, t) : Cs(n, B.memoizedState, e, t);
			},
			useTransition: function () {
				var e = Bo(Lo)[0],
					t = Mo().memoizedState;
				return [typeof e == `boolean` ? e : Po(e), t];
			},
			useSyncExternalStore: Vo,
			useId: As,
			useHostTransitionStatus: ks,
			useFormState: os,
			useActionState: os,
			useOptimistic: function (e, t) {
				var n = Mo();
				return B === null
					? ((n.baseState = e), [e, n.queue.dispatch])
					: Jo(n, B, e, t);
			},
			useMemoCache: Io,
			useCacheRefresh: js,
		};
		Hs.useEffectEvent = ms;
		function Us(e, t, n, r) {
			((t = e.memoizedState),
				(n = n(r, t)),
				(n = n == null ? t : f({}, t, n)),
				(e.memoizedState = n),
				e.lanes === 0 && (e.updateQueue.baseState = n));
		}
		var Ws = {
			enqueueSetState: function (e, t, n) {
				e = e._reactInternals;
				var r = pu(),
					i = Wa(r);
				((i.payload = t),
					n != null && (i.callback = n),
					(t = Ga(e, i, r)),
					t !== null && (hu(t, e, r), Ka(t, e, r)));
			},
			enqueueReplaceState: function (e, t, n) {
				e = e._reactInternals;
				var r = pu(),
					i = Wa(r);
				((i.tag = 1),
					(i.payload = t),
					n != null && (i.callback = n),
					(t = Ga(e, i, r)),
					t !== null && (hu(t, e, r), Ka(t, e, r)));
			},
			enqueueForceUpdate: function (e, t) {
				e = e._reactInternals;
				var n = pu(),
					r = Wa(n);
				((r.tag = 2),
					t != null && (r.callback = t),
					(t = Ga(e, r, n)),
					t !== null && (hu(t, e, n), Ka(t, e, n)));
			},
		};
		function Gs(e, t, n, r, i, a, o) {
			return (
				(e = e.stateNode),
				typeof e.shouldComponentUpdate == `function`
					? e.shouldComponentUpdate(r, a, o)
					: t.prototype && t.prototype.isPureReactComponent
						? !Dr(n, r) || !Dr(i, a)
						: !0
			);
		}
		function Ks(e, t, n, r) {
			((e = t.state),
				typeof t.componentWillReceiveProps == `function` &&
					t.componentWillReceiveProps(n, r),
				typeof t.UNSAFE_componentWillReceiveProps == `function` &&
					t.UNSAFE_componentWillReceiveProps(n, r),
				t.state !== e && Ws.enqueueReplaceState(t, t.state, null));
		}
		function qs(e, t) {
			var n = t;
			if (`ref` in t)
				for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
			if ((e = e.defaultProps))
				for (var i in (n === t && (n = f({}, n)), e))
					n[i] === void 0 && (n[i] = e[i]);
			return n;
		}
		function Js(e) {
			$r(e);
		}
		function Ys(e) {
			console.error(e);
		}
		function Xs(e) {
			$r(e);
		}
		function Zs(e, t) {
			try {
				var n = e.onUncaughtError;
				n(t.value, { componentStack: t.stack });
			} catch (e) {
				setTimeout(function () {
					throw e;
				});
			}
		}
		function Qs(e, t, n) {
			try {
				var r = e.onCaughtError;
				r(n.value, {
					componentStack: n.stack,
					errorBoundary: t.tag === 1 ? t.stateNode : null,
				});
			} catch (e) {
				setTimeout(function () {
					throw e;
				});
			}
		}
		function $s(e, t, n) {
			return (
				(n = Wa(n)),
				(n.tag = 3),
				(n.payload = { element: null }),
				(n.callback = function () {
					Zs(e, t);
				}),
				n
			);
		}
		function ec(e) {
			return ((e = Wa(e)), (e.tag = 3), e);
		}
		function tc(e, t, n, r) {
			var i = n.type.getDerivedStateFromError;
			if (typeof i == `function`) {
				var a = r.value;
				((e.payload = function () {
					return i(a);
				}),
					(e.callback = function () {
						Qs(t, n, r);
					}));
			}
			var o = n.stateNode;
			o !== null &&
				typeof o.componentDidCatch == `function` &&
				(e.callback = function () {
					(Qs(t, n, r),
						typeof i != `function` &&
							(ru === null
								? (ru = new Set([this]))
								: ru.add(this)));
					var e = r.stack;
					this.componentDidCatch(r.value, {
						componentStack: e === null ? `` : e,
					});
				});
		}
		function nc(e, t, n, r, a) {
			if (
				((n.flags |= 32768),
				typeof r == `object` && r && typeof r.then == `function`)
			) {
				if (
					((t = n.alternate),
					t !== null && $i(t, n, a, !0),
					(n = io.current),
					n !== null)
				) {
					switch (n.tag) {
						case 31:
						case 13:
							return (
								ao === null
									? Du()
									: n.alternate === null &&
										Wl === 0 &&
										(Wl = 3),
								(n.flags &= -257),
								(n.flags |= 65536),
								(n.lanes = a),
								r === Ea
									? (n.flags |= 16384)
									: ((t = n.updateQueue),
										t === null
											? (n.updateQueue = new Set([r]))
											: t.add(r),
										Gu(e, r, a)),
								!1
							);
						case 22:
							return (
								(n.flags |= 65536),
								r === Ea
									? (n.flags |= 16384)
									: ((t = n.updateQueue),
										t === null
											? ((t = {
													transitions: null,
													markerInstances: null,
													retryQueue: new Set([r]),
												}),
												(n.updateQueue = t))
											: ((n = t.retryQueue),
												n === null
													? (t.retryQueue = new Set([
															r,
														]))
													: n.add(r)),
										Gu(e, r, a)),
								!1
							);
					}
					throw Error(i(435, n.tag));
				}
				return (Gu(e, r, a), Du(), !1);
			}
			if (R)
				return (
					(t = io.current),
					t === null
						? (r !== Ri &&
								((t = Error(i(423), { cause: r })),
								Gi(xi(t, n))),
							(e = e.current.alternate),
							(e.flags |= 65536),
							(a &= -a),
							(e.lanes |= a),
							(r = xi(r, n)),
							(a = $s(e.stateNode, r, a)),
							qa(e, a),
							Wl !== 4 && (Wl = 2))
						: (!(t.flags & 65536) && (t.flags |= 256),
							(t.flags |= 65536),
							(t.lanes = a),
							r !== Ri &&
								((e = Error(i(422), { cause: r })),
								Gi(xi(e, n)))),
					!1
				);
			var o = Error(i(520), { cause: r });
			if (
				((o = xi(o, n)),
				Xl === null ? (Xl = [o]) : Xl.push(o),
				Wl !== 4 && (Wl = 2),
				t === null)
			)
				return !0;
			((r = xi(r, n)), (n = t));
			do {
				switch (n.tag) {
					case 3:
						return (
							(n.flags |= 65536),
							(e = a & -a),
							(n.lanes |= e),
							(e = $s(n.stateNode, r, e)),
							qa(n, e),
							!1
						);
					case 1:
						if (
							((t = n.type),
							(o = n.stateNode),
							!(n.flags & 128) &&
								(typeof t.getDerivedStateFromError ==
									`function` ||
									(o !== null &&
										typeof o.componentDidCatch ==
											`function` &&
										(ru === null || !ru.has(o)))))
						)
							return (
								(n.flags |= 65536),
								(a &= -a),
								(n.lanes |= a),
								(a = ec(a)),
								tc(a, e, n, r),
								qa(n, a),
								!1
							);
				}
				n = n.return;
			} while (n !== null);
			return !1;
		}
		var rc = Error(i(461)),
			U = !1;
		function ic(e, t, n, r) {
			t.child = e === null ? Ba(t, null, n, r) : za(t, e.child, n, r);
		}
		function ac(e, t, n, r, i) {
			n = n.render;
			var a = t.ref;
			if (`ref` in r) {
				var o = {};
				for (var s in r) s !== `ref` && (o[s] = r[s]);
			} else o = r;
			return (
				ta(t),
				(r = wo(e, t, n, o, a, i)),
				(s = Oo()),
				e !== null && !U
					? (ko(e, t, i), kc(e, t, i))
					: (R && s && Ni(t), (t.flags |= 1), ic(e, t, r, i), t.child)
			);
		}
		function oc(e, t, n, r, i) {
			if (e === null) {
				var a = n.type;
				return typeof a == `function` &&
					!fi(a) &&
					a.defaultProps === void 0 &&
					n.compare === null
					? ((t.tag = 15), (t.type = a), sc(e, t, a, r, i))
					: ((e = hi(n.type, null, r, t, t.mode, i)),
						(e.ref = t.ref),
						(e.return = t),
						(t.child = e));
			}
			if (((a = e.child), !Ac(e, i))) {
				var o = a.memoizedProps;
				if (
					((n = n.compare),
					(n = n === null ? Dr : n),
					n(o, r) && e.ref === t.ref)
				)
					return kc(e, t, i);
			}
			return (
				(t.flags |= 1),
				(e = pi(a, r)),
				(e.ref = t.ref),
				(e.return = t),
				(t.child = e)
			);
		}
		function sc(e, t, n, r, i) {
			if (e !== null) {
				var a = e.memoizedProps;
				if (Dr(a, r) && e.ref === t.ref)
					if (((U = !1), (t.pendingProps = r = a), Ac(e, i)))
						e.flags & 131072 && (U = !0);
					else return ((t.lanes = e.lanes), kc(e, t, i));
			}
			return hc(e, t, n, r, i);
		}
		function cc(e, t, n, r) {
			var i = r.children,
				a = e === null ? null : e.memoizedState;
			if (
				(e === null &&
					t.stateNode === null &&
					(t.stateNode = {
						_visibility: 1,
						_pendingMarkers: null,
						_retryCache: null,
						_transitions: null,
					}),
				r.mode === `hidden`)
			) {
				if (t.flags & 128) {
					if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
						for (r = t.child = e.child, i = 0; r !== null; )
							((i = i | r.lanes | r.childLanes), (r = r.sibling));
						r = i & ~a;
					} else ((r = 0), (t.child = null));
					return uc(e, t, a, n, r);
				}
				if (n & 536870912)
					((t.memoizedState = { baseLanes: 0, cachePool: null }),
						e !== null && xa(t, a === null ? null : a.cachePool),
						a === null ? no() : to(t, a),
						co(t));
				else
					return (
						(r = t.lanes = 536870912),
						uc(e, t, a === null ? n : a.baseLanes | n, n, r)
					);
			} else
				a === null
					? (e !== null && xa(t, null), no(), lo(t))
					: (xa(t, a.cachePool),
						to(t, a),
						lo(t),
						(t.memoizedState = null));
			return (ic(e, t, i, n), t.child);
		}
		function lc(e, t) {
			return (
				(e !== null && e.tag === 22) ||
					t.stateNode !== null ||
					(t.stateNode = {
						_visibility: 1,
						_pendingMarkers: null,
						_retryCache: null,
						_transitions: null,
					}),
				t.sibling
			);
		}
		function uc(e, t, n, r, i) {
			var a = ba();
			return (
				(a = a === null ? null : { parent: ca._currentValue, pool: a }),
				(t.memoizedState = { baseLanes: n, cachePool: a }),
				e !== null && xa(t, null),
				no(),
				co(t),
				e !== null && $i(e, t, r, !0),
				(t.childLanes = i),
				null
			);
		}
		function dc(e, t) {
			return (
				(t = wc({ mode: t.mode, children: t.children }, e.mode)),
				(t.ref = e.ref),
				(e.child = t),
				(t.return = e),
				t
			);
		}
		function fc(e, t, n) {
			return (
				za(t, e.child, null, n),
				(e = dc(t, t.pendingProps)),
				(e.flags |= 2),
				uo(t),
				(t.memoizedState = null),
				e
			);
		}
		function pc(e, t, n) {
			var r = t.pendingProps,
				a = (t.flags & 128) != 0;
			if (((t.flags &= -129), e === null)) {
				if (R) {
					if (r.mode === `hidden`)
						return (
							(e = dc(t, r)),
							(t.lanes = 536870912),
							lc(null, e)
						);
					if (
						(so(t),
						(e = L)
							? ((e = rf(e, Li)),
								(e = e !== null && e.data === `&` ? e : null),
								e !== null &&
									((t.memoizedState = {
										dehydrated: e,
										treeContext:
											Oi === null
												? null
												: { id: ki, overflow: Ai },
										retryLane: 536870912,
										hydrationErrors: null,
									}),
									(n = vi(e)),
									(n.return = t),
									(t.child = n),
									(Fi = t),
									(L = null)))
							: (e = null),
						e === null)
					)
						throw zi(t);
					return ((t.lanes = 536870912), null);
				}
				return dc(t, r);
			}
			var o = e.memoizedState;
			if (o !== null) {
				var s = o.dehydrated;
				if ((so(t), a))
					if (t.flags & 256) ((t.flags &= -257), (t = fc(e, t, n)));
					else if (t.memoizedState !== null)
						((t.child = e.child), (t.flags |= 128), (t = null));
					else throw Error(i(558));
				else if (
					(U || $i(e, t, n, !1),
					(a = (n & e.childLanes) !== 0),
					U || a)
				) {
					if (
						((r = q),
						r !== null &&
							((s = ct(r, n)), s !== 0 && s !== o.retryLane))
					)
						throw ((o.retryLane = s), oi(e, s), hu(r, e, s), rc);
					(Du(), (t = fc(e, t, n)));
				} else
					((e = o.treeContext),
						(L = cf(s.nextSibling)),
						(Fi = t),
						(R = !0),
						(Ii = null),
						(Li = !1),
						e !== null && Pi(t, e),
						(t = dc(t, r)),
						(t.flags |= 4096));
				return t;
			}
			return (
				(e = pi(e.child, { mode: r.mode, children: r.children })),
				(e.ref = t.ref),
				(t.child = e),
				(e.return = t),
				e
			);
		}
		function mc(e, t) {
			var n = t.ref;
			if (n === null)
				e !== null && e.ref !== null && (t.flags |= 4194816);
			else {
				if (typeof n != `function` && typeof n != `object`)
					throw Error(i(284));
				(e === null || e.ref !== n) && (t.flags |= 4194816);
			}
		}
		function hc(e, t, n, r, i) {
			return (
				ta(t),
				(n = wo(e, t, n, r, void 0, i)),
				(r = Oo()),
				e !== null && !U
					? (ko(e, t, i), kc(e, t, i))
					: (R && r && Ni(t), (t.flags |= 1), ic(e, t, n, i), t.child)
			);
		}
		function gc(e, t, n, r, i, a) {
			return (
				ta(t),
				(t.updateQueue = null),
				(n = Eo(t, r, n, i)),
				To(e),
				(r = Oo()),
				e !== null && !U
					? (ko(e, t, a), kc(e, t, a))
					: (R && r && Ni(t), (t.flags |= 1), ic(e, t, n, a), t.child)
			);
		}
		function _c(e, t, n, r, i) {
			if ((ta(t), t.stateNode === null)) {
				var a = li,
					o = n.contextType;
				(typeof o == `object` && o && (a = na(o)),
					(a = new n(r, a)),
					(t.memoizedState =
						a.state !== null && a.state !== void 0
							? a.state
							: null),
					(a.updater = Ws),
					(t.stateNode = a),
					(a._reactInternals = t),
					(a = t.stateNode),
					(a.props = r),
					(a.state = t.memoizedState),
					(a.refs = {}),
					Ha(t),
					(o = n.contextType),
					(a.context = typeof o == `object` && o ? na(o) : li),
					(a.state = t.memoizedState),
					(o = n.getDerivedStateFromProps),
					typeof o == `function` &&
						(Us(t, n, o, r), (a.state = t.memoizedState)),
					typeof n.getDerivedStateFromProps == `function` ||
						typeof a.getSnapshotBeforeUpdate == `function` ||
						(typeof a.UNSAFE_componentWillMount != `function` &&
							typeof a.componentWillMount != `function`) ||
						((o = a.state),
						typeof a.componentWillMount == `function` &&
							a.componentWillMount(),
						typeof a.UNSAFE_componentWillMount == `function` &&
							a.UNSAFE_componentWillMount(),
						o !== a.state &&
							Ws.enqueueReplaceState(a, a.state, null),
						Xa(t, r, a, i),
						Ya(),
						(a.state = t.memoizedState)),
					typeof a.componentDidMount == `function` &&
						(t.flags |= 4194308),
					(r = !0));
			} else if (e === null) {
				a = t.stateNode;
				var s = t.memoizedProps,
					c = qs(n, s);
				a.props = c;
				var l = a.context,
					u = n.contextType;
				((o = li), typeof u == `object` && u && (o = na(u)));
				var d = n.getDerivedStateFromProps;
				((u =
					typeof d == `function` ||
					typeof a.getSnapshotBeforeUpdate == `function`),
					(s = t.pendingProps !== s),
					u ||
						(typeof a.UNSAFE_componentWillReceiveProps !=
							`function` &&
							typeof a.componentWillReceiveProps != `function`) ||
						((s || l !== o) && Ks(t, a, r, o)),
					(Va = !1));
				var f = t.memoizedState;
				((a.state = f),
					Xa(t, r, a, i),
					Ya(),
					(l = t.memoizedState),
					s || f !== l || Va
						? (typeof d == `function` &&
								(Us(t, n, d, r), (l = t.memoizedState)),
							(c = Va || Gs(t, n, c, r, f, l, o))
								? (u ||
										(typeof a.UNSAFE_componentWillMount !=
											`function` &&
											typeof a.componentWillMount !=
												`function`) ||
										(typeof a.componentWillMount ==
											`function` &&
											a.componentWillMount(),
										typeof a.UNSAFE_componentWillMount ==
											`function` &&
											a.UNSAFE_componentWillMount()),
									typeof a.componentDidMount == `function` &&
										(t.flags |= 4194308))
								: (typeof a.componentDidMount == `function` &&
										(t.flags |= 4194308),
									(t.memoizedProps = r),
									(t.memoizedState = l)),
							(a.props = r),
							(a.state = l),
							(a.context = o),
							(r = c))
						: (typeof a.componentDidMount == `function` &&
								(t.flags |= 4194308),
							(r = !1)));
			} else {
				((a = t.stateNode),
					Ua(e, t),
					(o = t.memoizedProps),
					(u = qs(n, o)),
					(a.props = u),
					(d = t.pendingProps),
					(f = a.context),
					(l = n.contextType),
					(c = li),
					typeof l == `object` && l && (c = na(l)),
					(s = n.getDerivedStateFromProps),
					(l =
						typeof s == `function` ||
						typeof a.getSnapshotBeforeUpdate == `function`) ||
						(typeof a.UNSAFE_componentWillReceiveProps !=
							`function` &&
							typeof a.componentWillReceiveProps != `function`) ||
						((o !== d || f !== c) && Ks(t, a, r, c)),
					(Va = !1),
					(f = t.memoizedState),
					(a.state = f),
					Xa(t, r, a, i),
					Ya());
				var p = t.memoizedState;
				o !== d ||
				f !== p ||
				Va ||
				(e !== null && e.dependencies !== null && ea(e.dependencies))
					? (typeof s == `function` &&
							(Us(t, n, s, r), (p = t.memoizedState)),
						(u =
							Va ||
							Gs(t, n, u, r, f, p, c) ||
							(e !== null &&
								e.dependencies !== null &&
								ea(e.dependencies)))
							? (l ||
									(typeof a.UNSAFE_componentWillUpdate !=
										`function` &&
										typeof a.componentWillUpdate !=
											`function`) ||
									(typeof a.componentWillUpdate ==
										`function` &&
										a.componentWillUpdate(r, p, c),
									typeof a.UNSAFE_componentWillUpdate ==
										`function` &&
										a.UNSAFE_componentWillUpdate(r, p, c)),
								typeof a.componentDidUpdate == `function` &&
									(t.flags |= 4),
								typeof a.getSnapshotBeforeUpdate ==
									`function` && (t.flags |= 1024))
							: (typeof a.componentDidUpdate != `function` ||
									(o === e.memoizedProps &&
										f === e.memoizedState) ||
									(t.flags |= 4),
								typeof a.getSnapshotBeforeUpdate !=
									`function` ||
									(o === e.memoizedProps &&
										f === e.memoizedState) ||
									(t.flags |= 1024),
								(t.memoizedProps = r),
								(t.memoizedState = p)),
						(a.props = r),
						(a.state = p),
						(a.context = c),
						(r = u))
					: (typeof a.componentDidUpdate != `function` ||
							(o === e.memoizedProps && f === e.memoizedState) ||
							(t.flags |= 4),
						typeof a.getSnapshotBeforeUpdate != `function` ||
							(o === e.memoizedProps && f === e.memoizedState) ||
							(t.flags |= 1024),
						(r = !1));
			}
			return (
				(a = r),
				mc(e, t),
				(r = (t.flags & 128) != 0),
				a || r
					? ((a = t.stateNode),
						(n =
							r && typeof n.getDerivedStateFromError != `function`
								? null
								: a.render()),
						(t.flags |= 1),
						e !== null && r
							? ((t.child = za(t, e.child, null, i)),
								(t.child = za(t, null, n, i)))
							: ic(e, t, n, i),
						(t.memoizedState = a.state),
						(e = t.child))
					: (e = kc(e, t, i)),
				e
			);
		}
		function vc(e, t, n, r) {
			return (Ui(), (t.flags |= 256), ic(e, t, n, r), t.child);
		}
		var yc = {
			dehydrated: null,
			treeContext: null,
			retryLane: 0,
			hydrationErrors: null,
		};
		function bc(e) {
			return { baseLanes: e, cachePool: Sa() };
		}
		function xc(e, t, n) {
			return (
				(e = e === null ? 0 : e.childLanes & ~n),
				t && (e |= Jl),
				e
			);
		}
		function Sc(e, t, n) {
			var r = t.pendingProps,
				a = !1,
				o = (t.flags & 128) != 0,
				s;
			if (
				((s = o) ||
					(s =
						e !== null && e.memoizedState === null
							? !1
							: (fo.current & 2) != 0),
				s && ((a = !0), (t.flags &= -129)),
				(s = (t.flags & 32) != 0),
				(t.flags &= -33),
				e === null)
			) {
				if (R) {
					if (
						(a ? oo(t) : lo(t),
						(e = L)
							? ((e = rf(e, Li)),
								(e = e !== null && e.data !== `&` ? e : null),
								e !== null &&
									((t.memoizedState = {
										dehydrated: e,
										treeContext:
											Oi === null
												? null
												: { id: ki, overflow: Ai },
										retryLane: 536870912,
										hydrationErrors: null,
									}),
									(n = vi(e)),
									(n.return = t),
									(t.child = n),
									(Fi = t),
									(L = null)))
							: (e = null),
						e === null)
					)
						throw zi(t);
					return (
						of(e) ? (t.lanes = 32) : (t.lanes = 536870912),
						null
					);
				}
				var c = r.children;
				return (
					(r = r.fallback),
					a
						? (lo(t),
							(a = t.mode),
							(c = wc({ mode: `hidden`, children: c }, a)),
							(r = gi(r, a, n, null)),
							(c.return = t),
							(r.return = t),
							(c.sibling = r),
							(t.child = c),
							(r = t.child),
							(r.memoizedState = bc(n)),
							(r.childLanes = xc(e, s, n)),
							(t.memoizedState = yc),
							lc(null, r))
						: (oo(t), Cc(t, c))
				);
			}
			var l = e.memoizedState;
			if (l !== null && ((c = l.dehydrated), c !== null)) {
				if (o)
					t.flags & 256
						? (oo(t), (t.flags &= -257), (t = Tc(e, t, n)))
						: t.memoizedState === null
							? (lo(t),
								(c = r.fallback),
								(a = t.mode),
								(r = wc(
									{ mode: `visible`, children: r.children },
									a,
								)),
								(c = gi(c, a, n, null)),
								(c.flags |= 2),
								(r.return = t),
								(c.return = t),
								(r.sibling = c),
								(t.child = r),
								za(t, e.child, null, n),
								(r = t.child),
								(r.memoizedState = bc(n)),
								(r.childLanes = xc(e, s, n)),
								(t.memoizedState = yc),
								(t = lc(null, r)))
							: (lo(t),
								(t.child = e.child),
								(t.flags |= 128),
								(t = null));
				else if ((oo(t), of(c))) {
					if (((s = c.nextSibling && c.nextSibling.dataset), s))
						var u = s.dgst;
					((s = u),
						(r = Error(i(419))),
						(r.stack = ``),
						(r.digest = s),
						Gi({ value: r, source: null, stack: null }),
						(t = Tc(e, t, n)));
				} else if (
					(U || $i(e, t, n, !1),
					(s = (n & e.childLanes) !== 0),
					U || s)
				) {
					if (
						((s = q),
						s !== null &&
							((r = ct(s, n)), r !== 0 && r !== l.retryLane))
					)
						throw ((l.retryLane = r), oi(e, r), hu(s, e, r), rc);
					(af(c) || Du(), (t = Tc(e, t, n)));
				} else
					af(c)
						? ((t.flags |= 192), (t.child = e.child), (t = null))
						: ((e = l.treeContext),
							(L = cf(c.nextSibling)),
							(Fi = t),
							(R = !0),
							(Ii = null),
							(Li = !1),
							e !== null && Pi(t, e),
							(t = Cc(t, r.children)),
							(t.flags |= 4096));
				return t;
			}
			return a
				? (lo(t),
					(c = r.fallback),
					(a = t.mode),
					(l = e.child),
					(u = l.sibling),
					(r = pi(l, { mode: `hidden`, children: r.children })),
					(r.subtreeFlags = l.subtreeFlags & 65011712),
					u === null
						? ((c = gi(c, a, n, null)), (c.flags |= 2))
						: (c = pi(u, c)),
					(c.return = t),
					(r.return = t),
					(r.sibling = c),
					(t.child = r),
					lc(null, r),
					(r = t.child),
					(c = e.child.memoizedState),
					c === null
						? (c = bc(n))
						: ((a = c.cachePool),
							a === null
								? (a = Sa())
								: ((l = ca._currentValue),
									(a =
										a.parent === l
											? a
											: { parent: l, pool: l })),
							(c = { baseLanes: c.baseLanes | n, cachePool: a })),
					(r.memoizedState = c),
					(r.childLanes = xc(e, s, n)),
					(t.memoizedState = yc),
					lc(e.child, r))
				: (oo(t),
					(n = e.child),
					(e = n.sibling),
					(n = pi(n, { mode: `visible`, children: r.children })),
					(n.return = t),
					(n.sibling = null),
					e !== null &&
						((s = t.deletions),
						s === null
							? ((t.deletions = [e]), (t.flags |= 16))
							: s.push(e)),
					(t.child = n),
					(t.memoizedState = null),
					n);
		}
		function Cc(e, t) {
			return (
				(t = wc({ mode: `visible`, children: t }, e.mode)),
				(t.return = e),
				(e.child = t)
			);
		}
		function wc(e, t) {
			return ((e = di(22, e, null, t)), (e.lanes = 0), e);
		}
		function Tc(e, t, n) {
			return (
				za(t, e.child, null, n),
				(e = Cc(t, t.pendingProps.children)),
				(e.flags |= 2),
				(t.memoizedState = null),
				e
			);
		}
		function Ec(e, t, n) {
			e.lanes |= t;
			var r = e.alternate;
			(r !== null && (r.lanes |= t), Zi(e.return, t, n));
		}
		function Dc(e, t, n, r, i, a) {
			var o = e.memoizedState;
			o === null
				? (e.memoizedState = {
						isBackwards: t,
						rendering: null,
						renderingStartTime: 0,
						last: r,
						tail: n,
						tailMode: i,
						treeForkCount: a,
					})
				: ((o.isBackwards = t),
					(o.rendering = null),
					(o.renderingStartTime = 0),
					(o.last = r),
					(o.tail = n),
					(o.tailMode = i),
					(o.treeForkCount = a));
		}
		function Oc(e, t, n) {
			var r = t.pendingProps,
				i = r.revealOrder,
				a = r.tail;
			r = r.children;
			var o = fo.current,
				s = (o & 2) != 0;
			if (
				(s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
				O(fo, o),
				ic(e, t, r, n),
				(r = R ? Ti : 0),
				!s && e !== null && e.flags & 128)
			)
				a: for (e = t.child; e !== null; ) {
					if (e.tag === 13) e.memoizedState !== null && Ec(e, n, t);
					else if (e.tag === 19) Ec(e, n, t);
					else if (e.child !== null) {
						((e.child.return = e), (e = e.child));
						continue;
					}
					if (e === t) break a;
					for (; e.sibling === null; ) {
						if (e.return === null || e.return === t) break a;
						e = e.return;
					}
					((e.sibling.return = e.return), (e = e.sibling));
				}
			switch (i) {
				case `forwards`:
					for (n = t.child, i = null; n !== null; )
						((e = n.alternate),
							e !== null && po(e) === null && (i = n),
							(n = n.sibling));
					((n = i),
						n === null
							? ((i = t.child), (t.child = null))
							: ((i = n.sibling), (n.sibling = null)),
						Dc(t, !1, i, n, a, r));
					break;
				case `backwards`:
				case `unstable_legacy-backwards`:
					for (n = null, i = t.child, t.child = null; i !== null; ) {
						if (((e = i.alternate), e !== null && po(e) === null)) {
							t.child = i;
							break;
						}
						((e = i.sibling), (i.sibling = n), (n = i), (i = e));
					}
					Dc(t, !0, n, null, a, r);
					break;
				case `together`:
					Dc(t, !1, null, null, void 0, r);
					break;
				default:
					t.memoizedState = null;
			}
			return t.child;
		}
		function kc(e, t, n) {
			if (
				(e !== null && (t.dependencies = e.dependencies),
				(Gl |= t.lanes),
				(n & t.childLanes) === 0)
			)
				if (e !== null) {
					if (($i(e, t, n, !1), (n & t.childLanes) === 0))
						return null;
				} else return null;
			if (e !== null && t.child !== e.child) throw Error(i(153));
			if (t.child !== null) {
				for (
					e = t.child,
						n = pi(e, e.pendingProps),
						t.child = n,
						n.return = t;
					e.sibling !== null;
				)
					((e = e.sibling),
						(n = n.sibling = pi(e, e.pendingProps)),
						(n.return = t));
				n.sibling = null;
			}
			return t.child;
		}
		function Ac(e, t) {
			return (e.lanes & t) === 0
				? ((e = e.dependencies), !!(e !== null && ea(e)))
				: !0;
		}
		function jc(e, t, n) {
			switch (t.tag) {
				case 3:
					(ge(t, t.stateNode.containerInfo),
						Yi(t, ca, e.memoizedState.cache),
						Ui());
					break;
				case 27:
				case 5:
					be(t);
					break;
				case 4:
					ge(t, t.stateNode.containerInfo);
					break;
				case 10:
					Yi(t, t.type, t.memoizedProps.value);
					break;
				case 31:
					if (t.memoizedState !== null)
						return ((t.flags |= 128), so(t), null);
					break;
				case 13:
					var r = t.memoizedState;
					if (r !== null)
						return r.dehydrated === null
							? (n & t.child.childLanes) === 0
								? (oo(t),
									(e = kc(e, t, n)),
									e === null ? null : e.sibling)
								: Sc(e, t, n)
							: (oo(t), (t.flags |= 128), null);
					oo(t);
					break;
				case 19:
					var i = (e.flags & 128) != 0;
					if (
						((r = (n & t.childLanes) !== 0),
						(r ||= ($i(e, t, n, !1), (n & t.childLanes) !== 0)),
						i)
					) {
						if (r) return Oc(e, t, n);
						t.flags |= 128;
					}
					if (
						((i = t.memoizedState),
						i !== null &&
							((i.rendering = null),
							(i.tail = null),
							(i.lastEffect = null)),
						O(fo, fo.current),
						r)
					)
						break;
					return null;
				case 22:
					return ((t.lanes = 0), cc(e, t, n, t.pendingProps));
				case 24:
					Yi(t, ca, e.memoizedState.cache);
			}
			return kc(e, t, n);
		}
		function Mc(e, t, n) {
			if (e !== null)
				if (e.memoizedProps !== t.pendingProps) U = !0;
				else {
					if (!Ac(e, n) && !(t.flags & 128))
						return ((U = !1), jc(e, t, n));
					U = !!(e.flags & 131072);
				}
			else ((U = !1), R && t.flags & 1048576 && Mi(t, Ti, t.index));
			switch (((t.lanes = 0), t.tag)) {
				case 16:
					a: {
						var r = t.pendingProps;
						if (
							((e = ka(t.elementType)),
							(t.type = e),
							typeof e == `function`)
						)
							fi(e)
								? ((r = qs(e, r)),
									(t.tag = 1),
									(t = _c(null, t, e, r, n)))
								: ((t.tag = 0), (t = hc(null, t, e, r, n)));
						else {
							if (e != null) {
								var a = e.$$typeof;
								if (a === x) {
									((t.tag = 11), (t = ac(null, t, e, r, n)));
									break a;
								} else if (a === w) {
									((t.tag = 14), (t = oc(null, t, e, r, n)));
									break a;
								}
							}
							throw ((t = ae(e) || e), Error(i(306, t, ``)));
						}
					}
					return t;
				case 0:
					return hc(e, t, t.type, t.pendingProps, n);
				case 1:
					return (
						(r = t.type),
						(a = qs(r, t.pendingProps)),
						_c(e, t, r, a, n)
					);
				case 3:
					a: {
						if ((ge(t, t.stateNode.containerInfo), e === null))
							throw Error(i(387));
						r = t.pendingProps;
						var o = t.memoizedState;
						((a = o.element), Ua(e, t), Xa(t, r, null, n));
						var s = t.memoizedState;
						if (
							((r = s.cache),
							Yi(t, ca, r),
							r !== o.cache && Qi(t, [ca], n, !0),
							Ya(),
							(r = s.element),
							o.isDehydrated)
						)
							if (
								((o = {
									element: r,
									isDehydrated: !1,
									cache: s.cache,
								}),
								(t.updateQueue.baseState = o),
								(t.memoizedState = o),
								t.flags & 256)
							) {
								t = vc(e, t, r, n);
								break a;
							} else if (r !== a) {
								((a = xi(Error(i(424)), t)),
									Gi(a),
									(t = vc(e, t, r, n)));
								break a;
							} else {
								switch (
									((e = t.stateNode.containerInfo),
									e.nodeType)
								) {
									case 9:
										e = e.body;
										break;
									default:
										e =
											e.nodeName === `HTML`
												? e.ownerDocument.body
												: e;
								}
								for (
									L = cf(e.firstChild),
										Fi = t,
										R = !0,
										Ii = null,
										Li = !0,
										n = Ba(t, null, r, n),
										t.child = n;
									n;
								)
									((n.flags = (n.flags & -3) | 4096),
										(n = n.sibling));
							}
						else {
							if ((Ui(), r === a)) {
								t = kc(e, t, n);
								break a;
							}
							ic(e, t, r, n);
						}
						t = t.child;
					}
					return t;
				case 26:
					return (
						mc(e, t),
						e === null
							? (n = kf(t.type, null, t.pendingProps, null))
								? (t.memoizedState = n)
								: R ||
									((n = t.type),
									(e = t.pendingProps),
									(r = Bd(me.current).createElement(n)),
									(r[mt] = t),
									(r[ht] = e),
									Pd(r, n, e),
									j(r),
									(t.stateNode = r))
							: (t.memoizedState = kf(
									t.type,
									e.memoizedProps,
									t.pendingProps,
									e.memoizedState,
								)),
						null
					);
				case 27:
					return (
						be(t),
						e === null &&
							R &&
							((r = t.stateNode =
								ff(t.type, t.pendingProps, me.current)),
							(Fi = t),
							(Li = !0),
							(a = L),
							Zd(t.type)
								? ((lf = a), (L = cf(r.firstChild)))
								: (L = a)),
						ic(e, t, t.pendingProps.children, n),
						mc(e, t),
						e === null && (t.flags |= 4194304),
						t.child
					);
				case 5:
					return (
						e === null &&
							R &&
							((a = r = L) &&
								((r = tf(r, t.type, t.pendingProps, Li)),
								r === null
									? (a = !1)
									: ((t.stateNode = r),
										(Fi = t),
										(L = cf(r.firstChild)),
										(Li = !1),
										(a = !0))),
							a || zi(t)),
						be(t),
						(a = t.type),
						(o = t.pendingProps),
						(s = e === null ? null : e.memoizedProps),
						(r = o.children),
						Ud(a, o)
							? (r = null)
							: s !== null && Ud(a, s) && (t.flags |= 32),
						t.memoizedState !== null &&
							((a = wo(e, t, Do, null, null, n)),
							(Qf._currentValue = a)),
						mc(e, t),
						ic(e, t, r, n),
						t.child
					);
				case 6:
					return (
						e === null &&
							R &&
							((e = n = L) &&
								((n = nf(n, t.pendingProps, Li)),
								n === null
									? (e = !1)
									: ((t.stateNode = n),
										(Fi = t),
										(L = null),
										(e = !0))),
							e || zi(t)),
						null
					);
				case 13:
					return Sc(e, t, n);
				case 4:
					return (
						ge(t, t.stateNode.containerInfo),
						(r = t.pendingProps),
						e === null
							? (t.child = za(t, null, r, n))
							: ic(e, t, r, n),
						t.child
					);
				case 11:
					return ac(e, t, t.type, t.pendingProps, n);
				case 7:
					return (ic(e, t, t.pendingProps, n), t.child);
				case 8:
					return (ic(e, t, t.pendingProps.children, n), t.child);
				case 12:
					return (ic(e, t, t.pendingProps.children, n), t.child);
				case 10:
					return (
						(r = t.pendingProps),
						Yi(t, t.type, r.value),
						ic(e, t, r.children, n),
						t.child
					);
				case 9:
					return (
						(a = t.type._context),
						(r = t.pendingProps.children),
						ta(t),
						(a = na(a)),
						(r = r(a)),
						(t.flags |= 1),
						ic(e, t, r, n),
						t.child
					);
				case 14:
					return oc(e, t, t.type, t.pendingProps, n);
				case 15:
					return sc(e, t, t.type, t.pendingProps, n);
				case 19:
					return Oc(e, t, n);
				case 31:
					return pc(e, t, n);
				case 22:
					return cc(e, t, n, t.pendingProps);
				case 24:
					return (
						ta(t),
						(r = na(ca)),
						e === null
							? ((a = ba()),
								a === null &&
									((a = q),
									(o = la()),
									(a.pooledCache = o),
									o.refCount++,
									o !== null && (a.pooledCacheLanes |= n),
									(a = o)),
								(t.memoizedState = { parent: r, cache: a }),
								Ha(t),
								Yi(t, ca, a))
							: ((e.lanes & n) !== 0 &&
									(Ua(e, t), Xa(t, null, null, n), Ya()),
								(a = e.memoizedState),
								(o = t.memoizedState),
								a.parent === r
									? ((r = o.cache),
										Yi(t, ca, r),
										r !== a.cache && Qi(t, [ca], n, !0))
									: ((a = { parent: r, cache: r }),
										(t.memoizedState = a),
										t.lanes === 0 &&
											(t.memoizedState =
												t.updateQueue.baseState =
													a),
										Yi(t, ca, r))),
						ic(e, t, t.pendingProps.children, n),
						t.child
					);
				case 29:
					throw t.pendingProps;
			}
			throw Error(i(156, t.tag));
		}
		function Nc(e) {
			e.flags |= 4;
		}
		function Pc(e, t, n, r, i) {
			if (((t = (e.mode & 32) != 0) && (t = !1), t)) {
				if (((e.flags |= 16777216), (i & 335544128) === i))
					if (e.stateNode.complete) e.flags |= 8192;
					else if (wu()) e.flags |= 8192;
					else throw ((Aa = Ea), wa);
			} else e.flags &= -16777217;
		}
		function Fc(e, t) {
			if (t.type !== `stylesheet` || t.state.loading & 4)
				e.flags &= -16777217;
			else if (((e.flags |= 16777216), !Wf(t)))
				if (wu()) e.flags |= 8192;
				else throw ((Aa = Ea), wa);
		}
		function Ic(e, t) {
			(t !== null && (e.flags |= 4),
				e.flags & 16384 &&
					((t = e.tag === 22 ? 536870912 : nt()),
					(e.lanes |= t),
					(Yl |= t)));
		}
		function Lc(e, t) {
			if (!R)
				switch (e.tailMode) {
					case `hidden`:
						t = e.tail;
						for (var n = null; t !== null; )
							(t.alternate !== null && (n = t), (t = t.sibling));
						n === null ? (e.tail = null) : (n.sibling = null);
						break;
					case `collapsed`:
						n = e.tail;
						for (var r = null; n !== null; )
							(n.alternate !== null && (r = n), (n = n.sibling));
						r === null
							? t || e.tail === null
								? (e.tail = null)
								: (e.tail.sibling = null)
							: (r.sibling = null);
				}
		}
		function W(e) {
			var t = e.alternate !== null && e.alternate.child === e.child,
				n = 0,
				r = 0;
			if (t)
				for (var i = e.child; i !== null; )
					((n |= i.lanes | i.childLanes),
						(r |= i.subtreeFlags & 65011712),
						(r |= i.flags & 65011712),
						(i.return = e),
						(i = i.sibling));
			else
				for (i = e.child; i !== null; )
					((n |= i.lanes | i.childLanes),
						(r |= i.subtreeFlags),
						(r |= i.flags),
						(i.return = e),
						(i = i.sibling));
			return ((e.subtreeFlags |= r), (e.childLanes = n), t);
		}
		function Rc(e, t, n) {
			var r = t.pendingProps;
			switch ((I(t), t.tag)) {
				case 16:
				case 15:
				case 0:
				case 11:
				case 7:
				case 8:
				case 12:
				case 9:
				case 14:
					return (W(t), null);
				case 1:
					return (W(t), null);
				case 3:
					return (
						(n = t.stateNode),
						(r = null),
						e !== null && (r = e.memoizedState.cache),
						t.memoizedState.cache !== r && (t.flags |= 2048),
						Xi(ca),
						ve(),
						n.pendingContext &&
							((n.context = n.pendingContext),
							(n.pendingContext = null)),
						(e === null || e.child === null) &&
							(Hi(t)
								? Nc(t)
								: e === null ||
									(e.memoizedState.isDehydrated &&
										!(t.flags & 256)) ||
									((t.flags |= 1024), Wi())),
						W(t),
						null
					);
				case 26:
					var a = t.type,
						o = t.memoizedState;
					return (
						e === null
							? (Nc(t),
								o === null
									? (W(t), Pc(t, a, null, r, n))
									: (W(t), Fc(t, o)))
							: o
								? o === e.memoizedState
									? (W(t), (t.flags &= -16777217))
									: (Nc(t), W(t), Fc(t, o))
								: ((e = e.memoizedProps),
									e !== r && Nc(t),
									W(t),
									Pc(t, a, e, r, n)),
						null
					);
				case 27:
					if (
						(Se(t),
						(n = me.current),
						(a = t.type),
						e !== null && t.stateNode != null)
					)
						e.memoizedProps !== r && Nc(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error(i(166));
							return (W(t), null);
						}
						((e = fe.current),
							Hi(t)
								? Bi(t, e)
								: ((e = ff(a, r, n)),
									(t.stateNode = e),
									Nc(t)));
					}
					return (W(t), null);
				case 5:
					if (
						(Se(t), (a = t.type), e !== null && t.stateNode != null)
					)
						e.memoizedProps !== r && Nc(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error(i(166));
							return (W(t), null);
						}
						if (((o = fe.current), Hi(t))) Bi(t, o);
						else {
							var s = Bd(me.current);
							switch (o) {
								case 1:
									o = s.createElementNS(
										`http://www.w3.org/2000/svg`,
										a,
									);
									break;
								case 2:
									o = s.createElementNS(
										`http://www.w3.org/1998/Math/MathML`,
										a,
									);
									break;
								default:
									switch (a) {
										case `svg`:
											o = s.createElementNS(
												`http://www.w3.org/2000/svg`,
												a,
											);
											break;
										case `math`:
											o = s.createElementNS(
												`http://www.w3.org/1998/Math/MathML`,
												a,
											);
											break;
										case `script`:
											((o = s.createElement(`div`)),
												(o.innerHTML = `<script><\/script>`),
												(o = o.removeChild(
													o.firstChild,
												)));
											break;
										case `select`:
											((o =
												typeof r.is == `string`
													? s.createElement(
															`select`,
															{ is: r.is },
														)
													: s.createElement(
															`select`,
														)),
												r.multiple
													? (o.multiple = !0)
													: r.size &&
														(o.size = r.size));
											break;
										default:
											o =
												typeof r.is == `string`
													? s.createElement(a, {
															is: r.is,
														})
													: s.createElement(a);
									}
							}
							((o[mt] = t), (o[ht] = r));
							a: for (s = t.child; s !== null; ) {
								if (s.tag === 5 || s.tag === 6)
									o.appendChild(s.stateNode);
								else if (
									s.tag !== 4 &&
									s.tag !== 27 &&
									s.child !== null
								) {
									((s.child.return = s), (s = s.child));
									continue;
								}
								if (s === t) break a;
								for (; s.sibling === null; ) {
									if (s.return === null || s.return === t)
										break a;
									s = s.return;
								}
								((s.sibling.return = s.return),
									(s = s.sibling));
							}
							t.stateNode = o;
							a: switch ((Pd(o, a, r), a)) {
								case `button`:
								case `input`:
								case `select`:
								case `textarea`:
									r = !!r.autoFocus;
									break a;
								case `img`:
									r = !0;
									break a;
								default:
									r = !1;
							}
							r && Nc(t);
						}
					}
					return (
						W(t),
						Pc(
							t,
							t.type,
							e === null ? null : e.memoizedProps,
							t.pendingProps,
							n,
						),
						null
					);
				case 6:
					if (e && t.stateNode != null)
						e.memoizedProps !== r && Nc(t);
					else {
						if (typeof r != `string` && t.stateNode === null)
							throw Error(i(166));
						if (((e = me.current), Hi(t))) {
							if (
								((e = t.stateNode),
								(n = t.memoizedProps),
								(r = null),
								(a = Fi),
								a !== null)
							)
								switch (a.tag) {
									case 27:
									case 5:
										r = a.memoizedProps;
								}
							((e[mt] = t),
								(e = !!(
									e.nodeValue === n ||
									(r !== null &&
										!0 === r.suppressHydrationWarning) ||
									Md(e.nodeValue, n)
								)),
								e || zi(t, !0));
						} else
							((e = Bd(e).createTextNode(r)),
								(e[mt] = t),
								(t.stateNode = e));
					}
					return (W(t), null);
				case 31:
					if (
						((n = t.memoizedState),
						e === null || e.memoizedState !== null)
					) {
						if (((r = Hi(t)), n !== null)) {
							if (e === null) {
								if (!r) throw Error(i(318));
								if (
									((e = t.memoizedState),
									(e = e === null ? null : e.dehydrated),
									!e)
								)
									throw Error(i(557));
								e[mt] = t;
							} else
								(Ui(),
									!(t.flags & 128) &&
										(t.memoizedState = null),
									(t.flags |= 4));
							(W(t), (e = !1));
						} else
							((n = Wi()),
								e !== null &&
									e.memoizedState !== null &&
									(e.memoizedState.hydrationErrors = n),
								(e = !0));
						if (!e)
							return t.flags & 256 ? (uo(t), t) : (uo(t), null);
						if (t.flags & 128) throw Error(i(558));
					}
					return (W(t), null);
				case 13:
					if (
						((r = t.memoizedState),
						e === null ||
							(e.memoizedState !== null &&
								e.memoizedState.dehydrated !== null))
					) {
						if (
							((a = Hi(t)), r !== null && r.dehydrated !== null)
						) {
							if (e === null) {
								if (!a) throw Error(i(318));
								if (
									((a = t.memoizedState),
									(a = a === null ? null : a.dehydrated),
									!a)
								)
									throw Error(i(317));
								a[mt] = t;
							} else
								(Ui(),
									!(t.flags & 128) &&
										(t.memoizedState = null),
									(t.flags |= 4));
							(W(t), (a = !1));
						} else
							((a = Wi()),
								e !== null &&
									e.memoizedState !== null &&
									(e.memoizedState.hydrationErrors = a),
								(a = !0));
						if (!a)
							return t.flags & 256 ? (uo(t), t) : (uo(t), null);
					}
					return (
						uo(t),
						t.flags & 128
							? ((t.lanes = n), t)
							: ((n = r !== null),
								(e = e !== null && e.memoizedState !== null),
								n &&
									((r = t.child),
									(a = null),
									r.alternate !== null &&
										r.alternate.memoizedState !== null &&
										r.alternate.memoizedState.cachePool !==
											null &&
										(a =
											r.alternate.memoizedState.cachePool
												.pool),
									(o = null),
									r.memoizedState !== null &&
										r.memoizedState.cachePool !== null &&
										(o = r.memoizedState.cachePool.pool),
									o !== a && (r.flags |= 2048)),
								n !== e && n && (t.child.flags |= 8192),
								Ic(t, t.updateQueue),
								W(t),
								null)
					);
				case 4:
					return (
						ve(),
						e === null && Sd(t.stateNode.containerInfo),
						W(t),
						null
					);
				case 10:
					return (Xi(t.type), W(t), null);
				case 19:
					if ((de(fo), (r = t.memoizedState), r === null))
						return (W(t), null);
					if (
						((a = (t.flags & 128) != 0),
						(o = r.rendering),
						o === null)
					)
						if (a) Lc(r, !1);
						else {
							if (Wl !== 0 || (e !== null && e.flags & 128))
								for (e = t.child; e !== null; ) {
									if (((o = po(e)), o !== null)) {
										for (
											t.flags |= 128,
												Lc(r, !1),
												e = o.updateQueue,
												t.updateQueue = e,
												Ic(t, e),
												t.subtreeFlags = 0,
												e = n,
												n = t.child;
											n !== null;
										)
											(mi(n, e), (n = n.sibling));
										return (
											O(fo, (fo.current & 1) | 2),
											R && ji(t, r.treeForkCount),
											t.child
										);
									}
									e = e.sibling;
								}
							r.tail !== null &&
								Ne() > tu &&
								((t.flags |= 128),
								(a = !0),
								Lc(r, !1),
								(t.lanes = 4194304));
						}
					else {
						if (!a)
							if (((e = po(o)), e !== null)) {
								if (
									((t.flags |= 128),
									(a = !0),
									(e = e.updateQueue),
									(t.updateQueue = e),
									Ic(t, e),
									Lc(r, !0),
									r.tail === null &&
										r.tailMode === `hidden` &&
										!o.alternate &&
										!R)
								)
									return (W(t), null);
							} else
								2 * Ne() - r.renderingStartTime > tu &&
									n !== 536870912 &&
									((t.flags |= 128),
									(a = !0),
									Lc(r, !1),
									(t.lanes = 4194304));
						r.isBackwards
							? ((o.sibling = t.child), (t.child = o))
							: ((e = r.last),
								e === null ? (t.child = o) : (e.sibling = o),
								(r.last = o));
					}
					return r.tail === null
						? (W(t), null)
						: ((e = r.tail),
							(r.rendering = e),
							(r.tail = e.sibling),
							(r.renderingStartTime = Ne()),
							(e.sibling = null),
							(n = fo.current),
							O(fo, a ? (n & 1) | 2 : n & 1),
							R && ji(t, r.treeForkCount),
							e);
				case 22:
				case 23:
					return (
						uo(t),
						ro(),
						(r = t.memoizedState !== null),
						e === null
							? r && (t.flags |= 8192)
							: (e.memoizedState !== null) !== r &&
								(t.flags |= 8192),
						r
							? n & 536870912 &&
								!(t.flags & 128) &&
								(W(t), t.subtreeFlags & 6 && (t.flags |= 8192))
							: W(t),
						(n = t.updateQueue),
						n !== null && Ic(t, n.retryQueue),
						(n = null),
						e !== null &&
							e.memoizedState !== null &&
							e.memoizedState.cachePool !== null &&
							(n = e.memoizedState.cachePool.pool),
						(r = null),
						t.memoizedState !== null &&
							t.memoizedState.cachePool !== null &&
							(r = t.memoizedState.cachePool.pool),
						r !== n && (t.flags |= 2048),
						e !== null && de(ya),
						null
					);
				case 24:
					return (
						(n = null),
						e !== null && (n = e.memoizedState.cache),
						t.memoizedState.cache !== n && (t.flags |= 2048),
						Xi(ca),
						W(t),
						null
					);
				case 25:
					return null;
				case 30:
					return null;
			}
			throw Error(i(156, t.tag));
		}
		function zc(e, t) {
			switch ((I(t), t.tag)) {
				case 1:
					return (
						(e = t.flags),
						e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
					);
				case 3:
					return (
						Xi(ca),
						ve(),
						(e = t.flags),
						e & 65536 && !(e & 128)
							? ((t.flags = (e & -65537) | 128), t)
							: null
					);
				case 26:
				case 27:
				case 5:
					return (Se(t), null);
				case 31:
					if (t.memoizedState !== null) {
						if ((uo(t), t.alternate === null)) throw Error(i(340));
						Ui();
					}
					return (
						(e = t.flags),
						e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
					);
				case 13:
					if (
						(uo(t),
						(e = t.memoizedState),
						e !== null && e.dehydrated !== null)
					) {
						if (t.alternate === null) throw Error(i(340));
						Ui();
					}
					return (
						(e = t.flags),
						e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
					);
				case 19:
					return (de(fo), null);
				case 4:
					return (ve(), null);
				case 10:
					return (Xi(t.type), null);
				case 22:
				case 23:
					return (
						uo(t),
						ro(),
						e !== null && de(ya),
						(e = t.flags),
						e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
					);
				case 24:
					return (Xi(ca), null);
				case 25:
					return null;
				default:
					return null;
			}
		}
		function Bc(e, t) {
			switch ((I(t), t.tag)) {
				case 3:
					(Xi(ca), ve());
					break;
				case 26:
				case 27:
				case 5:
					Se(t);
					break;
				case 4:
					ve();
					break;
				case 31:
					t.memoizedState !== null && uo(t);
					break;
				case 13:
					uo(t);
					break;
				case 19:
					de(fo);
					break;
				case 10:
					Xi(t.type);
					break;
				case 22:
				case 23:
					(uo(t), ro(), e !== null && de(ya));
					break;
				case 24:
					Xi(ca);
			}
		}
		function Vc(e, t) {
			try {
				var n = t.updateQueue,
					r = n === null ? null : n.lastEffect;
				if (r !== null) {
					var i = r.next;
					n = i;
					do {
						if ((n.tag & e) === e) {
							r = void 0;
							var a = n.create,
								o = n.inst;
							((r = a()), (o.destroy = r));
						}
						n = n.next;
					} while (n !== i);
				}
			} catch (e) {
				Z(t, t.return, e);
			}
		}
		function Hc(e, t, n) {
			try {
				var r = t.updateQueue,
					i = r === null ? null : r.lastEffect;
				if (i !== null) {
					var a = i.next;
					r = a;
					do {
						if ((r.tag & e) === e) {
							var o = r.inst,
								s = o.destroy;
							if (s !== void 0) {
								((o.destroy = void 0), (i = t));
								var c = n,
									l = s;
								try {
									l();
								} catch (e) {
									Z(i, c, e);
								}
							}
						}
						r = r.next;
					} while (r !== a);
				}
			} catch (e) {
				Z(t, t.return, e);
			}
		}
		function Uc(e) {
			var t = e.updateQueue;
			if (t !== null) {
				var n = e.stateNode;
				try {
					Qa(t, n);
				} catch (t) {
					Z(e, e.return, t);
				}
			}
		}
		function Wc(e, t, n) {
			((n.props = qs(e.type, e.memoizedProps)),
				(n.state = e.memoizedState));
			try {
				n.componentWillUnmount();
			} catch (n) {
				Z(e, t, n);
			}
		}
		function Gc(e, t) {
			try {
				var n = e.ref;
				if (n !== null) {
					switch (e.tag) {
						case 26:
						case 27:
						case 5:
							var r = e.stateNode;
							break;
						case 30:
							r = e.stateNode;
							break;
						default:
							r = e.stateNode;
					}
					typeof n == `function`
						? (e.refCleanup = n(r))
						: (n.current = r);
				}
			} catch (n) {
				Z(e, t, n);
			}
		}
		function Kc(e, t) {
			var n = e.ref,
				r = e.refCleanup;
			if (n !== null)
				if (typeof r == `function`)
					try {
						r();
					} catch (n) {
						Z(e, t, n);
					} finally {
						((e.refCleanup = null),
							(e = e.alternate),
							e != null && (e.refCleanup = null));
					}
				else if (typeof n == `function`)
					try {
						n(null);
					} catch (n) {
						Z(e, t, n);
					}
				else n.current = null;
		}
		function qc(e) {
			var t = e.type,
				n = e.memoizedProps,
				r = e.stateNode;
			try {
				a: switch (t) {
					case `button`:
					case `input`:
					case `select`:
					case `textarea`:
						n.autoFocus && r.focus();
						break a;
					case `img`:
						n.src
							? (r.src = n.src)
							: n.srcSet && (r.srcset = n.srcSet);
				}
			} catch (t) {
				Z(e, e.return, t);
			}
		}
		function Jc(e, t, n) {
			try {
				var r = e.stateNode;
				(Fd(r, e.type, n, t), (r[ht] = t));
			} catch (t) {
				Z(e, e.return, t);
			}
		}
		function Yc(e) {
			return (
				e.tag === 5 ||
				e.tag === 3 ||
				e.tag === 26 ||
				(e.tag === 27 && Zd(e.type)) ||
				e.tag === 4
			);
		}
		function Xc(e) {
			a: for (;;) {
				for (; e.sibling === null; ) {
					if (e.return === null || Yc(e.return)) return null;
					e = e.return;
				}
				for (
					e.sibling.return = e.return, e = e.sibling;
					e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
				) {
					if (
						(e.tag === 27 && Zd(e.type)) ||
						e.flags & 2 ||
						e.child === null ||
						e.tag === 4
					)
						continue a;
					((e.child.return = e), (e = e.child));
				}
				if (!(e.flags & 2)) return e.stateNode;
			}
		}
		function Zc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6)
				((e = e.stateNode),
					t
						? (n.nodeType === 9
								? n.body
								: n.nodeName === `HTML`
									? n.ownerDocument.body
									: n
							).insertBefore(e, t)
						: ((t =
								n.nodeType === 9
									? n.body
									: n.nodeName === `HTML`
										? n.ownerDocument.body
										: n),
							t.appendChild(e),
							(n = n._reactRootContainer),
							n != null ||
								t.onclick !== null ||
								(t.onclick = an)));
			else if (
				r !== 4 &&
				(r === 27 && Zd(e.type) && ((n = e.stateNode), (t = null)),
				(e = e.child),
				e !== null)
			)
				for (Zc(e, t, n), e = e.sibling; e !== null; )
					(Zc(e, t, n), (e = e.sibling));
		}
		function Qc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6)
				((e = e.stateNode),
					t ? n.insertBefore(e, t) : n.appendChild(e));
			else if (
				r !== 4 &&
				(r === 27 && Zd(e.type) && (n = e.stateNode),
				(e = e.child),
				e !== null)
			)
				for (Qc(e, t, n), e = e.sibling; e !== null; )
					(Qc(e, t, n), (e = e.sibling));
		}
		function $c(e) {
			var t = e.stateNode,
				n = e.memoizedProps;
			try {
				for (var r = e.type, i = t.attributes; i.length; )
					t.removeAttributeNode(i[0]);
				(Pd(t, r, n), (t[mt] = e), (t[ht] = n));
			} catch (t) {
				Z(e, e.return, t);
			}
		}
		var el = !1,
			tl = !1,
			nl = !1,
			rl = typeof WeakSet == `function` ? WeakSet : Set,
			il = null;
		function al(e, t) {
			if (((e = e.containerInfo), (Rd = sp), (e = jr(e)), Mr(e))) {
				if (`selectionStart` in e)
					var n = { start: e.selectionStart, end: e.selectionEnd };
				else
					a: {
						n = ((n = e.ownerDocument) && n.defaultView) || window;
						var r = n.getSelection && n.getSelection();
						if (r && r.rangeCount !== 0) {
							n = r.anchorNode;
							var a = r.anchorOffset,
								o = r.focusNode;
							r = r.focusOffset;
							try {
								(n.nodeType, o.nodeType);
							} catch {
								n = null;
								break a;
							}
							var s = 0,
								c = -1,
								l = -1,
								u = 0,
								d = 0,
								f = e,
								p = null;
							b: for (;;) {
								for (
									var m;
									f !== n ||
										(a !== 0 && f.nodeType !== 3) ||
										(c = s + a),
										f !== o ||
											(r !== 0 && f.nodeType !== 3) ||
											(l = s + r),
										f.nodeType === 3 &&
											(s += f.nodeValue.length),
										(m = f.firstChild) !== null;
								)
									((p = f), (f = m));
								for (;;) {
									if (f === e) break b;
									if (
										(p === n && ++u === a && (c = s),
										p === o && ++d === r && (l = s),
										(m = f.nextSibling) !== null)
									)
										break;
									((f = p), (p = f.parentNode));
								}
								f = m;
							}
							n =
								c === -1 || l === -1
									? null
									: { start: c, end: l };
						} else n = null;
					}
				n ||= { start: 0, end: 0 };
			} else n = null;
			for (
				zd = { focusedElem: e, selectionRange: n }, sp = !1, il = t;
				il !== null;
			)
				if (
					((t = il),
					(e = t.child),
					t.subtreeFlags & 1028 && e !== null)
				)
					((e.return = t), (il = e));
				else
					for (; il !== null; ) {
						switch (
							((t = il), (o = t.alternate), (e = t.flags), t.tag)
						) {
							case 0:
								if (
									e & 4 &&
									((e = t.updateQueue),
									(e = e === null ? null : e.events),
									e !== null)
								)
									for (n = 0; n < e.length; n++)
										((a = e[n]), (a.ref.impl = a.nextImpl));
								break;
							case 11:
							case 15:
								break;
							case 1:
								if (e & 1024 && o !== null) {
									((e = void 0),
										(n = t),
										(a = o.memoizedProps),
										(o = o.memoizedState),
										(r = n.stateNode));
									try {
										var h = qs(n.type, a);
										((e = r.getSnapshotBeforeUpdate(h, o)),
											(r.__reactInternalSnapshotBeforeUpdate =
												e));
									} catch (e) {
										Z(n, n.return, e);
									}
								}
								break;
							case 3:
								if (e & 1024) {
									if (
										((e = t.stateNode.containerInfo),
										(n = e.nodeType),
										n === 9)
									)
										ef(e);
									else if (n === 1)
										switch (e.nodeName) {
											case `HEAD`:
											case `HTML`:
											case `BODY`:
												ef(e);
												break;
											default:
												e.textContent = ``;
										}
								}
								break;
							case 5:
							case 26:
							case 27:
							case 6:
							case 4:
							case 17:
								break;
							default:
								if (e & 1024) throw Error(i(163));
						}
						if (((e = t.sibling), e !== null)) {
							((e.return = t.return), (il = e));
							break;
						}
						il = t.return;
					}
		}
		function ol(e, t, n) {
			var r = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					(bl(e, n), r & 4 && Vc(5, n));
					break;
				case 1:
					if ((bl(e, n), r & 4))
						if (((e = n.stateNode), t === null))
							try {
								e.componentDidMount();
							} catch (e) {
								Z(n, n.return, e);
							}
						else {
							var i = qs(n.type, t.memoizedProps);
							t = t.memoizedState;
							try {
								e.componentDidUpdate(
									i,
									t,
									e.__reactInternalSnapshotBeforeUpdate,
								);
							} catch (e) {
								Z(n, n.return, e);
							}
						}
					(r & 64 && Uc(n), r & 512 && Gc(n, n.return));
					break;
				case 3:
					if (
						(bl(e, n), r & 64 && ((e = n.updateQueue), e !== null))
					) {
						if (((t = null), n.child !== null))
							switch (n.child.tag) {
								case 27:
								case 5:
									t = n.child.stateNode;
									break;
								case 1:
									t = n.child.stateNode;
							}
						try {
							Qa(e, t);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
					break;
				case 27:
					t === null && r & 4 && $c(n);
				case 26:
				case 5:
					(bl(e, n),
						t === null && r & 4 && qc(n),
						r & 512 && Gc(n, n.return));
					break;
				case 12:
					bl(e, n);
					break;
				case 31:
					(bl(e, n), r & 4 && dl(e, n));
					break;
				case 13:
					(bl(e, n),
						r & 4 && fl(e, n),
						r & 64 &&
							((e = n.memoizedState),
							e !== null &&
								((e = e.dehydrated),
								e !== null &&
									((n = Ju.bind(null, n)), sf(e, n)))));
					break;
				case 22:
					if (((r = n.memoizedState !== null || el), !r)) {
						((t = (t !== null && t.memoizedState !== null) || tl),
							(i = el));
						var a = tl;
						((el = r),
							(tl = t) && !a
								? Sl(e, n, (n.subtreeFlags & 8772) != 0)
								: bl(e, n),
							(el = i),
							(tl = a));
					}
					break;
				case 30:
					break;
				default:
					bl(e, n);
			}
		}
		function sl(e) {
			var t = e.alternate;
			(t !== null && ((e.alternate = null), sl(t)),
				(e.child = null),
				(e.deletions = null),
				(e.sibling = null),
				e.tag === 5 && ((t = e.stateNode), t !== null && St(t)),
				(e.stateNode = null),
				(e.return = null),
				(e.dependencies = null),
				(e.memoizedProps = null),
				(e.memoizedState = null),
				(e.pendingProps = null),
				(e.stateNode = null),
				(e.updateQueue = null));
		}
		var G = null,
			cl = !1;
		function ll(e, t, n) {
			for (n = n.child; n !== null; ) (ul(e, t, n), (n = n.sibling));
		}
		function ul(e, t, n) {
			if (Ue && typeof Ue.onCommitFiberUnmount == `function`)
				try {
					Ue.onCommitFiberUnmount(He, n);
				} catch {}
			switch (n.tag) {
				case 26:
					(tl || Kc(n, t),
						ll(e, t, n),
						n.memoizedState
							? n.memoizedState.count--
							: n.stateNode &&
								((n = n.stateNode),
								n.parentNode.removeChild(n)));
					break;
				case 27:
					tl || Kc(n, t);
					var r = G,
						i = cl;
					(Zd(n.type) && ((G = n.stateNode), (cl = !1)),
						ll(e, t, n),
						pf(n.stateNode),
						(G = r),
						(cl = i));
					break;
				case 5:
					tl || Kc(n, t);
				case 6:
					if (
						((r = G),
						(i = cl),
						(G = null),
						ll(e, t, n),
						(G = r),
						(cl = i),
						G !== null)
					)
						if (cl)
							try {
								(G.nodeType === 9
									? G.body
									: G.nodeName === `HTML`
										? G.ownerDocument.body
										: G
								).removeChild(n.stateNode);
							} catch (e) {
								Z(n, t, e);
							}
						else
							try {
								G.removeChild(n.stateNode);
							} catch (e) {
								Z(n, t, e);
							}
					break;
				case 18:
					G !== null &&
						(cl
							? ((e = G),
								Qd(
									e.nodeType === 9
										? e.body
										: e.nodeName === `HTML`
											? e.ownerDocument.body
											: e,
									n.stateNode,
								),
								Np(e))
							: Qd(G, n.stateNode));
					break;
				case 4:
					((r = G),
						(i = cl),
						(G = n.stateNode.containerInfo),
						(cl = !0),
						ll(e, t, n),
						(G = r),
						(cl = i));
					break;
				case 0:
				case 11:
				case 14:
				case 15:
					(Hc(2, n, t), tl || Hc(4, n, t), ll(e, t, n));
					break;
				case 1:
					(tl ||
						(Kc(n, t),
						(r = n.stateNode),
						typeof r.componentWillUnmount == `function` &&
							Wc(n, t, r)),
						ll(e, t, n));
					break;
				case 21:
					ll(e, t, n);
					break;
				case 22:
					((tl = (r = tl) || n.memoizedState !== null),
						ll(e, t, n),
						(tl = r));
					break;
				default:
					ll(e, t, n);
			}
		}
		function dl(e, t) {
			if (
				t.memoizedState === null &&
				((e = t.alternate),
				e !== null && ((e = e.memoizedState), e !== null))
			) {
				e = e.dehydrated;
				try {
					Np(e);
				} catch (e) {
					Z(t, t.return, e);
				}
			}
		}
		function fl(e, t) {
			if (
				t.memoizedState === null &&
				((e = t.alternate),
				e !== null &&
					((e = e.memoizedState),
					e !== null && ((e = e.dehydrated), e !== null)))
			)
				try {
					Np(e);
				} catch (e) {
					Z(t, t.return, e);
				}
		}
		function pl(e) {
			switch (e.tag) {
				case 31:
				case 13:
				case 19:
					var t = e.stateNode;
					return (t === null && (t = e.stateNode = new rl()), t);
				case 22:
					return (
						(e = e.stateNode),
						(t = e._retryCache),
						t === null && (t = e._retryCache = new rl()),
						t
					);
				default:
					throw Error(i(435, e.tag));
			}
		}
		function ml(e, t) {
			var n = pl(e);
			t.forEach(function (t) {
				if (!n.has(t)) {
					n.add(t);
					var r = Yu.bind(null, e, t);
					t.then(r, r);
				}
			});
		}
		function hl(e, t) {
			var n = t.deletions;
			if (n !== null)
				for (var r = 0; r < n.length; r++) {
					var a = n[r],
						o = e,
						s = t,
						c = s;
					a: for (; c !== null; ) {
						switch (c.tag) {
							case 27:
								if (Zd(c.type)) {
									((G = c.stateNode), (cl = !1));
									break a;
								}
								break;
							case 5:
								((G = c.stateNode), (cl = !1));
								break a;
							case 3:
							case 4:
								((G = c.stateNode.containerInfo), (cl = !0));
								break a;
						}
						c = c.return;
					}
					if (G === null) throw Error(i(160));
					(ul(o, s, a),
						(G = null),
						(cl = !1),
						(o = a.alternate),
						o !== null && (o.return = null),
						(a.return = null));
				}
			if (t.subtreeFlags & 13886)
				for (t = t.child; t !== null; ) (_l(t, e), (t = t.sibling));
		}
		var gl = null;
		function _l(e, t) {
			var n = e.alternate,
				r = e.flags;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					(hl(t, e),
						vl(e),
						r & 4 &&
							(Hc(3, e, e.return), Vc(3, e), Hc(5, e, e.return)));
					break;
				case 1:
					(hl(t, e),
						vl(e),
						r & 512 && (tl || n === null || Kc(n, n.return)),
						r & 64 &&
							el &&
							((e = e.updateQueue),
							e !== null &&
								((r = e.callbacks),
								r !== null &&
									((n = e.shared.hiddenCallbacks),
									(e.shared.hiddenCallbacks =
										n === null ? r : n.concat(r))))));
					break;
				case 26:
					var a = gl;
					if (
						(hl(t, e),
						vl(e),
						r & 512 && (tl || n === null || Kc(n, n.return)),
						r & 4)
					) {
						var o = n === null ? null : n.memoizedState;
						if (((r = e.memoizedState), n === null))
							if (r === null)
								if (e.stateNode === null) {
									a: {
										((r = e.type),
											(n = e.memoizedProps),
											(a = a.ownerDocument || a));
										b: switch (r) {
											case `title`:
												((o =
													a.getElementsByTagName(
														`title`,
													)[0]),
													(!o ||
														o[xt] ||
														o[mt] ||
														o.namespaceURI ===
															`http://www.w3.org/2000/svg` ||
														o.hasAttribute(
															`itemprop`,
														)) &&
														((o =
															a.createElement(r)),
														a.head.insertBefore(
															o,
															a.querySelector(
																`head > title`,
															),
														)),
													Pd(o, r, n),
													(o[mt] = e),
													j(o),
													(r = o));
												break a;
											case `link`:
												var s = Vf(
													`link`,
													`href`,
													a,
												).get(r + (n.href || ``));
												if (s) {
													for (
														var c = 0;
														c < s.length;
														c++
													)
														if (
															((o = s[c]),
															o.getAttribute(
																`href`,
															) ===
																(n.href ==
																	null ||
																n.href === ``
																	? null
																	: n.href) &&
																o.getAttribute(
																	`rel`,
																) ===
																	(n.rel ==
																	null
																		? null
																		: n.rel) &&
																o.getAttribute(
																	`title`,
																) ===
																	(n.title ==
																	null
																		? null
																		: n.title) &&
																o.getAttribute(
																	`crossorigin`,
																) ===
																	(n.crossOrigin ==
																	null
																		? null
																		: n.crossOrigin))
														) {
															s.splice(c, 1);
															break b;
														}
												}
												((o = a.createElement(r)),
													Pd(o, r, n),
													a.head.appendChild(o));
												break;
											case `meta`:
												if (
													(s = Vf(
														`meta`,
														`content`,
														a,
													).get(
														r + (n.content || ``),
													))
												) {
													for (
														c = 0;
														c < s.length;
														c++
													)
														if (
															((o = s[c]),
															o.getAttribute(
																`content`,
															) ===
																(n.content ==
																null
																	? null
																	: `` +
																		n.content) &&
																o.getAttribute(
																	`name`,
																) ===
																	(n.name ==
																	null
																		? null
																		: n.name) &&
																o.getAttribute(
																	`property`,
																) ===
																	(n.property ==
																	null
																		? null
																		: n.property) &&
																o.getAttribute(
																	`http-equiv`,
																) ===
																	(n.httpEquiv ==
																	null
																		? null
																		: n.httpEquiv) &&
																o.getAttribute(
																	`charset`,
																) ===
																	(n.charSet ==
																	null
																		? null
																		: n.charSet))
														) {
															s.splice(c, 1);
															break b;
														}
												}
												((o = a.createElement(r)),
													Pd(o, r, n),
													a.head.appendChild(o));
												break;
											default:
												throw Error(i(468, r));
										}
										((o[mt] = e), j(o), (r = o));
									}
									e.stateNode = r;
								} else Hf(a, e.type, e.stateNode);
							else e.stateNode = If(a, r, e.memoizedProps);
						else
							o === r
								? r === null &&
									e.stateNode !== null &&
									Jc(e, e.memoizedProps, n.memoizedProps)
								: (o === null
										? n.stateNode !== null &&
											((n = n.stateNode),
											n.parentNode.removeChild(n))
										: o.count--,
									r === null
										? Hf(a, e.type, e.stateNode)
										: If(a, r, e.memoizedProps));
					}
					break;
				case 27:
					(hl(t, e),
						vl(e),
						r & 512 && (tl || n === null || Kc(n, n.return)),
						n !== null &&
							r & 4 &&
							Jc(e, e.memoizedProps, n.memoizedProps));
					break;
				case 5:
					if (
						(hl(t, e),
						vl(e),
						r & 512 && (tl || n === null || Kc(n, n.return)),
						e.flags & 32)
					) {
						a = e.stateNode;
						try {
							Zt(a, ``);
						} catch (t) {
							Z(e, e.return, t);
						}
					}
					(r & 4 &&
						e.stateNode != null &&
						((a = e.memoizedProps),
						Jc(e, a, n === null ? a : n.memoizedProps)),
						r & 1024 && (nl = !0));
					break;
				case 6:
					if ((hl(t, e), vl(e), r & 4)) {
						if (e.stateNode === null) throw Error(i(162));
						((r = e.memoizedProps), (n = e.stateNode));
						try {
							n.nodeValue = r;
						} catch (t) {
							Z(e, e.return, t);
						}
					}
					break;
				case 3:
					if (
						((Bf = null),
						(a = gl),
						(gl = gf(t.containerInfo)),
						hl(t, e),
						(gl = a),
						vl(e),
						r & 4 && n !== null && n.memoizedState.isDehydrated)
					)
						try {
							Np(t.containerInfo);
						} catch (t) {
							Z(e, e.return, t);
						}
					nl && ((nl = !1), yl(e));
					break;
				case 4:
					((r = gl),
						(gl = gf(e.stateNode.containerInfo)),
						hl(t, e),
						vl(e),
						(gl = r));
					break;
				case 12:
					(hl(t, e), vl(e));
					break;
				case 31:
					(hl(t, e),
						vl(e),
						r & 4 &&
							((r = e.updateQueue),
							r !== null && ((e.updateQueue = null), ml(e, r))));
					break;
				case 13:
					(hl(t, e),
						vl(e),
						e.child.flags & 8192 &&
							(e.memoizedState !== null) !=
								(n !== null && n.memoizedState !== null) &&
							($l = Ne()),
						r & 4 &&
							((r = e.updateQueue),
							r !== null && ((e.updateQueue = null), ml(e, r))));
					break;
				case 22:
					a = e.memoizedState !== null;
					var l = n !== null && n.memoizedState !== null,
						u = el,
						d = tl;
					if (
						((el = u || a),
						(tl = d || l),
						hl(t, e),
						(tl = d),
						(el = u),
						vl(e),
						r & 8192)
					)
						a: for (
							t = e.stateNode,
								t._visibility = a
									? t._visibility & -2
									: t._visibility | 1,
								a && (n === null || l || el || tl || xl(e)),
								n = null,
								t = e;
							;
						) {
							if (t.tag === 5 || t.tag === 26) {
								if (n === null) {
									l = n = t;
									try {
										if (((o = l.stateNode), a))
											((s = o.style),
												typeof s.setProperty ==
												`function`
													? s.setProperty(
															`display`,
															`none`,
															`important`,
														)
													: (s.display = `none`));
										else {
											c = l.stateNode;
											var f = l.memoizedProps.style,
												p =
													f != null &&
													f.hasOwnProperty(`display`)
														? f.display
														: null;
											c.style.display =
												p == null ||
												typeof p == `boolean`
													? ``
													: (`` + p).trim();
										}
									} catch (e) {
										Z(l, l.return, e);
									}
								}
							} else if (t.tag === 6) {
								if (n === null) {
									l = t;
									try {
										l.stateNode.nodeValue = a
											? ``
											: l.memoizedProps;
									} catch (e) {
										Z(l, l.return, e);
									}
								}
							} else if (t.tag === 18) {
								if (n === null) {
									l = t;
									try {
										var m = l.stateNode;
										a ? $d(m, !0) : $d(l.stateNode, !1);
									} catch (e) {
										Z(l, l.return, e);
									}
								}
							} else if (
								((t.tag !== 22 && t.tag !== 23) ||
									t.memoizedState === null ||
									t === e) &&
								t.child !== null
							) {
								((t.child.return = t), (t = t.child));
								continue;
							}
							if (t === e) break a;
							for (; t.sibling === null; ) {
								if (t.return === null || t.return === e)
									break a;
								(n === t && (n = null), (t = t.return));
							}
							(n === t && (n = null),
								(t.sibling.return = t.return),
								(t = t.sibling));
						}
					r & 4 &&
						((r = e.updateQueue),
						r !== null &&
							((n = r.retryQueue),
							n !== null && ((r.retryQueue = null), ml(e, n))));
					break;
				case 19:
					(hl(t, e),
						vl(e),
						r & 4 &&
							((r = e.updateQueue),
							r !== null && ((e.updateQueue = null), ml(e, r))));
					break;
				case 30:
					break;
				case 21:
					break;
				default:
					(hl(t, e), vl(e));
			}
		}
		function vl(e) {
			var t = e.flags;
			if (t & 2) {
				try {
					for (var n, r = e.return; r !== null; ) {
						if (Yc(r)) {
							n = r;
							break;
						}
						r = r.return;
					}
					if (n == null) throw Error(i(160));
					switch (n.tag) {
						case 27:
							var a = n.stateNode;
							Qc(e, Xc(e), a);
							break;
						case 5:
							var o = n.stateNode;
							(n.flags & 32 && (Zt(o, ``), (n.flags &= -33)),
								Qc(e, Xc(e), o));
							break;
						case 3:
						case 4:
							var s = n.stateNode.containerInfo;
							Zc(e, Xc(e), s);
							break;
						default:
							throw Error(i(161));
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				e.flags &= -3;
			}
			t & 4096 && (e.flags &= -4097);
		}
		function yl(e) {
			if (e.subtreeFlags & 1024)
				for (e = e.child; e !== null; ) {
					var t = e;
					(yl(t),
						t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
						(e = e.sibling));
				}
		}
		function bl(e, t) {
			if (t.subtreeFlags & 8772)
				for (t = t.child; t !== null; )
					(ol(e, t.alternate, t), (t = t.sibling));
		}
		function xl(e) {
			for (e = e.child; e !== null; ) {
				var t = e;
				switch (t.tag) {
					case 0:
					case 11:
					case 14:
					case 15:
						(Hc(4, t, t.return), xl(t));
						break;
					case 1:
						Kc(t, t.return);
						var n = t.stateNode;
						(typeof n.componentWillUnmount == `function` &&
							Wc(t, t.return, n),
							xl(t));
						break;
					case 27:
						pf(t.stateNode);
					case 26:
					case 5:
						(Kc(t, t.return), xl(t));
						break;
					case 22:
						t.memoizedState === null && xl(t);
						break;
					case 30:
						xl(t);
						break;
					default:
						xl(t);
				}
				e = e.sibling;
			}
		}
		function Sl(e, t, n) {
			for (
				n &&= (t.subtreeFlags & 8772) != 0, t = t.child;
				t !== null;
			) {
				var r = t.alternate,
					i = e,
					a = t,
					o = a.flags;
				switch (a.tag) {
					case 0:
					case 11:
					case 15:
						(Sl(i, a, n), Vc(4, a));
						break;
					case 1:
						if (
							(Sl(i, a, n),
							(r = a),
							(i = r.stateNode),
							typeof i.componentDidMount == `function`)
						)
							try {
								i.componentDidMount();
							} catch (e) {
								Z(r, r.return, e);
							}
						if (((r = a), (i = r.updateQueue), i !== null)) {
							var s = r.stateNode;
							try {
								var c = i.shared.hiddenCallbacks;
								if (c !== null)
									for (
										i.shared.hiddenCallbacks = null, i = 0;
										i < c.length;
										i++
									)
										Za(c[i], s);
							} catch (e) {
								Z(r, r.return, e);
							}
						}
						(n && o & 64 && Uc(a), Gc(a, a.return));
						break;
					case 27:
						$c(a);
					case 26:
					case 5:
						(Sl(i, a, n),
							n && r === null && o & 4 && qc(a),
							Gc(a, a.return));
						break;
					case 12:
						Sl(i, a, n);
						break;
					case 31:
						(Sl(i, a, n), n && o & 4 && dl(i, a));
						break;
					case 13:
						(Sl(i, a, n), n && o & 4 && fl(i, a));
						break;
					case 22:
						(a.memoizedState === null && Sl(i, a, n),
							Gc(a, a.return));
						break;
					case 30:
						break;
					default:
						Sl(i, a, n);
				}
				t = t.sibling;
			}
		}
		function Cl(e, t) {
			var n = null;
			(e !== null &&
				e.memoizedState !== null &&
				e.memoizedState.cachePool !== null &&
				(n = e.memoizedState.cachePool.pool),
				(e = null),
				t.memoizedState !== null &&
					t.memoizedState.cachePool !== null &&
					(e = t.memoizedState.cachePool.pool),
				e !== n && (e != null && e.refCount++, n != null && ua(n)));
		}
		function wl(e, t) {
			((e = null),
				t.alternate !== null && (e = t.alternate.memoizedState.cache),
				(t = t.memoizedState.cache),
				t !== e && (t.refCount++, e != null && ua(e)));
		}
		function Tl(e, t, n, r) {
			if (t.subtreeFlags & 10256)
				for (t = t.child; t !== null; )
					(El(e, t, n, r), (t = t.sibling));
		}
		function El(e, t, n, r) {
			var i = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					(Tl(e, t, n, r), i & 2048 && Vc(9, t));
					break;
				case 1:
					Tl(e, t, n, r);
					break;
				case 3:
					(Tl(e, t, n, r),
						i & 2048 &&
							((e = null),
							t.alternate !== null &&
								(e = t.alternate.memoizedState.cache),
							(t = t.memoizedState.cache),
							t !== e && (t.refCount++, e != null && ua(e))));
					break;
				case 12:
					if (i & 2048) {
						(Tl(e, t, n, r), (e = t.stateNode));
						try {
							var a = t.memoizedProps,
								o = a.id,
								s = a.onPostCommit;
							typeof s == `function` &&
								s(
									o,
									t.alternate === null ? `mount` : `update`,
									e.passiveEffectDuration,
									-0,
								);
						} catch (e) {
							Z(t, t.return, e);
						}
					} else Tl(e, t, n, r);
					break;
				case 31:
					Tl(e, t, n, r);
					break;
				case 13:
					Tl(e, t, n, r);
					break;
				case 23:
					break;
				case 22:
					((a = t.stateNode),
						(o = t.alternate),
						t.memoizedState === null
							? a._visibility & 2
								? Tl(e, t, n, r)
								: ((a._visibility |= 2),
									Dl(
										e,
										t,
										n,
										r,
										(t.subtreeFlags & 10256) != 0 || !1,
									))
							: a._visibility & 2
								? Tl(e, t, n, r)
								: Ol(e, t),
						i & 2048 && Cl(o, t));
					break;
				case 24:
					(Tl(e, t, n, r), i & 2048 && wl(t.alternate, t));
					break;
				default:
					Tl(e, t, n, r);
			}
		}
		function Dl(e, t, n, r, i) {
			for (
				i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child;
				t !== null;
			) {
				var a = e,
					o = t,
					s = n,
					c = r,
					l = o.flags;
				switch (o.tag) {
					case 0:
					case 11:
					case 15:
						(Dl(a, o, s, c, i), Vc(8, o));
						break;
					case 23:
						break;
					case 22:
						var u = o.stateNode;
						(o.memoizedState === null
							? ((u._visibility |= 2), Dl(a, o, s, c, i))
							: u._visibility & 2
								? Dl(a, o, s, c, i)
								: Ol(a, o),
							i && l & 2048 && Cl(o.alternate, o));
						break;
					case 24:
						(Dl(a, o, s, c, i),
							i && l & 2048 && wl(o.alternate, o));
						break;
					default:
						Dl(a, o, s, c, i);
				}
				t = t.sibling;
			}
		}
		function Ol(e, t) {
			if (t.subtreeFlags & 10256)
				for (t = t.child; t !== null; ) {
					var n = e,
						r = t,
						i = r.flags;
					switch (r.tag) {
						case 22:
							(Ol(n, r), i & 2048 && Cl(r.alternate, r));
							break;
						case 24:
							(Ol(n, r), i & 2048 && wl(r.alternate, r));
							break;
						default:
							Ol(n, r);
					}
					t = t.sibling;
				}
		}
		var kl = 8192;
		function Al(e, t, n) {
			if (e.subtreeFlags & kl)
				for (e = e.child; e !== null; ) (jl(e, t, n), (e = e.sibling));
		}
		function jl(e, t, n) {
			switch (e.tag) {
				case 26:
					(Al(e, t, n),
						e.flags & kl &&
							e.memoizedState !== null &&
							Gf(n, gl, e.memoizedState, e.memoizedProps));
					break;
				case 5:
					Al(e, t, n);
					break;
				case 3:
				case 4:
					var r = gl;
					((gl = gf(e.stateNode.containerInfo)),
						Al(e, t, n),
						(gl = r));
					break;
				case 22:
					e.memoizedState === null &&
						((r = e.alternate),
						r !== null && r.memoizedState !== null
							? ((r = kl), (kl = 16777216), Al(e, t, n), (kl = r))
							: Al(e, t, n));
					break;
				default:
					Al(e, t, n);
			}
		}
		function Ml(e) {
			var t = e.alternate;
			if (t !== null && ((e = t.child), e !== null)) {
				t.child = null;
				do ((t = e.sibling), (e.sibling = null), (e = t));
				while (e !== null);
			}
		}
		function Nl(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null)
					for (var n = 0; n < t.length; n++) {
						var r = t[n];
						((il = r), Il(r, e));
					}
				Ml(e);
			}
			if (e.subtreeFlags & 10256)
				for (e = e.child; e !== null; ) (Pl(e), (e = e.sibling));
		}
		function Pl(e) {
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					(Nl(e), e.flags & 2048 && Hc(9, e, e.return));
					break;
				case 3:
					Nl(e);
					break;
				case 12:
					Nl(e);
					break;
				case 22:
					var t = e.stateNode;
					e.memoizedState !== null &&
					t._visibility & 2 &&
					(e.return === null || e.return.tag !== 13)
						? ((t._visibility &= -3), Fl(e))
						: Nl(e);
					break;
				default:
					Nl(e);
			}
		}
		function Fl(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null)
					for (var n = 0; n < t.length; n++) {
						var r = t[n];
						((il = r), Il(r, e));
					}
				Ml(e);
			}
			for (e = e.child; e !== null; ) {
				switch (((t = e), t.tag)) {
					case 0:
					case 11:
					case 15:
						(Hc(8, t, t.return), Fl(t));
						break;
					case 22:
						((n = t.stateNode),
							n._visibility & 2 &&
								((n._visibility &= -3), Fl(t)));
						break;
					default:
						Fl(t);
				}
				e = e.sibling;
			}
		}
		function Il(e, t) {
			for (; il !== null; ) {
				var n = il;
				switch (n.tag) {
					case 0:
					case 11:
					case 15:
						Hc(8, n, t);
						break;
					case 23:
					case 22:
						if (
							n.memoizedState !== null &&
							n.memoizedState.cachePool !== null
						) {
							var r = n.memoizedState.cachePool.pool;
							r != null && r.refCount++;
						}
						break;
					case 24:
						ua(n.memoizedState.cache);
				}
				if (((r = n.child), r !== null)) ((r.return = n), (il = r));
				else
					a: for (n = e; il !== null; ) {
						r = il;
						var i = r.sibling,
							a = r.return;
						if ((sl(r), r === n)) {
							il = null;
							break a;
						}
						if (i !== null) {
							((i.return = a), (il = i));
							break a;
						}
						il = a;
					}
			}
		}
		var Ll = {
				getCacheForType: function (e) {
					var t = na(ca),
						n = t.data.get(e);
					return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
				},
				cacheSignal: function () {
					return na(ca).controller.signal;
				},
			},
			Rl = typeof WeakMap == `function` ? WeakMap : Map,
			K = 0,
			q = null,
			J = null,
			Y = 0,
			X = 0,
			zl = null,
			Bl = !1,
			Vl = !1,
			Hl = !1,
			Ul = 0,
			Wl = 0,
			Gl = 0,
			Kl = 0,
			ql = 0,
			Jl = 0,
			Yl = 0,
			Xl = null,
			Zl = null,
			Ql = !1,
			$l = 0,
			eu = 0,
			tu = 1 / 0,
			nu = null,
			ru = null,
			iu = 0,
			au = null,
			ou = null,
			su = 0,
			cu = 0,
			lu = null,
			uu = null,
			du = 0,
			fu = null;
		function pu() {
			return K & 2 && Y !== 0 ? Y & -Y : E.T === null ? dt() : dd();
		}
		function mu() {
			if (Jl === 0)
				if (!(Y & 536870912) || R) {
					var e = Xe;
					((Xe <<= 1), !(Xe & 3932160) && (Xe = 262144), (Jl = e));
				} else Jl = 536870912;
			return ((e = io.current), e !== null && (e.flags |= 32), Jl);
		}
		function hu(e, t, n) {
			(((e === q && (X === 2 || X === 9)) ||
				e.cancelPendingCommit !== null) &&
				(Su(e, 0), yu(e, Y, Jl, !1)),
				it(e, n),
				(!(K & 2) || e !== q) &&
					(e === q &&
						(!(K & 2) && (Kl |= n), Wl === 4 && yu(e, Y, Jl, !1)),
					rd(e)));
		}
		function gu(e, t, n) {
			if (K & 6) throw Error(i(327));
			var r =
					(!n && (t & 127) == 0 && (t & e.expiredLanes) === 0) ||
					et(e, t),
				a = r ? Au(e, t) : Ou(e, t, !0),
				o = r;
			do {
				if (a === 0) {
					Vl && !r && yu(e, t, 0, !1);
					break;
				} else {
					if (((n = e.current.alternate), o && !vu(n))) {
						((a = Ou(e, t, !1)), (o = !1));
						continue;
					}
					if (a === 2) {
						if (((o = t), e.errorRecoveryDisabledLanes & o))
							var s = 0;
						else
							((s = e.pendingLanes & -536870913),
								(s =
									s === 0
										? s & 536870912
											? 536870912
											: 0
										: s));
						if (s !== 0) {
							t = s;
							a: {
								var c = e;
								a = Xl;
								var l = c.current.memoizedState.isDehydrated;
								if (
									(l && (Su(c, s).flags |= 256),
									(s = Ou(c, s, !1)),
									s !== 2)
								) {
									if (Hl && !l) {
										((c.errorRecoveryDisabledLanes |= o),
											(Kl |= o),
											(a = 4));
										break a;
									}
									((o = Zl),
										(Zl = a),
										o !== null &&
											(Zl === null
												? (Zl = o)
												: Zl.push.apply(Zl, o)));
								}
								a = s;
							}
							if (((o = !1), a !== 2)) continue;
						}
					}
					if (a === 1) {
						(Su(e, 0), yu(e, t, 0, !0));
						break;
					}
					a: {
						switch (((r = e), (o = a), o)) {
							case 0:
							case 1:
								throw Error(i(345));
							case 4:
								if ((t & 4194048) !== t) break;
							case 6:
								yu(r, t, Jl, !Bl);
								break a;
							case 2:
								Zl = null;
								break;
							case 3:
							case 5:
								break;
							default:
								throw Error(i(329));
						}
						if (
							(t & 62914560) === t &&
							((a = $l + 300 - Ne()), 10 < a)
						) {
							if ((yu(r, t, Jl, !Bl), $e(r, 0, !0) !== 0))
								break a;
							((su = t),
								(r.timeoutHandle = Kd(
									_u.bind(
										null,
										r,
										n,
										Zl,
										nu,
										Ql,
										t,
										Jl,
										Kl,
										Yl,
										Bl,
										o,
										`Throttled`,
										-0,
										0,
									),
									a,
								)));
							break a;
						}
						_u(r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Bl, o, null, -0, 0);
					}
				}
				break;
			} while (1);
			rd(e);
		}
		function _u(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			if (
				((e.timeoutHandle = -1),
				(d = t.subtreeFlags),
				d & 8192 || (d & 16785408) == 16785408)
			) {
				((d = {
					stylesheets: null,
					count: 0,
					imgCount: 0,
					imgBytes: 0,
					suspenseyImages: [],
					waitingForImages: !0,
					waitingForViewTransition: !1,
					unsuspend: an,
				}),
					jl(t, a, d));
				var m =
					(a & 62914560) === a
						? $l - Ne()
						: (a & 4194048) === a
							? eu - Ne()
							: 0;
				if (((m = qf(d, m)), m !== null)) {
					((su = a),
						(e.cancelPendingCommit = m(
							Lu.bind(
								null,
								e,
								t,
								a,
								n,
								r,
								i,
								o,
								s,
								c,
								u,
								d,
								null,
								f,
								p,
							),
						)),
						yu(e, a, o, !l));
					return;
				}
			}
			Lu(e, t, a, n, r, i, o, s, c);
		}
		function vu(e) {
			for (var t = e; ; ) {
				var n = t.tag;
				if (
					(n === 0 || n === 11 || n === 15) &&
					t.flags & 16384 &&
					((n = t.updateQueue),
					n !== null && ((n = n.stores), n !== null))
				)
					for (var r = 0; r < n.length; r++) {
						var i = n[r],
							a = i.getSnapshot;
						i = i.value;
						try {
							if (!Er(a(), i)) return !1;
						} catch {
							return !1;
						}
					}
				if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
					((n.return = t), (t = n));
				else {
					if (t === e) break;
					for (; t.sibling === null; ) {
						if (t.return === null || t.return === e) return !0;
						t = t.return;
					}
					((t.sibling.return = t.return), (t = t.sibling));
				}
			}
			return !0;
		}
		function yu(e, t, n, r) {
			((t &= ~ql),
				(t &= ~Kl),
				(e.suspendedLanes |= t),
				(e.pingedLanes &= ~t),
				r && (e.warmLanes |= t),
				(r = e.expirationTimes));
			for (var i = t; 0 < i; ) {
				var a = 31 - Ge(i),
					o = 1 << a;
				((r[a] = -1), (i &= ~o));
			}
			n !== 0 && ot(e, n, t);
		}
		function bu() {
			return K & 6 ? !0 : (id(0, !1), !1);
		}
		function xu() {
			if (J !== null) {
				if (X === 0) var e = J.return;
				else
					((e = J),
						(Ji = qi = null),
						Ao(e),
						(Na = null),
						(Pa = 0),
						(e = J));
				for (; e !== null; ) (Bc(e.alternate, e), (e = e.return));
				J = null;
			}
		}
		function Su(e, t) {
			var n = e.timeoutHandle;
			(n !== -1 && ((e.timeoutHandle = -1), qd(n)),
				(n = e.cancelPendingCommit),
				n !== null && ((e.cancelPendingCommit = null), n()),
				(su = 0),
				xu(),
				(q = e),
				(J = n = pi(e.current, null)),
				(Y = t),
				(X = 0),
				(zl = null),
				(Bl = !1),
				(Vl = et(e, t)),
				(Hl = !1),
				(Yl = Jl = ql = Kl = Gl = Wl = 0),
				(Zl = Xl = null),
				(Ql = !1),
				t & 8 && (t |= t & 32));
			var r = e.entangledLanes;
			if (r !== 0)
				for (e = e.entanglements, r &= t; 0 < r; ) {
					var i = 31 - Ge(r),
						a = 1 << i;
					((t |= e[i]), (r &= ~a));
				}
			return ((Ul = t), ri(), n);
		}
		function Cu(e, t) {
			((z = null),
				(E.H = zs),
				t === Ca || t === Ta
					? ((t = ja()), (X = 3))
					: t === wa
						? ((t = ja()), (X = 4))
						: (X =
								t === rc
									? 8
									: typeof t == `object` &&
										  t &&
										  typeof t.then == `function`
										? 6
										: 1),
				(zl = t),
				J === null && ((Wl = 1), Zs(e, xi(t, e.current))));
		}
		function wu() {
			var e = io.current;
			return e === null
				? !0
				: (Y & 4194048) === Y
					? ao === null
					: (Y & 62914560) === Y || Y & 536870912
						? e === ao
						: !1;
		}
		function Tu() {
			var e = E.H;
			return ((E.H = zs), e === null ? zs : e);
		}
		function Eu() {
			var e = E.A;
			return ((E.A = Ll), e);
		}
		function Du() {
			((Wl = 4),
				Bl || ((Y & 4194048) !== Y && io.current !== null) || (Vl = !0),
				(!(Gl & 134217727) && !(Kl & 134217727)) ||
					q === null ||
					yu(q, Y, Jl, !1));
		}
		function Ou(e, t, n) {
			var r = K;
			K |= 2;
			var i = Tu(),
				a = Eu();
			((q !== e || Y !== t) && ((nu = null), Su(e, t)), (t = !1));
			var o = Wl;
			a: do
				try {
					if (X !== 0 && J !== null) {
						var s = J,
							c = zl;
						switch (X) {
							case 8:
								(xu(), (o = 6));
								break a;
							case 3:
							case 2:
							case 9:
							case 6:
								io.current === null && (t = !0);
								var l = X;
								if (
									((X = 0),
									(zl = null),
									Pu(e, s, c, l),
									n && Vl)
								) {
									o = 0;
									break a;
								}
								break;
							default:
								((l = X), (X = 0), (zl = null), Pu(e, s, c, l));
						}
					}
					(ku(), (o = Wl));
					break;
				} catch (t) {
					Cu(e, t);
				}
			while (1);
			return (
				t && e.shellSuspendCounter++,
				(Ji = qi = null),
				(K = r),
				(E.H = i),
				(E.A = a),
				J === null && ((q = null), (Y = 0), ri()),
				o
			);
		}
		function ku() {
			for (; J !== null; ) Mu(J);
		}
		function Au(e, t) {
			var n = K;
			K |= 2;
			var r = Tu(),
				a = Eu();
			q !== e || Y !== t
				? ((nu = null), (tu = Ne() + 500), Su(e, t))
				: (Vl = et(e, t));
			a: do
				try {
					if (X !== 0 && J !== null) {
						t = J;
						var o = zl;
						b: switch (X) {
							case 1:
								((X = 0), (zl = null), Pu(e, t, o, 1));
								break;
							case 2:
							case 9:
								if (Da(o)) {
									((X = 0), (zl = null), Nu(t));
									break;
								}
								((t = function () {
									((X !== 2 && X !== 9) || q !== e || (X = 7),
										rd(e));
								}),
									o.then(t, t));
								break a;
							case 3:
								X = 7;
								break a;
							case 4:
								X = 5;
								break a;
							case 7:
								Da(o)
									? ((X = 0), (zl = null), Nu(t))
									: ((X = 0), (zl = null), Pu(e, t, o, 7));
								break;
							case 5:
								var s = null;
								switch (J.tag) {
									case 26:
										s = J.memoizedState;
									case 5:
									case 27:
										var c = J;
										if (s ? Wf(s) : c.stateNode.complete) {
											((X = 0), (zl = null));
											var l = c.sibling;
											if (l !== null) J = l;
											else {
												var u = c.return;
												u === null
													? (J = null)
													: ((J = u), Fu(u));
											}
											break b;
										}
								}
								((X = 0), (zl = null), Pu(e, t, o, 5));
								break;
							case 6:
								((X = 0), (zl = null), Pu(e, t, o, 6));
								break;
							case 8:
								(xu(), (Wl = 6));
								break a;
							default:
								throw Error(i(462));
						}
					}
					ju();
					break;
				} catch (t) {
					Cu(e, t);
				}
			while (1);
			return (
				(Ji = qi = null),
				(E.H = r),
				(E.A = a),
				(K = n),
				J === null ? ((q = null), (Y = 0), ri(), Wl) : 0
			);
		}
		function ju() {
			for (; J !== null && !je(); ) Mu(J);
		}
		function Mu(e) {
			var t = Mc(e.alternate, e, Ul);
			((e.memoizedProps = e.pendingProps), t === null ? Fu(e) : (J = t));
		}
		function Nu(e) {
			var t = e,
				n = t.alternate;
			switch (t.tag) {
				case 15:
				case 0:
					t = gc(n, t, t.pendingProps, t.type, void 0, Y);
					break;
				case 11:
					t = gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
					break;
				case 5:
					Ao(t);
				default:
					(Bc(n, t), (t = J = mi(t, Ul)), (t = Mc(n, t, Ul)));
			}
			((e.memoizedProps = e.pendingProps), t === null ? Fu(e) : (J = t));
		}
		function Pu(e, t, n, r) {
			((Ji = qi = null), Ao(t), (Na = null), (Pa = 0));
			var i = t.return;
			try {
				if (nc(e, i, t, n, Y)) {
					((Wl = 1), Zs(e, xi(n, e.current)), (J = null));
					return;
				}
			} catch (t) {
				if (i !== null) throw ((J = i), t);
				((Wl = 1), Zs(e, xi(n, e.current)), (J = null));
				return;
			}
			t.flags & 32768
				? (R || r === 1
						? (e = !0)
						: Vl || Y & 536870912
							? (e = !1)
							: ((Bl = e = !0),
								(r === 2 || r === 9 || r === 3 || r === 6) &&
									((r = io.current),
									r !== null &&
										r.tag === 13 &&
										(r.flags |= 16384))),
					Iu(t, e))
				: Fu(t);
		}
		function Fu(e) {
			var t = e;
			do {
				if (t.flags & 32768) {
					Iu(t, Bl);
					return;
				}
				e = t.return;
				var n = Rc(t.alternate, t, Ul);
				if (n !== null) {
					J = n;
					return;
				}
				if (((t = t.sibling), t !== null)) {
					J = t;
					return;
				}
				J = t = e;
			} while (t !== null);
			Wl === 0 && (Wl = 5);
		}
		function Iu(e, t) {
			do {
				var n = zc(e.alternate, e);
				if (n !== null) {
					((n.flags &= 32767), (J = n));
					return;
				}
				if (
					((n = e.return),
					n !== null &&
						((n.flags |= 32768),
						(n.subtreeFlags = 0),
						(n.deletions = null)),
					!t && ((e = e.sibling), e !== null))
				) {
					J = e;
					return;
				}
				J = e = n;
			} while (e !== null);
			((Wl = 6), (J = null));
		}
		function Lu(e, t, n, r, a, o, s, c, l) {
			e.cancelPendingCommit = null;
			do Hu();
			while (iu !== 0);
			if (K & 6) throw Error(i(327));
			if (t !== null) {
				if (t === e.current) throw Error(i(177));
				if (
					((o = t.lanes | t.childLanes),
					(o |= ni),
					at(e, n, o, s, c, l),
					e === q && ((J = q = null), (Y = 0)),
					(ou = t),
					(au = e),
					(su = n),
					(cu = o),
					(lu = a),
					(uu = r),
					t.subtreeFlags & 10256 || t.flags & 10256
						? ((e.callbackNode = null),
							(e.callbackPriority = 0),
							Xu(Le, function () {
								return (Uu(), null);
							}))
						: ((e.callbackNode = null), (e.callbackPriority = 0)),
					(r = (t.flags & 13878) != 0),
					t.subtreeFlags & 13878 || r)
				) {
					((r = E.T),
						(E.T = null),
						(a = D.p),
						(D.p = 2),
						(s = K),
						(K |= 4));
					try {
						al(e, t, n);
					} finally {
						((K = s), (D.p = a), (E.T = r));
					}
				}
				((iu = 1), Ru(), zu(), Bu());
			}
		}
		function Ru() {
			if (iu === 1) {
				iu = 0;
				var e = au,
					t = ou,
					n = (t.flags & 13878) != 0;
				if (t.subtreeFlags & 13878 || n) {
					((n = E.T), (E.T = null));
					var r = D.p;
					D.p = 2;
					var i = K;
					K |= 4;
					try {
						_l(t, e);
						var a = zd,
							o = jr(e.containerInfo),
							s = a.focusedElem,
							c = a.selectionRange;
						if (
							o !== s &&
							s &&
							s.ownerDocument &&
							Ar(s.ownerDocument.documentElement, s)
						) {
							if (c !== null && Mr(s)) {
								var l = c.start,
									u = c.end;
								if (
									(u === void 0 && (u = l),
									`selectionStart` in s)
								)
									((s.selectionStart = l),
										(s.selectionEnd = Math.min(
											u,
											s.value.length,
										)));
								else {
									var d = s.ownerDocument || document,
										f = (d && d.defaultView) || window;
									if (f.getSelection) {
										var p = f.getSelection(),
											m = s.textContent.length,
											h = Math.min(c.start, m),
											g =
												c.end === void 0
													? h
													: Math.min(c.end, m);
										!p.extend &&
											h > g &&
											((o = g), (g = h), (h = o));
										var _ = kr(s, h),
											v = kr(s, g);
										if (
											_ &&
											v &&
											(p.rangeCount !== 1 ||
												p.anchorNode !== _.node ||
												p.anchorOffset !== _.offset ||
												p.focusNode !== v.node ||
												p.focusOffset !== v.offset)
										) {
											var y = d.createRange();
											(y.setStart(_.node, _.offset),
												p.removeAllRanges(),
												h > g
													? (p.addRange(y),
														p.extend(
															v.node,
															v.offset,
														))
													: (y.setEnd(
															v.node,
															v.offset,
														),
														p.addRange(y)));
										}
									}
								}
							}
							for (d = [], p = s; (p = p.parentNode); )
								p.nodeType === 1 &&
									d.push({
										element: p,
										left: p.scrollLeft,
										top: p.scrollTop,
									});
							for (
								typeof s.focus == `function` && s.focus(),
									s = 0;
								s < d.length;
								s++
							) {
								var b = d[s];
								((b.element.scrollLeft = b.left),
									(b.element.scrollTop = b.top));
							}
						}
						((sp = !!Rd), (zd = Rd = null));
					} finally {
						((K = i), (D.p = r), (E.T = n));
					}
				}
				((e.current = t), (iu = 2));
			}
		}
		function zu() {
			if (iu === 2) {
				iu = 0;
				var e = au,
					t = ou,
					n = (t.flags & 8772) != 0;
				if (t.subtreeFlags & 8772 || n) {
					((n = E.T), (E.T = null));
					var r = D.p;
					D.p = 2;
					var i = K;
					K |= 4;
					try {
						ol(e, t.alternate, t);
					} finally {
						((K = i), (D.p = r), (E.T = n));
					}
				}
				iu = 3;
			}
		}
		function Bu() {
			if (iu === 4 || iu === 3) {
				((iu = 0), Me());
				var e = au,
					t = ou,
					n = su,
					r = uu;
				t.subtreeFlags & 10256 || t.flags & 10256
					? (iu = 5)
					: ((iu = 0), (ou = au = null), Vu(e, e.pendingLanes));
				var i = e.pendingLanes;
				if (
					(i === 0 && (ru = null),
					ut(n),
					(t = t.stateNode),
					Ue && typeof Ue.onCommitFiberRoot == `function`)
				)
					try {
						Ue.onCommitFiberRoot(
							He,
							t,
							void 0,
							(t.current.flags & 128) == 128,
						);
					} catch {}
				if (r !== null) {
					((t = E.T), (i = D.p), (D.p = 2), (E.T = null));
					try {
						for (
							var a = e.onRecoverableError, o = 0;
							o < r.length;
							o++
						) {
							var s = r[o];
							a(s.value, { componentStack: s.stack });
						}
					} finally {
						((E.T = t), (D.p = i));
					}
				}
				(su & 3 && Hu(),
					rd(e),
					(i = e.pendingLanes),
					n & 261930 && i & 42
						? e === fu
							? du++
							: ((du = 0), (fu = e))
						: (du = 0),
					id(0, !1));
			}
		}
		function Vu(e, t) {
			(e.pooledCacheLanes &= t) === 0 &&
				((t = e.pooledCache),
				t != null && ((e.pooledCache = null), ua(t)));
		}
		function Hu() {
			return (Ru(), zu(), Bu(), Uu());
		}
		function Uu() {
			if (iu !== 5) return !1;
			var e = au,
				t = cu;
			cu = 0;
			var n = ut(su),
				r = E.T,
				a = D.p;
			try {
				((D.p = 32 > n ? 32 : n), (E.T = null), (n = lu), (lu = null));
				var o = au,
					s = su;
				if (((iu = 0), (ou = au = null), (su = 0), K & 6))
					throw Error(i(331));
				var c = K;
				if (
					((K |= 4),
					Pl(o.current),
					El(o, o.current, s, n),
					(K = c),
					id(0, !1),
					Ue && typeof Ue.onPostCommitFiberRoot == `function`)
				)
					try {
						Ue.onPostCommitFiberRoot(He, o);
					} catch {}
				return !0;
			} finally {
				((D.p = a), (E.T = r), Vu(e, t));
			}
		}
		function Wu(e, t, n) {
			((t = xi(n, t)),
				(t = $s(e.stateNode, t, 2)),
				(e = Ga(e, t, 2)),
				e !== null && (it(e, 2), rd(e)));
		}
		function Z(e, t, n) {
			if (e.tag === 3) Wu(e, e, n);
			else
				for (; t !== null; ) {
					if (t.tag === 3) {
						Wu(t, e, n);
						break;
					} else if (t.tag === 1) {
						var r = t.stateNode;
						if (
							typeof t.type.getDerivedStateFromError ==
								`function` ||
							(typeof r.componentDidCatch == `function` &&
								(ru === null || !ru.has(r)))
						) {
							((e = xi(n, e)),
								(n = ec(2)),
								(r = Ga(t, n, 2)),
								r !== null &&
									(tc(n, r, t, e), it(r, 2), rd(r)));
							break;
						}
					}
					t = t.return;
				}
		}
		function Gu(e, t, n) {
			var r = e.pingCache;
			if (r === null) {
				r = e.pingCache = new Rl();
				var i = new Set();
				r.set(t, i);
			} else
				((i = r.get(t)),
					i === void 0 && ((i = new Set()), r.set(t, i)));
			i.has(n) ||
				((Hl = !0),
				i.add(n),
				(e = Ku.bind(null, e, t, n)),
				t.then(e, e));
		}
		function Ku(e, t, n) {
			var r = e.pingCache;
			(r !== null && r.delete(t),
				(e.pingedLanes |= e.suspendedLanes & n),
				(e.warmLanes &= ~n),
				q === e &&
					(Y & n) === n &&
					(Wl === 4 ||
					(Wl === 3 && (Y & 62914560) === Y && 300 > Ne() - $l)
						? !(K & 2) && Su(e, 0)
						: (ql |= n),
					Yl === Y && (Yl = 0)),
				rd(e));
		}
		function qu(e, t) {
			(t === 0 && (t = nt()),
				(e = oi(e, t)),
				e !== null && (it(e, t), rd(e)));
		}
		function Ju(e) {
			var t = e.memoizedState,
				n = 0;
			(t !== null && (n = t.retryLane), qu(e, n));
		}
		function Yu(e, t) {
			var n = 0;
			switch (e.tag) {
				case 31:
				case 13:
					var r = e.stateNode,
						a = e.memoizedState;
					a !== null && (n = a.retryLane);
					break;
				case 19:
					r = e.stateNode;
					break;
				case 22:
					r = e.stateNode._retryCache;
					break;
				default:
					throw Error(i(314));
			}
			(r !== null && r.delete(t), qu(e, n));
		}
		function Xu(e, t) {
			return ke(e, t);
		}
		var Zu = null,
			Qu = null,
			$u = !1,
			ed = !1,
			td = !1,
			nd = 0;
		function rd(e) {
			(e !== Qu &&
				e.next === null &&
				(Qu === null ? (Zu = Qu = e) : (Qu = Qu.next = e)),
				(ed = !0),
				$u || (($u = !0), ud()));
		}
		function id(e, t) {
			if (!td && ed) {
				td = !0;
				do
					for (var n = !1, r = Zu; r !== null; ) {
						if (!t)
							if (e !== 0) {
								var i = r.pendingLanes;
								if (i === 0) var a = 0;
								else {
									var o = r.suspendedLanes,
										s = r.pingedLanes;
									((a = (1 << (31 - Ge(42 | e) + 1)) - 1),
										(a &= i & ~(o & ~s)),
										(a =
											a & 201326741
												? (a & 201326741) | 1
												: a
													? a | 2
													: 0));
								}
								a !== 0 && ((n = !0), ld(r, a));
							} else
								((a = Y),
									(a = $e(
										r,
										r === q ? a : 0,
										r.cancelPendingCommit !== null ||
											r.timeoutHandle !== -1,
									)),
									!(a & 3) ||
										et(r, a) ||
										((n = !0), ld(r, a)));
						r = r.next;
					}
				while (n);
				td = !1;
			}
		}
		function ad() {
			od();
		}
		function od() {
			ed = $u = !1;
			var e = 0;
			nd !== 0 && Gd() && (e = nd);
			for (var t = Ne(), n = null, r = Zu; r !== null; ) {
				var i = r.next,
					a = sd(r, t);
				(a === 0
					? ((r.next = null),
						n === null ? (Zu = i) : (n.next = i),
						i === null && (Qu = n))
					: ((n = r), (e !== 0 || a & 3) && (ed = !0)),
					(r = i));
			}
			((iu !== 0 && iu !== 5) || id(e, !1), nd !== 0 && (nd = 0));
		}
		function sd(e, t) {
			for (
				var n = e.suspendedLanes,
					r = e.pingedLanes,
					i = e.expirationTimes,
					a = e.pendingLanes & -62914561;
				0 < a;
			) {
				var o = 31 - Ge(a),
					s = 1 << o,
					c = i[o];
				(c === -1
					? ((s & n) === 0 || (s & r) !== 0) && (i[o] = tt(s, t))
					: c <= t && (e.expiredLanes |= s),
					(a &= ~s));
			}
			if (
				((t = q),
				(n = Y),
				(n = $e(
					e,
					e === t ? n : 0,
					e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
				)),
				(r = e.callbackNode),
				n === 0 ||
					(e === t && (X === 2 || X === 9)) ||
					e.cancelPendingCommit !== null)
			)
				return (
					r !== null && r !== null && Ae(r),
					(e.callbackNode = null),
					(e.callbackPriority = 0)
				);
			if (!(n & 3) || et(e, n)) {
				if (((t = n & -n), t === e.callbackPriority)) return t;
				switch ((r !== null && Ae(r), ut(n))) {
					case 2:
					case 8:
						n = Ie;
						break;
					case 32:
						n = Le;
						break;
					case 268435456:
						n = ze;
						break;
					default:
						n = Le;
				}
				return (
					(r = cd.bind(null, e)),
					(n = ke(n, r)),
					(e.callbackPriority = t),
					(e.callbackNode = n),
					t
				);
			}
			return (
				r !== null && r !== null && Ae(r),
				(e.callbackPriority = 2),
				(e.callbackNode = null),
				2
			);
		}
		function cd(e, t) {
			if (iu !== 0 && iu !== 5)
				return (
					(e.callbackNode = null),
					(e.callbackPriority = 0),
					null
				);
			var n = e.callbackNode;
			if (Hu() && e.callbackNode !== n) return null;
			var r = Y;
			return (
				(r = $e(
					e,
					e === q ? r : 0,
					e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
				)),
				r === 0
					? null
					: (gu(e, r, t),
						sd(e, Ne()),
						e.callbackNode != null && e.callbackNode === n
							? cd.bind(null, e)
							: null)
			);
		}
		function ld(e, t) {
			if (Hu()) return null;
			gu(e, t, !0);
		}
		function ud() {
			Yd(function () {
				K & 6 ? ke(Fe, ad) : od();
			});
		}
		function dd() {
			if (nd === 0) {
				var e = pa;
				(e === 0 &&
					((e = Ye), (Ye <<= 1), !(Ye & 261888) && (Ye = 256)),
					(nd = e));
			}
			return nd;
		}
		function fd(e) {
			return e == null || typeof e == `symbol` || typeof e == `boolean`
				? null
				: typeof e == `function`
					? e
					: rn(`` + e);
		}
		function pd(e, t) {
			var n = t.ownerDocument.createElement(`input`);
			return (
				(n.name = t.name),
				(n.value = t.value),
				e.id && n.setAttribute(`form`, e.id),
				t.parentNode.insertBefore(n, t),
				(e = new FormData(e)),
				n.parentNode.removeChild(n),
				e
			);
		}
		function md(e, t, n, r, i) {
			if (t === `submit` && n && n.stateNode === i) {
				var a = fd((i[ht] || null).action),
					o = r.submitter;
				o &&
					((t = (t = o[ht] || null)
						? fd(t.formAction)
						: o.getAttribute(`formAction`)),
					t !== null && ((a = t), (o = null)));
				var s = new Tn(`action`, `action`, null, r, i);
				e.push({
					event: s,
					listeners: [
						{
							instance: null,
							listener: function () {
								if (r.defaultPrevented) {
									if (nd !== 0) {
										var e = o ? pd(i, o) : new FormData(i);
										Es(
											n,
											{
												pending: !0,
												data: e,
												method: i.method,
												action: a,
											},
											null,
											e,
										);
									}
								} else
									typeof a == `function` &&
										(s.preventDefault(),
										(e = o ? pd(i, o) : new FormData(i)),
										Es(
											n,
											{
												pending: !0,
												data: e,
												method: i.method,
												action: a,
											},
											a,
											e,
										));
							},
							currentTarget: i,
						},
					],
				});
			}
		}
		for (var hd = 0; hd < Zr.length; hd++) {
			var gd = Zr[hd];
			Qr(gd.toLowerCase(), `on` + (gd[0].toUpperCase() + gd.slice(1)));
		}
		(Qr(F, `onAnimationEnd`),
			Qr(Wr, `onAnimationIteration`),
			Qr(Gr, `onAnimationStart`),
			Qr(`dblclick`, `onDoubleClick`),
			Qr(`focusin`, `onFocus`),
			Qr(`focusout`, `onBlur`),
			Qr(Kr, `onTransitionRun`),
			Qr(qr, `onTransitionStart`),
			Qr(Jr, `onTransitionCancel`),
			Qr(Yr, `onTransitionEnd`),
			At(`onMouseEnter`, [`mouseout`, `mouseover`]),
			At(`onMouseLeave`, [`mouseout`, `mouseover`]),
			At(`onPointerEnter`, [`pointerout`, `pointerover`]),
			At(`onPointerLeave`, [`pointerout`, `pointerover`]),
			kt(
				`onChange`,
				`change click focusin focusout input keydown keyup selectionchange`.split(
					` `,
				),
			),
			kt(
				`onSelect`,
				`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
					` `,
				),
			),
			kt(`onBeforeInput`, [
				`compositionend`,
				`keypress`,
				`textInput`,
				`paste`,
			]),
			kt(
				`onCompositionEnd`,
				`compositionend focusout keydown keypress keyup mousedown`.split(
					` `,
				),
			),
			kt(
				`onCompositionStart`,
				`compositionstart focusout keydown keypress keyup mousedown`.split(
					` `,
				),
			),
			kt(
				`onCompositionUpdate`,
				`compositionupdate focusout keydown keypress keyup mousedown`.split(
					` `,
				),
			));
		var _d =
				`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
					` `,
				),
			vd = new Set(
				`beforetoggle cancel close invalid load scroll scrollend toggle`
					.split(` `)
					.concat(_d),
			);
		function yd(e, t) {
			t = (t & 4) != 0;
			for (var n = 0; n < e.length; n++) {
				var r = e[n],
					i = r.event;
				r = r.listeners;
				a: {
					var a = void 0;
					if (t)
						for (var o = r.length - 1; 0 <= o; o--) {
							var s = r[o],
								c = s.instance,
								l = s.currentTarget;
							if (
								((s = s.listener),
								c !== a && i.isPropagationStopped())
							)
								break a;
							((a = s), (i.currentTarget = l));
							try {
								a(i);
							} catch (e) {
								$r(e);
							}
							((i.currentTarget = null), (a = c));
						}
					else
						for (o = 0; o < r.length; o++) {
							if (
								((s = r[o]),
								(c = s.instance),
								(l = s.currentTarget),
								(s = s.listener),
								c !== a && i.isPropagationStopped())
							)
								break a;
							((a = s), (i.currentTarget = l));
							try {
								a(i);
							} catch (e) {
								$r(e);
							}
							((i.currentTarget = null), (a = c));
						}
				}
			}
		}
		function Q(e, t) {
			var n = t[_t];
			n === void 0 && (n = t[_t] = new Set());
			var r = e + `__bubble`;
			n.has(r) || (Cd(t, e, 2, !1), n.add(r));
		}
		function bd(e, t, n) {
			var r = 0;
			(t && (r |= 4), Cd(n, e, r, t));
		}
		var xd = `_reactListening` + Math.random().toString(36).slice(2);
		function Sd(e) {
			if (!e[xd]) {
				((e[xd] = !0),
					Dt.forEach(function (t) {
						t !== `selectionchange` &&
							(vd.has(t) || bd(t, !1, e), bd(t, !0, e));
					}));
				var t = e.nodeType === 9 ? e : e.ownerDocument;
				t === null ||
					t[xd] ||
					((t[xd] = !0), bd(`selectionchange`, !1, t));
			}
		}
		function Cd(e, t, n, r) {
			switch (mp(t)) {
				case 2:
					var i = cp;
					break;
				case 8:
					i = lp;
					break;
				default:
					i = up;
			}
			((n = i.bind(null, t, n, e)),
				(i = void 0),
				!hn ||
					(t !== `touchstart` &&
						t !== `touchmove` &&
						t !== `wheel`) ||
					(i = !0),
				r
					? i === void 0
						? e.addEventListener(t, n, !0)
						: e.addEventListener(t, n, { capture: !0, passive: i })
					: i === void 0
						? e.addEventListener(t, n, !1)
						: e.addEventListener(t, n, { passive: i }));
		}
		function wd(e, t, n, r, i) {
			var a = r;
			if (!(t & 1) && !(t & 2) && r !== null)
				a: for (;;) {
					if (r === null) return;
					var s = r.tag;
					if (s === 3 || s === 4) {
						var c = r.stateNode.containerInfo;
						if (c === i) break;
						if (s === 4)
							for (s = r.return; s !== null; ) {
								var l = s.tag;
								if (
									(l === 3 || l === 4) &&
									s.stateNode.containerInfo === i
								)
									return;
								s = s.return;
							}
						for (; c !== null; ) {
							if (((s = Ct(c)), s === null)) return;
							if (
								((l = s.tag),
								l === 5 || l === 6 || l === 26 || l === 27)
							) {
								r = a = s;
								continue a;
							}
							c = c.parentNode;
						}
					}
					r = r.return;
				}
			fn(function () {
				var r = a,
					i = sn(n),
					s = [];
				a: {
					var c = Xr.get(e);
					if (c !== void 0) {
						var l = Tn,
							u = e;
						switch (e) {
							case `keypress`:
								if (bn(n) === 0) break a;
							case `keydown`:
							case `keyup`:
								l = Un;
								break;
							case `focusin`:
								((u = `focus`), (l = Pn));
								break;
							case `focusout`:
								((u = `blur`), (l = Pn));
								break;
							case `beforeblur`:
							case `afterblur`:
								l = Pn;
								break;
							case `click`:
								if (n.button === 2) break a;
							case `auxclick`:
							case `dblclick`:
							case `mousedown`:
							case `mousemove`:
							case `mouseup`:
							case `mouseout`:
							case `mouseover`:
							case `contextmenu`:
								l = Mn;
								break;
							case `drag`:
							case `dragend`:
							case `dragenter`:
							case `dragexit`:
							case `dragleave`:
							case `dragover`:
							case `dragstart`:
							case `drop`:
								l = Nn;
								break;
							case `touchcancel`:
							case `touchend`:
							case `touchmove`:
							case `touchstart`:
								l = Gn;
								break;
							case F:
							case Wr:
							case Gr:
								l = Fn;
								break;
							case Yr:
								l = Kn;
								break;
							case `scroll`:
							case `scrollend`:
								l = Dn;
								break;
							case `wheel`:
								l = qn;
								break;
							case `copy`:
							case `cut`:
							case `paste`:
								l = In;
								break;
							case `gotpointercapture`:
							case `lostpointercapture`:
							case `pointercancel`:
							case `pointerdown`:
							case `pointermove`:
							case `pointerout`:
							case `pointerover`:
							case `pointerup`:
								l = Wn;
								break;
							case `toggle`:
							case `beforetoggle`:
								l = Jn;
						}
						var d = (t & 4) != 0,
							f = !d && (e === `scroll` || e === `scrollend`),
							p = d ? (c === null ? null : c + `Capture`) : c;
						d = [];
						for (var m = r, h; m !== null; ) {
							var g = m;
							if (
								((h = g.stateNode),
								(g = g.tag),
								(g !== 5 && g !== 26 && g !== 27) ||
									h === null ||
									p === null ||
									((g = pn(m, p)),
									g != null && d.push(Td(m, g, h))),
								f)
							)
								break;
							m = m.return;
						}
						0 < d.length &&
							((c = new l(c, u, null, n, i)),
							s.push({ event: c, listeners: d }));
					}
				}
				if (!(t & 7)) {
					a: {
						if (
							((c = e === `mouseover` || e === `pointerover`),
							(l = e === `mouseout` || e === `pointerout`),
							c &&
								n !== on &&
								(u = n.relatedTarget || n.fromElement) &&
								(Ct(u) || u[gt]))
						)
							break a;
						if (
							(l || c) &&
							((c =
								i.window === i
									? i
									: (c = i.ownerDocument)
										? c.defaultView || c.parentWindow
										: window),
							l
								? ((u = n.relatedTarget || n.toElement),
									(l = r),
									(u = u ? Ct(u) : null),
									u !== null &&
										((f = o(u)),
										(d = u.tag),
										u !== f ||
											(d !== 5 && d !== 27 && d !== 6)) &&
										(u = null))
								: ((l = null), (u = r)),
							l !== u)
						) {
							if (
								((d = Mn),
								(g = `onMouseLeave`),
								(p = `onMouseEnter`),
								(m = `mouse`),
								(e === `pointerout` || e === `pointerover`) &&
									((d = Wn),
									(g = `onPointerLeave`),
									(p = `onPointerEnter`),
									(m = `pointer`)),
								(f = l == null ? c : Tt(l)),
								(h = u == null ? c : Tt(u)),
								(c = new d(g, m + `leave`, l, n, i)),
								(c.target = f),
								(c.relatedTarget = h),
								(g = null),
								Ct(i) === r &&
									((d = new d(p, m + `enter`, u, n, i)),
									(d.target = h),
									(d.relatedTarget = f),
									(g = d)),
								(f = g),
								l && u)
							)
								b: {
									for (
										d = Dd, p = l, m = u, h = 0, g = p;
										g;
										g = d(g)
									)
										h++;
									g = 0;
									for (var _ = m; _; _ = d(_)) g++;
									for (; 0 < h - g; ) ((p = d(p)), h--);
									for (; 0 < g - h; ) ((m = d(m)), g--);
									for (; h--; ) {
										if (
											p === m ||
											(m !== null && p === m.alternate)
										) {
											d = p;
											break b;
										}
										((p = d(p)), (m = d(m)));
									}
									d = null;
								}
							else d = null;
							(l !== null && Od(s, c, l, d, !1),
								u !== null && f !== null && Od(s, f, u, d, !0));
						}
					}
					a: {
						if (
							((c = r ? Tt(r) : window),
							(l = c.nodeName && c.nodeName.toLowerCase()),
							l === `select` ||
								(l === `input` && c.type === `file`))
						)
							var v = mr;
						else if (cr(c))
							if (hr) v = wr;
							else {
								v = Sr;
								var y = xr;
							}
						else
							((l = c.nodeName),
								!l ||
								l.toLowerCase() !== `input` ||
								(c.type !== `checkbox` && c.type !== `radio`)
									? r && tn(r.elementType) && (v = mr)
									: (v = Cr));
						if ((v &&= v(e, r))) {
							lr(s, v, n, i);
							break a;
						}
						(y && y(e, c, r),
							e === `focusout` &&
								r &&
								c.type === `number` &&
								r.memoizedProps.value != null &&
								qt(c, `number`, c.value));
					}
					switch (((y = r ? Tt(r) : window), e)) {
						case `focusin`:
							(cr(y) || y.contentEditable === `true`) &&
								((Pr = y), (Fr = r), (Ir = null));
							break;
						case `focusout`:
							Ir = Fr = Pr = null;
							break;
						case `mousedown`:
							Lr = !0;
							break;
						case `contextmenu`:
						case `mouseup`:
						case `dragend`:
							((Lr = !1), Rr(s, n, i));
							break;
						case `selectionchange`:
							if (Nr) break;
						case `keydown`:
						case `keyup`:
							Rr(s, n, i);
					}
					var b;
					if (Xn)
						b: {
							switch (e) {
								case `compositionstart`:
									var x = `onCompositionStart`;
									break b;
								case `compositionend`:
									x = `onCompositionEnd`;
									break b;
								case `compositionupdate`:
									x = `onCompositionUpdate`;
									break b;
							}
							x = void 0;
						}
					else
						ir
							? nr(e, n) && (x = `onCompositionEnd`)
							: e === `keydown` &&
								n.keyCode === 229 &&
								(x = `onCompositionStart`);
					(x &&
						($n &&
							n.locale !== `ko` &&
							(ir || x !== `onCompositionStart`
								? x === `onCompositionEnd` && ir && (b = yn())
								: ((gn = i),
									(_n =
										`value` in gn
											? gn.value
											: gn.textContent),
									(ir = !0))),
						(y = Ed(r, x)),
						0 < y.length &&
							((x = new Ln(x, e, null, n, i)),
							s.push({ event: x, listeners: y }),
							b
								? (x.data = b)
								: ((b = rr(n)), b !== null && (x.data = b)))),
						(b = Qn ? ar(e, n) : or(e, n)) &&
							((x = Ed(r, `onBeforeInput`)),
							0 < x.length &&
								((y = new Ln(
									`onBeforeInput`,
									`beforeinput`,
									null,
									n,
									i,
								)),
								s.push({ event: y, listeners: x }),
								(y.data = b))),
						md(s, e, r, n, i));
				}
				yd(s, t);
			});
		}
		function Td(e, t, n) {
			return { instance: e, listener: t, currentTarget: n };
		}
		function Ed(e, t) {
			for (var n = t + `Capture`, r = []; e !== null; ) {
				var i = e,
					a = i.stateNode;
				if (
					((i = i.tag),
					(i !== 5 && i !== 26 && i !== 27) ||
						a === null ||
						((i = pn(e, n)),
						i != null && r.unshift(Td(e, i, a)),
						(i = pn(e, t)),
						i != null && r.push(Td(e, i, a))),
					e.tag === 3)
				)
					return r;
				e = e.return;
			}
			return [];
		}
		function Dd(e) {
			if (e === null) return null;
			do e = e.return;
			while (e && e.tag !== 5 && e.tag !== 27);
			return e || null;
		}
		function Od(e, t, n, r, i) {
			for (var a = t._reactName, o = []; n !== null && n !== r; ) {
				var s = n,
					c = s.alternate,
					l = s.stateNode;
				if (((s = s.tag), c !== null && c === r)) break;
				((s !== 5 && s !== 26 && s !== 27) ||
					l === null ||
					((c = l),
					i
						? ((l = pn(n, a)), l != null && o.unshift(Td(n, l, c)))
						: i ||
							((l = pn(n, a)), l != null && o.push(Td(n, l, c)))),
					(n = n.return));
			}
			o.length !== 0 && e.push({ event: t, listeners: o });
		}
		var kd = /\r\n?/g,
			Ad = /\u0000|\uFFFD/g;
		function jd(e) {
			return (typeof e == `string` ? e : `` + e)
				.replace(
					kd,
					`
`,
				)
				.replace(Ad, ``);
		}
		function Md(e, t) {
			return ((t = jd(t)), jd(e) === t);
		}
		function $(e, t, n, r, a, o) {
			switch (n) {
				case `children`:
					typeof r == `string`
						? t === `body` ||
							(t === `textarea` && r === ``) ||
							Zt(e, r)
						: (typeof r == `number` || typeof r == `bigint`) &&
							t !== `body` &&
							Zt(e, `` + r);
					break;
				case `className`:
					It(e, `class`, r);
					break;
				case `tabIndex`:
					It(e, `tabindex`, r);
					break;
				case `dir`:
				case `role`:
				case `viewBox`:
				case `width`:
				case `height`:
					It(e, n, r);
					break;
				case `style`:
					en(e, r, o);
					break;
				case `data`:
					if (t !== `object`) {
						It(e, `data`, r);
						break;
					}
				case `src`:
				case `href`:
					if (r === `` && (t !== `a` || n !== `href`)) {
						e.removeAttribute(n);
						break;
					}
					if (
						r == null ||
						typeof r == `function` ||
						typeof r == `symbol` ||
						typeof r == `boolean`
					) {
						e.removeAttribute(n);
						break;
					}
					((r = rn(`` + r)), e.setAttribute(n, r));
					break;
				case `action`:
				case `formAction`:
					if (typeof r == `function`) {
						e.setAttribute(
							n,
							`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
						);
						break;
					} else
						typeof o == `function` &&
							(n === `formAction`
								? (t !== `input` &&
										$(e, t, `name`, a.name, a, null),
									$(
										e,
										t,
										`formEncType`,
										a.formEncType,
										a,
										null,
									),
									$(
										e,
										t,
										`formMethod`,
										a.formMethod,
										a,
										null,
									),
									$(
										e,
										t,
										`formTarget`,
										a.formTarget,
										a,
										null,
									))
								: ($(e, t, `encType`, a.encType, a, null),
									$(e, t, `method`, a.method, a, null),
									$(e, t, `target`, a.target, a, null)));
					if (
						r == null ||
						typeof r == `symbol` ||
						typeof r == `boolean`
					) {
						e.removeAttribute(n);
						break;
					}
					((r = rn(`` + r)), e.setAttribute(n, r));
					break;
				case `onClick`:
					r != null && (e.onclick = an);
					break;
				case `onScroll`:
					r != null && Q(`scroll`, e);
					break;
				case `onScrollEnd`:
					r != null && Q(`scrollend`, e);
					break;
				case `dangerouslySetInnerHTML`:
					if (r != null) {
						if (typeof r != `object` || !(`__html` in r))
							throw Error(i(61));
						if (((n = r.__html), n != null)) {
							if (a.children != null) throw Error(i(60));
							e.innerHTML = n;
						}
					}
					break;
				case `multiple`:
					e.multiple =
						r && typeof r != `function` && typeof r != `symbol`;
					break;
				case `muted`:
					e.muted =
						r && typeof r != `function` && typeof r != `symbol`;
					break;
				case `suppressContentEditableWarning`:
				case `suppressHydrationWarning`:
				case `defaultValue`:
				case `defaultChecked`:
				case `innerHTML`:
				case `ref`:
					break;
				case `autoFocus`:
					break;
				case `xlinkHref`:
					if (
						r == null ||
						typeof r == `function` ||
						typeof r == `boolean` ||
						typeof r == `symbol`
					) {
						e.removeAttribute(`xlink:href`);
						break;
					}
					((n = rn(`` + r)),
						e.setAttributeNS(
							`http://www.w3.org/1999/xlink`,
							`xlink:href`,
							n,
						));
					break;
				case `contentEditable`:
				case `spellCheck`:
				case `draggable`:
				case `value`:
				case `autoReverse`:
				case `externalResourcesRequired`:
				case `focusable`:
				case `preserveAlpha`:
					r != null && typeof r != `function` && typeof r != `symbol`
						? e.setAttribute(n, `` + r)
						: e.removeAttribute(n);
					break;
				case `inert`:
				case `allowFullScreen`:
				case `async`:
				case `autoPlay`:
				case `controls`:
				case `default`:
				case `defer`:
				case `disabled`:
				case `disablePictureInPicture`:
				case `disableRemotePlayback`:
				case `formNoValidate`:
				case `hidden`:
				case `loop`:
				case `noModule`:
				case `noValidate`:
				case `open`:
				case `playsInline`:
				case `readOnly`:
				case `required`:
				case `reversed`:
				case `scoped`:
				case `seamless`:
				case `itemScope`:
					r && typeof r != `function` && typeof r != `symbol`
						? e.setAttribute(n, ``)
						: e.removeAttribute(n);
					break;
				case `capture`:
				case `download`:
					!0 === r
						? e.setAttribute(n, ``)
						: !1 !== r &&
							  r != null &&
							  typeof r != `function` &&
							  typeof r != `symbol`
							? e.setAttribute(n, r)
							: e.removeAttribute(n);
					break;
				case `cols`:
				case `rows`:
				case `size`:
				case `span`:
					r != null &&
					typeof r != `function` &&
					typeof r != `symbol` &&
					!isNaN(r) &&
					1 <= r
						? e.setAttribute(n, r)
						: e.removeAttribute(n);
					break;
				case `rowSpan`:
				case `start`:
					r == null ||
					typeof r == `function` ||
					typeof r == `symbol` ||
					isNaN(r)
						? e.removeAttribute(n)
						: e.setAttribute(n, r);
					break;
				case `popover`:
					(Q(`beforetoggle`, e), Q(`toggle`, e), Ft(e, `popover`, r));
					break;
				case `xlinkActuate`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
					break;
				case `xlinkArcrole`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
					break;
				case `xlinkRole`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
					break;
				case `xlinkShow`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
					break;
				case `xlinkTitle`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
					break;
				case `xlinkType`:
					M(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
					break;
				case `xmlBase`:
					M(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
					break;
				case `xmlLang`:
					M(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
					break;
				case `xmlSpace`:
					M(
						e,
						`http://www.w3.org/XML/1998/namespace`,
						`xml:space`,
						r,
					);
					break;
				case `is`:
					Ft(e, `is`, r);
					break;
				case `innerText`:
				case `textContent`:
					break;
				default:
					(!(2 < n.length) ||
						(n[0] !== `o` && n[0] !== `O`) ||
						(n[1] !== `n` && n[1] !== `N`)) &&
						((n = nn.get(n) || n), Ft(e, n, r));
			}
		}
		function Nd(e, t, n, r, a, o) {
			switch (n) {
				case `style`:
					en(e, r, o);
					break;
				case `dangerouslySetInnerHTML`:
					if (r != null) {
						if (typeof r != `object` || !(`__html` in r))
							throw Error(i(61));
						if (((n = r.__html), n != null)) {
							if (a.children != null) throw Error(i(60));
							e.innerHTML = n;
						}
					}
					break;
				case `children`:
					typeof r == `string`
						? Zt(e, r)
						: (typeof r == `number` || typeof r == `bigint`) &&
							Zt(e, `` + r);
					break;
				case `onScroll`:
					r != null && Q(`scroll`, e);
					break;
				case `onScrollEnd`:
					r != null && Q(`scrollend`, e);
					break;
				case `onClick`:
					r != null && (e.onclick = an);
					break;
				case `suppressContentEditableWarning`:
				case `suppressHydrationWarning`:
				case `innerHTML`:
				case `ref`:
					break;
				case `innerText`:
				case `textContent`:
					break;
				default:
					if (!Ot.hasOwnProperty(n))
						a: {
							if (
								n[0] === `o` &&
								n[1] === `n` &&
								((a = n.endsWith(`Capture`)),
								(t = n.slice(2, a ? n.length - 7 : void 0)),
								(o = e[ht] || null),
								(o = o == null ? null : o[n]),
								typeof o == `function` &&
									e.removeEventListener(t, o, a),
								typeof r == `function`)
							) {
								(typeof o != `function` &&
									o !== null &&
									(n in e
										? (e[n] = null)
										: e.hasAttribute(n) &&
											e.removeAttribute(n)),
									e.addEventListener(t, r, a));
								break a;
							}
							n in e
								? (e[n] = r)
								: !0 === r
									? e.setAttribute(n, ``)
									: Ft(e, n, r);
						}
			}
		}
		function Pd(e, t, n) {
			switch (t) {
				case `div`:
				case `span`:
				case `svg`:
				case `path`:
				case `a`:
				case `g`:
				case `p`:
				case `li`:
					break;
				case `img`:
					(Q(`error`, e), Q(`load`, e));
					var r = !1,
						a = !1,
						o;
					for (o in n)
						if (n.hasOwnProperty(o)) {
							var s = n[o];
							if (s != null)
								switch (o) {
									case `src`:
										r = !0;
										break;
									case `srcSet`:
										a = !0;
										break;
									case `children`:
									case `dangerouslySetInnerHTML`:
										throw Error(i(137, t));
									default:
										$(e, t, o, s, n, null);
								}
						}
					(a && $(e, t, `srcSet`, n.srcSet, n, null),
						r && $(e, t, `src`, n.src, n, null));
					return;
				case `input`:
					Q(`invalid`, e);
					var c = (o = s = a = null),
						l = null,
						u = null;
					for (r in n)
						if (n.hasOwnProperty(r)) {
							var d = n[r];
							if (d != null)
								switch (r) {
									case `name`:
										a = d;
										break;
									case `type`:
										s = d;
										break;
									case `checked`:
										l = d;
										break;
									case `defaultChecked`:
										u = d;
										break;
									case `value`:
										o = d;
										break;
									case `defaultValue`:
										c = d;
										break;
									case `children`:
									case `dangerouslySetInnerHTML`:
										if (d != null) throw Error(i(137, t));
										break;
									default:
										$(e, t, r, d, n, null);
								}
						}
					Kt(e, o, c, l, u, s, a, !1);
					return;
				case `select`:
					for (a in (Q(`invalid`, e), (r = s = o = null), n))
						if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
							switch (a) {
								case `value`:
									o = c;
									break;
								case `defaultValue`:
									s = c;
									break;
								case `multiple`:
									r = c;
								default:
									$(e, t, a, c, n, null);
							}
					((t = o),
						(n = s),
						(e.multiple = !!r),
						t == null
							? n != null && Jt(e, !!r, n, !0)
							: Jt(e, !!r, t, !1));
					return;
				case `textarea`:
					for (s in (Q(`invalid`, e), (o = a = r = null), n))
						if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
							switch (s) {
								case `value`:
									r = c;
									break;
								case `defaultValue`:
									a = c;
									break;
								case `children`:
									o = c;
									break;
								case `dangerouslySetInnerHTML`:
									if (c != null) throw Error(i(91));
									break;
								default:
									$(e, t, s, c, n, null);
							}
					Xt(e, r, a, o);
					return;
				case `option`:
					for (l in n)
						if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
							switch (l) {
								case `selected`:
									e.selected =
										r &&
										typeof r != `function` &&
										typeof r != `symbol`;
									break;
								default:
									$(e, t, l, r, n, null);
							}
					return;
				case `dialog`:
					(Q(`beforetoggle`, e),
						Q(`toggle`, e),
						Q(`cancel`, e),
						Q(`close`, e));
					break;
				case `iframe`:
				case `object`:
					Q(`load`, e);
					break;
				case `video`:
				case `audio`:
					for (r = 0; r < _d.length; r++) Q(_d[r], e);
					break;
				case `image`:
					(Q(`error`, e), Q(`load`, e));
					break;
				case `details`:
					Q(`toggle`, e);
					break;
				case `embed`:
				case `source`:
				case `link`:
					(Q(`error`, e), Q(`load`, e));
				case `area`:
				case `base`:
				case `br`:
				case `col`:
				case `hr`:
				case `keygen`:
				case `meta`:
				case `param`:
				case `track`:
				case `wbr`:
				case `menuitem`:
					for (u in n)
						if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
							switch (u) {
								case `children`:
								case `dangerouslySetInnerHTML`:
									throw Error(i(137, t));
								default:
									$(e, t, u, r, n, null);
							}
					return;
				default:
					if (tn(t)) {
						for (d in n)
							n.hasOwnProperty(d) &&
								((r = n[d]),
								r !== void 0 && Nd(e, t, d, r, n, void 0));
						return;
					}
			}
			for (c in n)
				n.hasOwnProperty(c) &&
					((r = n[c]), r != null && $(e, t, c, r, n, null));
		}
		function Fd(e, t, n, r) {
			switch (t) {
				case `div`:
				case `span`:
				case `svg`:
				case `path`:
				case `a`:
				case `g`:
				case `p`:
				case `li`:
					break;
				case `input`:
					var a = null,
						o = null,
						s = null,
						c = null,
						l = null,
						u = null,
						d = null;
					for (m in n) {
						var f = n[m];
						if (n.hasOwnProperty(m) && f != null)
							switch (m) {
								case `checked`:
									break;
								case `value`:
									break;
								case `defaultValue`:
									l = f;
								default:
									r.hasOwnProperty(m) ||
										$(e, t, m, null, r, f);
							}
					}
					for (var p in r) {
						var m = r[p];
						if (
							((f = n[p]),
							r.hasOwnProperty(p) && (m != null || f != null))
						)
							switch (p) {
								case `type`:
									o = m;
									break;
								case `name`:
									a = m;
									break;
								case `checked`:
									u = m;
									break;
								case `defaultChecked`:
									d = m;
									break;
								case `value`:
									s = m;
									break;
								case `defaultValue`:
									c = m;
									break;
								case `children`:
								case `dangerouslySetInnerHTML`:
									if (m != null) throw Error(i(137, t));
									break;
								default:
									m !== f && $(e, t, p, m, r, f);
							}
					}
					Gt(e, s, c, l, u, d, o, a);
					return;
				case `select`:
					for (o in ((m = s = c = p = null), n))
						if (((l = n[o]), n.hasOwnProperty(o) && l != null))
							switch (o) {
								case `value`:
									break;
								case `multiple`:
									m = l;
								default:
									r.hasOwnProperty(o) ||
										$(e, t, o, null, r, l);
							}
					for (a in r)
						if (
							((o = r[a]),
							(l = n[a]),
							r.hasOwnProperty(a) && (o != null || l != null))
						)
							switch (a) {
								case `value`:
									p = o;
									break;
								case `defaultValue`:
									c = o;
									break;
								case `multiple`:
									s = o;
								default:
									o !== l && $(e, t, a, o, r, l);
							}
					((t = c),
						(n = s),
						(r = m),
						p == null
							? !!r != !!n &&
								(t == null
									? Jt(e, !!n, n ? [] : ``, !1)
									: Jt(e, !!n, t, !0))
							: Jt(e, !!n, p, !1));
					return;
				case `textarea`:
					for (c in ((m = p = null), n))
						if (
							((a = n[c]),
							n.hasOwnProperty(c) &&
								a != null &&
								!r.hasOwnProperty(c))
						)
							switch (c) {
								case `value`:
									break;
								case `children`:
									break;
								default:
									$(e, t, c, null, r, a);
							}
					for (s in r)
						if (
							((a = r[s]),
							(o = n[s]),
							r.hasOwnProperty(s) && (a != null || o != null))
						)
							switch (s) {
								case `value`:
									p = a;
									break;
								case `defaultValue`:
									m = a;
									break;
								case `children`:
									break;
								case `dangerouslySetInnerHTML`:
									if (a != null) throw Error(i(91));
									break;
								default:
									a !== o && $(e, t, s, a, r, o);
							}
					Yt(e, p, m);
					return;
				case `option`:
					for (var h in n)
						if (
							((p = n[h]),
							n.hasOwnProperty(h) &&
								p != null &&
								!r.hasOwnProperty(h))
						)
							switch (h) {
								case `selected`:
									e.selected = !1;
									break;
								default:
									$(e, t, h, null, r, p);
							}
					for (l in r)
						if (
							((p = r[l]),
							(m = n[l]),
							r.hasOwnProperty(l) &&
								p !== m &&
								(p != null || m != null))
						)
							switch (l) {
								case `selected`:
									e.selected =
										p &&
										typeof p != `function` &&
										typeof p != `symbol`;
									break;
								default:
									$(e, t, l, p, r, m);
							}
					return;
				case `img`:
				case `link`:
				case `area`:
				case `base`:
				case `br`:
				case `col`:
				case `embed`:
				case `hr`:
				case `keygen`:
				case `meta`:
				case `param`:
				case `source`:
				case `track`:
				case `wbr`:
				case `menuitem`:
					for (var g in n)
						((p = n[g]),
							n.hasOwnProperty(g) &&
								p != null &&
								!r.hasOwnProperty(g) &&
								$(e, t, g, null, r, p));
					for (u in r)
						if (
							((p = r[u]),
							(m = n[u]),
							r.hasOwnProperty(u) &&
								p !== m &&
								(p != null || m != null))
						)
							switch (u) {
								case `children`:
								case `dangerouslySetInnerHTML`:
									if (p != null) throw Error(i(137, t));
									break;
								default:
									$(e, t, u, p, r, m);
							}
					return;
				default:
					if (tn(t)) {
						for (var _ in n)
							((p = n[_]),
								n.hasOwnProperty(_) &&
									p !== void 0 &&
									!r.hasOwnProperty(_) &&
									Nd(e, t, _, void 0, r, p));
						for (d in r)
							((p = r[d]),
								(m = n[d]),
								!r.hasOwnProperty(d) ||
									p === m ||
									(p === void 0 && m === void 0) ||
									Nd(e, t, d, p, r, m));
						return;
					}
			}
			for (var v in n)
				((p = n[v]),
					n.hasOwnProperty(v) &&
						p != null &&
						!r.hasOwnProperty(v) &&
						$(e, t, v, null, r, p));
			for (f in r)
				((p = r[f]),
					(m = n[f]),
					!r.hasOwnProperty(f) ||
						p === m ||
						(p == null && m == null) ||
						$(e, t, f, p, r, m));
		}
		function Id(e) {
			switch (e) {
				case `css`:
				case `script`:
				case `font`:
				case `img`:
				case `image`:
				case `input`:
				case `link`:
					return !0;
				default:
					return !1;
			}
		}
		function Ld() {
			if (typeof performance.getEntriesByType == `function`) {
				for (
					var e = 0,
						t = 0,
						n = performance.getEntriesByType(`resource`),
						r = 0;
					r < n.length;
					r++
				) {
					var i = n[r],
						a = i.transferSize,
						o = i.initiatorType,
						s = i.duration;
					if (a && s && Id(o)) {
						for (
							o = 0, s = i.responseEnd, r += 1;
							r < n.length;
							r++
						) {
							var c = n[r],
								l = c.startTime;
							if (l > s) break;
							var u = c.transferSize,
								d = c.initiatorType;
							u &&
								Id(d) &&
								((c = c.responseEnd),
								(o += u * (c < s ? 1 : (s - l) / (c - l))));
						}
						if (
							(--r,
							(t += (8 * (a + o)) / (i.duration / 1e3)),
							e++,
							10 < e)
						)
							break;
					}
				}
				if (0 < e) return t / e / 1e6;
			}
			return navigator.connection &&
				((e = navigator.connection.downlink), typeof e == `number`)
				? e
				: 5;
		}
		var Rd = null,
			zd = null;
		function Bd(e) {
			return e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Vd(e) {
			switch (e) {
				case `http://www.w3.org/2000/svg`:
					return 1;
				case `http://www.w3.org/1998/Math/MathML`:
					return 2;
				default:
					return 0;
			}
		}
		function Hd(e, t) {
			if (e === 0)
				switch (t) {
					case `svg`:
						return 1;
					case `math`:
						return 2;
					default:
						return 0;
				}
			return e === 1 && t === `foreignObject` ? 0 : e;
		}
		function Ud(e, t) {
			return (
				e === `textarea` ||
				e === `noscript` ||
				typeof t.children == `string` ||
				typeof t.children == `number` ||
				typeof t.children == `bigint` ||
				(typeof t.dangerouslySetInnerHTML == `object` &&
					t.dangerouslySetInnerHTML !== null &&
					t.dangerouslySetInnerHTML.__html != null)
			);
		}
		var Wd = null;
		function Gd() {
			var e = window.event;
			return e && e.type === `popstate`
				? e === Wd
					? !1
					: ((Wd = e), !0)
				: ((Wd = null), !1);
		}
		var Kd = typeof setTimeout == `function` ? setTimeout : void 0,
			qd = typeof clearTimeout == `function` ? clearTimeout : void 0,
			Jd = typeof Promise == `function` ? Promise : void 0,
			Yd =
				typeof queueMicrotask == `function`
					? queueMicrotask
					: Jd === void 0
						? Kd
						: function (e) {
								return Jd.resolve(null).then(e).catch(Xd);
							};
		function Xd(e) {
			setTimeout(function () {
				throw e;
			});
		}
		function Zd(e) {
			return e === `head`;
		}
		function Qd(e, t) {
			var n = t,
				r = 0;
			do {
				var i = n.nextSibling;
				if ((e.removeChild(n), i && i.nodeType === 8))
					if (((n = i.data), n === `/$` || n === `/&`)) {
						if (r === 0) {
							(e.removeChild(i), Np(t));
							return;
						}
						r--;
					} else if (
						n === `$` ||
						n === `$?` ||
						n === `$~` ||
						n === `$!` ||
						n === `&`
					)
						r++;
					else if (n === `html`) pf(e.ownerDocument.documentElement);
					else if (n === `head`) {
						((n = e.ownerDocument.head), pf(n));
						for (var a = n.firstChild; a; ) {
							var o = a.nextSibling,
								s = a.nodeName;
							(a[xt] ||
								s === `SCRIPT` ||
								s === `STYLE` ||
								(s === `LINK` &&
									a.rel.toLowerCase() === `stylesheet`) ||
								n.removeChild(a),
								(a = o));
						}
					} else n === `body` && pf(e.ownerDocument.body);
				n = i;
			} while (n);
			Np(t);
		}
		function $d(e, t) {
			var n = e;
			e = 0;
			do {
				var r = n.nextSibling;
				if (
					(n.nodeType === 1
						? t
							? ((n._stashedDisplay = n.style.display),
								(n.style.display = `none`))
							: ((n.style.display = n._stashedDisplay || ``),
								n.getAttribute(`style`) === `` &&
									n.removeAttribute(`style`))
						: n.nodeType === 3 &&
							(t
								? ((n._stashedText = n.nodeValue),
									(n.nodeValue = ``))
								: (n.nodeValue = n._stashedText || ``)),
					r && r.nodeType === 8)
				)
					if (((n = r.data), n === `/$`)) {
						if (e === 0) break;
						e--;
					} else
						(n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) ||
							e++;
				n = r;
			} while (n);
		}
		function ef(e) {
			var t = e.firstChild;
			for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
				var n = t;
				switch (((t = t.nextSibling), n.nodeName)) {
					case `HTML`:
					case `HEAD`:
					case `BODY`:
						(ef(n), St(n));
						continue;
					case `SCRIPT`:
					case `STYLE`:
						continue;
					case `LINK`:
						if (n.rel.toLowerCase() === `stylesheet`) continue;
				}
				e.removeChild(n);
			}
		}
		function tf(e, t, n, r) {
			for (; e.nodeType === 1; ) {
				var i = n;
				if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
					if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`))
						break;
				} else if (!r)
					if (t === `input` && e.type === `hidden`) {
						var a = i.name == null ? null : `` + i.name;
						if (i.type === `hidden` && e.getAttribute(`name`) === a)
							return e;
					} else return e;
				else if (!e[xt])
					switch (t) {
						case `meta`:
							if (!e.hasAttribute(`itemprop`)) break;
							return e;
						case `link`:
							if (
								((a = e.getAttribute(`rel`)),
								(a === `stylesheet` &&
									e.hasAttribute(`data-precedence`)) ||
									a !== i.rel ||
									e.getAttribute(`href`) !==
										(i.href == null || i.href === ``
											? null
											: i.href) ||
									e.getAttribute(`crossorigin`) !==
										(i.crossOrigin == null
											? null
											: i.crossOrigin) ||
									e.getAttribute(`title`) !==
										(i.title == null ? null : i.title))
							)
								break;
							return e;
						case `style`:
							if (e.hasAttribute(`data-precedence`)) break;
							return e;
						case `script`:
							if (
								((a = e.getAttribute(`src`)),
								(a !== (i.src == null ? null : i.src) ||
									e.getAttribute(`type`) !==
										(i.type == null ? null : i.type) ||
									e.getAttribute(`crossorigin`) !==
										(i.crossOrigin == null
											? null
											: i.crossOrigin)) &&
									a &&
									e.hasAttribute(`async`) &&
									!e.hasAttribute(`itemprop`))
							)
								break;
							return e;
						default:
							return e;
					}
				if (((e = cf(e.nextSibling)), e === null)) break;
			}
			return null;
		}
		function nf(e, t, n) {
			if (t === ``) return null;
			for (; e.nodeType !== 3; )
				if (
					((e.nodeType !== 1 ||
						e.nodeName !== `INPUT` ||
						e.type !== `hidden`) &&
						!n) ||
					((e = cf(e.nextSibling)), e === null)
				)
					return null;
			return e;
		}
		function rf(e, t) {
			for (; e.nodeType !== 8; )
				if (
					((e.nodeType !== 1 ||
						e.nodeName !== `INPUT` ||
						e.type !== `hidden`) &&
						!t) ||
					((e = cf(e.nextSibling)), e === null)
				)
					return null;
			return e;
		}
		function af(e) {
			return e.data === `$?` || e.data === `$~`;
		}
		function of(e) {
			return (
				e.data === `$!` ||
				(e.data === `$?` && e.ownerDocument.readyState !== `loading`)
			);
		}
		function sf(e, t) {
			var n = e.ownerDocument;
			if (e.data === `$~`) e._reactRetry = t;
			else if (e.data !== `$?` || n.readyState !== `loading`) t();
			else {
				var r = function () {
					(t(), n.removeEventListener(`DOMContentLoaded`, r));
				};
				(n.addEventListener(`DOMContentLoaded`, r),
					(e._reactRetry = r));
			}
		}
		function cf(e) {
			for (; e != null; e = e.nextSibling) {
				var t = e.nodeType;
				if (t === 1 || t === 3) break;
				if (t === 8) {
					if (
						((t = e.data),
						t === `$` ||
							t === `$!` ||
							t === `$?` ||
							t === `$~` ||
							t === `&` ||
							t === `F!` ||
							t === `F`)
					)
						break;
					if (t === `/$` || t === `/&`) return null;
				}
			}
			return e;
		}
		var lf = null;
		function uf(e) {
			e = e.nextSibling;
			for (var t = 0; e; ) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === `/$` || n === `/&`) {
						if (t === 0) return cf(e.nextSibling);
						t--;
					} else
						(n !== `$` &&
							n !== `$!` &&
							n !== `$?` &&
							n !== `$~` &&
							n !== `&`) ||
							t++;
				}
				e = e.nextSibling;
			}
			return null;
		}
		function df(e) {
			e = e.previousSibling;
			for (var t = 0; e; ) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (
						n === `$` ||
						n === `$!` ||
						n === `$?` ||
						n === `$~` ||
						n === `&`
					) {
						if (t === 0) return e;
						t--;
					} else (n !== `/$` && n !== `/&`) || t++;
				}
				e = e.previousSibling;
			}
			return null;
		}
		function ff(e, t, n) {
			switch (((t = Bd(n)), e)) {
				case `html`:
					if (((e = t.documentElement), !e)) throw Error(i(452));
					return e;
				case `head`:
					if (((e = t.head), !e)) throw Error(i(453));
					return e;
				case `body`:
					if (((e = t.body), !e)) throw Error(i(454));
					return e;
				default:
					throw Error(i(451));
			}
		}
		function pf(e) {
			for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
			St(e);
		}
		var mf = new Map(),
			hf = new Set();
		function gf(e) {
			return typeof e.getRootNode == `function`
				? e.getRootNode()
				: e.nodeType === 9
					? e
					: e.ownerDocument;
		}
		var _f = D.d;
		D.d = { f: vf, r: yf, D: Sf, C: Cf, L: wf, m: Tf, X: Df, S: Ef, M: Of };
		function vf() {
			var e = _f.f(),
				t = bu();
			return e || t;
		}
		function yf(e) {
			var t = wt(e);
			t !== null && t.tag === 5 && t.type === `form` ? Os(t) : _f.r(e);
		}
		var bf = typeof document > `u` ? null : document;
		function xf(e, t, n) {
			var r = bf;
			if (r && typeof t == `string` && t) {
				var i = Wt(t);
				((i = `link[rel="` + e + `"][href="` + i + `"]`),
					typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
					hf.has(i) ||
						(hf.add(i),
						(e = { rel: e, crossOrigin: n, href: t }),
						r.querySelector(i) === null &&
							((t = r.createElement(`link`)),
							Pd(t, `link`, e),
							j(t),
							r.head.appendChild(t))));
			}
		}
		function Sf(e) {
			(_f.D(e), xf(`dns-prefetch`, e, null));
		}
		function Cf(e, t) {
			(_f.C(e, t), xf(`preconnect`, e, t));
		}
		function wf(e, t, n) {
			_f.L(e, t, n);
			var r = bf;
			if (r && e && t) {
				var i = `link[rel="preload"][as="` + Wt(t) + `"]`;
				t === `image` && n && n.imageSrcSet
					? ((i += `[imagesrcset="` + Wt(n.imageSrcSet) + `"]`),
						typeof n.imageSizes == `string` &&
							(i += `[imagesizes="` + Wt(n.imageSizes) + `"]`))
					: (i += `[href="` + Wt(e) + `"]`);
				var a = i;
				switch (t) {
					case `style`:
						a = Af(e);
						break;
					case `script`:
						a = Pf(e);
				}
				mf.has(a) ||
					((e = f(
						{
							rel: `preload`,
							href:
								t === `image` && n && n.imageSrcSet
									? void 0
									: e,
							as: t,
						},
						n,
					)),
					mf.set(a, e),
					r.querySelector(i) !== null ||
						(t === `style` && r.querySelector(jf(a))) ||
						(t === `script` && r.querySelector(Ff(a))) ||
						((t = r.createElement(`link`)),
						Pd(t, `link`, e),
						j(t),
						r.head.appendChild(t)));
			}
		}
		function Tf(e, t) {
			_f.m(e, t);
			var n = bf;
			if (n && e) {
				var r = t && typeof t.as == `string` ? t.as : `script`,
					i =
						`link[rel="modulepreload"][as="` +
						Wt(r) +
						`"][href="` +
						Wt(e) +
						`"]`,
					a = i;
				switch (r) {
					case `audioworklet`:
					case `paintworklet`:
					case `serviceworker`:
					case `sharedworker`:
					case `worker`:
					case `script`:
						a = Pf(e);
				}
				if (
					!mf.has(a) &&
					((e = f({ rel: `modulepreload`, href: e }, t)),
					mf.set(a, e),
					n.querySelector(i) === null)
				) {
					switch (r) {
						case `audioworklet`:
						case `paintworklet`:
						case `serviceworker`:
						case `sharedworker`:
						case `worker`:
						case `script`:
							if (n.querySelector(Ff(a))) return;
					}
					((r = n.createElement(`link`)),
						Pd(r, `link`, e),
						j(r),
						n.head.appendChild(r));
				}
			}
		}
		function Ef(e, t, n) {
			_f.S(e, t, n);
			var r = bf;
			if (r && e) {
				var i = Et(r).hoistableStyles,
					a = Af(e);
				t ||= `default`;
				var o = i.get(a);
				if (!o) {
					var s = { loading: 0, preload: null };
					if ((o = r.querySelector(jf(a)))) s.loading = 5;
					else {
						((e = f(
							{
								rel: `stylesheet`,
								href: e,
								"data-precedence": t,
							},
							n,
						)),
							(n = mf.get(a)) && Rf(e, n));
						var c = (o = r.createElement(`link`));
						(j(c),
							Pd(c, `link`, e),
							(c._p = new Promise(function (e, t) {
								((c.onload = e), (c.onerror = t));
							})),
							c.addEventListener(`load`, function () {
								s.loading |= 1;
							}),
							c.addEventListener(`error`, function () {
								s.loading |= 2;
							}),
							(s.loading |= 4),
							Lf(o, t, r));
					}
					((o = {
						type: `stylesheet`,
						instance: o,
						count: 1,
						state: s,
					}),
						i.set(a, o));
				}
			}
		}
		function Df(e, t) {
			_f.X(e, t);
			var n = bf;
			if (n && e) {
				var r = Et(n).hoistableScripts,
					i = Pf(e),
					a = r.get(i);
				a ||
					((a = n.querySelector(Ff(i))),
					a ||
						((e = f({ src: e, async: !0 }, t)),
						(t = mf.get(i)) && zf(e, t),
						(a = n.createElement(`script`)),
						j(a),
						Pd(a, `link`, e),
						n.head.appendChild(a)),
					(a = {
						type: `script`,
						instance: a,
						count: 1,
						state: null,
					}),
					r.set(i, a));
			}
		}
		function Of(e, t) {
			_f.M(e, t);
			var n = bf;
			if (n && e) {
				var r = Et(n).hoistableScripts,
					i = Pf(e),
					a = r.get(i);
				a ||
					((a = n.querySelector(Ff(i))),
					a ||
						((e = f({ src: e, async: !0, type: `module` }, t)),
						(t = mf.get(i)) && zf(e, t),
						(a = n.createElement(`script`)),
						j(a),
						Pd(a, `link`, e),
						n.head.appendChild(a)),
					(a = {
						type: `script`,
						instance: a,
						count: 1,
						state: null,
					}),
					r.set(i, a));
			}
		}
		function kf(e, t, n, r) {
			var a = (a = me.current) ? gf(a) : null;
			if (!a) throw Error(i(446));
			switch (e) {
				case `meta`:
				case `title`:
					return null;
				case `style`:
					return typeof n.precedence == `string` &&
						typeof n.href == `string`
						? ((t = Af(n.href)),
							(n = Et(a).hoistableStyles),
							(r = n.get(t)),
							r ||
								((r = {
									type: `style`,
									instance: null,
									count: 0,
									state: null,
								}),
								n.set(t, r)),
							r)
						: {
								type: `void`,
								instance: null,
								count: 0,
								state: null,
							};
				case `link`:
					if (
						n.rel === `stylesheet` &&
						typeof n.href == `string` &&
						typeof n.precedence == `string`
					) {
						e = Af(n.href);
						var o = Et(a).hoistableStyles,
							s = o.get(e);
						if (
							(s ||
								((a = a.ownerDocument || a),
								(s = {
									type: `stylesheet`,
									instance: null,
									count: 0,
									state: { loading: 0, preload: null },
								}),
								o.set(e, s),
								(o = a.querySelector(jf(e))) &&
									!o._p &&
									((s.instance = o), (s.state.loading = 5)),
								mf.has(e) ||
									((n = {
										rel: `preload`,
										as: `style`,
										href: n.href,
										crossOrigin: n.crossOrigin,
										integrity: n.integrity,
										media: n.media,
										hrefLang: n.hrefLang,
										referrerPolicy: n.referrerPolicy,
									}),
									mf.set(e, n),
									o || Nf(a, e, n, s.state))),
							t && r === null)
						)
							throw Error(i(528, ``));
						return s;
					}
					if (t && r !== null) throw Error(i(529, ``));
					return null;
				case `script`:
					return (
						(t = n.async),
						(n = n.src),
						typeof n == `string` &&
						t &&
						typeof t != `function` &&
						typeof t != `symbol`
							? ((t = Pf(n)),
								(n = Et(a).hoistableScripts),
								(r = n.get(t)),
								r ||
									((r = {
										type: `script`,
										instance: null,
										count: 0,
										state: null,
									}),
									n.set(t, r)),
								r)
							: {
									type: `void`,
									instance: null,
									count: 0,
									state: null,
								}
					);
				default:
					throw Error(i(444, e));
			}
		}
		function Af(e) {
			return `href="` + Wt(e) + `"`;
		}
		function jf(e) {
			return `link[rel="stylesheet"][` + e + `]`;
		}
		function Mf(e) {
			return f({}, e, {
				"data-precedence": e.precedence,
				precedence: null,
			});
		}
		function Nf(e, t, n, r) {
			e.querySelector(`link[rel="preload"][as="style"][` + t + `]`)
				? (r.loading = 1)
				: ((t = e.createElement(`link`)),
					(r.preload = t),
					t.addEventListener(`load`, function () {
						return (r.loading |= 1);
					}),
					t.addEventListener(`error`, function () {
						return (r.loading |= 2);
					}),
					Pd(t, `link`, n),
					j(t),
					e.head.appendChild(t));
		}
		function Pf(e) {
			return `[src="` + Wt(e) + `"]`;
		}
		function Ff(e) {
			return `script[async]` + e;
		}
		function If(e, t, n) {
			if ((t.count++, t.instance === null))
				switch (t.type) {
					case `style`:
						var r = e.querySelector(
							`style[data-href~="` + Wt(n.href) + `"]`,
						);
						if (r) return ((t.instance = r), j(r), r);
						var a = f({}, n, {
							"data-href": n.href,
							"data-precedence": n.precedence,
							href: null,
							precedence: null,
						});
						return (
							(r = (e.ownerDocument || e).createElement(`style`)),
							j(r),
							Pd(r, `style`, a),
							Lf(r, n.precedence, e),
							(t.instance = r)
						);
					case `stylesheet`:
						a = Af(n.href);
						var o = e.querySelector(jf(a));
						if (o)
							return (
								(t.state.loading |= 4),
								(t.instance = o),
								j(o),
								o
							);
						((r = Mf(n)),
							(a = mf.get(a)) && Rf(r, a),
							(o = (e.ownerDocument || e).createElement(`link`)),
							j(o));
						var s = o;
						return (
							(s._p = new Promise(function (e, t) {
								((s.onload = e), (s.onerror = t));
							})),
							Pd(o, `link`, r),
							(t.state.loading |= 4),
							Lf(o, n.precedence, e),
							(t.instance = o)
						);
					case `script`:
						return (
							(o = Pf(n.src)),
							(a = e.querySelector(Ff(o)))
								? ((t.instance = a), j(a), a)
								: ((r = n),
									(a = mf.get(o)) &&
										((r = f({}, n)), zf(r, a)),
									(e = e.ownerDocument || e),
									(a = e.createElement(`script`)),
									j(a),
									Pd(a, `link`, r),
									e.head.appendChild(a),
									(t.instance = a))
						);
					case `void`:
						return null;
					default:
						throw Error(i(443, t.type));
				}
			else
				t.type === `stylesheet` &&
					!(t.state.loading & 4) &&
					((r = t.instance),
					(t.state.loading |= 4),
					Lf(r, n.precedence, e));
			return t.instance;
		}
		function Lf(e, t, n) {
			for (
				var r = n.querySelectorAll(
						`link[rel="stylesheet"][data-precedence],style[data-precedence]`,
					),
					i = r.length ? r[r.length - 1] : null,
					a = i,
					o = 0;
				o < r.length;
				o++
			) {
				var s = r[o];
				if (s.dataset.precedence === t) a = s;
				else if (a !== i) break;
			}
			a
				? a.parentNode.insertBefore(e, a.nextSibling)
				: ((t = n.nodeType === 9 ? n.head : n),
					t.insertBefore(e, t.firstChild));
		}
		function Rf(e, t) {
			((e.crossOrigin ??= t.crossOrigin),
				(e.referrerPolicy ??= t.referrerPolicy),
				(e.title ??= t.title));
		}
		function zf(e, t) {
			((e.crossOrigin ??= t.crossOrigin),
				(e.referrerPolicy ??= t.referrerPolicy),
				(e.integrity ??= t.integrity));
		}
		var Bf = null;
		function Vf(e, t, n) {
			if (Bf === null) {
				var r = new Map(),
					i = (Bf = new Map());
				i.set(n, r);
			} else
				((i = Bf), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
			if (r.has(e)) return r;
			for (
				r.set(e, null), n = n.getElementsByTagName(e), i = 0;
				i < n.length;
				i++
			) {
				var a = n[i];
				if (
					!(
						a[xt] ||
						a[mt] ||
						(e === `link` && a.getAttribute(`rel`) === `stylesheet`)
					) &&
					a.namespaceURI !== `http://www.w3.org/2000/svg`
				) {
					var o = a.getAttribute(t) || ``;
					o = e + o;
					var s = r.get(o);
					s ? s.push(a) : r.set(o, [a]);
				}
			}
			return r;
		}
		function Hf(e, t, n) {
			((e = e.ownerDocument || e),
				e.head.insertBefore(
					n,
					t === `title` ? e.querySelector(`head > title`) : null,
				));
		}
		function Uf(e, t, n) {
			if (n === 1 || t.itemProp != null) return !1;
			switch (e) {
				case `meta`:
				case `title`:
					return !0;
				case `style`:
					if (
						typeof t.precedence != `string` ||
						typeof t.href != `string` ||
						t.href === ``
					)
						break;
					return !0;
				case `link`:
					if (
						typeof t.rel != `string` ||
						typeof t.href != `string` ||
						t.href === `` ||
						t.onLoad ||
						t.onError
					)
						break;
					switch (t.rel) {
						case `stylesheet`:
							return (
								(e = t.disabled),
								typeof t.precedence == `string` && e == null
							);
						default:
							return !0;
					}
				case `script`:
					if (
						t.async &&
						typeof t.async != `function` &&
						typeof t.async != `symbol` &&
						!t.onLoad &&
						!t.onError &&
						t.src &&
						typeof t.src == `string`
					)
						return !0;
			}
			return !1;
		}
		function Wf(e) {
			return !(e.type === `stylesheet` && !(e.state.loading & 3));
		}
		function Gf(e, t, n, r) {
			if (
				n.type === `stylesheet` &&
				(typeof r.media != `string` ||
					!1 !== matchMedia(r.media).matches) &&
				!(n.state.loading & 4)
			) {
				if (n.instance === null) {
					var i = Af(r.href),
						a = t.querySelector(jf(i));
					if (a) {
						((t = a._p),
							typeof t == `object` &&
								t &&
								typeof t.then == `function` &&
								(e.count++, (e = Jf.bind(e)), t.then(e, e)),
							(n.state.loading |= 4),
							(n.instance = a),
							j(a));
						return;
					}
					((a = t.ownerDocument || t),
						(r = Mf(r)),
						(i = mf.get(i)) && Rf(r, i),
						(a = a.createElement(`link`)),
						j(a));
					var o = a;
					((o._p = new Promise(function (e, t) {
						((o.onload = e), (o.onerror = t));
					})),
						Pd(a, `link`, r),
						(n.instance = a));
				}
				(e.stylesheets === null && (e.stylesheets = new Map()),
					e.stylesheets.set(n, t),
					(t = n.state.preload) &&
						!(n.state.loading & 3) &&
						(e.count++,
						(n = Jf.bind(e)),
						t.addEventListener(`load`, n),
						t.addEventListener(`error`, n)));
			}
		}
		var Kf = 0;
		function qf(e, t) {
			return (
				e.stylesheets && e.count === 0 && Xf(e, e.stylesheets),
				0 < e.count || 0 < e.imgCount
					? function (n) {
							var r = setTimeout(function () {
								if (
									(e.stylesheets && Xf(e, e.stylesheets),
									e.unsuspend)
								) {
									var t = e.unsuspend;
									((e.unsuspend = null), t());
								}
							}, 6e4 + t);
							0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
							var i = setTimeout(
								function () {
									if (
										((e.waitingForImages = !1),
										e.count === 0 &&
											(e.stylesheets &&
												Xf(e, e.stylesheets),
											e.unsuspend))
									) {
										var t = e.unsuspend;
										((e.unsuspend = null), t());
									}
								},
								(e.imgBytes > Kf ? 50 : 800) + t,
							);
							return (
								(e.unsuspend = n),
								function () {
									((e.unsuspend = null),
										clearTimeout(r),
										clearTimeout(i));
								}
							);
						}
					: null
			);
		}
		function Jf() {
			if (
				(this.count--,
				this.count === 0 &&
					(this.imgCount === 0 || !this.waitingForImages))
			) {
				if (this.stylesheets) Xf(this, this.stylesheets);
				else if (this.unsuspend) {
					var e = this.unsuspend;
					((this.unsuspend = null), e());
				}
			}
		}
		var Yf = null;
		function Xf(e, t) {
			((e.stylesheets = null),
				e.unsuspend !== null &&
					(e.count++,
					(Yf = new Map()),
					t.forEach(Zf, e),
					(Yf = null),
					Jf.call(e)));
		}
		function Zf(e, t) {
			if (!(t.state.loading & 4)) {
				var n = Yf.get(e);
				if (n) var r = n.get(null);
				else {
					((n = new Map()), Yf.set(e, n));
					for (
						var i = e.querySelectorAll(
								`link[data-precedence],style[data-precedence]`,
							),
							a = 0;
						a < i.length;
						a++
					) {
						var o = i[a];
						(o.nodeName === `LINK` ||
							o.getAttribute(`media`) !== `not all`) &&
							(n.set(o.dataset.precedence, o), (r = o));
					}
					r && n.set(null, r);
				}
				((i = t.instance),
					(o = i.getAttribute(`data-precedence`)),
					(a = n.get(o) || r),
					a === r && n.set(null, i),
					n.set(o, i),
					this.count++,
					(r = Jf.bind(this)),
					i.addEventListener(`load`, r),
					i.addEventListener(`error`, r),
					a
						? a.parentNode.insertBefore(i, a.nextSibling)
						: ((e = e.nodeType === 9 ? e.head : e),
							e.insertBefore(i, e.firstChild)),
					(t.state.loading |= 4));
			}
		}
		var Qf = {
			$$typeof: b,
			Provider: null,
			Consumer: null,
			_currentValue: se,
			_currentValue2: se,
			_threadCount: 0,
		};
		function $f(e, t, n, r, i, a, o, s, c) {
			((this.tag = 1),
				(this.containerInfo = e),
				(this.pingCache = this.current = this.pendingChildren = null),
				(this.timeoutHandle = -1),
				(this.callbackNode =
					this.next =
					this.pendingContext =
					this.context =
					this.cancelPendingCommit =
						null),
				(this.callbackPriority = 0),
				(this.expirationTimes = rt(-1)),
				(this.entangledLanes =
					this.shellSuspendCounter =
					this.errorRecoveryDisabledLanes =
					this.expiredLanes =
					this.warmLanes =
					this.pingedLanes =
					this.suspendedLanes =
					this.pendingLanes =
						0),
				(this.entanglements = rt(0)),
				(this.hiddenUpdates = rt(null)),
				(this.identifierPrefix = r),
				(this.onUncaughtError = i),
				(this.onCaughtError = a),
				(this.onRecoverableError = o),
				(this.pooledCache = null),
				(this.pooledCacheLanes = 0),
				(this.formState = c),
				(this.incompleteTransitions = new Map()));
		}
		function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
			return (
				(e = new $f(e, t, n, o, c, l, u, d, s)),
				(t = 1),
				!0 === a && (t |= 24),
				(a = di(3, null, null, t)),
				(e.current = a),
				(a.stateNode = e),
				(t = la()),
				t.refCount++,
				(e.pooledCache = t),
				t.refCount++,
				(a.memoizedState = { element: r, isDehydrated: n, cache: t }),
				Ha(a),
				e
			);
		}
		function tp(e) {
			return e ? ((e = li), e) : li;
		}
		function np(e, t, n, r, i, a) {
			((i = tp(i)),
				r.context === null ? (r.context = i) : (r.pendingContext = i),
				(r = Wa(t)),
				(r.payload = { element: n }),
				(a = a === void 0 ? null : a),
				a !== null && (r.callback = a),
				(n = Ga(e, r, t)),
				n !== null && (hu(n, e, t), Ka(n, e, t)));
		}
		function rp(e, t) {
			if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
				var n = e.retryLane;
				e.retryLane = n !== 0 && n < t ? n : t;
			}
		}
		function ip(e, t) {
			(rp(e, t), (e = e.alternate) && rp(e, t));
		}
		function ap(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = oi(e, 67108864);
				(t !== null && hu(t, e, 67108864), ip(e, 67108864));
			}
		}
		function op(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = pu();
				t = lt(t);
				var n = oi(e, t);
				(n !== null && hu(n, e, t), ip(e, t));
			}
		}
		var sp = !0;
		function cp(e, t, n, r) {
			var i = E.T;
			E.T = null;
			var a = D.p;
			try {
				((D.p = 2), up(e, t, n, r));
			} finally {
				((D.p = a), (E.T = i));
			}
		}
		function lp(e, t, n, r) {
			var i = E.T;
			E.T = null;
			var a = D.p;
			try {
				((D.p = 8), up(e, t, n, r));
			} finally {
				((D.p = a), (E.T = i));
			}
		}
		function up(e, t, n, r) {
			if (sp) {
				var i = dp(r);
				if (i === null) (wd(e, t, r, fp, n), Cp(e, r));
				else if (Tp(i, e, t, n, r)) r.stopPropagation();
				else if ((Cp(e, r), t & 4 && -1 < Sp.indexOf(e))) {
					for (; i !== null; ) {
						var a = wt(i);
						if (a !== null)
							switch (a.tag) {
								case 3:
									if (
										((a = a.stateNode),
										a.current.memoizedState.isDehydrated)
									) {
										var o = Qe(a.pendingLanes);
										if (o !== 0) {
											var s = a;
											for (
												s.pendingLanes |= 2,
													s.entangledLanes |= 2;
												o;
											) {
												var c = 1 << (31 - Ge(o));
												((s.entanglements[1] |= c),
													(o &= ~c));
											}
											(rd(a),
												!(K & 6) &&
													((tu = Ne() + 500),
													id(0, !1)));
										}
									}
									break;
								case 31:
								case 13:
									((s = oi(a, 2)),
										s !== null && hu(s, a, 2),
										bu(),
										ip(a, 2));
							}
						if (
							((a = dp(r)),
							a === null && wd(e, t, r, fp, n),
							a === i)
						)
							break;
						i = a;
					}
					i !== null && r.stopPropagation();
				} else wd(e, t, r, null, n);
			}
		}
		function dp(e) {
			return ((e = sn(e)), pp(e));
		}
		var fp = null;
		function pp(e) {
			if (((fp = null), (e = Ct(e)), e !== null)) {
				var t = o(e);
				if (t === null) e = null;
				else {
					var n = t.tag;
					if (n === 13) {
						if (((e = s(t)), e !== null)) return e;
						e = null;
					} else if (n === 31) {
						if (((e = c(t)), e !== null)) return e;
						e = null;
					} else if (n === 3) {
						if (t.stateNode.current.memoizedState.isDehydrated)
							return t.tag === 3
								? t.stateNode.containerInfo
								: null;
						e = null;
					} else t !== e && (e = null);
				}
			}
			return ((fp = e), null);
		}
		function mp(e) {
			switch (e) {
				case `beforetoggle`:
				case `cancel`:
				case `click`:
				case `close`:
				case `contextmenu`:
				case `copy`:
				case `cut`:
				case `auxclick`:
				case `dblclick`:
				case `dragend`:
				case `dragstart`:
				case `drop`:
				case `focusin`:
				case `focusout`:
				case `input`:
				case `invalid`:
				case `keydown`:
				case `keypress`:
				case `keyup`:
				case `mousedown`:
				case `mouseup`:
				case `paste`:
				case `pause`:
				case `play`:
				case `pointercancel`:
				case `pointerdown`:
				case `pointerup`:
				case `ratechange`:
				case `reset`:
				case `resize`:
				case `seeked`:
				case `submit`:
				case `toggle`:
				case `touchcancel`:
				case `touchend`:
				case `touchstart`:
				case `volumechange`:
				case `change`:
				case `selectionchange`:
				case `textInput`:
				case `compositionstart`:
				case `compositionend`:
				case `compositionupdate`:
				case `beforeblur`:
				case `afterblur`:
				case `beforeinput`:
				case `blur`:
				case `fullscreenchange`:
				case `focus`:
				case `hashchange`:
				case `popstate`:
				case `select`:
				case `selectstart`:
					return 2;
				case `drag`:
				case `dragenter`:
				case `dragexit`:
				case `dragleave`:
				case `dragover`:
				case `mousemove`:
				case `mouseout`:
				case `mouseover`:
				case `pointermove`:
				case `pointerout`:
				case `pointerover`:
				case `scroll`:
				case `touchmove`:
				case `wheel`:
				case `mouseenter`:
				case `mouseleave`:
				case `pointerenter`:
				case `pointerleave`:
					return 8;
				case `message`:
					switch (Pe()) {
						case Fe:
							return 2;
						case Ie:
							return 8;
						case Le:
						case Re:
							return 32;
						case ze:
							return 268435456;
						default:
							return 32;
					}
				default:
					return 32;
			}
		}
		var hp = !1,
			gp = null,
			_p = null,
			vp = null,
			yp = new Map(),
			bp = new Map(),
			xp = [],
			Sp =
				`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
					` `,
				);
		function Cp(e, t) {
			switch (e) {
				case `focusin`:
				case `focusout`:
					gp = null;
					break;
				case `dragenter`:
				case `dragleave`:
					_p = null;
					break;
				case `mouseover`:
				case `mouseout`:
					vp = null;
					break;
				case `pointerover`:
				case `pointerout`:
					yp.delete(t.pointerId);
					break;
				case `gotpointercapture`:
				case `lostpointercapture`:
					bp.delete(t.pointerId);
			}
		}
		function wp(e, t, n, r, i, a) {
			return e === null || e.nativeEvent !== a
				? ((e = {
						blockedOn: t,
						domEventName: n,
						eventSystemFlags: r,
						nativeEvent: a,
						targetContainers: [i],
					}),
					t !== null && ((t = wt(t)), t !== null && ap(t)),
					e)
				: ((e.eventSystemFlags |= r),
					(t = e.targetContainers),
					i !== null && t.indexOf(i) === -1 && t.push(i),
					e);
		}
		function Tp(e, t, n, r, i) {
			switch (t) {
				case `focusin`:
					return ((gp = wp(gp, e, t, n, r, i)), !0);
				case `dragenter`:
					return ((_p = wp(_p, e, t, n, r, i)), !0);
				case `mouseover`:
					return ((vp = wp(vp, e, t, n, r, i)), !0);
				case `pointerover`:
					var a = i.pointerId;
					return (
						yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)),
						!0
					);
				case `gotpointercapture`:
					return (
						(a = i.pointerId),
						bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)),
						!0
					);
			}
			return !1;
		}
		function Ep(e) {
			var t = Ct(e.target);
			if (t !== null) {
				var n = o(t);
				if (n !== null) {
					if (((t = n.tag), t === 13)) {
						if (((t = s(n)), t !== null)) {
							((e.blockedOn = t),
								ft(e.priority, function () {
									op(n);
								}));
							return;
						}
					} else if (t === 31) {
						if (((t = c(n)), t !== null)) {
							((e.blockedOn = t),
								ft(e.priority, function () {
									op(n);
								}));
							return;
						}
					} else if (
						t === 3 &&
						n.stateNode.current.memoizedState.isDehydrated
					) {
						e.blockedOn =
							n.tag === 3 ? n.stateNode.containerInfo : null;
						return;
					}
				}
			}
			e.blockedOn = null;
		}
		function Dp(e) {
			if (e.blockedOn !== null) return !1;
			for (var t = e.targetContainers; 0 < t.length; ) {
				var n = dp(e.nativeEvent);
				if (n === null) {
					n = e.nativeEvent;
					var r = new n.constructor(n.type, n);
					((on = r), n.target.dispatchEvent(r), (on = null));
				} else
					return (
						(t = wt(n)),
						t !== null && ap(t),
						(e.blockedOn = n),
						!1
					);
				t.shift();
			}
			return !0;
		}
		function Op(e, t, n) {
			Dp(e) && n.delete(t);
		}
		function kp() {
			((hp = !1),
				gp !== null && Dp(gp) && (gp = null),
				_p !== null && Dp(_p) && (_p = null),
				vp !== null && Dp(vp) && (vp = null),
				yp.forEach(Op),
				bp.forEach(Op));
		}
		function Ap(e, n) {
			e.blockedOn === n &&
				((e.blockedOn = null),
				hp ||
					((hp = !0),
					t.unstable_scheduleCallback(
						t.unstable_NormalPriority,
						kp,
					)));
		}
		var jp = null;
		function Mp(e) {
			jp !== e &&
				((jp = e),
				t.unstable_scheduleCallback(
					t.unstable_NormalPriority,
					function () {
						jp === e && (jp = null);
						for (var t = 0; t < e.length; t += 3) {
							var n = e[t],
								r = e[t + 1],
								i = e[t + 2];
							if (typeof r != `function`) {
								if (pp(r || n) === null) continue;
								break;
							}
							var a = wt(n);
							a !== null &&
								(e.splice(t, 3),
								(t -= 3),
								Es(
									a,
									{
										pending: !0,
										data: i,
										method: n.method,
										action: r,
									},
									r,
									i,
								));
						}
					},
				));
		}
		function Np(e) {
			function t(t) {
				return Ap(t, e);
			}
			(gp !== null && Ap(gp, e),
				_p !== null && Ap(_p, e),
				vp !== null && Ap(vp, e),
				yp.forEach(t),
				bp.forEach(t));
			for (var n = 0; n < xp.length; n++) {
				var r = xp[n];
				r.blockedOn === e && (r.blockedOn = null);
			}
			for (; 0 < xp.length && ((n = xp[0]), n.blockedOn === null); )
				(Ep(n), n.blockedOn === null && xp.shift());
			if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
				for (r = 0; r < n.length; r += 3) {
					var i = n[r],
						a = n[r + 1],
						o = i[ht] || null;
					if (typeof a == `function`) o || Mp(n);
					else if (o) {
						var s = null;
						if (a && a.hasAttribute(`formAction`)) {
							if (((i = a), (o = a[ht] || null)))
								s = o.formAction;
							else if (pp(i) !== null) continue;
						} else s = o.action;
						(typeof s == `function`
							? (n[r + 1] = s)
							: (n.splice(r, 3), (r -= 3)),
							Mp(n));
					}
				}
		}
		function Pp() {
			function e(e) {
				e.canIntercept &&
					e.info === `react-transition` &&
					e.intercept({
						handler: function () {
							return new Promise(function (e) {
								return (i = e);
							});
						},
						focusReset: `manual`,
						scroll: `manual`,
					});
			}
			function t() {
				(i !== null && (i(), (i = null)), r || setTimeout(n, 20));
			}
			function n() {
				if (!r && !navigation.transition) {
					var e = navigation.currentEntry;
					e &&
						e.url != null &&
						navigation.navigate(e.url, {
							state: e.getState(),
							info: `react-transition`,
							history: `replace`,
						});
				}
			}
			if (typeof navigation == `object`) {
				var r = !1,
					i = null;
				return (
					navigation.addEventListener(`navigate`, e),
					navigation.addEventListener(`navigatesuccess`, t),
					navigation.addEventListener(`navigateerror`, t),
					setTimeout(n, 100),
					function () {
						((r = !0),
							navigation.removeEventListener(`navigate`, e),
							navigation.removeEventListener(
								`navigatesuccess`,
								t,
							),
							navigation.removeEventListener(`navigateerror`, t),
							i !== null && (i(), (i = null)));
					}
				);
			}
		}
		function Fp(e) {
			this._internalRoot = e;
		}
		((Ip.prototype.render = Fp.prototype.render =
			function (e) {
				var t = this._internalRoot;
				if (t === null) throw Error(i(409));
				var n = t.current;
				np(n, pu(), e, t, null, null);
			}),
			(Ip.prototype.unmount = Fp.prototype.unmount =
				function () {
					var e = this._internalRoot;
					if (e !== null) {
						this._internalRoot = null;
						var t = e.containerInfo;
						(np(e.current, 2, null, e, null, null),
							bu(),
							(t[gt] = null));
					}
				}));
		function Ip(e) {
			this._internalRoot = e;
		}
		Ip.prototype.unstable_scheduleHydration = function (e) {
			if (e) {
				var t = dt();
				e = { blockedOn: null, target: e, priority: t };
				for (
					var n = 0;
					n < xp.length && t !== 0 && t < xp[n].priority;
					n++
				);
				(xp.splice(n, 0, e), n === 0 && Ep(e));
			}
		};
		var Lp = n.version;
		if (Lp !== `19.2.4`) throw Error(i(527, Lp, `19.2.4`));
		D.findDOMNode = function (e) {
			var t = e._reactInternals;
			if (t === void 0)
				throw typeof e.render == `function`
					? Error(i(188))
					: ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
			return (
				(e = u(t)),
				(e = e === null ? null : d(e)),
				(e = e === null ? null : e.stateNode),
				e
			);
		};
		var Rp = {
			bundleType: 0,
			version: `19.2.4`,
			rendererPackageName: `react-dom`,
			currentDispatcherRef: E,
			reconcilerVersion: `19.2.4`,
		};
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
			var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
			if (!zp.isDisabled && zp.supportsFiber)
				try {
					((He = zp.inject(Rp)), (Ue = zp));
				} catch {}
		}
		e.createRoot = function (e, t) {
			if (!a(e)) throw Error(i(299));
			var n = !1,
				r = ``,
				o = Js,
				s = Ys,
				c = Xs;
			return (
				t != null &&
					(!0 === t.unstable_strictMode && (n = !0),
					t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
					t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
					t.onCaughtError !== void 0 && (s = t.onCaughtError),
					t.onRecoverableError !== void 0 &&
						(c = t.onRecoverableError)),
				(t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp)),
				(e[gt] = t.current),
				Sd(e),
				new Fp(t)
			);
		};
	}),
	Ce = o((e, t) => {
		function n() {
			if (
				!(
					typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
					typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
				)
			)
				try {
					__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
				} catch (e) {
					console.error(e);
				}
		}
		(n(), (t.exports = Se()));
	}),
	we = o((e) => {
		var t = Symbol.for(`react.transitional.element`),
			n = Symbol.for(`react.fragment`);
		function r(e, n, r) {
			var i = null;
			if (
				(r !== void 0 && (i = `` + r),
				n.key !== void 0 && (i = `` + n.key),
				`key` in n)
			)
				for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
			else r = n;
			return (
				(n = r.ref),
				{
					$$typeof: t,
					type: e,
					key: i,
					ref: n === void 0 ? null : n,
					props: r,
				}
			);
		}
		((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
	}),
	Te = o((e, t) => {
		t.exports = we();
	}),
	k = c(_e()),
	Ee = Ce(),
	A = Te(),
	De = (0, Ee.createRoot)(document.getElementById(`root`));
function Oe(e) {
	De.render((0, A.jsx)(k.StrictMode, { children: e }));
}
var ke = o((e, t) => {
		(function () {
			var e = {}.hasOwnProperty;
			function n() {
				for (var e = ``, t = 0; t < arguments.length; t++) {
					var n = arguments[t];
					n && (e = i(e, r(n)));
				}
				return e;
			}
			function r(t) {
				if (typeof t == `string` || typeof t == `number`) return t;
				if (typeof t != `object`) return ``;
				if (Array.isArray(t)) return n.apply(null, t);
				if (
					t.toString !== Object.prototype.toString &&
					!t.toString.toString().includes(`[native code]`)
				)
					return t.toString();
				var r = ``;
				for (var a in t) e.call(t, a) && t[a] && (r = i(r, a));
				return r;
			}
			function i(e, t) {
				return t ? (e ? e + ` ` + t : e + t) : e;
			}
			t !== void 0 && t.exports
				? ((n.default = n), (t.exports = n))
				: typeof define == `function` &&
					  typeof define.amd == `object` &&
					  define.amd
					? define(`classnames`, [], function () {
							return n;
						})
					: (window.classNames = n);
		})();
	}),
	Ae = `_button_474wk_1`,
	je = `_disabled_474wk_30`,
	Me = `_fullWidth_474wk_118`,
	Ne = `_button__leftIcon_474wk_124`,
	Pe = `_button__rightIcon_474wk_125`,
	Fe = {
		button: Ae,
		disabled: je,
		"buttonType-muted": `_buttonType-muted_474wk_34`,
		"buttonType-primary": `_buttonType-primary_474wk_50`,
		"buttonType-negative": `_buttonType-negative_474wk_71`,
		"buttonSize-xxs": `_buttonSize-xxs_474wk_88`,
		"buttonSize-xs": `_buttonSize-xs_474wk_93`,
		"buttonSize-s": `_buttonSize-s_474wk_98`,
		"buttonSize-m": `_buttonSize-m_474wk_103`,
		"buttonSize-l": `_buttonSize-l_474wk_108`,
		"buttonSize-xl": `_buttonSize-xl_474wk_113`,
		fullWidth: Me,
		button__leftIcon: Ne,
		button__rightIcon: Pe,
	},
	Ie = c(ke());
function Le(e) {
	var t,
		n = e.children,
		r = e.className,
		i = e.disabled,
		a = e.buttonType,
		o = a === void 0 ? `muted` : a,
		s = e.buttonSize,
		c = s === void 0 ? `m` : s,
		l = e.fullWidth,
		u = e.onClick,
		d = e.style,
		f = e.leftIcon,
		p = e.rightIcon,
		m = e.type,
		h = m === void 0 ? `button` : m;
	return k.createElement(
		`button`,
		{
			type: h,
			className: (0, Ie.default)(
				Fe.button,
				Fe[`buttonType-${o}`],
				Fe[`buttonSize-${c}`],
				((t = {}), (t[Fe.disabled] = i), (t[Fe.fullWidth] = l), t),
				r,
			),
			disabled: i,
			onClick: u,
			style: d,
		},
		f && k.createElement(`span`, { className: Fe.button__leftIcon }, f),
		n && k.createElement(`span`, null, n),
		p && k.createElement(`span`, { className: Fe.button__rightIcon }, p),
	);
}
var Re = function () {
	return (
		(Re =
			Object.assign ||
			function (e) {
				for (var t, n = 1, r = arguments.length; n < r; n++)
					for (var i in ((t = arguments[n]), t))
						Object.prototype.hasOwnProperty.call(t, i) &&
							(e[i] = t[i]);
				return e;
			}),
		Re.apply(this, arguments)
	);
};
function ze(e) {
	return e === e.toLowerCase()
		? e
		: e.replace(/[A-Z]/g, function (e) {
				return `-${e.toLowerCase()}`;
			});
}
function Be(e, t) {
	return (
		t === void 0 && (t = !1),
		Re(
			{
				padding: t
					? void 0
					: e.bodyPadding
							.map(function (e) {
								return `${e}px`;
							})
							.join(` `),
			},
			Object.fromEntries(
				Object.entries(e.theme).flatMap(function (e) {
					var t = e[0],
						n = e[1];
					return [
						[`--${ze(t)}`, n],
						[
							`--${ze(`${t}RgbComponents`)}`,
							n.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || void 0,
						],
					];
				}),
			),
		)
	);
}
var Ve = {
		themeVariables: `_themeVariables_2dr1w_1`,
		canvas: `_canvas_2dr1w_70`,
	},
	He = (0, k.createContext)(null);
function Ue(e) {
	var t = e.ctx,
		n = e.children,
		r = e.noAutoResizer,
		i = t.mode;
	return (
		(0, k.useEffect)(
			function () {
				if (!r && `startAutoResizer` in t) {
					var e = t;
					return (
						e.startAutoResizer(),
						function () {
							e.stopAutoResizer();
						}
					);
				}
			},
			[i, r],
		),
		k.createElement(
			He.Provider,
			{ value: t },
			k.createElement(
				`div`,
				{
					className: (0, Ie.default)(Ve.themeVariables, Ve.canvas),
					style: Be(t),
				},
				n,
			),
		)
	);
}
var We = { fieldError: `_fieldError_qi0xk_1` };
function Ge(e) {
	var t = e.children;
	return k.createElement(`div`, { className: We.fieldError }, t);
}
var Ke = {
		FieldGroup: `_FieldGroup_uz9ju_1`,
		FieldGroup__item: `_FieldGroup__item_uz9ju_5`,
	},
	qe = function () {
		return (
			(qe =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			qe.apply(this, arguments)
		);
	},
	Je = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	};
function Ye(e) {
	var t = e.children,
		n = e.className,
		r = Je(e, [`children`, `className`]),
		i = (0, Ie.default)(Ke.FieldGroup, n);
	return k.createElement(
		`div`,
		qe({}, r, { className: i }),
		k.Children.map(t, function (e) {
			return (
				e &&
				k.createElement(`div`, { className: Ke.FieldGroup__item }, e)
			);
		}),
	);
}
var Xe = { fieldHint: `_fieldHint_1avon_1` };
function Ze(e) {
	var t = e.children;
	return k.createElement(`div`, { className: Xe.fieldHint }, t);
}
var Qe = function () {
	return (
		(Qe =
			Object.assign ||
			function (e) {
				for (var t, n = 1, r = arguments.length; n < r; n++)
					for (var i in ((t = arguments[n]), t))
						Object.prototype.hasOwnProperty.call(t, i) &&
							(e[i] = t[i]);
				return e;
			}),
		Qe.apply(this, arguments)
	);
};
function $e(e) {
	var t = e.id,
		n = e.label,
		r = e.hint,
		i = e.error,
		a = e.required,
		o = e.formLabelProps,
		s = e.children;
	return k.createElement(
		k.Fragment,
		null,
		k.createElement(
			dt,
			Qe({}, o, { htmlFor: t, required: a, error: !!i }),
			n,
		),
		s,
		i && k.createElement(Ge, null, i),
		r && k.createElement(Ze, null, r),
	);
}
var et = {
		Form: `_Form_5qspp_1`,
		Form__item: `_Form__item_5qspp_5`,
		"Form__item--default": `_Form__item--default_5qspp_13`,
		"Form__item--condensed": `_Form__item--condensed_5qspp_17`,
	},
	tt = function () {
		return (
			(tt =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			tt.apply(this, arguments)
		);
	},
	nt = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	},
	rt = function (e) {
		var t = e.children,
			n = e.className,
			r = e.onSubmit,
			i = e.spacing,
			a = i === void 0 ? `default` : i,
			o = nt(e, [`children`, `className`, `onSubmit`, `spacing`]),
			s = (0, Ie.default)(et.Form, n),
			c = (0, Ie.default)(et.Form__item, et[`Form__item--${a}`]),
			l = (0, k.useCallback)(
				function (e) {
					(e.preventDefault(), r && r(e));
				},
				[r],
			);
		return k.createElement(
			`form`,
			tt({ className: s, onSubmit: l }, o),
			k.Children.map(t, function (e) {
				return e ? k.createElement(`div`, { className: c }, e) : null;
			}),
		);
	},
	it = `_formLabel_tcjrv_1`,
	at = `_formLabel__code_tcjrv_8`,
	ot = `_formLabel__label_tcjrv_18`,
	st = `_formLabel__required_tcjrv_30`,
	ct = {
		formLabel: it,
		formLabel__code: at,
		"formLabel--error": `_formLabel--error_tcjrv_14`,
		formLabel__label: ot,
		formLabel__required: st,
	},
	lt = function () {
		return (
			(lt =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			lt.apply(this, arguments)
		);
	},
	ut = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	},
	dt = function (e) {
		var t,
			n = e.children,
			r = e.className,
			i = e.htmlFor,
			a = e.code,
			o = e.required,
			s = o === void 0 ? !1 : o,
			c = e.error,
			l = c === void 0 ? !1 : c,
			u = ut(e, [
				`children`,
				`className`,
				`htmlFor`,
				`code`,
				`required`,
				`error`,
			]),
			d = (0, Ie.default)(
				ct.formLabel,
				r,
				((t = {}), (t[ct[`formLabel--error`]] = l), t),
			);
		return k.createElement(
			`label`,
			lt({ className: d, htmlFor: i }, u),
			k.createElement(
				`span`,
				{ className: ct.formLabel__label },
				n,
				s &&
					k.createElement(
						`span`,
						{ className: ct.formLabel__required },
						`*`,
					),
			),
			a && k.createElement(`span`, { className: ct.formLabel__code }, a),
		);
	},
	ft = `_Section_zh95u_1`,
	pt = `_pageContentSectionHighligh_zh95u_1`,
	mt = `_Section__header_zh95u_19`,
	ht = `_Section__title_zh95u_38`,
	gt = `_Section__title__content_zh95u_52`,
	_t = `_Section__arrow_zh95u_55`,
	vt = {
		Section: ft,
		"Section--highlighted": `_Section--highlighted_zh95u_5`,
		pageContentSectionHighligh: pt,
		Section__header: mt,
		Section__title: ht,
		Section__title__content: gt,
		Section__arrow: _t,
		"Section__arrow--is-open": `_Section__arrow--is-open_zh95u_82`,
	};
function yt(e) {
	var t,
		n,
		r = e.title,
		i = e.children,
		a = e.highlighted,
		o = e.collapsible,
		s = e.headerClassName,
		c = e.titleClassName,
		l = e.headerStyle,
		u = e.titleStyle;
	return k.createElement(
		`div`,
		{
			className: (0, Ie.default)(
				vt.Section,
				((t = {}), (t[vt[`Section--highlighted`]] = a), t),
			),
		},
		k.createElement(
			`div`,
			{ className: (0, Ie.default)(vt.Section__header, s), style: l },
			k.createElement(
				`div`,
				{ className: (0, Ie.default)(vt.Section__title, c), style: u },
				o &&
					k.createElement(`button`, {
						type: `button`,
						className: (0, Ie.default)(
							vt.Section__arrow,
							((n = {}),
							(n[vt[`Section__arrow--is-open`]] = o.isOpen),
							n),
						),
						onClick: o.onToggle,
					}),
				k.createElement(
					`div`,
					{ className: vt.Section__title__content },
					r,
				),
			),
		),
		(!o || o.isOpen) && i,
	);
}
var bt = function () {
	return (
		(bt =
			Object.assign ||
			function (e) {
				for (var t, n = 1, r = arguments.length; n < r; n++)
					for (var i in ((t = arguments[n]), t))
						Object.prototype.hasOwnProperty.call(t, i) &&
							(e[i] = t[i]);
				return e;
			}),
		bt.apply(this, arguments)
	);
};
function xt(e) {
	var t = e.id,
		n = e.name,
		r = e.label,
		i = e.hint,
		a = e.error,
		o = e.required,
		s = e.placeholder,
		c = e.formLabelProps,
		l = e.value,
		u = e.onChange,
		d = e.selectInputProps;
	return k.createElement(
		$e,
		{ formLabelProps: c, id: t, required: o, error: a, hint: i, label: r },
		k.createElement(
			Fs,
			bt({}, d, {
				id: t,
				name: n,
				value: l,
				placeholder: s,
				onChange: u,
				error: !!a,
			}),
		),
	);
}
function St(e) {
	"@babel/helpers - typeof";
	return (
		(St =
			typeof Symbol == `function` && typeof Symbol.iterator == `symbol`
				? function (e) {
						return typeof e;
					}
				: function (e) {
						return e &&
							typeof Symbol == `function` &&
							e.constructor === Symbol &&
							e !== Symbol.prototype
							? `symbol`
							: typeof e;
					}),
		St(e)
	);
}
function Ct(e, t) {
	if (St(e) != `object` || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || `default`);
		if (St(r) != `object`) return r;
		throw TypeError(`@@toPrimitive must return a primitive value.`);
	}
	return (t === `string` ? String : Number)(e);
}
function wt(e) {
	var t = Ct(e, `string`);
	return St(t) == `symbol` ? t : t + ``;
}
function Tt(e, t, n) {
	return (
		(t = wt(t)) in e
			? Object.defineProperty(e, t, {
					value: n,
					enumerable: !0,
					configurable: !0,
					writable: !0,
				})
			: (e[t] = n),
		e
	);
}
function Et(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		(t &&
			(r = r.filter(function (t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable;
			})),
			n.push.apply(n, r));
	}
	return n;
}
function j(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2
			? Et(Object(n), !0).forEach(function (t) {
					Tt(e, t, n[t]);
				})
			: Object.getOwnPropertyDescriptors
				? Object.defineProperties(
						e,
						Object.getOwnPropertyDescriptors(n),
					)
				: Et(Object(n)).forEach(function (t) {
						Object.defineProperty(
							e,
							t,
							Object.getOwnPropertyDescriptor(n, t),
						);
					});
	}
	return e;
}
function Dt(e) {
	if (Array.isArray(e)) return e;
}
function Ot(e, t) {
	var n =
		e == null
			? null
			: (typeof Symbol < `u` && e[Symbol.iterator]) || e[`@@iterator`];
	if (n != null) {
		var r,
			i,
			a,
			o,
			s = [],
			c = !0,
			l = !1;
		try {
			if (((a = (n = n.call(e)).next), t === 0)) {
				if (Object(n) !== n) return;
				c = !1;
			} else
				for (
					;
					!(c = (r = a.call(n)).done) &&
					(s.push(r.value), s.length !== t);
					c = !0
				);
		} catch (e) {
			((l = !0), (i = e));
		} finally {
			try {
				if (
					!c &&
					n.return != null &&
					((o = n.return()), Object(o) !== o)
				)
					return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function kt(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function At(e, t) {
	if (e) {
		if (typeof e == `string`) return kt(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return (
			n === `Object` && e.constructor && (n = e.constructor.name),
			n === `Map` || n === `Set`
				? Array.from(e)
				: n === `Arguments` ||
					  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
					? kt(e, t)
					: void 0
		);
	}
}
function jt() {
	throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Mt(e, t) {
	return Dt(e) || Ot(e, t) || At(e, t) || jt();
}
function Nt(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e)
		if ({}.hasOwnProperty.call(e, r)) {
			if (t.indexOf(r) !== -1) continue;
			n[r] = e[r];
		}
	return n;
}
function Pt(e, t) {
	if (e == null) return {};
	var n,
		r,
		i = Nt(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++)
			((n = a[r]),
				t.indexOf(n) === -1 &&
					{}.propertyIsEnumerable.call(e, n) &&
					(i[n] = e[n]));
	}
	return i;
}
var Ft = [
	`defaultInputValue`,
	`defaultMenuIsOpen`,
	`defaultValue`,
	`inputValue`,
	`menuIsOpen`,
	`onChange`,
	`onInputChange`,
	`onMenuClose`,
	`onMenuOpen`,
	`value`,
];
function It(e) {
	var t = e.defaultInputValue,
		n = t === void 0 ? `` : t,
		r = e.defaultMenuIsOpen,
		i = r === void 0 ? !1 : r,
		a = e.defaultValue,
		o = a === void 0 ? null : a,
		s = e.inputValue,
		c = e.menuIsOpen,
		l = e.onChange,
		u = e.onInputChange,
		d = e.onMenuClose,
		f = e.onMenuOpen,
		p = e.value,
		m = Pt(e, Ft),
		h = Mt((0, k.useState)(s === void 0 ? n : s), 2),
		g = h[0],
		_ = h[1],
		v = Mt((0, k.useState)(c === void 0 ? i : c), 2),
		y = v[0],
		b = v[1],
		x = Mt((0, k.useState)(p === void 0 ? o : p), 2),
		S = x[0],
		C = x[1],
		w = (0, k.useCallback)(
			function (e, t) {
				(typeof l == `function` && l(e, t), C(e));
			},
			[l],
		),
		ee = (0, k.useCallback)(
			function (e, t) {
				var n;
				(typeof u == `function` && (n = u(e, t)),
					_(n === void 0 ? e : n));
			},
			[u],
		),
		T = (0, k.useCallback)(
			function () {
				(typeof f == `function` && f(), b(!0));
			},
			[f],
		),
		te = (0, k.useCallback)(
			function () {
				(typeof d == `function` && d(), b(!1));
			},
			[d],
		),
		ne = s === void 0 ? g : s,
		re = c === void 0 ? y : c,
		ie = p === void 0 ? S : p;
	return j(
		j({}, m),
		{},
		{
			inputValue: ne,
			menuIsOpen: re,
			onChange: w,
			onInputChange: ee,
			onMenuClose: te,
			onMenuOpen: T,
			value: ie,
		},
	);
}
function M() {
	return (
		(M = Object.assign
			? Object.assign.bind()
			: function (e) {
					for (var t = 1; t < arguments.length; t++) {
						var n = arguments[t];
						for (var r in n)
							({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
					}
					return e;
				}),
		M.apply(null, arguments)
	);
}
function Lt(e, t) {
	if (!(e instanceof t)) throw TypeError(`Cannot call a class as a function`);
}
function Rt(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		((r.enumerable = r.enumerable || !1),
			(r.configurable = !0),
			`value` in r && (r.writable = !0),
			Object.defineProperty(e, wt(r.key), r));
	}
}
function zt(e, t, n) {
	return (
		t && Rt(e.prototype, t),
		n && Rt(e, n),
		Object.defineProperty(e, `prototype`, { writable: !1 }),
		e
	);
}
function Bt(e, t) {
	return (
		(Bt = Object.setPrototypeOf
			? Object.setPrototypeOf.bind()
			: function (e, t) {
					return ((e.__proto__ = t), e);
				}),
		Bt(e, t)
	);
}
function Vt(e, t) {
	if (typeof t != `function` && t !== null)
		throw TypeError(`Super expression must either be null or a function`);
	((e.prototype = Object.create(t && t.prototype, {
		constructor: { value: e, writable: !0, configurable: !0 },
	})),
		Object.defineProperty(e, `prototype`, { writable: !1 }),
		t && Bt(e, t));
}
function Ht(e) {
	return (
		(Ht = Object.setPrototypeOf
			? Object.getPrototypeOf.bind()
			: function (e) {
					return e.__proto__ || Object.getPrototypeOf(e);
				}),
		Ht(e)
	);
}
function Ut() {
	try {
		var e = !Boolean.prototype.valueOf.call(
			Reflect.construct(Boolean, [], function () {}),
		);
	} catch {}
	return (Ut = function () {
		return !!e;
	})();
}
function Wt(e) {
	if (e === void 0)
		throw ReferenceError(
			`this hasn't been initialised - super() hasn't been called`,
		);
	return e;
}
function Gt(e, t) {
	if (t && (St(t) == `object` || typeof t == `function`)) return t;
	if (t !== void 0)
		throw TypeError(
			`Derived constructors may only return object or undefined`,
		);
	return Wt(e);
}
function Kt(e) {
	var t = Ut();
	return function () {
		var n,
			r = Ht(e);
		if (t) {
			var i = Ht(this).constructor;
			n = Reflect.construct(r, arguments, i);
		} else n = r.apply(this, arguments);
		return Gt(this, n);
	};
}
function qt(e) {
	if (Array.isArray(e)) return kt(e);
}
function Jt(e) {
	if (
		(typeof Symbol < `u` && e[Symbol.iterator] != null) ||
		e[`@@iterator`] != null
	)
		return Array.from(e);
}
function Yt() {
	throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xt(e) {
	return qt(e) || Jt(e) || At(e) || Yt();
}
var Zt = !1;
function Qt(e) {
	if (e.sheet) return e.sheet;
	for (var t = 0; t < document.styleSheets.length; t++)
		if (document.styleSheets[t].ownerNode === e)
			return document.styleSheets[t];
}
function $t(e) {
	var t = document.createElement(`style`);
	return (
		t.setAttribute(`data-emotion`, e.key),
		e.nonce !== void 0 && t.setAttribute(`nonce`, e.nonce),
		t.appendChild(document.createTextNode(``)),
		t.setAttribute(`data-s`, ``),
		t
	);
}
var en = (function () {
		function e(e) {
			var t = this;
			((this._insertTag = function (e) {
				var n =
					t.tags.length === 0
						? t.insertionPoint
							? t.insertionPoint.nextSibling
							: t.prepend
								? t.container.firstChild
								: t.before
						: t.tags[t.tags.length - 1].nextSibling;
				(t.container.insertBefore(e, n), t.tags.push(e));
			}),
				(this.isSpeedy = e.speedy === void 0 ? !Zt : e.speedy),
				(this.tags = []),
				(this.ctr = 0),
				(this.nonce = e.nonce),
				(this.key = e.key),
				(this.container = e.container),
				(this.prepend = e.prepend),
				(this.insertionPoint = e.insertionPoint),
				(this.before = null));
		}
		var t = e.prototype;
		return (
			(t.hydrate = function (e) {
				e.forEach(this._insertTag);
			}),
			(t.insert = function (e) {
				this.ctr % (this.isSpeedy ? 65e3 : 1) == 0 &&
					this._insertTag($t(this));
				var t = this.tags[this.tags.length - 1];
				if (this.isSpeedy) {
					var n = Qt(t);
					try {
						n.insertRule(e, n.cssRules.length);
					} catch {}
				} else t.appendChild(document.createTextNode(e));
				this.ctr++;
			}),
			(t.flush = function () {
				(this.tags.forEach(function (e) {
					return e.parentNode?.removeChild(e);
				}),
					(this.tags = []),
					(this.ctr = 0));
			}),
			e
		);
	})(),
	tn = `-ms-`,
	nn = `-moz-`,
	N = `-webkit-`,
	rn = `comm`,
	an = `rule`,
	on = `decl`,
	sn = `@import`,
	cn = `@keyframes`,
	ln = `@layer`,
	un = Math.abs,
	dn = String.fromCharCode,
	fn = Object.assign;
function pn(e, t) {
	return _n(e, 0) ^ 45
		? (((((((t << 2) ^ _n(e, 0)) << 2) ^ _n(e, 1)) << 2) ^ _n(e, 2)) << 2) ^
				_n(e, 3)
		: 0;
}
function mn(e) {
	return e.trim();
}
function hn(e, t) {
	return (e = t.exec(e)) ? e[0] : e;
}
function P(e, t, n) {
	return e.replace(t, n);
}
function gn(e, t) {
	return e.indexOf(t);
}
function _n(e, t) {
	return e.charCodeAt(t) | 0;
}
function vn(e, t, n) {
	return e.slice(t, n);
}
function yn(e) {
	return e.length;
}
function bn(e) {
	return e.length;
}
function xn(e, t) {
	return (t.push(e), e);
}
function Sn(e, t) {
	return e.map(t).join(``);
}
var Cn = 1,
	wn = 1,
	Tn = 0,
	En = 0,
	Dn = 0,
	On = ``;
function kn(e, t, n, r, i, a, o) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: Cn,
		column: wn,
		length: o,
		return: ``,
	};
}
function An(e, t) {
	return fn(
		kn(``, null, null, ``, null, null, 0),
		e,
		{ length: -e.length },
		t,
	);
}
function jn() {
	return Dn;
}
function Mn() {
	return (
		(Dn = En > 0 ? _n(On, --En) : 0),
		wn--,
		Dn === 10 && ((wn = 1), Cn--),
		Dn
	);
}
function Nn() {
	return (
		(Dn = En < Tn ? _n(On, En++) : 0),
		wn++,
		Dn === 10 && ((wn = 1), Cn++),
		Dn
	);
}
function Pn() {
	return _n(On, En);
}
function Fn() {
	return En;
}
function In(e, t) {
	return vn(On, e, t);
}
function Ln(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32:
			return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125:
			return 4;
		case 58:
			return 3;
		case 34:
		case 39:
		case 40:
		case 91:
			return 2;
		case 41:
		case 93:
			return 1;
	}
	return 0;
}
function Rn(e) {
	return ((Cn = wn = 1), (Tn = yn((On = e))), (En = 0), []);
}
function zn(e) {
	return ((On = ``), e);
}
function Bn(e) {
	return mn(In(En - 1, Un(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Vn(e) {
	for (; (Dn = Pn()) && Dn < 33; ) Nn();
	return Ln(e) > 2 || Ln(Dn) > 3 ? `` : ` `;
}
function Hn(e, t) {
	for (
		;
		--t &&
		Nn() &&
		!(Dn < 48 || Dn > 102 || (Dn > 57 && Dn < 65) || (Dn > 70 && Dn < 97));
	);
	return In(e, Fn() + (t < 6 && Pn() == 32 && Nn() == 32));
}
function Un(e) {
	for (; Nn(); )
		switch (Dn) {
			case e:
				return En;
			case 34:
			case 39:
				e !== 34 && e !== 39 && Un(Dn);
				break;
			case 40:
				e === 41 && Un(e);
				break;
			case 92:
				Nn();
				break;
		}
	return En;
}
function Wn(e, t) {
	for (; Nn() && e + Dn !== 57 && !(e + Dn === 84 && Pn() === 47); );
	return `/*` + In(t, En - 1) + `*` + dn(e === 47 ? e : Nn());
}
function Gn(e) {
	for (; !Ln(Pn()); ) Nn();
	return In(e, En);
}
function Kn(e) {
	return zn(qn(``, null, null, null, [``], (e = Rn(e)), 0, [0], e));
}
function qn(e, t, n, r, i, a, o, s, c) {
	for (
		var l = 0,
			u = 0,
			d = o,
			f = 0,
			p = 0,
			m = 0,
			h = 1,
			g = 1,
			_ = 1,
			v = 0,
			y = ``,
			b = i,
			x = a,
			S = r,
			C = y;
		g;
	)
		switch (((m = v), (v = Nn()))) {
			case 40:
				if (m != 108 && _n(C, d - 1) == 58) {
					gn((C += P(Bn(v), `&`, `&\f`)), `&\f`) != -1 && (_ = -1);
					break;
				}
			case 34:
			case 39:
			case 91:
				C += Bn(v);
				break;
			case 9:
			case 10:
			case 13:
			case 32:
				C += Vn(m);
				break;
			case 92:
				C += Hn(Fn() - 1, 7);
				continue;
			case 47:
				switch (Pn()) {
					case 42:
					case 47:
						xn(Yn(Wn(Nn(), Fn()), t, n), c);
						break;
					default:
						C += `/`;
				}
				break;
			case 123 * h:
				s[l++] = yn(C) * _;
			case 125 * h:
			case 59:
			case 0:
				switch (v) {
					case 0:
					case 125:
						g = 0;
					case 59 + u:
						(_ == -1 && (C = P(C, /\f/g, ``)),
							p > 0 &&
								yn(C) - d &&
								xn(
									p > 32
										? Xn(C + `;`, r, n, d - 1)
										: Xn(P(C, ` `, ``) + `;`, r, n, d - 2),
									c,
								));
						break;
					case 59:
						C += `;`;
					default:
						if (
							(xn(
								(S = Jn(
									C,
									t,
									n,
									l,
									u,
									i,
									s,
									y,
									(b = []),
									(x = []),
									d,
								)),
								a,
							),
							v === 123)
						)
							if (u === 0) qn(C, t, S, S, b, a, d, s, x);
							else
								switch (
									f === 99 && _n(C, 3) === 110 ? 100 : f
								) {
									case 100:
									case 108:
									case 109:
									case 115:
										qn(
											e,
											S,
											S,
											r &&
												xn(
													Jn(
														e,
														S,
														S,
														0,
														0,
														i,
														s,
														y,
														i,
														(b = []),
														d,
													),
													x,
												),
											i,
											x,
											d,
											s,
											r ? b : x,
										);
										break;
									default:
										qn(C, S, S, S, [``], x, 0, s, x);
								}
				}
				((l = u = p = 0), (h = _ = 1), (y = C = ``), (d = o));
				break;
			case 58:
				((d = 1 + yn(C)), (p = m));
			default:
				if (h < 1) {
					if (v == 123) --h;
					else if (v == 125 && h++ == 0 && Mn() == 125) continue;
				}
				switch (((C += dn(v)), v * h)) {
					case 38:
						_ = u > 0 ? 1 : ((C += `\f`), -1);
						break;
					case 44:
						((s[l++] = (yn(C) - 1) * _), (_ = 1));
						break;
					case 64:
						(Pn() === 45 && (C += Bn(Nn())),
							(f = Pn()),
							(u = d = yn((y = C += Gn(Fn())))),
							v++);
						break;
					case 45:
						m === 45 && yn(C) == 2 && (h = 0);
				}
		}
	return a;
}
function Jn(e, t, n, r, i, a, o, s, c, l, u) {
	for (
		var d = i - 1, f = i === 0 ? a : [``], p = bn(f), m = 0, h = 0, g = 0;
		m < r;
		++m
	)
		for (
			var _ = 0, v = vn(e, d + 1, (d = un((h = o[m])))), y = e;
			_ < p;
			++_
		)
			(y = mn(h > 0 ? f[_] + ` ` + v : P(v, /&\f/g, f[_]))) &&
				(c[g++] = y);
	return kn(e, t, n, i === 0 ? an : s, c, l, u);
}
function Yn(e, t, n) {
	return kn(e, t, n, rn, dn(jn()), vn(e, 2, -2), 0);
}
function Xn(e, t, n, r) {
	return kn(e, t, n, on, vn(e, 0, r), vn(e, r + 1, -1), r);
}
function Zn(e, t) {
	for (var n = ``, r = bn(e), i = 0; i < r; i++) n += t(e[i], i, e, t) || ``;
	return n;
}
function Qn(e, t, n, r) {
	switch (e.type) {
		case ln:
			if (e.children.length) break;
		case sn:
		case on:
			return (e.return = e.return || e.value);
		case rn:
			return ``;
		case cn:
			return (e.return = e.value + `{` + Zn(e.children, r) + `}`);
		case an:
			e.value = e.props.join(`,`);
	}
	return yn((n = Zn(e.children, r)))
		? (e.return = e.value + `{` + n + `}`)
		: ``;
}
function $n(e) {
	var t = bn(e);
	return function (n, r, i, a) {
		for (var o = ``, s = 0; s < t; s++) o += e[s](n, r, i, a) || ``;
		return o;
	};
}
function er(e) {
	return function (t) {
		t.root || ((t = t.return) && e(t));
	};
}
function tr(e) {
	var t = Object.create(null);
	return function (n) {
		return (t[n] === void 0 && (t[n] = e(n)), t[n]);
	};
}
var nr = function (e, t, n) {
		for (
			var r = 0, i = 0;
			(r = i), (i = Pn()), r === 38 && i === 12 && (t[n] = 1), !Ln(i);
		)
			Nn();
		return In(e, En);
	},
	rr = function (e, t) {
		var n = -1,
			r = 44;
		do
			switch (Ln(r)) {
				case 0:
					(r === 38 && Pn() === 12 && (t[n] = 1),
						(e[n] += nr(En - 1, t, n)));
					break;
				case 2:
					e[n] += Bn(r);
					break;
				case 4:
					if (r === 44) {
						((e[++n] = Pn() === 58 ? `&\f` : ``),
							(t[n] = e[n].length));
						break;
					}
				default:
					e[n] += dn(r);
			}
		while ((r = Nn()));
		return e;
	},
	ir = function (e, t) {
		return zn(rr(Rn(e), t));
	},
	ar = new WeakMap(),
	or = function (e) {
		if (!(e.type !== `rule` || !e.parent || e.length < 1)) {
			for (
				var t = e.value,
					n = e.parent,
					r = e.column === n.column && e.line === n.line;
				n.type !== `rule`;
			)
				if (((n = n.parent), !n)) return;
			if (
				!(
					e.props.length === 1 &&
					t.charCodeAt(0) !== 58 &&
					!ar.get(n)
				) &&
				!r
			) {
				ar.set(e, !0);
				for (
					var i = [], a = ir(t, i), o = n.props, s = 0, c = 0;
					s < a.length;
					s++
				)
					for (var l = 0; l < o.length; l++, c++)
						e.props[c] = i[s]
							? a[s].replace(/&\f/g, o[l])
							: o[l] + ` ` + a[s];
			}
		}
	},
	sr = function (e) {
		if (e.type === `decl`) {
			var t = e.value;
			t.charCodeAt(0) === 108 &&
				t.charCodeAt(2) === 98 &&
				((e.return = ``), (e.value = ``));
		}
	};
function cr(e, t) {
	switch (pn(e, t)) {
		case 5103:
			return N + `print-` + e + e;
		case 5737:
		case 4201:
		case 3177:
		case 3433:
		case 1641:
		case 4457:
		case 2921:
		case 5572:
		case 6356:
		case 5844:
		case 3191:
		case 6645:
		case 3005:
		case 6391:
		case 5879:
		case 5623:
		case 6135:
		case 4599:
		case 4855:
		case 4215:
		case 6389:
		case 5109:
		case 5365:
		case 5621:
		case 3829:
			return N + e + e;
		case 5349:
		case 4246:
		case 4810:
		case 6968:
		case 2756:
			return N + e + nn + e + tn + e + e;
		case 6828:
		case 4268:
			return N + e + tn + e + e;
		case 6165:
			return N + e + tn + `flex-` + e + e;
		case 5187:
			return (
				N +
				e +
				P(e, /(\w+).+(:[^]+)/, N + `box-$1$2` + tn + `flex-$1$2`) +
				e
			);
		case 5443:
			return N + e + tn + `flex-item-` + P(e, /flex-|-self/, ``) + e;
		case 4675:
			return (
				N +
				e +
				tn +
				`flex-line-pack` +
				P(e, /align-content|flex-|-self/, ``) +
				e
			);
		case 5548:
			return N + e + tn + P(e, `shrink`, `negative`) + e;
		case 5292:
			return N + e + tn + P(e, `basis`, `preferred-size`) + e;
		case 6060:
			return (
				N +
				`box-` +
				P(e, `-grow`, ``) +
				N +
				e +
				tn +
				P(e, `grow`, `positive`) +
				e
			);
		case 4554:
			return N + P(e, /([^-])(transform)/g, `$1` + N + `$2`) + e;
		case 6187:
			return (
				P(
					P(P(e, /(zoom-|grab)/, N + `$1`), /(image-set)/, N + `$1`),
					e,
					``,
				) + e
			);
		case 5495:
		case 3959:
			return P(e, /(image-set\([^]*)/, N + "$1$`$1");
		case 4968:
			return (
				P(
					P(
						e,
						/(.+:)(flex-)?(.*)/,
						N + `box-pack:$3` + tn + `flex-pack:$3`,
					),
					/s.+-b[^;]+/,
					`justify`,
				) +
				N +
				e +
				e
			);
		case 4095:
		case 3583:
		case 4068:
		case 2532:
			return P(e, /(.+)-inline(.+)/, N + `$1$2`) + e;
		case 8116:
		case 7059:
		case 5753:
		case 5535:
		case 5445:
		case 5701:
		case 4933:
		case 4677:
		case 5533:
		case 5789:
		case 5021:
		case 4765:
			if (yn(e) - 1 - t > 6)
				switch (_n(e, t + 1)) {
					case 109:
						if (_n(e, t + 4) !== 45) break;
					case 102:
						return (
							P(
								e,
								/(.+:)(.+)-([^]+)/,
								`$1` +
									N +
									`$2-$3$1` +
									nn +
									(_n(e, t + 3) == 108 ? `$3` : `$2-$3`),
							) + e
						);
					case 115:
						return ~gn(e, `stretch`)
							? cr(P(e, `stretch`, `fill-available`), t) + e
							: e;
				}
			break;
		case 4949:
			if (_n(e, t + 1) !== 115) break;
		case 6444:
			switch (_n(e, yn(e) - 3 - (~gn(e, `!important`) && 10))) {
				case 107:
					return P(e, `:`, `:` + N) + e;
				case 101:
					return (
						P(
							e,
							/(.+:)([^;!]+)(;|!.+)?/,
							`$1` +
								N +
								(_n(e, 14) === 45 ? `inline-` : ``) +
								`box$3$1` +
								N +
								`$2$3$1` +
								tn +
								`$2box$3`,
						) + e
					);
			}
			break;
		case 5936:
			switch (_n(e, t + 11)) {
				case 114:
					return N + e + tn + P(e, /[svh]\w+-[tblr]{2}/, `tb`) + e;
				case 108:
					return N + e + tn + P(e, /[svh]\w+-[tblr]{2}/, `tb-rl`) + e;
				case 45:
					return N + e + tn + P(e, /[svh]\w+-[tblr]{2}/, `lr`) + e;
			}
			return N + e + tn + e + e;
	}
	return e;
}
var lr = [
		function (e, t, n, r) {
			if (e.length > -1 && !e.return)
				switch (e.type) {
					case on:
						e.return = cr(e.value, e.length);
						break;
					case cn:
						return Zn(
							[An(e, { value: P(e.value, `@`, `@` + N) })],
							r,
						);
					case an:
						if (e.length)
							return Sn(e.props, function (t) {
								switch (hn(t, /(::plac\w+|:read-\w+)/)) {
									case `:read-only`:
									case `:read-write`:
										return Zn(
											[
												An(e, {
													props: [
														P(
															t,
															/:(read-\w+)/,
															`:` + nn + `$1`,
														),
													],
												}),
											],
											r,
										);
									case `::placeholder`:
										return Zn(
											[
												An(e, {
													props: [
														P(
															t,
															/:(plac\w+)/,
															`:` +
																N +
																`input-$1`,
														),
													],
												}),
												An(e, {
													props: [
														P(
															t,
															/:(plac\w+)/,
															`:` + nn + `$1`,
														),
													],
												}),
												An(e, {
													props: [
														P(
															t,
															/:(plac\w+)/,
															tn + `input-$1`,
														),
													],
												}),
											],
											r,
										);
								}
								return ``;
							});
				}
		},
	],
	ur = function (e) {
		var t = e.key;
		if (t === `css`) {
			var n = document.querySelectorAll(
				`style[data-emotion]:not([data-s])`,
			);
			Array.prototype.forEach.call(n, function (e) {
				e.getAttribute(`data-emotion`).indexOf(` `) !== -1 &&
					(document.head.appendChild(e),
					e.setAttribute(`data-s`, ``));
			});
		}
		var r = e.stylisPlugins || lr,
			i = {},
			a,
			o = [];
		((a = e.container || document.head),
			Array.prototype.forEach.call(
				document.querySelectorAll(`style[data-emotion^="` + t + ` "]`),
				function (e) {
					for (
						var t = e.getAttribute(`data-emotion`).split(` `),
							n = 1;
						n < t.length;
						n++
					)
						i[t[n]] = !0;
					o.push(e);
				},
			));
		var s,
			c = [or, sr],
			l,
			u = [
				Qn,
				er(function (e) {
					l.insert(e);
				}),
			],
			d = $n(c.concat(r, u)),
			f = function (e) {
				return Zn(Kn(e), d);
			};
		s = function (e, t, n, r) {
			((l = n),
				f(e ? e + `{` + t.styles + `}` : t.styles),
				r && (p.inserted[t.name] = !0));
		};
		var p = {
			key: t,
			sheet: new en({
				key: t,
				container: a,
				nonce: e.nonce,
				speedy: e.speedy,
				prepend: e.prepend,
				insertionPoint: e.insertionPoint,
			}),
			nonce: e.nonce,
			inserted: i,
			registered: {},
			insert: s,
		};
		return (p.sheet.hydrate(o), p);
	},
	dr = o((e) => {
		var t = typeof Symbol == `function` && Symbol.for,
			n = t ? Symbol.for(`react.element`) : 60103,
			r = t ? Symbol.for(`react.portal`) : 60106,
			i = t ? Symbol.for(`react.fragment`) : 60107,
			a = t ? Symbol.for(`react.strict_mode`) : 60108,
			o = t ? Symbol.for(`react.profiler`) : 60114,
			s = t ? Symbol.for(`react.provider`) : 60109,
			c = t ? Symbol.for(`react.context`) : 60110,
			l = t ? Symbol.for(`react.async_mode`) : 60111,
			u = t ? Symbol.for(`react.concurrent_mode`) : 60111,
			d = t ? Symbol.for(`react.forward_ref`) : 60112,
			f = t ? Symbol.for(`react.suspense`) : 60113,
			p = t ? Symbol.for(`react.suspense_list`) : 60120,
			m = t ? Symbol.for(`react.memo`) : 60115,
			h = t ? Symbol.for(`react.lazy`) : 60116,
			g = t ? Symbol.for(`react.block`) : 60121,
			_ = t ? Symbol.for(`react.fundamental`) : 60117,
			v = t ? Symbol.for(`react.responder`) : 60118,
			y = t ? Symbol.for(`react.scope`) : 60119;
		function b(e) {
			if (typeof e == `object` && e) {
				var t = e.$$typeof;
				switch (t) {
					case n:
						switch (((e = e.type), e)) {
							case l:
							case u:
							case i:
							case o:
							case a:
							case f:
								return e;
							default:
								switch (((e &&= e.$$typeof), e)) {
									case c:
									case d:
									case h:
									case m:
									case s:
										return e;
									default:
										return t;
								}
						}
					case r:
						return t;
				}
			}
		}
		function x(e) {
			return b(e) === u;
		}
		((e.AsyncMode = l),
			(e.ConcurrentMode = u),
			(e.ContextConsumer = c),
			(e.ContextProvider = s),
			(e.Element = n),
			(e.ForwardRef = d),
			(e.Fragment = i),
			(e.Lazy = h),
			(e.Memo = m),
			(e.Portal = r),
			(e.Profiler = o),
			(e.StrictMode = a),
			(e.Suspense = f),
			(e.isAsyncMode = function (e) {
				return x(e) || b(e) === l;
			}),
			(e.isConcurrentMode = x),
			(e.isContextConsumer = function (e) {
				return b(e) === c;
			}),
			(e.isContextProvider = function (e) {
				return b(e) === s;
			}),
			(e.isElement = function (e) {
				return typeof e == `object` && !!e && e.$$typeof === n;
			}),
			(e.isForwardRef = function (e) {
				return b(e) === d;
			}),
			(e.isFragment = function (e) {
				return b(e) === i;
			}),
			(e.isLazy = function (e) {
				return b(e) === h;
			}),
			(e.isMemo = function (e) {
				return b(e) === m;
			}),
			(e.isPortal = function (e) {
				return b(e) === r;
			}),
			(e.isProfiler = function (e) {
				return b(e) === o;
			}),
			(e.isStrictMode = function (e) {
				return b(e) === a;
			}),
			(e.isSuspense = function (e) {
				return b(e) === f;
			}),
			(e.isValidElementType = function (e) {
				return (
					typeof e == `string` ||
					typeof e == `function` ||
					e === i ||
					e === u ||
					e === o ||
					e === a ||
					e === f ||
					e === p ||
					(typeof e == `object` &&
						!!e &&
						(e.$$typeof === h ||
							e.$$typeof === m ||
							e.$$typeof === s ||
							e.$$typeof === c ||
							e.$$typeof === d ||
							e.$$typeof === _ ||
							e.$$typeof === v ||
							e.$$typeof === y ||
							e.$$typeof === g))
				);
			}),
			(e.typeOf = b));
	}),
	fr = o((e, t) => {
		t.exports = dr();
	}),
	pr = o((e, t) => {
		var n = fr(),
			r = {
				childContextTypes: !0,
				contextType: !0,
				contextTypes: !0,
				defaultProps: !0,
				displayName: !0,
				getDefaultProps: !0,
				getDerivedStateFromError: !0,
				getDerivedStateFromProps: !0,
				mixins: !0,
				propTypes: !0,
				type: !0,
			},
			i = {
				name: !0,
				length: !0,
				prototype: !0,
				caller: !0,
				callee: !0,
				arguments: !0,
				arity: !0,
			},
			a = {
				$$typeof: !0,
				render: !0,
				defaultProps: !0,
				displayName: !0,
				propTypes: !0,
			},
			o = {
				$$typeof: !0,
				compare: !0,
				defaultProps: !0,
				displayName: !0,
				propTypes: !0,
				type: !0,
			},
			s = {};
		((s[n.ForwardRef] = a), (s[n.Memo] = o));
		function c(e) {
			return n.isMemo(e) ? o : s[e.$$typeof] || r;
		}
		var l = Object.defineProperty,
			u = Object.getOwnPropertyNames,
			d = Object.getOwnPropertySymbols,
			f = Object.getOwnPropertyDescriptor,
			p = Object.getPrototypeOf,
			m = Object.prototype;
		function h(e, t, n) {
			if (typeof t != `string`) {
				if (m) {
					var r = p(t);
					r && r !== m && h(e, r, n);
				}
				var a = u(t);
				d && (a = a.concat(d(t)));
				for (var o = c(e), s = c(t), g = 0; g < a.length; ++g) {
					var _ = a[g];
					if (!i[_] && !(n && n[_]) && !(s && s[_]) && !(o && o[_])) {
						var v = f(t, _);
						try {
							l(e, _, v);
						} catch {}
					}
				}
			}
			return e;
		}
		t.exports = h;
	}),
	mr = !0;
function hr(e, t, n) {
	var r = ``;
	return (
		n.split(` `).forEach(function (n) {
			e[n] === void 0 ? n && (r += n + ` `) : t.push(e[n] + `;`);
		}),
		r
	);
}
var gr = function (e, t, n) {
		var r = e.key + `-` + t.name;
		(n === !1 || mr === !1) &&
			e.registered[r] === void 0 &&
			(e.registered[r] = t.styles);
	},
	_r = function (e, t, n) {
		gr(e, t, n);
		var r = e.key + `-` + t.name;
		if (e.inserted[t.name] === void 0) {
			var i = t;
			do (e.insert(t === i ? `.` + r : ``, i, e.sheet, !0), (i = i.next));
			while (i !== void 0);
		}
	};
function vr(e) {
	for (var t = 0, n, r = 0, i = e.length; i >= 4; ++r, i -= 4)
		((n =
			(e.charCodeAt(r) & 255) |
			((e.charCodeAt(++r) & 255) << 8) |
			((e.charCodeAt(++r) & 255) << 16) |
			((e.charCodeAt(++r) & 255) << 24)),
			(n = (n & 65535) * 1540483477 + (((n >>> 16) * 59797) << 16)),
			(n ^= n >>> 24),
			(t =
				((n & 65535) * 1540483477 + (((n >>> 16) * 59797) << 16)) ^
				((t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16))));
	switch (i) {
		case 3:
			t ^= (e.charCodeAt(r + 2) & 255) << 16;
		case 2:
			t ^= (e.charCodeAt(r + 1) & 255) << 8;
		case 1:
			((t ^= e.charCodeAt(r) & 255),
				(t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)));
	}
	return (
		(t ^= t >>> 13),
		(t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)),
		((t ^ (t >>> 15)) >>> 0).toString(36)
	);
}
var yr = {
		animationIterationCount: 1,
		aspectRatio: 1,
		borderImageOutset: 1,
		borderImageSlice: 1,
		borderImageWidth: 1,
		boxFlex: 1,
		boxFlexGroup: 1,
		boxOrdinalGroup: 1,
		columnCount: 1,
		columns: 1,
		flex: 1,
		flexGrow: 1,
		flexPositive: 1,
		flexShrink: 1,
		flexNegative: 1,
		flexOrder: 1,
		gridRow: 1,
		gridRowEnd: 1,
		gridRowSpan: 1,
		gridRowStart: 1,
		gridColumn: 1,
		gridColumnEnd: 1,
		gridColumnSpan: 1,
		gridColumnStart: 1,
		msGridRow: 1,
		msGridRowSpan: 1,
		msGridColumn: 1,
		msGridColumnSpan: 1,
		fontWeight: 1,
		lineHeight: 1,
		opacity: 1,
		order: 1,
		orphans: 1,
		scale: 1,
		tabSize: 1,
		widows: 1,
		zIndex: 1,
		zoom: 1,
		WebkitLineClamp: 1,
		fillOpacity: 1,
		floodOpacity: 1,
		stopOpacity: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1,
		strokeMiterlimit: 1,
		strokeOpacity: 1,
		strokeWidth: 1,
	},
	br = !1,
	xr = /[A-Z]|^ms/g,
	Sr = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
	Cr = function (e) {
		return e.charCodeAt(1) === 45;
	},
	wr = function (e) {
		return e != null && typeof e != `boolean`;
	},
	Tr = tr(function (e) {
		return Cr(e) ? e : e.replace(xr, `-$&`).toLowerCase();
	}),
	Er = function (e, t) {
		switch (e) {
			case `animation`:
			case `animationName`:
				if (typeof t == `string`)
					return t.replace(Sr, function (e, t, n) {
						return ((jr = { name: t, styles: n, next: jr }), t);
					});
		}
		return yr[e] !== 1 && !Cr(e) && typeof t == `number` && t !== 0
			? t + `px`
			: t;
	},
	Dr = `Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.`;
function Or(e, t, n) {
	if (n == null) return ``;
	var r = n;
	if (r.__emotion_styles !== void 0) return r;
	switch (typeof n) {
		case `boolean`:
			return ``;
		case `object`:
			var i = n;
			if (i.anim === 1)
				return (
					(jr = { name: i.name, styles: i.styles, next: jr }),
					i.name
				);
			var a = n;
			if (a.styles !== void 0) {
				var o = a.next;
				if (o !== void 0)
					for (; o !== void 0; )
						((jr = { name: o.name, styles: o.styles, next: jr }),
							(o = o.next));
				return a.styles + `;`;
			}
			return kr(e, t, n);
		case `function`:
			if (e !== void 0) {
				var s = jr,
					c = n(e);
				return ((jr = s), Or(e, t, c));
			}
			break;
	}
	var l = n;
	if (t == null) return l;
	var u = t[l];
	return u === void 0 ? l : u;
}
function kr(e, t, n) {
	var r = ``;
	if (Array.isArray(n))
		for (var i = 0; i < n.length; i++) r += Or(e, t, n[i]) + `;`;
	else
		for (var a in n) {
			var o = n[a];
			if (typeof o != `object`) {
				var s = o;
				t != null && t[s] !== void 0
					? (r += a + `{` + t[s] + `}`)
					: wr(s) && (r += Tr(a) + `:` + Er(a, s) + `;`);
			} else {
				if (a === `NO_COMPONENT_SELECTOR` && br) throw Error(Dr);
				if (
					Array.isArray(o) &&
					typeof o[0] == `string` &&
					(t == null || t[o[0]] === void 0)
				)
					for (var c = 0; c < o.length; c++)
						wr(o[c]) && (r += Tr(a) + `:` + Er(a, o[c]) + `;`);
				else {
					var l = Or(e, t, o);
					switch (a) {
						case `animation`:
						case `animationName`:
							r += Tr(a) + `:` + l + `;`;
							break;
						default:
							r += a + `{` + l + `}`;
					}
				}
			}
		}
	return r;
}
var Ar = /label:\s*([^\s;{]+)\s*(;|$)/g,
	jr;
function Mr(e, t, n) {
	if (
		e.length === 1 &&
		typeof e[0] == `object` &&
		e[0] !== null &&
		e[0].styles !== void 0
	)
		return e[0];
	var r = !0,
		i = ``;
	jr = void 0;
	var a = e[0];
	a == null || a.raw === void 0
		? ((r = !1), (i += Or(n, t, a)))
		: (i += a[0]);
	for (var o = 1; o < e.length; o++)
		((i += Or(n, t, e[o])), r && (i += a[o]));
	Ar.lastIndex = 0;
	for (var s = ``, c; (c = Ar.exec(i)) !== null; ) s += `-` + c[1];
	return { name: vr(i) + s, styles: i, next: jr };
}
var Nr = function (e) {
		return e();
	},
	Pr = k.useInsertionEffect ? k.useInsertionEffect : !1,
	Fr = Pr || Nr;
Pr || k.useLayoutEffect;
var Ir = k.createContext(typeof HTMLElement < `u` ? ur({ key: `css` }) : null);
Ir.Provider;
var Lr = function (e) {
		return (0, k.forwardRef)(function (t, n) {
			return e(t, (0, k.useContext)(Ir), n);
		});
	},
	Rr = k.createContext({}),
	zr = {}.hasOwnProperty,
	Br = `__EMOTION_TYPE_PLEASE_DO_NOT_USE__`,
	Vr = function (e, t) {
		var n = {};
		for (var r in t) zr.call(t, r) && (n[r] = t[r]);
		return ((n[Br] = e), n);
	},
	Hr = function (e) {
		var t = e.cache,
			n = e.serialized,
			r = e.isStringTag;
		return (
			gr(t, n, r),
			Fr(function () {
				return _r(t, n, r);
			}),
			null
		);
	},
	Ur = Lr(function (e, t, n) {
		var r = e.css;
		typeof r == `string` &&
			t.registered[r] !== void 0 &&
			(r = t.registered[r]);
		var i = e[Br],
			a = [r],
			o = ``;
		typeof e.className == `string`
			? (o = hr(t.registered, a, e.className))
			: e.className != null && (o = e.className + ` `);
		var s = Mr(a, void 0, k.useContext(Rr));
		o += t.key + `-` + s.name;
		var c = {};
		for (var l in e)
			zr.call(e, l) && l !== `css` && l !== Br && (c[l] = e[l]);
		return (
			(c.className = o),
			n && (c.ref = n),
			k.createElement(
				k.Fragment,
				null,
				k.createElement(Hr, {
					cache: t,
					serialized: s,
					isStringTag: typeof i == `string`,
				}),
				k.createElement(i, c),
			)
		);
	});
pr();
var F = function (e, t) {
	var n = arguments;
	if (t == null || !zr.call(t, `css`))
		return k.createElement.apply(void 0, n);
	var r = n.length,
		i = Array(r);
	((i[0] = Ur), (i[1] = Vr(e, t)));
	for (var a = 2; a < r; a++) i[a] = n[a];
	return k.createElement.apply(null, i);
};
(function (e) {
	var t;
	(function (e) {})((t ||= e.JSX ||= {}));
})((F ||= {}));
function Wr() {
	return Mr([...arguments]);
}
function Gr() {
	var e = Wr.apply(void 0, arguments),
		t = `animation-` + e.name;
	return {
		name: t,
		styles: `@keyframes ` + t + `{` + e.styles + `}`,
		anim: 1,
		toString: function () {
			return `_EMO_` + this.name + `_` + this.styles + `_EMO_`;
		},
	};
}
function Kr(e, t) {
	return (
		(t ||= e.slice(0)),
		Object.freeze(
			Object.defineProperties(e, { raw: { value: Object.freeze(t) } }),
		)
	);
}
var qr = Math.min,
	Jr = Math.max,
	Yr = Math.round,
	Xr = Math.floor,
	Zr = (e) => ({ x: e, y: e });
function Qr(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n,
	};
}
function $r() {
	return typeof window < `u`;
}
function ei(e) {
	return ri(e) ? (e.nodeName || ``).toLowerCase() : `#document`;
}
function ti(e) {
	var t;
	return (
		(e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) ||
		window
	);
}
function ni(e) {
	return ((ri(e) ? e.ownerDocument : e.document) || window.document)
		?.documentElement;
}
function ri(e) {
	return $r() ? e instanceof Node || e instanceof ti(e).Node : !1;
}
function ii(e) {
	return $r() ? e instanceof Element || e instanceof ti(e).Element : !1;
}
function ai(e) {
	return $r()
		? e instanceof HTMLElement || e instanceof ti(e).HTMLElement
		: !1;
}
function oi(e) {
	return !$r() || typeof ShadowRoot > `u`
		? !1
		: e instanceof ShadowRoot || e instanceof ti(e).ShadowRoot;
}
function si(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = di(e);
	return (
		/auto|scroll|overlay|hidden|clip/.test(t + r + n) &&
		i !== `inline` &&
		i !== `contents`
	);
}
var ci;
function li() {
	return (
		(ci ??=
			typeof CSS < `u` &&
			CSS.supports &&
			CSS.supports(`-webkit-backdrop-filter`, `none`)),
		ci
	);
}
function ui(e) {
	return /^(html|body|#document)$/.test(ei(e));
}
function di(e) {
	return ti(e).getComputedStyle(e);
}
function fi(e) {
	if (ei(e) === `html`) return e;
	let t = e.assignedSlot || e.parentNode || (oi(e) && e.host) || ni(e);
	return oi(t) ? t.host : t;
}
function pi(e) {
	let t = fi(e);
	return ui(t)
		? e.ownerDocument
			? e.ownerDocument.body
			: e.body
		: ai(t) && si(t)
			? t
			: pi(t);
}
function mi(e, t, n) {
	(t === void 0 && (t = []), n === void 0 && (n = !0));
	let r = pi(e),
		i = r === e.ownerDocument?.body,
		a = ti(r);
	if (i) {
		let e = hi(a);
		return t.concat(
			a,
			a.visualViewport || [],
			si(r) ? r : [],
			e && n ? mi(e) : [],
		);
	} else return t.concat(r, mi(r, [], n));
}
function hi(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function gi(e) {
	let t = di(e),
		n = parseFloat(t.width) || 0,
		r = parseFloat(t.height) || 0,
		i = ai(e),
		a = i ? e.offsetWidth : n,
		o = i ? e.offsetHeight : r,
		s = Yr(n) !== a || Yr(r) !== o;
	return (s && ((n = a), (r = o)), { width: n, height: r, $: s });
}
function _i(e) {
	return ii(e) ? e : e.contextElement;
}
function vi(e) {
	let t = _i(e);
	if (!ai(t)) return Zr(1);
	let n = t.getBoundingClientRect(),
		{ width: r, height: i, $: a } = gi(t),
		o = (a ? Yr(n.width) : n.width) / r,
		s = (a ? Yr(n.height) : n.height) / i;
	return (
		(!o || !Number.isFinite(o)) && (o = 1),
		(!s || !Number.isFinite(s)) && (s = 1),
		{ x: o, y: s }
	);
}
var yi = Zr(0);
function bi(e) {
	let t = ti(e);
	return !li() || !t.visualViewport
		? yi
		: { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function xi(e, t, n) {
	return (t === void 0 && (t = !1), !n || (t && n !== ti(e)) ? !1 : t);
}
function Si(e, t, n, r) {
	(t === void 0 && (t = !1), n === void 0 && (n = !1));
	let i = e.getBoundingClientRect(),
		a = _i(e),
		o = Zr(1);
	t && (r ? ii(r) && (o = vi(r)) : (o = vi(e)));
	let s = xi(a, n, r) ? bi(a) : Zr(0),
		c = (i.left + s.x) / o.x,
		l = (i.top + s.y) / o.y,
		u = i.width / o.x,
		d = i.height / o.y;
	if (a) {
		let e = ti(a),
			t = r && ii(r) ? ti(r) : r,
			n = e,
			i = hi(n);
		for (; i && r && t !== n; ) {
			let e = vi(i),
				t = i.getBoundingClientRect(),
				r = di(i),
				a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x,
				o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			((c *= e.x),
				(l *= e.y),
				(u *= e.x),
				(d *= e.y),
				(c += a),
				(l += o),
				(n = ti(i)),
				(i = hi(n)));
		}
	}
	return Qr({ width: u, height: d, x: c, y: l });
}
function Ci(e, t) {
	return (
		e.x === t.x &&
		e.y === t.y &&
		e.width === t.width &&
		e.height === t.height
	);
}
function wi(e, t) {
	let n = null,
		r,
		i = ni(e);
	function a() {
		var e;
		(clearTimeout(r), (e = n) == null || e.disconnect(), (n = null));
	}
	function o(s, c) {
		(s === void 0 && (s = !1), c === void 0 && (c = 1), a());
		let l = e.getBoundingClientRect(),
			{ left: u, top: d, width: f, height: p } = l;
		if ((s || t(), !f || !p)) return;
		let m = Xr(d),
			h = Xr(i.clientWidth - (u + f)),
			g = Xr(i.clientHeight - (d + p)),
			_ = Xr(u),
			v = {
				rootMargin: -m + `px ` + -h + `px ` + -g + `px ` + -_ + `px`,
				threshold: Jr(0, qr(1, c)) || 1,
			},
			y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (n !== c) {
				if (!y) return o();
				n
					? o(!1, n)
					: (r = setTimeout(() => {
							o(!1, 1e-7);
						}, 1e3));
			}
			(n === 1 && !Ci(l, e.getBoundingClientRect()) && o(), (y = !1));
		}
		try {
			n = new IntersectionObserver(b, { ...v, root: i.ownerDocument });
		} catch {
			n = new IntersectionObserver(b, v);
		}
		n.observe(e);
	}
	return (o(!0), a);
}
function Ti(e, t, n, r) {
	r === void 0 && (r = {});
	let {
			ancestorScroll: i = !0,
			ancestorResize: a = !0,
			elementResize: o = typeof ResizeObserver == `function`,
			layoutShift: s = typeof IntersectionObserver == `function`,
			animationFrame: c = !1,
		} = r,
		l = _i(e),
		u = i || a ? [...(l ? mi(l) : []), ...(t ? mi(t) : [])] : [];
	u.forEach((e) => {
		(i && e.addEventListener(`scroll`, n, { passive: !0 }),
			a && e.addEventListener(`resize`, n));
	});
	let d = l && s ? wi(l, n) : null,
		f = -1,
		p = null;
	o &&
		((p = new ResizeObserver((e) => {
			let [r] = e;
			(r &&
				r.target === l &&
				p &&
				t &&
				(p.unobserve(t),
				cancelAnimationFrame(f),
				(f = requestAnimationFrame(() => {
					var e;
					(e = p) == null || e.observe(t);
				}))),
				n());
		})),
		l && !c && p.observe(l),
		t && p.observe(t));
	let m,
		h = c ? Si(e) : null;
	c && g();
	function g() {
		let t = Si(e);
		(h && !Ci(h, t) && n(), (h = t), (m = requestAnimationFrame(g)));
	}
	return (
		n(),
		() => {
			var e;
			(u.forEach((e) => {
				(i && e.removeEventListener(`scroll`, n),
					a && e.removeEventListener(`resize`, n));
			}),
				d?.(),
				(e = p) == null || e.disconnect(),
				(p = null),
				c && cancelAnimationFrame(m));
		}
	);
}
var Ei = k.useLayoutEffect,
	Di = c(xe()),
	Oi = [
		`className`,
		`clearValue`,
		`cx`,
		`getStyles`,
		`getClassNames`,
		`getValue`,
		`hasValue`,
		`isMulti`,
		`isRtl`,
		`options`,
		`selectOption`,
		`selectProps`,
		`setValue`,
		`theme`,
	],
	ki = function () {};
function Ai(e, t) {
	return t ? (t[0] === `-` ? e + t : e + `__` + t) : e;
}
function ji(e, t) {
	var n = [...arguments].slice(2),
		r = [].concat(n);
	if (t && e)
		for (var i in t) t.hasOwnProperty(i) && t[i] && r.push(`${Ai(e, i)}`);
	return r
		.filter(function (e) {
			return e;
		})
		.map(function (e) {
			return String(e).trim();
		})
		.join(` `);
}
var Mi = function (e) {
		return Ji(e)
			? e.filter(Boolean)
			: St(e) === `object` && e !== null
				? [e]
				: [];
	},
	Ni = function (e) {
		return (
			e.className,
			e.clearValue,
			e.cx,
			e.getStyles,
			e.getClassNames,
			e.getValue,
			e.hasValue,
			e.isMulti,
			e.isRtl,
			e.options,
			e.selectOption,
			e.selectProps,
			e.setValue,
			e.theme,
			j({}, Pt(e, Oi))
		);
	},
	I = function (e, t, n) {
		var r = e.cx,
			i = e.getStyles,
			a = e.getClassNames,
			o = e.className;
		return { css: i(t, e), className: r(n ?? {}, a(t, e), o) };
	};
function Pi(e) {
	return [document.documentElement, document.body, window].indexOf(e) > -1;
}
function Fi(e) {
	return Pi(e) ? window.innerHeight : e.clientHeight;
}
function L(e) {
	return Pi(e) ? window.pageYOffset : e.scrollTop;
}
function R(e, t) {
	if (Pi(e)) {
		window.scrollTo(0, t);
		return;
	}
	e.scrollTop = t;
}
function Ii(e) {
	var t = getComputedStyle(e),
		n = t.position === `absolute`,
		r = /(auto|scroll)/;
	if (t.position === `fixed`) return document.documentElement;
	for (var i = e; (i = i.parentElement); )
		if (
			((t = getComputedStyle(i)),
			!(n && t.position === `static`) &&
				r.test(t.overflow + t.overflowY + t.overflowX))
		)
			return i;
	return document.documentElement;
}
function Li(e, t, n, r) {
	return n * ((e = e / r - 1) * e * e + 1) + t;
}
function Ri(e, t) {
	var n =
			arguments.length > 2 && arguments[2] !== void 0
				? arguments[2]
				: 200,
		r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ki,
		i = L(e),
		a = t - i,
		o = 10,
		s = 0;
	function c() {
		((s += o),
			R(e, Li(s, i, a, n)),
			s < n ? window.requestAnimationFrame(c) : r(e));
	}
	c();
}
function zi(e, t) {
	var n = e.getBoundingClientRect(),
		r = t.getBoundingClientRect(),
		i = t.offsetHeight / 3;
	r.bottom + i > n.bottom
		? R(
				e,
				Math.min(
					t.offsetTop + t.clientHeight - e.offsetHeight + i,
					e.scrollHeight,
				),
			)
		: r.top - i < n.top && R(e, Math.max(t.offsetTop - i, 0));
}
function Bi(e) {
	var t = e.getBoundingClientRect();
	return {
		bottom: t.bottom,
		height: t.height,
		left: t.left,
		right: t.right,
		top: t.top,
		width: t.width,
	};
}
function Vi() {
	try {
		return (document.createEvent(`TouchEvent`), !0);
	} catch {
		return !1;
	}
}
function Hi() {
	try {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		);
	} catch {
		return !1;
	}
}
var Ui = !1,
	Wi = {
		get passive() {
			return (Ui = !0);
		},
	},
	Gi = typeof window < `u` ? window : {};
Gi.addEventListener &&
	Gi.removeEventListener &&
	(Gi.addEventListener(`p`, ki, Wi), Gi.removeEventListener(`p`, ki, !1));
var Ki = Ui;
function qi(e) {
	return e != null;
}
function Ji(e) {
	return Array.isArray(e);
}
function Yi(e, t, n) {
	return e ? t : n;
}
function Xi(e) {
	return e;
}
function Zi(e) {
	return e;
}
var Qi = function (e) {
		var t = [...arguments].slice(1);
		return Object.entries(e)
			.filter(function (e) {
				var n = Mt(e, 1)[0];
				return !t.includes(n);
			})
			.reduce(function (e, t) {
				var n = Mt(t, 2),
					r = n[0];
				return ((e[r] = n[1]), e);
			}, {});
	},
	$i = [`children`, `innerProps`],
	ea = [`children`, `innerProps`];
function ta(e) {
	var t = e.maxHeight,
		n = e.menuEl,
		r = e.minHeight,
		i = e.placement,
		a = e.shouldScroll,
		o = e.isFixedPosition,
		s = e.controlHeight,
		c = Ii(n),
		l = { placement: `bottom`, maxHeight: t };
	if (!n || !n.offsetParent) return l;
	var u = c.getBoundingClientRect().height,
		d = n.getBoundingClientRect(),
		f = d.bottom,
		p = d.height,
		m = d.top,
		h = n.offsetParent.getBoundingClientRect().top,
		g = o ? window.innerHeight : Fi(c),
		_ = L(c),
		v = parseInt(getComputedStyle(n).marginBottom, 10),
		y = parseInt(getComputedStyle(n).marginTop, 10),
		b = h - y,
		x = g - m,
		S = b + _,
		C = u - _ - m,
		w = f - g + _ + v,
		ee = _ + m - y,
		T = 160;
	switch (i) {
		case `auto`:
		case `bottom`:
			if (x >= p) return { placement: `bottom`, maxHeight: t };
			if (C >= p && !o)
				return (
					a && Ri(c, w, T),
					{ placement: `bottom`, maxHeight: t }
				);
			if ((!o && C >= r) || (o && x >= r))
				return (
					a && Ri(c, w, T),
					{ placement: `bottom`, maxHeight: o ? x - v : C - v }
				);
			if (i === `auto` || o) {
				var te = t,
					ne = o ? b : S;
				return (
					ne >= r && (te = Math.min(ne - v - s, t)),
					{ placement: `top`, maxHeight: te }
				);
			}
			if (i === `bottom`)
				return (a && R(c, w), { placement: `bottom`, maxHeight: t });
			break;
		case `top`:
			if (b >= p) return { placement: `top`, maxHeight: t };
			if (S >= p && !o)
				return (a && Ri(c, ee, T), { placement: `top`, maxHeight: t });
			if ((!o && S >= r) || (o && b >= r)) {
				var re = t;
				return (
					((!o && S >= r) || (o && b >= r)) &&
						(re = o ? b - y : S - y),
					a && Ri(c, ee, T),
					{ placement: `top`, maxHeight: re }
				);
			}
			return { placement: `bottom`, maxHeight: t };
		default:
			throw Error(`Invalid placement provided "${i}".`);
	}
	return l;
}
function na(e) {
	return e ? { bottom: `top`, top: `bottom` }[e] : `bottom`;
}
var ra = function (e) {
		return e === `auto` ? `bottom` : e;
	},
	ia = function (e, t) {
		var n,
			r = e.placement,
			i = e.theme,
			a = i.borderRadius,
			o = i.spacing,
			s = i.colors;
		return j(
			((n = { label: `menu` }),
			Tt(n, na(r), `100%`),
			Tt(n, `position`, `absolute`),
			Tt(n, `width`, `100%`),
			Tt(n, `zIndex`, 1),
			n),
			t
				? {}
				: {
						backgroundColor: s.neutral0,
						borderRadius: a,
						boxShadow: `0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)`,
						marginBottom: o.menuGutter,
						marginTop: o.menuGutter,
					},
		);
	},
	aa = (0, k.createContext)(null),
	oa = function (e) {
		var t = e.children,
			n = e.minMenuHeight,
			r = e.maxMenuHeight,
			i = e.menuPlacement,
			a = e.menuPosition,
			o = e.menuShouldScrollIntoView,
			s = e.theme,
			c = ((0, k.useContext)(aa) || {}).setPortalPlacement,
			l = (0, k.useRef)(null),
			u = Mt((0, k.useState)(r), 2),
			d = u[0],
			f = u[1],
			p = Mt((0, k.useState)(null), 2),
			m = p[0],
			h = p[1],
			g = s.spacing.controlHeight;
		return (
			Ei(
				function () {
					var e = l.current;
					if (e) {
						var t = a === `fixed`,
							s = ta({
								maxHeight: r,
								menuEl: e,
								minHeight: n,
								placement: i,
								shouldScroll: o && !t,
								isFixedPosition: t,
								controlHeight: g,
							});
						(f(s.maxHeight), h(s.placement), c?.(s.placement));
					}
				},
				[r, i, a, o, n, c, g],
			),
			t({
				ref: l,
				placerProps: j(
					j({}, e),
					{},
					{ placement: m || ra(i), maxHeight: d },
				),
			})
		);
	},
	sa = function (e) {
		var t = e.children,
			n = e.innerRef,
			r = e.innerProps;
		return F(`div`, M({}, I(e, `menu`, { menu: !0 }), { ref: n }, r), t);
	},
	ca = function (e, t) {
		var n = e.maxHeight,
			r = e.theme.spacing.baseUnit;
		return j(
			{
				maxHeight: n,
				overflowY: `auto`,
				position: `relative`,
				WebkitOverflowScrolling: `touch`,
			},
			t ? {} : { paddingBottom: r, paddingTop: r },
		);
	},
	la = function (e) {
		var t = e.children,
			n = e.innerProps,
			r = e.innerRef,
			i = e.isMulti;
		return F(
			`div`,
			M(
				{},
				I(e, `menuList`, { "menu-list": !0, "menu-list--is-multi": i }),
				{ ref: r },
				n,
			),
			t,
		);
	},
	ua = function (e, t) {
		var n = e.theme,
			r = n.spacing.baseUnit,
			i = n.colors;
		return j(
			{ textAlign: `center` },
			t ? {} : { color: i.neutral40, padding: `${r * 2}px ${r * 3}px` },
		);
	},
	da = ua,
	fa = ua,
	pa = function (e) {
		var t = e.children,
			n = t === void 0 ? `No options` : t,
			r = e.innerProps;
		return F(
			`div`,
			M(
				{},
				I(
					j(j({}, Pt(e, $i)), {}, { children: n, innerProps: r }),
					`noOptionsMessage`,
					{ "menu-notice": !0, "menu-notice--no-options": !0 },
				),
				r,
			),
			n,
		);
	},
	ma = function (e) {
		var t = e.children,
			n = t === void 0 ? `Loading...` : t,
			r = e.innerProps;
		return F(
			`div`,
			M(
				{},
				I(
					j(j({}, Pt(e, ea)), {}, { children: n, innerProps: r }),
					`loadingMessage`,
					{ "menu-notice": !0, "menu-notice--loading": !0 },
				),
				r,
			),
			n,
		);
	},
	ha = function (e) {
		var t = e.rect,
			n = e.offset,
			r = e.position;
		return { left: t.left, position: r, top: n, width: t.width, zIndex: 1 };
	},
	ga = function (e) {
		var t = e.appendTo,
			n = e.children,
			r = e.controlElement,
			i = e.innerProps,
			a = e.menuPlacement,
			o = e.menuPosition,
			s = (0, k.useRef)(null),
			c = (0, k.useRef)(null),
			l = Mt((0, k.useState)(ra(a)), 2),
			u = l[0],
			d = l[1],
			f = (0, k.useMemo)(function () {
				return { setPortalPlacement: d };
			}, []),
			p = Mt((0, k.useState)(null), 2),
			m = p[0],
			h = p[1],
			g = (0, k.useCallback)(
				function () {
					if (r) {
						var e = Bi(r),
							t = o === `fixed` ? 0 : window.pageYOffset,
							n = e[u] + t;
						(n !== m?.offset ||
							e.left !== m?.rect.left ||
							e.width !== m?.rect.width) &&
							h({ offset: n, rect: e });
					}
				},
				[r, o, u, m?.offset, m?.rect.left, m?.rect.width],
			);
		Ei(
			function () {
				g();
			},
			[g],
		);
		var _ = (0, k.useCallback)(
			function () {
				(typeof c.current == `function` &&
					(c.current(), (c.current = null)),
					r &&
						s.current &&
						(c.current = Ti(r, s.current, g, {
							elementResize: `ResizeObserver` in window,
						})));
			},
			[r, g],
		);
		Ei(
			function () {
				_();
			},
			[_],
		);
		var v = (0, k.useCallback)(
			function (e) {
				((s.current = e), _());
			},
			[_],
		);
		if ((!t && o !== `fixed`) || !m) return null;
		var y = F(
			`div`,
			M(
				{ ref: v },
				I(
					j(
						j({}, e),
						{},
						{ offset: m.offset, position: o, rect: m.rect },
					),
					`menuPortal`,
					{ "menu-portal": !0 },
				),
				i,
			),
			n,
		);
		return F(aa.Provider, { value: f }, t ? (0, Di.createPortal)(y, t) : y);
	},
	_a = function (e) {
		var t = e.isDisabled;
		return {
			label: `container`,
			direction: e.isRtl ? `rtl` : void 0,
			pointerEvents: t ? `none` : void 0,
			position: `relative`,
		};
	},
	va = function (e) {
		var t = e.children,
			n = e.innerProps,
			r = e.isDisabled,
			i = e.isRtl;
		return F(
			`div`,
			M({}, I(e, `container`, { "--is-disabled": r, "--is-rtl": i }), n),
			t,
		);
	},
	ya = function (e, t) {
		var n = e.theme.spacing,
			r = e.isMulti,
			i = e.hasValue,
			a = e.selectProps.controlShouldRenderValue;
		return j(
			{
				alignItems: `center`,
				display: r && i && a ? `flex` : `grid`,
				flex: 1,
				flexWrap: `wrap`,
				WebkitOverflowScrolling: `touch`,
				position: `relative`,
				overflow: `hidden`,
			},
			t ? {} : { padding: `${n.baseUnit / 2}px ${n.baseUnit * 2}px` },
		);
	},
	ba = function (e) {
		var t = e.children,
			n = e.innerProps,
			r = e.isMulti,
			i = e.hasValue;
		return F(
			`div`,
			M(
				{},
				I(e, `valueContainer`, {
					"value-container": !0,
					"value-container--is-multi": r,
					"value-container--has-value": i,
				}),
				n,
			),
			t,
		);
	},
	xa = function () {
		return {
			alignItems: `center`,
			alignSelf: `stretch`,
			display: `flex`,
			flexShrink: 0,
		};
	},
	Sa = function (e) {
		var t = e.children,
			n = e.innerProps;
		return F(
			`div`,
			M({}, I(e, `indicatorsContainer`, { indicators: !0 }), n),
			t,
		);
	},
	Ca,
	wa = [`size`],
	Ta = [`innerProps`, `isRtl`, `size`],
	Ea = {
		name: `8mmkcg`,
		styles: `display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0`,
	},
	Da = function (e) {
		var t = e.size,
			n = Pt(e, wa);
		return F(
			`svg`,
			M(
				{
					height: t,
					width: t,
					viewBox: `0 0 20 20`,
					"aria-hidden": `true`,
					focusable: `false`,
					css: Ea,
				},
				n,
			),
		);
	},
	Oa = function (e) {
		return F(
			Da,
			M({ size: 20 }, e),
			F(`path`, {
				d: `M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z`,
			}),
		);
	},
	ka = function (e) {
		return F(
			Da,
			M({ size: 20 }, e),
			F(`path`, {
				d: `M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z`,
			}),
		);
	},
	Aa = function (e, t) {
		var n = e.isFocused,
			r = e.theme,
			i = r.spacing.baseUnit,
			a = r.colors;
		return j(
			{
				label: `indicatorContainer`,
				display: `flex`,
				transition: `color 150ms`,
			},
			t
				? {}
				: {
						color: n ? a.neutral60 : a.neutral20,
						padding: i * 2,
						":hover": { color: n ? a.neutral80 : a.neutral40 },
					},
		);
	},
	ja = Aa,
	Ma = function (e) {
		var t = e.children,
			n = e.innerProps;
		return F(
			`div`,
			M(
				{},
				I(e, `dropdownIndicator`, {
					indicator: !0,
					"dropdown-indicator": !0,
				}),
				n,
			),
			t || F(ka, null),
		);
	},
	Na = Aa,
	Pa = function (e) {
		var t = e.children,
			n = e.innerProps;
		return F(
			`div`,
			M(
				{},
				I(e, `clearIndicator`, {
					indicator: !0,
					"clear-indicator": !0,
				}),
				n,
			),
			t || F(Oa, null),
		);
	},
	Fa = function (e, t) {
		var n = e.isDisabled,
			r = e.theme,
			i = r.spacing.baseUnit,
			a = r.colors;
		return j(
			{ label: `indicatorSeparator`, alignSelf: `stretch`, width: 1 },
			t
				? {}
				: {
						backgroundColor: n ? a.neutral10 : a.neutral20,
						marginBottom: i * 2,
						marginTop: i * 2,
					},
		);
	},
	Ia = function (e) {
		var t = e.innerProps;
		return F(
			`span`,
			M({}, t, I(e, `indicatorSeparator`, { "indicator-separator": !0 })),
		);
	},
	La = Gr(
		(Ca ||= Kr([
			`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`,
		])),
	),
	Ra = function (e, t) {
		var n = e.isFocused,
			r = e.size,
			i = e.theme,
			a = i.colors,
			o = i.spacing.baseUnit;
		return j(
			{
				label: `loadingIndicator`,
				display: `flex`,
				transition: `color 150ms`,
				alignSelf: `center`,
				fontSize: r,
				lineHeight: 1,
				marginRight: r,
				textAlign: `center`,
				verticalAlign: `middle`,
			},
			t ? {} : { color: n ? a.neutral60 : a.neutral20, padding: o * 2 },
		);
	},
	za = function (e) {
		var t = e.delay,
			n = e.offset;
		return F(`span`, {
			css: Wr(
				{
					animation: `${La} 1s ease-in-out ${t}ms infinite;`,
					backgroundColor: `currentColor`,
					borderRadius: `1em`,
					display: `inline-block`,
					marginLeft: n ? `1em` : void 0,
					height: `1em`,
					verticalAlign: `top`,
					width: `1em`,
				},
				``,
				``,
			),
		});
	},
	Ba = function (e) {
		var t = e.innerProps,
			n = e.isRtl,
			r = e.size,
			i = r === void 0 ? 4 : r;
		return F(
			`div`,
			M(
				{},
				I(
					j(
						j({}, Pt(e, Ta)),
						{},
						{ innerProps: t, isRtl: n, size: i },
					),
					`loadingIndicator`,
					{ indicator: !0, "loading-indicator": !0 },
				),
				t,
			),
			F(za, { delay: 0, offset: n }),
			F(za, { delay: 160, offset: !0 }),
			F(za, { delay: 320, offset: !n }),
		);
	},
	Va = function (e, t) {
		var n = e.isDisabled,
			r = e.isFocused,
			i = e.theme,
			a = i.colors,
			o = i.borderRadius,
			s = i.spacing;
		return j(
			{
				label: `control`,
				alignItems: `center`,
				cursor: `default`,
				display: `flex`,
				flexWrap: `wrap`,
				justifyContent: `space-between`,
				minHeight: s.controlHeight,
				outline: `0 !important`,
				position: `relative`,
				transition: `all 100ms`,
			},
			t
				? {}
				: {
						backgroundColor: n ? a.neutral5 : a.neutral0,
						borderColor: n
							? a.neutral10
							: r
								? a.primary
								: a.neutral20,
						borderRadius: o,
						borderStyle: `solid`,
						borderWidth: 1,
						boxShadow: r ? `0 0 0 1px ${a.primary}` : void 0,
						"&:hover": { borderColor: r ? a.primary : a.neutral30 },
					},
		);
	},
	Ha = function (e) {
		var t = e.children,
			n = e.isDisabled,
			r = e.isFocused,
			i = e.innerRef,
			a = e.innerProps,
			o = e.menuIsOpen;
		return F(
			`div`,
			M(
				{ ref: i },
				I(e, `control`, {
					control: !0,
					"control--is-disabled": n,
					"control--is-focused": r,
					"control--menu-is-open": o,
				}),
				a,
				{ "aria-disabled": n || void 0 },
			),
			t,
		);
	},
	Ua = [`data`],
	Wa = function (e, t) {
		var n = e.theme.spacing;
		return t
			? {}
			: { paddingBottom: n.baseUnit * 2, paddingTop: n.baseUnit * 2 };
	},
	Ga = function (e) {
		var t = e.children,
			n = e.cx,
			r = e.getStyles,
			i = e.getClassNames,
			a = e.Heading,
			o = e.headingProps,
			s = e.innerProps,
			c = e.label,
			l = e.theme,
			u = e.selectProps;
		return F(
			`div`,
			M({}, I(e, `group`, { group: !0 }), s),
			F(
				a,
				M({}, o, {
					selectProps: u,
					theme: l,
					getStyles: r,
					getClassNames: i,
					cx: n,
				}),
				c,
			),
			F(`div`, null, t),
		);
	},
	Ka = function (e, t) {
		var n = e.theme,
			r = n.colors,
			i = n.spacing;
		return j(
			{ label: `group`, cursor: `default`, display: `block` },
			t
				? {}
				: {
						color: r.neutral40,
						fontSize: `75%`,
						fontWeight: 500,
						marginBottom: `0.25em`,
						paddingLeft: i.baseUnit * 3,
						paddingRight: i.baseUnit * 3,
						textTransform: `uppercase`,
					},
		);
	},
	qa = function (e) {
		var t = Ni(e);
		t.data;
		var n = Pt(t, Ua);
		return F(
			`div`,
			M({}, I(e, `groupHeading`, { "group-heading": !0 }), n),
		);
	},
	Ja = Ga,
	Ya = [`innerRef`, `isDisabled`, `isHidden`, `inputClassName`],
	Xa = function (e, t) {
		var n = e.isDisabled,
			r = e.value,
			i = e.theme,
			a = i.spacing,
			o = i.colors;
		return j(
			j(
				{
					visibility: n ? `hidden` : `visible`,
					transform: r ? `translateZ(0)` : ``,
				},
				Qa,
			),
			t
				? {}
				: {
						margin: a.baseUnit / 2,
						paddingBottom: a.baseUnit / 2,
						paddingTop: a.baseUnit / 2,
						color: o.neutral80,
					},
		);
	},
	Za = {
		gridArea: `1 / 2`,
		font: `inherit`,
		minWidth: `2px`,
		border: 0,
		margin: 0,
		outline: 0,
		padding: 0,
	},
	Qa = {
		flex: `1 1 auto`,
		display: `inline-grid`,
		gridArea: `1 / 1 / 2 / 3`,
		gridTemplateColumns: `0 min-content`,
		"&:after": j(
			{
				content: `attr(data-value) " "`,
				visibility: `hidden`,
				whiteSpace: `pre`,
			},
			Za,
		),
	},
	$a = function (e) {
		return j(
			{
				label: `input`,
				color: `inherit`,
				background: 0,
				opacity: e ? 0 : 1,
				width: `100%`,
			},
			Za,
		);
	},
	eo = function (e) {
		var t = e.cx,
			n = e.value,
			r = Ni(e),
			i = r.innerRef,
			a = r.isDisabled,
			o = r.isHidden,
			s = r.inputClassName,
			c = Pt(r, Ya);
		return F(
			`div`,
			M({}, I(e, `input`, { "input-container": !0 }), {
				"data-value": n || ``,
			}),
			F(
				`input`,
				M(
					{
						className: t({ input: !0 }, s),
						ref: i,
						style: $a(o),
						disabled: a,
					},
					c,
				),
			),
		);
	},
	to = function (e, t) {
		var n = e.theme,
			r = n.spacing,
			i = n.borderRadius,
			a = n.colors;
		return j(
			{ label: `multiValue`, display: `flex`, minWidth: 0 },
			t
				? {}
				: {
						backgroundColor: a.neutral10,
						borderRadius: i / 2,
						margin: r.baseUnit / 2,
					},
		);
	},
	no = function (e, t) {
		var n = e.theme,
			r = n.borderRadius,
			i = n.colors,
			a = e.cropWithEllipsis;
		return j(
			{
				overflow: `hidden`,
				textOverflow: a || a === void 0 ? `ellipsis` : void 0,
				whiteSpace: `nowrap`,
			},
			t
				? {}
				: {
						borderRadius: r / 2,
						color: i.neutral80,
						fontSize: `85%`,
						padding: 3,
						paddingLeft: 6,
					},
		);
	},
	ro = function (e, t) {
		var n = e.theme,
			r = n.spacing,
			i = n.borderRadius,
			a = n.colors,
			o = e.isFocused;
		return j(
			{ alignItems: `center`, display: `flex` },
			t
				? {}
				: {
						borderRadius: i / 2,
						backgroundColor: o ? a.dangerLight : void 0,
						paddingLeft: r.baseUnit,
						paddingRight: r.baseUnit,
						":hover": {
							backgroundColor: a.dangerLight,
							color: a.danger,
						},
					},
		);
	},
	io = function (e) {
		var t = e.children,
			n = e.innerProps;
		return F(`div`, n, t);
	},
	ao = io,
	oo = io;
function so(e) {
	var t = e.children,
		n = e.innerProps;
	return F(`div`, M({ role: `button` }, n), t || F(Oa, { size: 14 }));
}
var co = function (e) {
		var t = e.children,
			n = e.components,
			r = e.data,
			i = e.innerProps,
			a = e.isDisabled,
			o = e.removeProps,
			s = e.selectProps,
			c = n.Container,
			l = n.Label,
			u = n.Remove;
		return F(
			c,
			{
				data: r,
				innerProps: j(
					j(
						{},
						I(e, `multiValue`, {
							"multi-value": !0,
							"multi-value--is-disabled": a,
						}),
					),
					i,
				),
				selectProps: s,
			},
			F(
				l,
				{
					data: r,
					innerProps: j(
						{},
						I(e, `multiValueLabel`, { "multi-value__label": !0 }),
					),
					selectProps: s,
				},
				t,
			),
			F(u, {
				data: r,
				innerProps: j(
					j(
						{},
						I(e, `multiValueRemove`, { "multi-value__remove": !0 }),
					),
					{},
					{ "aria-label": `Remove ${t || `option`}` },
					o,
				),
				selectProps: s,
			}),
		);
	},
	lo = function (e, t) {
		var n = e.isDisabled,
			r = e.isFocused,
			i = e.isSelected,
			a = e.theme,
			o = a.spacing,
			s = a.colors;
		return j(
			{
				label: `option`,
				cursor: `default`,
				display: `block`,
				fontSize: `inherit`,
				width: `100%`,
				userSelect: `none`,
				WebkitTapHighlightColor: `rgba(0, 0, 0, 0)`,
			},
			t
				? {}
				: {
						backgroundColor: i
							? s.primary
							: r
								? s.primary25
								: `transparent`,
						color: n ? s.neutral20 : i ? s.neutral0 : `inherit`,
						padding: `${o.baseUnit * 2}px ${o.baseUnit * 3}px`,
						":active": {
							backgroundColor: n
								? void 0
								: i
									? s.primary
									: s.primary50,
						},
					},
		);
	},
	uo = function (e) {
		var t = e.children,
			n = e.isDisabled,
			r = e.isFocused,
			i = e.isSelected,
			a = e.innerRef,
			o = e.innerProps;
		return F(
			`div`,
			M(
				{},
				I(e, `option`, {
					option: !0,
					"option--is-disabled": n,
					"option--is-focused": r,
					"option--is-selected": i,
				}),
				{ ref: a, "aria-disabled": n },
				o,
			),
			t,
		);
	},
	fo = function (e, t) {
		var n = e.theme,
			r = n.spacing,
			i = n.colors;
		return j(
			{ label: `placeholder`, gridArea: `1 / 1 / 2 / 3` },
			t
				? {}
				: {
						color: i.neutral50,
						marginLeft: r.baseUnit / 2,
						marginRight: r.baseUnit / 2,
					},
		);
	},
	po = function (e) {
		var t = e.children,
			n = e.innerProps;
		return F(`div`, M({}, I(e, `placeholder`, { placeholder: !0 }), n), t);
	},
	mo = function (e, t) {
		var n = e.isDisabled,
			r = e.theme,
			i = r.spacing,
			a = r.colors;
		return j(
			{
				label: `singleValue`,
				gridArea: `1 / 1 / 2 / 3`,
				maxWidth: `100%`,
				overflow: `hidden`,
				textOverflow: `ellipsis`,
				whiteSpace: `nowrap`,
			},
			t
				? {}
				: {
						color: n ? a.neutral40 : a.neutral80,
						marginLeft: i.baseUnit / 2,
						marginRight: i.baseUnit / 2,
					},
		);
	},
	z = {
		ClearIndicator: Pa,
		Control: Ha,
		DropdownIndicator: Ma,
		DownChevron: ka,
		CrossIcon: Oa,
		Group: Ja,
		GroupHeading: qa,
		IndicatorsContainer: Sa,
		IndicatorSeparator: Ia,
		Input: eo,
		LoadingIndicator: Ba,
		Menu: sa,
		MenuList: la,
		MenuPortal: ga,
		LoadingMessage: ma,
		NoOptionsMessage: pa,
		MultiValue: co,
		MultiValueContainer: ao,
		MultiValueLabel: oo,
		MultiValueRemove: so,
		Option: uo,
		Placeholder: po,
		SelectContainer: va,
		SingleValue: function (e) {
			var t = e.children,
				n = e.isDisabled,
				r = e.innerProps;
			return F(
				`div`,
				M(
					{},
					I(e, `singleValue`, {
						"single-value": !0,
						"single-value--is-disabled": n,
					}),
					r,
				),
				t,
			);
		},
		ValueContainer: ba,
	},
	B = function (e) {
		return j(j({}, z), e.components);
	},
	ho =
		Number.isNaN ||
		function (e) {
			return typeof e == `number` && e !== e;
		};
function go(e, t) {
	return !!(e === t || (ho(e) && ho(t)));
}
function _o(e, t) {
	if (e.length !== t.length) return !1;
	for (var n = 0; n < e.length; n++) if (!go(e[n], t[n])) return !1;
	return !0;
}
function vo(e, t) {
	t === void 0 && (t = _o);
	var n = null;
	function r() {
		var r = [...arguments];
		if (n && n.lastThis === this && t(r, n.lastArgs)) return n.lastResult;
		var i = e.apply(this, r);
		return ((n = { lastResult: i, lastArgs: r, lastThis: this }), i);
	}
	return (
		(r.clear = function () {
			n = null;
		}),
		r
	);
}
for (
	var yo = {
			name: `7pg0cj-a11yText`,
			styles: `label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap`,
		},
		bo = function (e) {
			return F(`span`, M({ css: yo }, e));
		},
		xo = {
			guidance: function (e) {
				var t = e.isSearchable,
					n = e.isMulti,
					r = e.tabSelectsValue,
					i = e.context,
					a = e.isInitialFocus;
				switch (i) {
					case `menu`:
						return `Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu${r ? `, press Tab to select the option and exit the menu` : ``}.`;
					case `input`:
						return a
							? `${e[`aria-label`] || `Select`} is focused ${t ? `,type to refine list` : ``}, press Down to open the menu, ${n ? ` press left to focus selected values` : ``}`
							: ``;
					case `value`:
						return `Use left and right to toggle between focused values, press Backspace to remove the currently focused value`;
					default:
						return ``;
				}
			},
			onChange: function (e) {
				var t = e.action,
					n = e.label,
					r = n === void 0 ? `` : n,
					i = e.labels,
					a = e.isDisabled;
				switch (t) {
					case `deselect-option`:
					case `pop-value`:
					case `remove-value`:
						return `option ${r}, deselected.`;
					case `clear`:
						return `All selected options have been cleared.`;
					case `initial-input-focus`:
						return `option${i.length > 1 ? `s` : ``} ${i.join(`,`)}, selected.`;
					case `select-option`:
						return a
							? `option ${r} is disabled. Select another option.`
							: `option ${r}, selected.`;
					default:
						return ``;
				}
			},
			onFocus: function (e) {
				var t = e.context,
					n = e.focused,
					r = e.options,
					i = e.label,
					a = i === void 0 ? `` : i,
					o = e.selectValue,
					s = e.isDisabled,
					c = e.isSelected,
					l = e.isAppleDevice,
					u = function (e, t) {
						return e && e.length
							? `${e.indexOf(t) + 1} of ${e.length}`
							: ``;
					};
				return t === `value` && o
					? `value ${a} focused, ${u(o, n)}.`
					: t === `menu` && l
						? `${a}${`${c ? ` selected` : ``}${s ? ` disabled` : ``}`}, ${u(r, n)}.`
						: ``;
			},
			onFilter: function (e) {
				var t = e.inputValue;
				return `${e.resultsMessage}${t ? ` for search term ` + t : ``}.`;
			},
		},
		So = function (e) {
			var t = e.ariaSelection,
				n = e.focusedOption,
				r = e.focusedValue,
				i = e.focusableOptions,
				a = e.isFocused,
				o = e.selectValue,
				s = e.selectProps,
				c = e.id,
				l = e.isAppleDevice,
				u = s.ariaLiveMessages,
				d = s.getOptionLabel,
				f = s.inputValue,
				p = s.isMulti,
				m = s.isOptionDisabled,
				h = s.isSearchable,
				g = s.menuIsOpen,
				_ = s.options,
				v = s.screenReaderStatus,
				y = s.tabSelectsValue,
				b = s.isLoading,
				x = s[`aria-label`],
				S = s[`aria-live`],
				C = (0, k.useMemo)(
					function () {
						return j(j({}, xo), u || {});
					},
					[u],
				),
				w = (0, k.useMemo)(
					function () {
						var e = ``;
						if (t && C.onChange) {
							var n = t.option,
								r = t.options,
								i = t.removedValue,
								a = t.removedValues,
								s = t.value,
								c =
									i ||
									n ||
									(function (e) {
										return Array.isArray(e) ? null : e;
									})(s),
								l = c ? d(c) : ``,
								u = r || a || void 0,
								f = u ? u.map(d) : [],
								p = j(
									{
										isDisabled: c && m(c, o),
										label: l,
										labels: f,
									},
									t,
								);
							e = C.onChange(p);
						}
						return e;
					},
					[t, C, m, o, d],
				),
				ee = (0, k.useMemo)(
					function () {
						var e = ``,
							t = n || r,
							a = !!(n && o && o.includes(n));
						if (t && C.onFocus) {
							var s = {
								focused: t,
								label: d(t),
								isDisabled: m(t, o),
								isSelected: a,
								options: i,
								context: t === n ? `menu` : `value`,
								selectValue: o,
								isAppleDevice: l,
							};
							e = C.onFocus(s);
						}
						return e;
					},
					[n, r, d, m, C, i, o, l],
				),
				T = (0, k.useMemo)(
					function () {
						var e = ``;
						if (g && _.length && !b && C.onFilter) {
							var t = v({ count: i.length });
							e = C.onFilter({
								inputValue: f,
								resultsMessage: t,
							});
						}
						return e;
					},
					[i, f, g, C, _, v, b],
				),
				te = t?.action === `initial-input-focus`,
				ne = (0, k.useMemo)(
					function () {
						var e = ``;
						if (C.guidance) {
							var t = r ? `value` : g ? `menu` : `input`;
							e = C.guidance({
								"aria-label": x,
								context: t,
								isDisabled: n && m(n, o),
								isMulti: p,
								isSearchable: h,
								tabSelectsValue: y,
								isInitialFocus: te,
							});
						}
						return e;
					},
					[x, n, r, p, m, h, g, C, o, y, te],
				),
				re = F(
					k.Fragment,
					null,
					F(`span`, { id: `aria-selection` }, w),
					F(`span`, { id: `aria-focused` }, ee),
					F(`span`, { id: `aria-results` }, T),
					F(`span`, { id: `aria-guidance` }, ne),
				);
			return F(
				k.Fragment,
				null,
				F(bo, { id: c }, te && re),
				F(
					bo,
					{
						"aria-live": S,
						"aria-atomic": `false`,
						"aria-relevant": `additions text`,
						role: `log`,
					},
					a && !te && re,
				),
			);
		},
		V = [
			{ base: `A`, letters: `AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ` },
			{ base: `AA`, letters: `Ꜳ` },
			{ base: `AE`, letters: `ÆǼǢ` },
			{ base: `AO`, letters: `Ꜵ` },
			{ base: `AU`, letters: `Ꜷ` },
			{ base: `AV`, letters: `ꜸꜺ` },
			{ base: `AY`, letters: `Ꜽ` },
			{ base: `B`, letters: `BⒷＢḂḄḆɃƂƁ` },
			{ base: `C`, letters: `CⒸＣĆĈĊČÇḈƇȻꜾ` },
			{ base: `D`, letters: `DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ` },
			{ base: `DZ`, letters: `ǱǄ` },
			{ base: `Dz`, letters: `ǲǅ` },
			{ base: `E`, letters: `EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ` },
			{ base: `F`, letters: `FⒻＦḞƑꝻ` },
			{ base: `G`, letters: `GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ` },
			{ base: `H`, letters: `HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ` },
			{ base: `I`, letters: `IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ` },
			{ base: `J`, letters: `JⒿＪĴɈ` },
			{ base: `K`, letters: `KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ` },
			{ base: `L`, letters: `LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ` },
			{ base: `LJ`, letters: `Ǉ` },
			{ base: `Lj`, letters: `ǈ` },
			{ base: `M`, letters: `MⓂＭḾṀṂⱮƜ` },
			{ base: `N`, letters: `NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ` },
			{ base: `NJ`, letters: `Ǌ` },
			{ base: `Nj`, letters: `ǋ` },
			{
				base: `O`,
				letters: `OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ`,
			},
			{ base: `OI`, letters: `Ƣ` },
			{ base: `OO`, letters: `Ꝏ` },
			{ base: `OU`, letters: `Ȣ` },
			{ base: `P`, letters: `PⓅＰṔṖƤⱣꝐꝒꝔ` },
			{ base: `Q`, letters: `QⓆＱꝖꝘɊ` },
			{ base: `R`, letters: `RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ` },
			{ base: `S`, letters: `SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ` },
			{ base: `T`, letters: `TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ` },
			{ base: `TZ`, letters: `Ꜩ` },
			{ base: `U`, letters: `UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ` },
			{ base: `V`, letters: `VⓋＶṼṾƲꝞɅ` },
			{ base: `VY`, letters: `Ꝡ` },
			{ base: `W`, letters: `WⓌＷẀẂŴẆẄẈⱲ` },
			{ base: `X`, letters: `XⓍＸẊẌ` },
			{ base: `Y`, letters: `YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ` },
			{ base: `Z`, letters: `ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ` },
			{ base: `a`, letters: `aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ` },
			{ base: `aa`, letters: `ꜳ` },
			{ base: `ae`, letters: `æǽǣ` },
			{ base: `ao`, letters: `ꜵ` },
			{ base: `au`, letters: `ꜷ` },
			{ base: `av`, letters: `ꜹꜻ` },
			{ base: `ay`, letters: `ꜽ` },
			{ base: `b`, letters: `bⓑｂḃḅḇƀƃɓ` },
			{ base: `c`, letters: `cⓒｃćĉċčçḉƈȼꜿↄ` },
			{ base: `d`, letters: `dⓓｄḋďḍḑḓḏđƌɖɗꝺ` },
			{ base: `dz`, letters: `ǳǆ` },
			{ base: `e`, letters: `eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ` },
			{ base: `f`, letters: `fⓕｆḟƒꝼ` },
			{ base: `g`, letters: `gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ` },
			{ base: `h`, letters: `hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ` },
			{ base: `hv`, letters: `ƕ` },
			{ base: `i`, letters: `iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı` },
			{ base: `j`, letters: `jⓙｊĵǰɉ` },
			{ base: `k`, letters: `kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ` },
			{ base: `l`, letters: `lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ` },
			{ base: `lj`, letters: `ǉ` },
			{ base: `m`, letters: `mⓜｍḿṁṃɱɯ` },
			{ base: `n`, letters: `nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ` },
			{ base: `nj`, letters: `ǌ` },
			{
				base: `o`,
				letters: `oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ`,
			},
			{ base: `oi`, letters: `ƣ` },
			{ base: `ou`, letters: `ȣ` },
			{ base: `oo`, letters: `ꝏ` },
			{ base: `p`, letters: `pⓟｐṕṗƥᵽꝑꝓꝕ` },
			{ base: `q`, letters: `qⓠｑɋꝗꝙ` },
			{ base: `r`, letters: `rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ` },
			{ base: `s`, letters: `sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ` },
			{ base: `t`, letters: `tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ` },
			{ base: `tz`, letters: `ꜩ` },
			{ base: `u`, letters: `uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ` },
			{ base: `v`, letters: `vⓥｖṽṿʋꝟʌ` },
			{ base: `vy`, letters: `ꝡ` },
			{ base: `w`, letters: `wⓦｗẁẃŵẇẅẘẉⱳ` },
			{ base: `x`, letters: `xⓧｘẋẍ` },
			{ base: `y`, letters: `yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ` },
			{ base: `z`, letters: `zⓩｚźẑżžẓẕƶȥɀⱬꝣ` },
		],
		Co = RegExp(
			`[` +
				V.map(function (e) {
					return e.letters;
				}).join(``) +
				`]`,
			`g`,
		),
		wo = {},
		To = 0;
	To < V.length;
	To++
)
	for (var Eo = V[To], Do = 0; Do < Eo.letters.length; Do++)
		wo[Eo.letters[Do]] = Eo.base;
var Oo = function (e) {
		return e.replace(Co, function (e) {
			return wo[e];
		});
	},
	ko = vo(Oo),
	Ao = function (e) {
		return e.replace(/^\s+|\s+$/g, ``);
	},
	jo = function (e) {
		return `${e.label} ${e.value}`;
	},
	Mo = function (e) {
		return function (t, n) {
			if (t.data.__isNew__) return !0;
			var r = j(
					{
						ignoreCase: !0,
						ignoreAccents: !0,
						stringify: jo,
						trim: !0,
						matchFrom: `any`,
					},
					e,
				),
				i = r.ignoreCase,
				a = r.ignoreAccents,
				o = r.stringify,
				s = r.trim,
				c = r.matchFrom,
				l = s ? Ao(n) : n,
				u = s ? Ao(o(t)) : o(t);
			return (
				i && ((l = l.toLowerCase()), (u = u.toLowerCase())),
				a && ((l = ko(l)), (u = Oo(u))),
				c === `start` ? u.substr(0, l.length) === l : u.indexOf(l) > -1
			);
		};
	},
	No = [`innerRef`];
function Po(e) {
	var t = e.innerRef,
		n = Qi(Pt(e, No), `onExited`, `in`, `enter`, `exit`, `appear`);
	return F(
		`input`,
		M({ ref: t }, n, {
			css: Wr(
				{
					label: `dummyInput`,
					background: 0,
					border: 0,
					caretColor: `transparent`,
					fontSize: `inherit`,
					gridArea: `1 / 1 / 2 / 3`,
					outline: 0,
					padding: 0,
					width: 1,
					color: `transparent`,
					left: -100,
					opacity: 0,
					position: `relative`,
					transform: `scale(.01)`,
				},
				``,
				``,
			),
		}),
	);
}
var Fo = function (e) {
	(e.cancelable && e.preventDefault(), e.stopPropagation());
};
function Io(e) {
	var t = e.isEnabled,
		n = e.onBottomArrive,
		r = e.onBottomLeave,
		i = e.onTopArrive,
		a = e.onTopLeave,
		o = (0, k.useRef)(!1),
		s = (0, k.useRef)(!1),
		c = (0, k.useRef)(0),
		l = (0, k.useRef)(null),
		u = (0, k.useCallback)(
			function (e, t) {
				if (l.current !== null) {
					var c = l.current,
						u = c.scrollTop,
						d = c.scrollHeight,
						f = c.clientHeight,
						p = l.current,
						m = t > 0,
						h = d - f - u,
						g = !1;
					(h > t && o.current && (r && r(e), (o.current = !1)),
						m && s.current && (a && a(e), (s.current = !1)),
						m && t > h
							? (n && !o.current && n(e),
								(p.scrollTop = d),
								(g = !0),
								(o.current = !0))
							: !m &&
								-t > u &&
								(i && !s.current && i(e),
								(p.scrollTop = 0),
								(g = !0),
								(s.current = !0)),
						g && Fo(e));
				}
			},
			[n, r, i, a],
		),
		d = (0, k.useCallback)(
			function (e) {
				u(e, e.deltaY);
			},
			[u],
		),
		f = (0, k.useCallback)(function (e) {
			c.current = e.changedTouches[0].clientY;
		}, []),
		p = (0, k.useCallback)(
			function (e) {
				u(e, c.current - e.changedTouches[0].clientY);
			},
			[u],
		),
		m = (0, k.useCallback)(
			function (e) {
				if (e) {
					var t = Ki ? { passive: !1 } : !1;
					(e.addEventListener(`wheel`, d, t),
						e.addEventListener(`touchstart`, f, t),
						e.addEventListener(`touchmove`, p, t));
				}
			},
			[p, f, d],
		),
		h = (0, k.useCallback)(
			function (e) {
				e &&
					(e.removeEventListener(`wheel`, d, !1),
					e.removeEventListener(`touchstart`, f, !1),
					e.removeEventListener(`touchmove`, p, !1));
			},
			[p, f, d],
		);
	return (
		(0, k.useEffect)(
			function () {
				if (t) {
					var e = l.current;
					return (
						m(e),
						function () {
							h(e);
						}
					);
				}
			},
			[t, m, h],
		),
		function (e) {
			l.current = e;
		}
	);
}
var Lo = [`boxSizing`, `height`, `overflow`, `paddingRight`, `position`],
	Ro = {
		boxSizing: `border-box`,
		overflow: `hidden`,
		position: `relative`,
		height: `100%`,
	};
function zo(e) {
	e.cancelable && e.preventDefault();
}
function Bo(e) {
	e.stopPropagation();
}
function Vo() {
	var e = this.scrollTop,
		t = this.scrollHeight,
		n = e + this.offsetHeight;
	e === 0 ? (this.scrollTop = 1) : n === t && (this.scrollTop = e - 1);
}
function Ho() {
	return `ontouchstart` in window || navigator.maxTouchPoints;
}
var Uo = !!(
		typeof window < `u` &&
		window.document &&
		window.document.createElement
	),
	Wo = 0,
	Go = { capture: !1, passive: !1 };
function Ko(e) {
	var t = e.isEnabled,
		n = e.accountForScrollbars,
		r = n === void 0 ? !0 : n,
		i = (0, k.useRef)({}),
		a = (0, k.useRef)(null),
		o = (0, k.useCallback)(
			function (e) {
				if (Uo) {
					var t = document.body,
						n = t && t.style;
					if (
						(r &&
							Lo.forEach(function (e) {
								var t = n && n[e];
								i.current[e] = t;
							}),
						r && Wo < 1)
					) {
						var a = parseInt(i.current.paddingRight, 10) || 0,
							o = document.body ? document.body.clientWidth : 0,
							s = window.innerWidth - o + a || 0;
						(Object.keys(Ro).forEach(function (e) {
							var t = Ro[e];
							n && (n[e] = t);
						}),
							n && (n.paddingRight = `${s}px`));
					}
					(t &&
						Ho() &&
						(t.addEventListener(`touchmove`, zo, Go),
						e &&
							(e.addEventListener(`touchstart`, Vo, Go),
							e.addEventListener(`touchmove`, Bo, Go))),
						(Wo += 1));
				}
			},
			[r],
		),
		s = (0, k.useCallback)(
			function (e) {
				if (Uo) {
					var t = document.body,
						n = t && t.style;
					((Wo = Math.max(Wo - 1, 0)),
						r &&
							Wo < 1 &&
							Lo.forEach(function (e) {
								var t = i.current[e];
								n && (n[e] = t);
							}),
						t &&
							Ho() &&
							(t.removeEventListener(`touchmove`, zo, Go),
							e &&
								(e.removeEventListener(`touchstart`, Vo, Go),
								e.removeEventListener(`touchmove`, Bo, Go))));
				}
			},
			[r],
		);
	return (
		(0, k.useEffect)(
			function () {
				if (t) {
					var e = a.current;
					return (
						o(e),
						function () {
							s(e);
						}
					);
				}
			},
			[t, o, s],
		),
		function (e) {
			a.current = e;
		}
	);
}
var qo = function (e) {
		var t = e.target;
		return (
			t.ownerDocument.activeElement &&
			t.ownerDocument.activeElement.blur()
		);
	},
	Jo = {
		name: `1kfdb0e`,
		styles: `position:fixed;left:0;bottom:0;right:0;top:0`,
	};
function Yo(e) {
	var t = e.children,
		n = e.lockEnabled,
		r = e.captureEnabled,
		i = r === void 0 ? !0 : r,
		a = e.onBottomArrive,
		o = e.onBottomLeave,
		s = e.onTopArrive,
		c = e.onTopLeave,
		l = Io({
			isEnabled: i,
			onBottomArrive: a,
			onBottomLeave: o,
			onTopArrive: s,
			onTopLeave: c,
		}),
		u = Ko({ isEnabled: n });
	return F(
		k.Fragment,
		null,
		n && F(`div`, { onClick: qo, css: Jo }),
		t(function (e) {
			(l(e), u(e));
		}),
	);
}
var Xo = {
		name: `1a0ro4n-requiredInput`,
		styles: `label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%`,
	},
	Zo = function (e) {
		var t = e.name,
			n = e.onFocus;
		return F(`input`, {
			required: !0,
			name: t,
			tabIndex: -1,
			"aria-hidden": `true`,
			onFocus: n,
			css: Xo,
			value: ``,
			onChange: function () {},
		});
	};
function Qo(e) {
	return typeof window < `u` && window.navigator != null
		? e.test(
				window.navigator.userAgentData?.platform ||
					window.navigator.platform,
			)
		: !1;
}
function $o() {
	return Qo(/^iPhone/i);
}
function es() {
	return Qo(/^Mac/i);
}
function ts() {
	return Qo(/^iPad/i) || (es() && navigator.maxTouchPoints > 1);
}
function ns() {
	return $o() || ts();
}
function rs() {
	return es() || ns();
}
var is = function (e) {
		return e.label;
	},
	as = function (e) {
		return e.label;
	},
	os = function (e) {
		return e.value;
	},
	ss = function (e) {
		return !!e.isDisabled;
	},
	cs = {
		clearIndicator: Na,
		container: _a,
		control: Va,
		dropdownIndicator: ja,
		group: Wa,
		groupHeading: Ka,
		indicatorsContainer: xa,
		indicatorSeparator: Fa,
		input: Xa,
		loadingIndicator: Ra,
		loadingMessage: fa,
		menu: ia,
		menuList: ca,
		menuPortal: ha,
		multiValue: to,
		multiValueLabel: no,
		multiValueRemove: ro,
		noOptionsMessage: da,
		option: lo,
		placeholder: fo,
		singleValue: mo,
		valueContainer: ya,
	},
	ls = {
		primary: `#2684FF`,
		primary75: `#4C9AFF`,
		primary50: `#B2D4FF`,
		primary25: `#DEEBFF`,
		danger: `#DE350B`,
		dangerLight: `#FFBDAD`,
		neutral0: `hsl(0, 0%, 100%)`,
		neutral5: `hsl(0, 0%, 95%)`,
		neutral10: `hsl(0, 0%, 90%)`,
		neutral20: `hsl(0, 0%, 80%)`,
		neutral30: `hsl(0, 0%, 70%)`,
		neutral40: `hsl(0, 0%, 60%)`,
		neutral50: `hsl(0, 0%, 50%)`,
		neutral60: `hsl(0, 0%, 40%)`,
		neutral70: `hsl(0, 0%, 30%)`,
		neutral80: `hsl(0, 0%, 20%)`,
		neutral90: `hsl(0, 0%, 10%)`,
	},
	us = 4,
	ds = 4,
	fs = {
		borderRadius: us,
		colors: ls,
		spacing: { baseUnit: ds, controlHeight: 38, menuGutter: ds * 2 },
	},
	ps = {
		"aria-live": `polite`,
		backspaceRemovesValue: !0,
		blurInputOnSelect: Vi(),
		captureMenuScroll: !Vi(),
		classNames: {},
		closeMenuOnSelect: !0,
		closeMenuOnScroll: !1,
		components: {},
		controlShouldRenderValue: !0,
		escapeClearsValue: !1,
		filterOption: Mo(),
		formatGroupLabel: is,
		getOptionLabel: as,
		getOptionValue: os,
		isDisabled: !1,
		isLoading: !1,
		isMulti: !1,
		isRtl: !1,
		isSearchable: !0,
		isOptionDisabled: ss,
		loadingMessage: function () {
			return `Loading...`;
		},
		maxMenuHeight: 300,
		minMenuHeight: 140,
		menuIsOpen: !1,
		menuPlacement: `bottom`,
		menuPosition: `absolute`,
		menuShouldBlockScroll: !1,
		menuShouldScrollIntoView: !Hi(),
		noOptionsMessage: function () {
			return `No options`;
		},
		openMenuOnFocus: !1,
		openMenuOnClick: !0,
		options: [],
		pageSize: 5,
		placeholder: `Select...`,
		screenReaderStatus: function (e) {
			var t = e.count;
			return `${t} result${t === 1 ? `` : `s`} available`;
		},
		styles: {},
		tabIndex: 0,
		tabSelectsValue: !0,
		unstyled: !1,
	};
function ms(e, t, n, r) {
	return {
		type: `option`,
		data: t,
		isDisabled: Ts(e, t, n),
		isSelected: Es(e, t, n),
		label: Cs(e, t),
		value: ws(e, t),
		index: r,
	};
}
function hs(e, t) {
	return e.options
		.map(function (n, r) {
			if (`options` in n) {
				var i = n.options
					.map(function (n, r) {
						return ms(e, n, t, r);
					})
					.filter(function (t) {
						return ys(e, t);
					});
				return i.length > 0
					? { type: `group`, data: n, options: i, index: r }
					: void 0;
			}
			var a = ms(e, n, t, r);
			return ys(e, a) ? a : void 0;
		})
		.filter(qi);
}
function gs(e) {
	return e.reduce(function (e, t) {
		return (
			t.type === `group`
				? e.push.apply(
						e,
						Xt(
							t.options.map(function (e) {
								return e.data;
							}),
						),
					)
				: e.push(t.data),
			e
		);
	}, []);
}
function _s(e, t) {
	return e.reduce(function (e, n) {
		return (
			n.type === `group`
				? e.push.apply(
						e,
						Xt(
							n.options.map(function (e) {
								return {
									data: e.data,
									id: `${t}-${n.index}-${e.index}`,
								};
							}),
						),
					)
				: e.push({ data: n.data, id: `${t}-${n.index}` }),
			e
		);
	}, []);
}
function vs(e, t) {
	return gs(hs(e, t));
}
function ys(e, t) {
	var n = e.inputValue,
		r = n === void 0 ? `` : n,
		i = t.data,
		a = t.isSelected,
		o = t.label,
		s = t.value;
	return (!Os(e) || !a) && Ds(e, { label: o, value: s, data: i }, r);
}
function bs(e, t) {
	var n = e.focusedValue,
		r = e.selectValue.indexOf(n);
	if (r > -1) {
		if (t.indexOf(n) > -1) return n;
		if (r < t.length) return t[r];
	}
	return null;
}
function xs(e, t) {
	var n = e.focusedOption;
	return n && t.indexOf(n) > -1 ? n : t[0];
}
var Ss = function (e, t) {
		return (
			e.find(function (e) {
				return e.data === t;
			})?.id || null
		);
	},
	Cs = function (e, t) {
		return e.getOptionLabel(t);
	},
	ws = function (e, t) {
		return e.getOptionValue(t);
	};
function Ts(e, t, n) {
	return typeof e.isOptionDisabled == `function`
		? e.isOptionDisabled(t, n)
		: !1;
}
function Es(e, t, n) {
	if (n.indexOf(t) > -1) return !0;
	if (typeof e.isOptionSelected == `function`)
		return e.isOptionSelected(t, n);
	var r = ws(e, t);
	return n.some(function (t) {
		return ws(e, t) === r;
	});
}
function Ds(e, t, n) {
	return e.filterOption ? e.filterOption(t, n) : !0;
}
var Os = function (e) {
		var t = e.hideSelectedOptions,
			n = e.isMulti;
		return t === void 0 ? n : t;
	},
	ks = 1,
	As = (function (e) {
		Vt(n, e);
		var t = Kt(n);
		function n(e) {
			var r;
			if (
				(Lt(this, n),
				(r = t.call(this, e)),
				(r.state = {
					ariaSelection: null,
					focusedOption: null,
					focusedOptionId: null,
					focusableOptionsWithIds: [],
					focusedValue: null,
					inputIsHidden: !1,
					isFocused: !1,
					selectValue: [],
					clearFocusValueOnUpdate: !1,
					prevWasFocused: !1,
					inputIsHiddenAfterUpdate: void 0,
					prevProps: void 0,
					instancePrefix: ``,
					isAppleDevice: !1,
				}),
				(r.blockOptionHover = !1),
				(r.isComposing = !1),
				(r.commonProps = void 0),
				(r.initialTouchX = 0),
				(r.initialTouchY = 0),
				(r.openAfterFocus = !1),
				(r.scrollToFocusedOptionOnUpdate = !1),
				(r.userIsDragging = void 0),
				(r.controlRef = null),
				(r.getControlRef = function (e) {
					r.controlRef = e;
				}),
				(r.focusedOptionRef = null),
				(r.getFocusedOptionRef = function (e) {
					r.focusedOptionRef = e;
				}),
				(r.menuListRef = null),
				(r.getMenuListRef = function (e) {
					r.menuListRef = e;
				}),
				(r.inputRef = null),
				(r.getInputRef = function (e) {
					r.inputRef = e;
				}),
				(r.focus = r.focusInput),
				(r.blur = r.blurInput),
				(r.onChange = function (e, t) {
					var n = r.props,
						i = n.onChange;
					((t.name = n.name), r.ariaOnChange(e, t), i(e, t));
				}),
				(r.setValue = function (e, t, n) {
					var i = r.props,
						a = i.closeMenuOnSelect,
						o = i.isMulti,
						s = i.inputValue;
					(r.onInputChange(``, {
						action: `set-value`,
						prevInputValue: s,
					}),
						a &&
							(r.setState({ inputIsHiddenAfterUpdate: !o }),
							r.onMenuClose()),
						r.setState({ clearFocusValueOnUpdate: !0 }),
						r.onChange(e, { action: t, option: n }));
				}),
				(r.selectOption = function (e) {
					var t = r.props,
						n = t.blurInputOnSelect,
						i = t.isMulti,
						a = t.name,
						o = r.state.selectValue,
						s = i && r.isOptionSelected(e, o),
						c = r.isOptionDisabled(e, o);
					if (s) {
						var l = r.getOptionValue(e);
						r.setValue(
							Zi(
								o.filter(function (e) {
									return r.getOptionValue(e) !== l;
								}),
							),
							`deselect-option`,
							e,
						);
					} else if (!c)
						i
							? r.setValue(
									Zi([].concat(Xt(o), [e])),
									`select-option`,
									e,
								)
							: r.setValue(Xi(e), `select-option`);
					else {
						r.ariaOnChange(Xi(e), {
							action: `select-option`,
							option: e,
							name: a,
						});
						return;
					}
					n && r.blurInput();
				}),
				(r.removeValue = function (e) {
					var t = r.props.isMulti,
						n = r.state.selectValue,
						i = r.getOptionValue(e),
						a = n.filter(function (e) {
							return r.getOptionValue(e) !== i;
						}),
						o = Yi(t, a, a[0] || null);
					(r.onChange(o, { action: `remove-value`, removedValue: e }),
						r.focusInput());
				}),
				(r.clearValue = function () {
					var e = r.state.selectValue;
					r.onChange(Yi(r.props.isMulti, [], null), {
						action: `clear`,
						removedValues: e,
					});
				}),
				(r.popValue = function () {
					var e = r.props.isMulti,
						t = r.state.selectValue,
						n = t[t.length - 1],
						i = t.slice(0, t.length - 1),
						a = Yi(e, i, i[0] || null);
					n &&
						r.onChange(a, { action: `pop-value`, removedValue: n });
				}),
				(r.getFocusedOptionId = function (e) {
					return Ss(r.state.focusableOptionsWithIds, e);
				}),
				(r.getFocusableOptionsWithIds = function () {
					return _s(
						hs(r.props, r.state.selectValue),
						r.getElementId(`option`),
					);
				}),
				(r.getValue = function () {
					return r.state.selectValue;
				}),
				(r.cx = function () {
					var e = [...arguments];
					return ji.apply(
						void 0,
						[r.props.classNamePrefix].concat(e),
					);
				}),
				(r.getOptionLabel = function (e) {
					return Cs(r.props, e);
				}),
				(r.getOptionValue = function (e) {
					return ws(r.props, e);
				}),
				(r.getStyles = function (e, t) {
					var n = r.props.unstyled,
						i = cs[e](t, n);
					i.boxSizing = `border-box`;
					var a = r.props.styles[e];
					return a ? a(i, t) : i;
				}),
				(r.getClassNames = function (e, t) {
					var n;
					return (n = r.props.classNames)[e]?.call(n, t);
				}),
				(r.getElementId = function (e) {
					return `${r.state.instancePrefix}-${e}`;
				}),
				(r.getComponents = function () {
					return B(r.props);
				}),
				(r.buildCategorizedOptions = function () {
					return hs(r.props, r.state.selectValue);
				}),
				(r.getCategorizedOptions = function () {
					return r.props.menuIsOpen
						? r.buildCategorizedOptions()
						: [];
				}),
				(r.buildFocusableOptions = function () {
					return gs(r.buildCategorizedOptions());
				}),
				(r.getFocusableOptions = function () {
					return r.props.menuIsOpen ? r.buildFocusableOptions() : [];
				}),
				(r.ariaOnChange = function (e, t) {
					r.setState({ ariaSelection: j({ value: e }, t) });
				}),
				(r.onMenuMouseDown = function (e) {
					e.button === 0 &&
						(e.stopPropagation(),
						e.preventDefault(),
						r.focusInput());
				}),
				(r.onMenuMouseMove = function (e) {
					r.blockOptionHover = !1;
				}),
				(r.onControlMouseDown = function (e) {
					if (!e.defaultPrevented) {
						var t = r.props.openMenuOnClick;
						(r.state.isFocused
							? r.props.menuIsOpen
								? e.target.tagName !== `INPUT` &&
									e.target.tagName !== `TEXTAREA` &&
									r.onMenuClose()
								: t && r.openMenu(`first`)
							: (t && (r.openAfterFocus = !0), r.focusInput()),
							e.target.tagName !== `INPUT` &&
								e.target.tagName !== `TEXTAREA` &&
								e.preventDefault());
					}
				}),
				(r.onDropdownIndicatorMouseDown = function (e) {
					if (
						!(e && e.type === `mousedown` && e.button !== 0) &&
						!r.props.isDisabled
					) {
						var t = r.props,
							n = t.isMulti,
							i = t.menuIsOpen;
						(r.focusInput(),
							i
								? (r.setState({ inputIsHiddenAfterUpdate: !n }),
									r.onMenuClose())
								: r.openMenu(`first`),
							e.preventDefault());
					}
				}),
				(r.onClearIndicatorMouseDown = function (e) {
					(e && e.type === `mousedown` && e.button !== 0) ||
						(r.clearValue(),
						e.preventDefault(),
						(r.openAfterFocus = !1),
						e.type === `touchend`
							? r.focusInput()
							: setTimeout(function () {
									return r.focusInput();
								}));
				}),
				(r.onScroll = function (e) {
					typeof r.props.closeMenuOnScroll == `boolean`
						? e.target instanceof HTMLElement &&
							Pi(e.target) &&
							r.props.onMenuClose()
						: typeof r.props.closeMenuOnScroll == `function` &&
							r.props.closeMenuOnScroll(e) &&
							r.props.onMenuClose();
				}),
				(r.onCompositionStart = function () {
					r.isComposing = !0;
				}),
				(r.onCompositionEnd = function () {
					r.isComposing = !1;
				}),
				(r.onTouchStart = function (e) {
					var t = e.touches,
						n = t && t.item(0);
					n &&
						((r.initialTouchX = n.clientX),
						(r.initialTouchY = n.clientY),
						(r.userIsDragging = !1));
				}),
				(r.onTouchMove = function (e) {
					var t = e.touches,
						n = t && t.item(0);
					if (n) {
						var i = Math.abs(n.clientX - r.initialTouchX),
							a = Math.abs(n.clientY - r.initialTouchY),
							o = 5;
						r.userIsDragging = i > o || a > o;
					}
				}),
				(r.onTouchEnd = function (e) {
					r.userIsDragging ||
						(r.controlRef &&
							!r.controlRef.contains(e.target) &&
							r.menuListRef &&
							!r.menuListRef.contains(e.target) &&
							r.blurInput(),
						(r.initialTouchX = 0),
						(r.initialTouchY = 0));
				}),
				(r.onControlTouchEnd = function (e) {
					r.userIsDragging || r.onControlMouseDown(e);
				}),
				(r.onClearIndicatorTouchEnd = function (e) {
					r.userIsDragging || r.onClearIndicatorMouseDown(e);
				}),
				(r.onDropdownIndicatorTouchEnd = function (e) {
					r.userIsDragging || r.onDropdownIndicatorMouseDown(e);
				}),
				(r.handleInputChange = function (e) {
					var t = r.props.inputValue,
						n = e.currentTarget.value;
					(r.setState({ inputIsHiddenAfterUpdate: !1 }),
						r.onInputChange(n, {
							action: `input-change`,
							prevInputValue: t,
						}),
						r.props.menuIsOpen || r.onMenuOpen());
				}),
				(r.onInputFocus = function (e) {
					(r.props.onFocus && r.props.onFocus(e),
						r.setState({
							inputIsHiddenAfterUpdate: !1,
							isFocused: !0,
						}),
						(r.openAfterFocus || r.props.openMenuOnFocus) &&
							r.openMenu(`first`),
						(r.openAfterFocus = !1));
				}),
				(r.onInputBlur = function (e) {
					var t = r.props.inputValue;
					if (
						r.menuListRef &&
						r.menuListRef.contains(document.activeElement)
					) {
						r.inputRef.focus();
						return;
					}
					(r.props.onBlur && r.props.onBlur(e),
						r.onInputChange(``, {
							action: `input-blur`,
							prevInputValue: t,
						}),
						r.onMenuClose(),
						r.setState({ focusedValue: null, isFocused: !1 }));
				}),
				(r.onOptionHover = function (e) {
					if (!(r.blockOptionHover || r.state.focusedOption === e)) {
						var t = r.getFocusableOptions().indexOf(e);
						r.setState({
							focusedOption: e,
							focusedOptionId:
								t > -1 ? r.getFocusedOptionId(e) : null,
						});
					}
				}),
				(r.shouldHideSelectedOptions = function () {
					return Os(r.props);
				}),
				(r.onValueInputFocus = function (e) {
					(e.preventDefault(), e.stopPropagation(), r.focus());
				}),
				(r.onKeyDown = function (e) {
					var t = r.props,
						n = t.isMulti,
						i = t.backspaceRemovesValue,
						a = t.escapeClearsValue,
						o = t.inputValue,
						s = t.isClearable,
						c = t.isDisabled,
						l = t.menuIsOpen,
						u = t.onKeyDown,
						d = t.tabSelectsValue,
						f = t.openMenuOnFocus,
						p = r.state,
						m = p.focusedOption,
						h = p.focusedValue,
						g = p.selectValue;
					if (
						!c &&
						!(typeof u == `function` && (u(e), e.defaultPrevented))
					) {
						switch (((r.blockOptionHover = !0), e.key)) {
							case `ArrowLeft`:
								if (!n || o) return;
								r.focusValue(`previous`);
								break;
							case `ArrowRight`:
								if (!n || o) return;
								r.focusValue(`next`);
								break;
							case `Delete`:
							case `Backspace`:
								if (o) return;
								if (h) r.removeValue(h);
								else {
									if (!i) return;
									n ? r.popValue() : s && r.clearValue();
								}
								break;
							case `Tab`:
								if (
									r.isComposing ||
									e.shiftKey ||
									!l ||
									!d ||
									!m ||
									(f && r.isOptionSelected(m, g))
								)
									return;
								r.selectOption(m);
								break;
							case `Enter`:
								if (e.keyCode === 229) break;
								if (l) {
									if (!m || r.isComposing) return;
									r.selectOption(m);
									break;
								}
								return;
							case `Escape`:
								l
									? (r.setState({
											inputIsHiddenAfterUpdate: !1,
										}),
										r.onInputChange(``, {
											action: `menu-close`,
											prevInputValue: o,
										}),
										r.onMenuClose())
									: s && a && r.clearValue();
								break;
							case ` `:
								if (o) return;
								if (!l) {
									r.openMenu(`first`);
									break;
								}
								if (!m) return;
								r.selectOption(m);
								break;
							case `ArrowUp`:
								l ? r.focusOption(`up`) : r.openMenu(`last`);
								break;
							case `ArrowDown`:
								l ? r.focusOption(`down`) : r.openMenu(`first`);
								break;
							case `PageUp`:
								if (!l) return;
								r.focusOption(`pageup`);
								break;
							case `PageDown`:
								if (!l) return;
								r.focusOption(`pagedown`);
								break;
							case `Home`:
								if (!l) return;
								r.focusOption(`first`);
								break;
							case `End`:
								if (!l) return;
								r.focusOption(`last`);
								break;
							default:
								return;
						}
						e.preventDefault();
					}
				}),
				(r.state.instancePrefix =
					`react-select-` + (r.props.instanceId || ++ks)),
				(r.state.selectValue = Mi(e.value)),
				e.menuIsOpen && r.state.selectValue.length)
			) {
				var i = r.getFocusableOptionsWithIds(),
					a = r.buildFocusableOptions(),
					o = a.indexOf(r.state.selectValue[0]);
				((r.state.focusableOptionsWithIds = i),
					(r.state.focusedOption = a[o]),
					(r.state.focusedOptionId = Ss(i, a[o])));
			}
			return r;
		}
		return (
			zt(
				n,
				[
					{
						key: `componentDidMount`,
						value: function () {
							(this.startListeningComposition(),
								this.startListeningToTouch(),
								this.props.closeMenuOnScroll &&
									document &&
									document.addEventListener &&
									document.addEventListener(
										`scroll`,
										this.onScroll,
										!0,
									),
								this.props.autoFocus && this.focusInput(),
								this.props.menuIsOpen &&
									this.state.focusedOption &&
									this.menuListRef &&
									this.focusedOptionRef &&
									zi(this.menuListRef, this.focusedOptionRef),
								rs() && this.setState({ isAppleDevice: !0 }));
						},
					},
					{
						key: `componentDidUpdate`,
						value: function (e) {
							var t = this.props,
								n = t.isDisabled,
								r = t.menuIsOpen,
								i = this.state.isFocused;
							(((i && !n && e.isDisabled) ||
								(i && r && !e.menuIsOpen)) &&
								this.focusInput(),
								i && n && !e.isDisabled
									? this.setState(
											{ isFocused: !1 },
											this.onMenuClose,
										)
									: !i &&
										!n &&
										e.isDisabled &&
										this.inputRef ===
											document.activeElement &&
										this.setState({ isFocused: !0 }),
								this.menuListRef &&
									this.focusedOptionRef &&
									this.scrollToFocusedOptionOnUpdate &&
									(zi(
										this.menuListRef,
										this.focusedOptionRef,
									),
									(this.scrollToFocusedOptionOnUpdate = !1)));
						},
					},
					{
						key: `componentWillUnmount`,
						value: function () {
							(this.stopListeningComposition(),
								this.stopListeningToTouch(),
								document.removeEventListener(
									`scroll`,
									this.onScroll,
									!0,
								));
						},
					},
					{
						key: `onMenuOpen`,
						value: function () {
							this.props.onMenuOpen();
						},
					},
					{
						key: `onMenuClose`,
						value: function () {
							(this.onInputChange(``, {
								action: `menu-close`,
								prevInputValue: this.props.inputValue,
							}),
								this.props.onMenuClose());
						},
					},
					{
						key: `onInputChange`,
						value: function (e, t) {
							this.props.onInputChange(e, t);
						},
					},
					{
						key: `focusInput`,
						value: function () {
							this.inputRef && this.inputRef.focus();
						},
					},
					{
						key: `blurInput`,
						value: function () {
							this.inputRef && this.inputRef.blur();
						},
					},
					{
						key: `openMenu`,
						value: function (e) {
							var t = this,
								n = this.state,
								r = n.selectValue,
								i = n.isFocused,
								a = this.buildFocusableOptions(),
								o = e === `first` ? 0 : a.length - 1;
							if (!this.props.isMulti) {
								var s = a.indexOf(r[0]);
								s > -1 && (o = s);
							}
							((this.scrollToFocusedOptionOnUpdate = !(
								i && this.menuListRef
							)),
								this.setState(
									{
										inputIsHiddenAfterUpdate: !1,
										focusedValue: null,
										focusedOption: a[o],
										focusedOptionId:
											this.getFocusedOptionId(a[o]),
									},
									function () {
										return t.onMenuOpen();
									},
								));
						},
					},
					{
						key: `focusValue`,
						value: function (e) {
							var t = this.state,
								n = t.selectValue,
								r = t.focusedValue;
							if (this.props.isMulti) {
								this.setState({ focusedOption: null });
								var i = n.indexOf(r);
								r || (i = -1);
								var a = n.length - 1,
									o = -1;
								if (n.length) {
									switch (e) {
										case `previous`:
											o =
												i === 0
													? 0
													: i === -1
														? a
														: i - 1;
											break;
										case `next`:
											i > -1 && i < a && (o = i + 1);
											break;
									}
									this.setState({
										inputIsHidden: o !== -1,
										focusedValue: n[o],
									});
								}
							}
						},
					},
					{
						key: `focusOption`,
						value: function () {
							var e =
									arguments.length > 0 &&
									arguments[0] !== void 0
										? arguments[0]
										: `first`,
								t = this.props.pageSize,
								n = this.state.focusedOption,
								r = this.getFocusableOptions();
							if (r.length) {
								var i = 0,
									a = r.indexOf(n);
								(n || (a = -1),
									e === `up`
										? (i = a > 0 ? a - 1 : r.length - 1)
										: e === `down`
											? (i = (a + 1) % r.length)
											: e === `pageup`
												? ((i = a - t),
													i < 0 && (i = 0))
												: e === `pagedown`
													? ((i = a + t),
														i > r.length - 1 &&
															(i = r.length - 1))
													: e === `last` &&
														(i = r.length - 1),
									(this.scrollToFocusedOptionOnUpdate = !0),
									this.setState({
										focusedOption: r[i],
										focusedValue: null,
										focusedOptionId:
											this.getFocusedOptionId(r[i]),
									}));
							}
						},
					},
					{
						key: `getTheme`,
						value: function () {
							return this.props.theme
								? typeof this.props.theme == `function`
									? this.props.theme(fs)
									: j(j({}, fs), this.props.theme)
								: fs;
						},
					},
					{
						key: `getCommonProps`,
						value: function () {
							var e = this.clearValue,
								t = this.cx,
								n = this.getStyles,
								r = this.getClassNames,
								i = this.getValue,
								a = this.selectOption,
								o = this.setValue,
								s = this.props,
								c = s.isMulti,
								l = s.isRtl,
								u = s.options;
							return {
								clearValue: e,
								cx: t,
								getStyles: n,
								getClassNames: r,
								getValue: i,
								hasValue: this.hasValue(),
								isMulti: c,
								isRtl: l,
								options: u,
								selectOption: a,
								selectProps: s,
								setValue: o,
								theme: this.getTheme(),
							};
						},
					},
					{
						key: `hasValue`,
						value: function () {
							return this.state.selectValue.length > 0;
						},
					},
					{
						key: `hasOptions`,
						value: function () {
							return !!this.getFocusableOptions().length;
						},
					},
					{
						key: `isClearable`,
						value: function () {
							var e = this.props,
								t = e.isClearable,
								n = e.isMulti;
							return t === void 0 ? n : t;
						},
					},
					{
						key: `isOptionDisabled`,
						value: function (e, t) {
							return Ts(this.props, e, t);
						},
					},
					{
						key: `isOptionSelected`,
						value: function (e, t) {
							return Es(this.props, e, t);
						},
					},
					{
						key: `filterOption`,
						value: function (e, t) {
							return Ds(this.props, e, t);
						},
					},
					{
						key: `formatOptionLabel`,
						value: function (e, t) {
							if (
								typeof this.props.formatOptionLabel ==
								`function`
							) {
								var n = this.props.inputValue,
									r = this.state.selectValue;
								return this.props.formatOptionLabel(e, {
									context: t,
									inputValue: n,
									selectValue: r,
								});
							} else return this.getOptionLabel(e);
						},
					},
					{
						key: `formatGroupLabel`,
						value: function (e) {
							return this.props.formatGroupLabel(e);
						},
					},
					{
						key: `startListeningComposition`,
						value: function () {
							document &&
								document.addEventListener &&
								(document.addEventListener(
									`compositionstart`,
									this.onCompositionStart,
									!1,
								),
								document.addEventListener(
									`compositionend`,
									this.onCompositionEnd,
									!1,
								));
						},
					},
					{
						key: `stopListeningComposition`,
						value: function () {
							document &&
								document.removeEventListener &&
								(document.removeEventListener(
									`compositionstart`,
									this.onCompositionStart,
								),
								document.removeEventListener(
									`compositionend`,
									this.onCompositionEnd,
								));
						},
					},
					{
						key: `startListeningToTouch`,
						value: function () {
							document &&
								document.addEventListener &&
								(document.addEventListener(
									`touchstart`,
									this.onTouchStart,
									!1,
								),
								document.addEventListener(
									`touchmove`,
									this.onTouchMove,
									!1,
								),
								document.addEventListener(
									`touchend`,
									this.onTouchEnd,
									!1,
								));
						},
					},
					{
						key: `stopListeningToTouch`,
						value: function () {
							document &&
								document.removeEventListener &&
								(document.removeEventListener(
									`touchstart`,
									this.onTouchStart,
								),
								document.removeEventListener(
									`touchmove`,
									this.onTouchMove,
								),
								document.removeEventListener(
									`touchend`,
									this.onTouchEnd,
								));
						},
					},
					{
						key: `renderInput`,
						value: function () {
							var e = this.props,
								t = e.isDisabled,
								n = e.isSearchable,
								r = e.inputId,
								i = e.inputValue,
								a = e.tabIndex,
								o = e.form,
								s = e.menuIsOpen,
								c = e.required,
								l = this.getComponents().Input,
								u = this.state,
								d = u.inputIsHidden,
								f = u.ariaSelection,
								p = this.commonProps,
								m = r || this.getElementId(`input`),
								h = j(
									j(
										j(
											{
												"aria-autocomplete": `list`,
												"aria-expanded": s,
												"aria-haspopup": !0,
												"aria-errormessage":
													this.props[
														`aria-errormessage`
													],
												"aria-invalid":
													this.props[`aria-invalid`],
												"aria-label":
													this.props[`aria-label`],
												"aria-labelledby":
													this.props[
														`aria-labelledby`
													],
												"aria-required": c,
												role: `combobox`,
												"aria-activedescendant": this
													.state.isAppleDevice
													? void 0
													: this.state
															.focusedOptionId ||
														``,
											},
											s && {
												"aria-controls":
													this.getElementId(
														`listbox`,
													),
											},
										),
										!n && { "aria-readonly": !0 },
									),
									this.hasValue()
										? f?.action ===
												`initial-input-focus` && {
												"aria-describedby":
													this.getElementId(
														`live-region`,
													),
											}
										: {
												"aria-describedby":
													this.getElementId(
														`placeholder`,
													),
											},
								);
							return n
								? k.createElement(
										l,
										M(
											{},
											p,
											{
												autoCapitalize: `none`,
												autoComplete: `off`,
												autoCorrect: `off`,
												id: m,
												innerRef: this.getInputRef,
												isDisabled: t,
												isHidden: d,
												onBlur: this.onInputBlur,
												onChange:
													this.handleInputChange,
												onFocus: this.onInputFocus,
												spellCheck: `false`,
												tabIndex: a,
												form: o,
												type: `text`,
												value: i,
											},
											h,
										),
									)
								: k.createElement(
										Po,
										M(
											{
												id: m,
												innerRef: this.getInputRef,
												onBlur: this.onInputBlur,
												onChange: ki,
												onFocus: this.onInputFocus,
												disabled: t,
												tabIndex: a,
												inputMode: `none`,
												form: o,
												value: ``,
											},
											h,
										),
									);
						},
					},
					{
						key: `renderPlaceholderOrValue`,
						value: function () {
							var e = this,
								t = this.getComponents(),
								n = t.MultiValue,
								r = t.MultiValueContainer,
								i = t.MultiValueLabel,
								a = t.MultiValueRemove,
								o = t.SingleValue,
								s = t.Placeholder,
								c = this.commonProps,
								l = this.props,
								u = l.controlShouldRenderValue,
								d = l.isDisabled,
								f = l.isMulti,
								p = l.inputValue,
								m = l.placeholder,
								h = this.state,
								g = h.selectValue,
								_ = h.focusedValue,
								v = h.isFocused;
							if (!this.hasValue() || !u)
								return p
									? null
									: k.createElement(
											s,
											M({}, c, {
												key: `placeholder`,
												isDisabled: d,
												isFocused: v,
												innerProps: {
													id: this.getElementId(
														`placeholder`,
													),
												},
											}),
											m,
										);
							if (f)
								return g.map(function (t, o) {
									var s = t === _,
										l = `${e.getOptionLabel(t)}-${e.getOptionValue(t)}`;
									return k.createElement(
										n,
										M({}, c, {
											components: {
												Container: r,
												Label: i,
												Remove: a,
											},
											isFocused: s,
											isDisabled: d,
											key: l,
											index: o,
											removeProps: {
												onClick: function () {
													return e.removeValue(t);
												},
												onTouchEnd: function () {
													return e.removeValue(t);
												},
												onMouseDown: function (e) {
													e.preventDefault();
												},
											},
											data: t,
										}),
										e.formatOptionLabel(t, `value`),
									);
								});
							if (p) return null;
							var y = g[0];
							return k.createElement(
								o,
								M({}, c, { data: y, isDisabled: d }),
								this.formatOptionLabel(y, `value`),
							);
						},
					},
					{
						key: `renderClearIndicator`,
						value: function () {
							var e = this.getComponents().ClearIndicator,
								t = this.commonProps,
								n = this.props,
								r = n.isDisabled,
								i = n.isLoading,
								a = this.state.isFocused;
							if (
								!this.isClearable() ||
								!e ||
								r ||
								!this.hasValue() ||
								i
							)
								return null;
							var o = {
								onMouseDown: this.onClearIndicatorMouseDown,
								onTouchEnd: this.onClearIndicatorTouchEnd,
								"aria-hidden": `true`,
							};
							return k.createElement(
								e,
								M({}, t, { innerProps: o, isFocused: a }),
							);
						},
					},
					{
						key: `renderLoadingIndicator`,
						value: function () {
							var e = this.getComponents().LoadingIndicator,
								t = this.commonProps,
								n = this.props,
								r = n.isDisabled,
								i = n.isLoading,
								a = this.state.isFocused;
							return !e || !i
								? null
								: k.createElement(
										e,
										M({}, t, {
											innerProps: {
												"aria-hidden": `true`,
											},
											isDisabled: r,
											isFocused: a,
										}),
									);
						},
					},
					{
						key: `renderIndicatorSeparator`,
						value: function () {
							var e = this.getComponents(),
								t = e.DropdownIndicator,
								n = e.IndicatorSeparator;
							if (!t || !n) return null;
							var r = this.commonProps,
								i = this.props.isDisabled,
								a = this.state.isFocused;
							return k.createElement(
								n,
								M({}, r, { isDisabled: i, isFocused: a }),
							);
						},
					},
					{
						key: `renderDropdownIndicator`,
						value: function () {
							var e = this.getComponents().DropdownIndicator;
							if (!e) return null;
							var t = this.commonProps,
								n = this.props.isDisabled,
								r = this.state.isFocused,
								i = {
									onMouseDown:
										this.onDropdownIndicatorMouseDown,
									onTouchEnd:
										this.onDropdownIndicatorTouchEnd,
									"aria-hidden": `true`,
								};
							return k.createElement(
								e,
								M({}, t, {
									innerProps: i,
									isDisabled: n,
									isFocused: r,
								}),
							);
						},
					},
					{
						key: `renderMenu`,
						value: function () {
							var e = this,
								t = this.getComponents(),
								n = t.Group,
								r = t.GroupHeading,
								i = t.Menu,
								a = t.MenuList,
								o = t.MenuPortal,
								s = t.LoadingMessage,
								c = t.NoOptionsMessage,
								l = t.Option,
								u = this.commonProps,
								d = this.state.focusedOption,
								f = this.props,
								p = f.captureMenuScroll,
								m = f.inputValue,
								h = f.isLoading,
								g = f.loadingMessage,
								_ = f.minMenuHeight,
								v = f.maxMenuHeight,
								y = f.menuIsOpen,
								b = f.menuPlacement,
								x = f.menuPosition,
								S = f.menuPortalTarget,
								C = f.menuShouldBlockScroll,
								w = f.menuShouldScrollIntoView,
								ee = f.noOptionsMessage,
								T = f.onMenuScrollToTop,
								te = f.onMenuScrollToBottom;
							if (!y) return null;
							var ne = function (t, n) {
									var r = t.type,
										i = t.data,
										a = t.isDisabled,
										o = t.isSelected,
										s = t.label,
										c = t.value,
										f = d === i,
										p = a
											? void 0
											: function () {
													return e.onOptionHover(i);
												},
										m = a
											? void 0
											: function () {
													return e.selectOption(i);
												},
										h = `${e.getElementId(`option`)}-${n}`,
										g = {
											id: h,
											onClick: m,
											onMouseMove: p,
											onMouseOver: p,
											tabIndex: -1,
											role: `option`,
											"aria-selected": e.state
												.isAppleDevice
												? void 0
												: o,
										};
									return k.createElement(
										l,
										M({}, u, {
											innerProps: g,
											data: i,
											isDisabled: a,
											isSelected: o,
											key: h,
											label: s,
											type: r,
											value: c,
											isFocused: f,
											innerRef: f
												? e.getFocusedOptionRef
												: void 0,
										}),
										e.formatOptionLabel(t.data, `menu`),
									);
								},
								re;
							if (this.hasOptions())
								re = this.getCategorizedOptions().map(
									function (t) {
										if (t.type === `group`) {
											var i = t.data,
												a = t.options,
												o = t.index,
												s = `${e.getElementId(`group`)}-${o}`,
												c = `${s}-heading`;
											return k.createElement(
												n,
												M({}, u, {
													key: s,
													data: i,
													options: a,
													Heading: r,
													headingProps: {
														id: c,
														data: t.data,
													},
													label: e.formatGroupLabel(
														t.data,
													),
												}),
												t.options.map(function (e) {
													return ne(
														e,
														`${o}-${e.index}`,
													);
												}),
											);
										} else if (t.type === `option`)
											return ne(t, `${t.index}`);
									},
								);
							else if (h) {
								var ie = g({ inputValue: m });
								if (ie === null) return null;
								re = k.createElement(s, u, ie);
							} else {
								var ae = ee({ inputValue: m });
								if (ae === null) return null;
								re = k.createElement(c, u, ae);
							}
							var oe = {
									minMenuHeight: _,
									maxMenuHeight: v,
									menuPlacement: b,
									menuPosition: x,
									menuShouldScrollIntoView: w,
								},
								E = k.createElement(
									oa,
									M({}, u, oe),
									function (t) {
										var n = t.ref,
											r = t.placerProps,
											o = r.placement,
											s = r.maxHeight;
										return k.createElement(
											i,
											M({}, u, oe, {
												innerRef: n,
												innerProps: {
													onMouseDown:
														e.onMenuMouseDown,
													onMouseMove:
														e.onMenuMouseMove,
												},
												isLoading: h,
												placement: o,
											}),
											k.createElement(
												Yo,
												{
													captureEnabled: p,
													onTopArrive: T,
													onBottomArrive: te,
													lockEnabled: C,
												},
												function (t) {
													return k.createElement(
														a,
														M({}, u, {
															innerRef: function (
																n,
															) {
																(e.getMenuListRef(
																	n,
																),
																	t(n));
															},
															innerProps: {
																role: `listbox`,
																"aria-multiselectable":
																	u.isMulti,
																id: e.getElementId(
																	`listbox`,
																),
															},
															isLoading: h,
															maxHeight: s,
															focusedOption: d,
														}),
														re,
													);
												},
											),
										);
									},
								);
							return S || x === `fixed`
								? k.createElement(
										o,
										M({}, u, {
											appendTo: S,
											controlElement: this.controlRef,
											menuPlacement: b,
											menuPosition: x,
										}),
										E,
									)
								: E;
						},
					},
					{
						key: `renderFormField`,
						value: function () {
							var e = this,
								t = this.props,
								n = t.delimiter,
								r = t.isDisabled,
								i = t.isMulti,
								a = t.name,
								o = t.required,
								s = this.state.selectValue;
							if (o && !this.hasValue() && !r)
								return k.createElement(Zo, {
									name: a,
									onFocus: this.onValueInputFocus,
								});
							if (!(!a || r))
								if (i)
									if (n) {
										var c = s
											.map(function (t) {
												return e.getOptionValue(t);
											})
											.join(n);
										return k.createElement(`input`, {
											name: a,
											type: `hidden`,
											value: c,
										});
									} else {
										var l =
											s.length > 0
												? s.map(function (t, n) {
														return k.createElement(
															`input`,
															{
																key: `i-${n}`,
																name: a,
																type: `hidden`,
																value: e.getOptionValue(
																	t,
																),
															},
														);
													})
												: k.createElement(`input`, {
														name: a,
														type: `hidden`,
														value: ``,
													});
										return k.createElement(`div`, null, l);
									}
								else {
									var u = s[0]
										? this.getOptionValue(s[0])
										: ``;
									return k.createElement(`input`, {
										name: a,
										type: `hidden`,
										value: u,
									});
								}
						},
					},
					{
						key: `renderLiveRegion`,
						value: function () {
							var e = this.commonProps,
								t = this.state,
								n = t.ariaSelection,
								r = t.focusedOption,
								i = t.focusedValue,
								a = t.isFocused,
								o = t.selectValue,
								s = this.getFocusableOptions();
							return k.createElement(
								So,
								M({}, e, {
									id: this.getElementId(`live-region`),
									ariaSelection: n,
									focusedOption: r,
									focusedValue: i,
									isFocused: a,
									selectValue: o,
									focusableOptions: s,
									isAppleDevice: this.state.isAppleDevice,
								}),
							);
						},
					},
					{
						key: `render`,
						value: function () {
							var e = this.getComponents(),
								t = e.Control,
								n = e.IndicatorsContainer,
								r = e.SelectContainer,
								i = e.ValueContainer,
								a = this.props,
								o = a.className,
								s = a.id,
								c = a.isDisabled,
								l = a.menuIsOpen,
								u = this.state.isFocused,
								d = (this.commonProps = this.getCommonProps());
							return k.createElement(
								r,
								M({}, d, {
									className: o,
									innerProps: {
										id: s,
										onKeyDown: this.onKeyDown,
									},
									isDisabled: c,
									isFocused: u,
								}),
								this.renderLiveRegion(),
								k.createElement(
									t,
									M({}, d, {
										innerRef: this.getControlRef,
										innerProps: {
											onMouseDown:
												this.onControlMouseDown,
											onTouchEnd: this.onControlTouchEnd,
										},
										isDisabled: c,
										isFocused: u,
										menuIsOpen: l,
									}),
									k.createElement(
										i,
										M({}, d, { isDisabled: c }),
										this.renderPlaceholderOrValue(),
										this.renderInput(),
									),
									k.createElement(
										n,
										M({}, d, { isDisabled: c }),
										this.renderClearIndicator(),
										this.renderLoadingIndicator(),
										this.renderIndicatorSeparator(),
										this.renderDropdownIndicator(),
									),
								),
								this.renderMenu(),
								this.renderFormField(),
							);
						},
					},
				],
				[
					{
						key: `getDerivedStateFromProps`,
						value: function (e, t) {
							var n = t.prevProps,
								r = t.clearFocusValueOnUpdate,
								i = t.inputIsHiddenAfterUpdate,
								a = t.ariaSelection,
								o = t.isFocused,
								s = t.prevWasFocused,
								c = t.instancePrefix,
								l = e.options,
								u = e.value,
								d = e.menuIsOpen,
								f = e.inputValue,
								p = e.isMulti,
								m = Mi(u),
								h = {};
							if (
								n &&
								(u !== n.value ||
									l !== n.options ||
									d !== n.menuIsOpen ||
									f !== n.inputValue)
							) {
								var g = d ? vs(e, m) : [],
									_ = d ? _s(hs(e, m), `${c}-option`) : [],
									v = r ? bs(t, m) : null,
									y = xs(t, g);
								h = {
									selectValue: m,
									focusedOption: y,
									focusedOptionId: Ss(_, y),
									focusableOptionsWithIds: _,
									focusedValue: v,
									clearFocusValueOnUpdate: !1,
								};
							}
							var b =
									i != null && e !== n
										? {
												inputIsHidden: i,
												inputIsHiddenAfterUpdate:
													void 0,
											}
										: {},
								x = a,
								S = o && s;
							return (
								o &&
									!S &&
									((x = {
										value: Yi(p, m, m[0] || null),
										options: m,
										action: `initial-input-focus`,
									}),
									(S = !s)),
								a?.action === `initial-input-focus` &&
									(x = null),
								j(
									j(j({}, h), b),
									{},
									{
										prevProps: e,
										ariaSelection: x,
										prevWasFocused: S,
									},
								)
							);
						},
					},
				],
			),
			n
		);
	})(k.Component);
As.defaultProps = ps;
var js = (0, k.forwardRef)(function (e, t) {
		var n = It(e);
		return k.createElement(As, M({ ref: t }, n));
	}),
	H = function () {
		return (
			(H =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			H.apply(this, arguments)
		);
	},
	Ms = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	},
	Ns = function (e) {
		return H(H({}, e), {
			borderRadius: 0,
			colors: H(H({}, e.colors), {
				primary25: `var(--semi-transparent-accent-color)`,
				neutral10: `var(--border-color)`,
				neutral20: `var(--border-color)`,
				primary: `var(--accent-color)`,
				neutral30: `var(--darker-border-color)`,
			}),
		});
	},
	Ps = function (e, t) {
		return (0, k.useMemo)(
			function () {
				return {
					placeholder: function (e) {
						return H(H({}, e), {
							color: `var(--placeholder-body-color)`,
						});
					},
					container: function (e) {
						return H(H({}, e), { fontSize: `inherit` });
					},
					control: function (n, r) {
						var i = r.isFocused,
							a = n;
						return (
							(a = H(H({}, a), { minHeight: 40 })),
							i
								? H(H({}, a), {
										borderColor: t
											? `var(--alert-color)`
											: `var(--accent-color)`,
										backgroundColor: e
											? `var(--disabled-color)`
											: `white`,
										boxShadow: `0 0 0 3px ${t ? `rgba(var(--alert-color-rgb-components), 0.2)` : `var(--semi-transparent-accent-color)`}`,
										"&:hover": {
											borderColor: t
												? `var(--alert-color)`
												: `var(--accent-color)`,
										},
									})
								: H(H({}, a), {
										borderColor: t
											? `var(--alert-color)`
											: `var(--border-color)`,
										backgroundColor: e
											? `var(--disabled-color)`
											: `white`,
										"&:hover": {
											borderColor: t
												? `var(--alert-color)`
												: `var(--darker-border-color)`,
										},
									})
						);
					},
					multiValueRemove: function (e) {
						return H(H({}, e), { cursor: `pointer` });
					},
					menu: function (e) {
						return H(H({}, e), { zIndex: 1e3, minWidth: 250 });
					},
					input: function (e) {
						return H(H({}, e), {
							boxShadow: `none`,
							"input:focus": { boxShadow: `none` },
						});
					},
					multiValue: function (e) {
						return H(H({}, e), {
							zIndex: 100,
							backgroundColor: `var(--light-color)`,
							userSelect: `none`,
						});
					},
					multiValueLabel: function (e) {
						return H(H({}, e), { fontSize: `inherit`, padding: 3 });
					},
				};
			},
			[e, t],
		);
	};
function Fs(e) {
	var t = e.isDisabled,
		n = e.error,
		r = Ms(e, [`isDisabled`, `error`]),
		i = Ps(t, n);
	return k.createElement(
		js,
		H({}, r, { isDisabled: t, theme: Ns, styles: i }),
	);
}
var Is = {
		switchField__flex: `_switchField__flex_16z4j_1`,
		switchField__switchInput: `_switchField__switchInput_16z4j_6`,
		switchField__label: `_switchField__label_16z4j_10`,
		switchField__below: `_switchField__below_16z4j_22`,
	},
	Ls = function () {
		return (
			(Ls =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			Ls.apply(this, arguments)
		);
	};
function Rs(e) {
	var t = e.id,
		n = e.name,
		r = e.label,
		i = e.hint,
		a = e.error,
		o = e.required,
		s = e.formLabelProps,
		c = e.value,
		l = e.onChange,
		u = e.switchInputProps;
	return k.createElement(
		k.Fragment,
		null,
		k.createElement(
			`div`,
			{ className: Is.switchField__flex },
			k.createElement(
				`div`,
				{ className: Is.switchField__switchInput },
				k.createElement(
					Hs,
					Ls({}, u, { name: n, value: c, onChange: l }),
				),
			),
			k.createElement(
				dt,
				Ls({}, s, {
					htmlFor: t,
					required: o,
					className: (0, Ie.default)(
						Is.switchField__label,
						s?.className,
					),
					error: !!a,
				}),
				r,
			),
		),
		(i || a) &&
			k.createElement(
				`div`,
				{ className: Is.switchField__below },
				a && k.createElement(Ge, null, a),
				i && k.createElement(Ze, null, i),
			),
	);
}
var zs = {
		switchInput__inner: `_switchInput__inner_1knbg_1`,
		switchInput: `_switchInput_1knbg_1`,
		switchInput__off: `_switchInput__off_1knbg_1`,
		switchInput__on: `_switchInput__on_1knbg_1`,
		switchInput__checked: `_switchInput__checked_1knbg_47`,
		switchInput__disabled: `_switchInput__disabled_1knbg_60`,
		none: `_none_1knbg_1`,
	},
	Bs = function () {
		return (
			(Bs =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			Bs.apply(this, arguments)
		);
	},
	Vs = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	};
function Hs(e) {
	var t,
		n = e.className,
		r = e.value,
		i = e.disabled,
		a = e.onClick,
		o = e.onChange,
		s = e.onKeyDown,
		c = Vs(e, [
			`className`,
			`value`,
			`disabled`,
			`onClick`,
			`onChange`,
			`onKeyDown`,
		]);
	function l(e, t) {
		!i && o && o(e, t);
	}
	function u(e) {
		(e.key === `ArrowLeft` ? l(!1, e) : e.key === `ArrowRight` && l(!0, e),
			s?.(e));
	}
	function d(e) {
		(l(!r, e), a?.(e));
	}
	var f = (0, Ie.default)(
		zs.switchInput,
		n,
		((t = {}),
		(t[zs.switchInput__checked] = r),
		(t[zs.switchInput__disabled] = i),
		t),
	);
	return k.createElement(
		`button`,
		Bs({}, c, {
			type: `button`,
			role: `switch`,
			"aria-checked": r,
			disabled: i,
			className: f,
			onKeyDown: u,
			onClick: d,
		}),
		k.createElement(`span`, { className: zs.switchInput__inner }),
	);
}
var Us = function () {
	return (
		(Us =
			Object.assign ||
			function (e) {
				for (var t, n = 1, r = arguments.length; n < r; n++)
					for (var i in ((t = arguments[n]), t))
						Object.prototype.hasOwnProperty.call(t, i) &&
							(e[i] = t[i]);
				return e;
			}),
		Us.apply(this, arguments)
	);
};
function Ws(e) {
	var t = e.id,
		n = e.name,
		r = e.label,
		i = e.hint,
		a = e.error,
		o = e.required,
		s = e.placeholder,
		c = e.formLabelProps,
		l = e.value,
		u = e.onChange,
		d = e.textInputProps;
	return k.createElement(
		$e,
		{ formLabelProps: c, id: t, required: o, error: a, hint: i, label: r },
		k.createElement(
			Js,
			Us({}, d, {
				id: t,
				name: n,
				value: l,
				placeholder: s,
				onChange: u,
				error: !!a,
			}),
		),
	);
}
var Gs = {
		TextInput: `_TextInput_x2oj2_1`,
		"TextInput--monospaced": `_TextInput--monospaced_x2oj2_30`,
		"TextInput--disabled": `_TextInput--disabled_x2oj2_35`,
		"TextInput--error": `_TextInput--error_x2oj2_41`,
	},
	Ks = function () {
		return (
			(Ks =
				Object.assign ||
				function (e) {
					for (var t, n = 1, r = arguments.length; n < r; n++)
						for (var i in ((t = arguments[n]), t))
							Object.prototype.hasOwnProperty.call(t, i) &&
								(e[i] = t[i]);
					return e;
				}),
			Ks.apply(this, arguments)
		);
	},
	qs = function (e, t) {
		var n = {};
		for (var r in e)
			Object.prototype.hasOwnProperty.call(e, r) &&
				t.indexOf(r) < 0 &&
				(n[r] = e[r]);
		if (e != null && typeof Object.getOwnPropertySymbols == `function`)
			for (
				var i = 0, r = Object.getOwnPropertySymbols(e);
				i < r.length;
				i++
			)
				t.indexOf(r[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
					(n[r[i]] = e[r[i]]);
		return n;
	},
	Js = function (e) {
		var t,
			n = e.className,
			r = e.disabled,
			i = r === void 0 ? !1 : r,
			a = e.error,
			o = e.id,
			s = e.inputRef,
			c = e.maxLength,
			l = e.name,
			u = e.labelText,
			d = e.onBlur,
			f = e.onChange,
			p = e.placeholder,
			m = e.required,
			h = m === void 0 ? !1 : m,
			g = e.type,
			_ = e.value,
			v = e.monospaced,
			y = qs(e, [
				`className`,
				`disabled`,
				`error`,
				`id`,
				`inputRef`,
				`maxLength`,
				`name`,
				`labelText`,
				`onBlur`,
				`onChange`,
				`placeholder`,
				`required`,
				`type`,
				`value`,
				`monospaced`,
			]),
			b = (0, k.useCallback)(
				function (e) {
					f && f(e.target.value, e);
				},
				[f],
			),
			x = (0, Ie.default)(
				Gs.TextInput,
				n,
				((t = {}),
				(t[Gs[`TextInput--disabled`]] = i),
				(t[Gs[`TextInput--error`]] = a),
				(t[Gs[`TextInput--monospaced`]] = v),
				t),
			);
		return k.createElement(
			`input`,
			Ks(
				{
					className: x,
					"aria-label": u,
					id: o,
					name: l,
					required: h,
					placeholder: p,
					maxLength: c,
					disabled: i,
					onBlur: d,
					onChange: b,
					value: _,
					type: g,
					ref: s,
				},
				y,
			),
		);
	},
	Ys = () => {
		function e(e, t) {
			let n = (e.fieldPath ? e.fieldPath.split(`.`) : []).reduce(
				(e, t) => e?.[t],
				e?.formValues,
			);
			if (t === `content_settings` && n)
				try {
					return JSON.parse(n);
				} catch {
					return {};
				}
			return t !== `plugin_settings` &&
				e?.parameters?.field_settings &&
				Object.keys(e.parameters.field_settings).length > 0
				? e.parameters?.field_settings
				: t !== `plugin_settings` &&
					  e?.field?.attributes?.appearance?.parameters
							?.field_settings &&
					  Object.keys(
							e.field?.attributes.appearance.parameters
								.field_settings,
					  ).length > 0
					? e.field.attributes.appearance.parameters.field_settings
					: e?.plugin?.attributes?.parameters &&
						  Object.keys(e.plugin.attributes.parameters).length > 0
						? e.plugin.attributes.parameters
						: {};
		}
		return {
			getCtxParams: e,
			getDefaultValue: (e, t, n) => (e?.[t] === void 0 ? n : e?.[t]),
		};
	},
	Xs = {
		"link-settings__form": `_link-settings__form_1l1od_2`,
		"link-settings__link-types": `_link-settings__link-types_1l1od_16`,
		"link-settings__link-controlls": `_link-settings__link-controlls_1l1od_17`,
		"link-settings__link-type-item": `_link-settings__link-type-item_1l1od_33`,
		"link-settings__link-control-item": `_link-settings__link-control-item_1l1od_34`,
	},
	{ getCtxParams: Zs, getDefaultValue: Qs } = Ys(),
	$s = ({ ctx: e, configType: t }) => {
		let n = Zs(e, t),
			r = [
				{
					id: `allow_record`,
					label: `Allow Records`,
					value: Qs(n, `allow_record`, !0),
				},
				{
					id: `allow_assets`,
					label: `Allow Assets`,
					value: Qs(n, `allow_assets`, !0),
				},
				{
					id: `allow_url`,
					label: `Allow URL`,
					value: Qs(n, `allow_url`, !0),
				},
				{
					id: `allow_tel`,
					label: `Allow Telephone numbers`,
					value: Qs(n, `allow_tel`, !0),
				},
				{
					id: `allow_email`,
					label: `Allow Email addresses`,
					value: Qs(n, `allow_email`, !0),
				},
				{
					id: `allow_custom_text`,
					label: `Allow Title`,
					value: Qs(n, `allow_custom_text`, !0),
				},
				{
					id: `allow_aria_label`,
					label: `Allow aria-label`,
					value: Qs(n, `allow_aria_label`, !0),
				},
				{
					id: `allow_new_target`,
					label: `Allow Target control`,
					value: Qs(n, `allow_new_target`, !0),
				},
				{
					id: `allow_nofollow`,
					label: `Allow NoFollow`,
					value: Qs(n, `allow_nofollow`, !0),
				},
				{
					id: `allow_icons`,
					label: `Allow Icons`,
					value: Qs(n, `allow_icons`, !0),
				},
				{
					id: `itemTypes`,
					label: `Item Types`,
					value: Qs(n, `itemTypes`, []),
				},
			],
			i = {
				allow_record: { label: `Record`, value: `record` },
				allow_assets: { label: `Asset`, value: `asset` },
				allow_url: { label: `URL`, value: `url` },
				allow_tel: { label: `Telephone number`, value: `tel` },
				allow_email: { label: `Email address`, value: `email` },
			},
			a = (e) => e.replace(/[^a-zA-Z\s-]/g, ``),
			o = Object.values(e?.itemTypes)
				.filter((e) => !e.attributes.modular_block)
				.map((e) => ({
					...e,
					label: e.attributes.name,
					api_key: e.attributes.api_key,
					value: e.id,
				}))
				.sort((e, t) => {
					let n = a(e.label),
						r = a(t.label);
					return n < r ? -1 : n > r ? 1 : 0;
				}),
			[s, c] = (0, k.useState)(r);
		return (0, A.jsx)(`div`, {
			children: (0, A.jsxs)(rt, {
				onSubmit: async () => {
					let r = {},
						a = [];
					(s.forEach((e) => {
						(e.value === !0 && i[e.id] && a.push(i[e.id]),
							(r[e.id] = e.value));
					}),
						(r.linkTypeOptions = a));
					let o = { ...n, ...r, linkTypeOptions: a };
					t === `plugin_settings`
						? e.updatePluginParameters(o)
						: t === `field_settings` &&
							e.setParameters({ field_settings: o });
				},
				className: Xs[`link-settings__form`],
				children: [
					(0, A.jsx)(xt, {
						name: `styling`,
						id: `styling`,
						label: `Allowed Records`,
						value: s.find((e) => e.id === `itemTypes`)?.value || [],
						selectInputProps: { isMulti: !0, options: o },
						onChange: (e) =>
							c((t) => {
								let n = e.sort((e, t) =>
									e.label < t.label
										? -1
										: e.label > t.label
											? 1
											: 0,
								);
								return t.map((e) =>
									e.id === `itemTypes`
										? { ...e, value: n }
										: e,
								);
							}),
					}),
					(0, A.jsx)(Ye, {
						className: Xs[`link-settings__link-types`],
						children: s.slice(0, -6).map((e) =>
							(0, A.jsx)(
								`div`,
								{
									className:
										Xs[`link-settings__link-type-item`],
									children: (0, A.jsx)(Rs, {
										id: e.id,
										name: e.id,
										label: e.label,
										value: e.value,
										onChange: (t) => {
											c((n) =>
												n.map((n) =>
													n.id === e.id
														? { ...n, value: t }
														: n,
												),
											);
										},
									}),
								},
								e.id,
							),
						),
					}),
					(0, A.jsx)(Ye, {
						className: Xs[`link-settings__link-controlls`],
						children: s.slice(-6, -1).map((e) =>
							(0, A.jsx)(
								`div`,
								{
									className:
										Xs[`link-settings__link-control-item`],
									children: (0, A.jsx)(Rs, {
										id: e.id,
										name: e.id,
										label: e.label,
										value: e.value,
										onChange: (t) => {
											c((n) =>
												n.map((n) =>
													n.id === e.id
														? { ...n, value: t }
														: n,
												),
											);
										},
									}),
								},
								e.id,
							),
						),
					}),
					(0, A.jsx)(Ye, {
						children: (0, A.jsx)(Le, {
							fullWidth: !0,
							type: `submit`,
							buttonType: `primary`,
							children: `Save link settings`,
						}),
					}),
				],
			}),
		});
	},
	ec = (...e) =>
		e
			.filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
			.join(` `)
			.trim(),
	tc = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
	nc = (e) =>
		e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
			n ? n.toUpperCase() : t.toLowerCase(),
		),
	rc = (e) => {
		let t = nc(e);
		return t.charAt(0).toUpperCase() + t.slice(1);
	},
	U = {
		xmlns: `http://www.w3.org/2000/svg`,
		width: 24,
		height: 24,
		viewBox: `0 0 24 24`,
		fill: `none`,
		stroke: `currentColor`,
		strokeWidth: 2,
		strokeLinecap: `round`,
		strokeLinejoin: `round`,
	},
	ic = (e) => {
		for (let t in e)
			if (t.startsWith(`aria-`) || t === `role` || t === `title`)
				return !0;
		return !1;
	},
	ac = (0, k.createContext)({}),
	oc = () => (0, k.useContext)(ac),
	sc = (0, k.forwardRef)(
		(
			{
				color: e,
				size: t,
				strokeWidth: n,
				absoluteStrokeWidth: r,
				className: i = ``,
				children: a,
				iconNode: o,
				...s
			},
			c,
		) => {
			let {
					size: l = 24,
					strokeWidth: u = 2,
					absoluteStrokeWidth: d = !1,
					color: f = `currentColor`,
					className: p = ``,
				} = oc() ?? {},
				m =
					(r ?? d)
						? (Number(n ?? u) * 24) / Number(t ?? l)
						: (n ?? u);
			return (0, k.createElement)(
				`svg`,
				{
					ref: c,
					...U,
					width: t ?? l ?? U.width,
					height: t ?? l ?? U.height,
					stroke: e ?? f,
					strokeWidth: m,
					className: ec(`lucide`, p, i),
					...(!a && !ic(s) && { "aria-hidden": `true` }),
					...s,
				},
				[
					...o.map(([e, t]) => (0, k.createElement)(e, t)),
					...(Array.isArray(a) ? a : [a]),
				],
			);
		},
	),
	cc = (e, t) => {
		let n = (0, k.forwardRef)(({ className: n, ...r }, i) =>
			(0, k.createElement)(sc, {
				ref: i,
				iconNode: t,
				className: ec(`lucide-${tc(rc(e))}`, `lucide-${e}`, n),
				...r,
			}),
		);
		return ((n.displayName = rc(e)), n);
	},
	lc = cc(`plus`, [
		[`path`, { d: `M5 12h14`, key: `1ays0h` }],
		[`path`, { d: `M12 5v14`, key: `s699le` }],
	]),
	uc = cc(`trash-2`, [
		[`path`, { d: `M10 11v6`, key: `nco0om` }],
		[`path`, { d: `M14 11v6`, key: `outv1u` }],
		[
			`path`,
			{ d: `M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`, key: `miytrc` },
		],
		[`path`, { d: `M3 6h18`, key: `d0wm0j` }],
		[
			`path`,
			{ d: `M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`, key: `e791ji` },
		],
	]),
	dc = {
		"style-settings__form": `_style-settings__form_2hbfq_3`,
		"style-settings__controlls": `_style-settings__controlls_2hbfq_16`,
		"style-settings__buttons": `_style-settings__buttons_2hbfq_17`,
		"link-settings__link-types": `_link-settings__link-types_2hbfq_23`,
		"link-settings__link-controlls": `_link-settings__link-controlls_2hbfq_24`,
		"style-settings__error": `_style-settings__error_2hbfq_36`,
		"style-settings__controll-item": `_style-settings__controll-item_2hbfq_54`,
		"style-settings__controll-texts": `_style-settings__controll-texts_2hbfq_68`,
	};
function fc({
	item: e,
	onIdChange: t,
	onLabelChange: n,
	onValueChange: r,
	onAllowIconsChange: i,
	onDelete: a,
	duplicateArrays: o,
	isRequired: s,
}) {
	let { duplicateIds: c, duplicateLabels: l, duplicateValues: u } = o,
		d = c.includes(e.id),
		f = l.includes(e.label),
		p = u.includes(e.value);
	return (
		d && t(e.id * 1e6),
		(0, A.jsxs)(`div`, {
			className: dc[`style-settings__controll-item`],
			children: [
				(0, A.jsxs)(Ye, {
					className: dc[`style-settings__controll-texts`],
					children: [
						(0, A.jsx)(Ws, {
							required: s,
							error:
								(s && e.label === ``) || f
									? `Label already exists`
									: ``,
							name: `${e.id}-label`,
							id: `${e.id}-label`,
							label: `Label`,
							placeholder: `Label`,
							value: e.label,
							onChange: n,
							formLabelProps: {
								children: (0, A.jsx)(A.Fragment, {}),
								htmlFor: `${e.id}-label`,
								className: `sr-only`,
							},
						}),
						(0, A.jsx)(Ws, {
							required: s,
							error:
								(s && e.value === ``) || p
									? `Value is required`
									: ``,
							name: `${e.id}-value`,
							id: `${e.id}-value`,
							label: `Value`,
							placeholder: `Value`,
							value: e.value,
							onChange: r,
							formLabelProps: {
								children: (0, A.jsx)(A.Fragment, {}),
								htmlFor: `${e.id}-value`,
								className: `sr-only`,
							},
						}),
					],
				}),
				(0, A.jsx)(Rs, {
					id: `${e.id}-allowIcons`,
					name: `${e.id}-allowIcons`,
					label: `Icons`,
					value: e.allowIcons,
					onChange: i,
				}),
				(0, A.jsx)(Le, {
					buttonSize: `xs`,
					buttonType: `negative`,
					leftIcon: (0, A.jsx)(`span`, {
						style: { display: `inline-flex`, alignItems: `center` },
						children: (0, A.jsx)(uc, {
							size: 14,
							strokeWidth: 2,
							style: { fill: `none` },
						}),
					}),
					onClick: () => a(e.id),
					children: `Delete`,
				}),
			],
		})
	);
}
var { getCtxParams: pc, getDefaultValue: mc } = Ys(),
	hc = ({ ctx: e, configType: t }) => {
		let n = pc(e, t),
			[r, i] = (0, k.useState)(
				(mc(n, `stylingOptions`, []) ?? []).map((e, t) => ({
					id: t,
					label: e.label,
					value: e.value,
					allowIcons: e.allowIcons ?? !1,
				})),
			),
			a = async () => {
				let i = [];
				r.forEach((e) => {
					i.push({
						label: e.label,
						value: e.value,
						allowIcons: e.allowIcons,
					});
				});
				let a = { ...n, stylingOptions: i };
				(t === `plugin_settings`
					? await e.updatePluginParameters(a)
					: t === `field_settings` &&
						(await e.setParameters({ field_settings: a })),
					e.notice(`Styling settings saved successfully`));
			},
			o = (e) => {
				i(
					e.sort((e, t) =>
						e.label < t.label ? -1 : e.label > t.label ? 1 : 0,
					),
				);
			},
			s = (e, t) => {
				let n = [...r];
				((n[t].id = e), o(n));
			},
			c = (e, t) => {
				let n = [...r];
				((n[t].label = e), o(n));
			},
			l = (e, t) => {
				let n = [...r];
				((n[t].value = e), o(n));
			},
			u = (e, t) => {
				let n = [...r];
				((n[t].allowIcons = e), o(n));
			},
			d = (e) => {
				let t = [...r];
				(t.splice(e, 1), o(t));
			};
		function f(e) {
			let t = new Set(),
				n = new Set(),
				r = new Set(),
				i = [],
				a = [],
				o = [];
			for (let s of e)
				(t.has(s.id) ? i.push(s.id) : t.add(s.id),
					n.has(s.label) ? a.push(s.label) : n.add(s.label),
					r.has(s.value) ? o.push(s.value) : r.add(s.value));
			return { duplicateIds: i, duplicateLabels: a, duplicateValues: o };
		}
		let p = () => {
				let {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				} = f(r);
				return {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				};
			},
			m = () => {
				let {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				} = p();
				return e.length > 0 || t.length > 0 || n.length > 0;
			};
		return (0, A.jsx)(`div`, {
			children: (0, A.jsxs)(rt, {
				onSubmit: a,
				className: dc[`style-settings__form`],
				children: [
					(0, A.jsx)(Ye, {
						className: dc[`style-settings__controlls`],
						children: r.map((e, t) =>
							(0, A.jsx)(
								fc,
								{
									item: e,
									onIdChange: (e) => s(e, t),
									onLabelChange: (e) => c(e, t),
									onValueChange: (e) => l(e, t),
									onAllowIconsChange: (e) => u(e, t),
									onDelete: () => d(t),
									duplicateArrays: p(),
									isRequired: !0,
								},
								e.id,
							),
						),
					}),
					(0, A.jsxs)(Ye, {
						className: dc[`style-settings__buttons`],
						children: [
							(0, A.jsx)(Le, {
								fullWidth: !0,
								buttonType: `muted`,
								leftIcon: (0, A.jsx)(`span`, {
									style: {
										display: `inline-flex`,
										alignItems: `center`,
									},
									children: (0, A.jsx)(lc, {
										size: 16,
										strokeWidth: 2,
										style: { fill: `none` },
									}),
								}),
								disabled: m(),
								onClick: (e) => {
									if ((e.preventDefault(), !m())) {
										let e = Date.now();
										o([
											...r,
											{
												id: e,
												label: ``,
												value: ``,
												allowIcons: !1,
											},
										]);
									}
								},
								children: `Add item`,
							}),
							(0, A.jsx)(Le, {
								fullWidth: !0,
								type: `submit`,
								buttonType: `primary`,
								className: dc[`style-settings__submit`],
								children: `Save styling settings`,
							}),
						],
					}),
					m() &&
						(0, A.jsx)(Ye, {
							className: dc[`style-settings__warinig`],
							children: (0, A.jsx)(`p`, {
								className: dc[`style-settings__error`],
								children: `All keys need to be unique. Saving this can result in data loss.`,
							}),
						}),
				],
			}),
		});
	};
function gc({
	item: e,
	onIdChange: t,
	onLabelChange: n,
	onValueChange: r,
	onDelete: i,
	duplicateArrays: a,
	isRequired: o,
}) {
	let { duplicateIds: s, duplicateLabels: c, duplicateValues: l } = a,
		u = s.includes(e.id),
		d = c.includes(e.label),
		f = l.includes(e.value);
	return (
		u && t(e.id * 1e6),
		(0, A.jsxs)(`div`, {
			className: dc[`style-settings__controll-item`],
			children: [
				(0, A.jsxs)(Ye, {
					className: dc[`style-settings__controll-texts`],
					children: [
						(0, A.jsx)(Ws, {
							required: o,
							error:
								(o && e.label === ``) || d
									? `Label already exists`
									: ``,
							name: `${e.id}-label`,
							id: `${e.id}-label`,
							label: `Label`,
							placeholder: `Label`,
							value: e.label,
							onChange: n,
							formLabelProps: {
								children: (0, A.jsx)(A.Fragment, {}),
								htmlFor: `${e.id}-label`,
								className: `sr-only`,
							},
						}),
						(0, A.jsx)(Ws, {
							required: o,
							error:
								(o && e.value === ``) || f
									? `Value is required`
									: ``,
							name: `${e.id}-value`,
							id: `${e.id}-value`,
							label: `Value`,
							placeholder: `Value`,
							value: e.value,
							onChange: r,
							formLabelProps: {
								children: (0, A.jsx)(A.Fragment, {}),
								htmlFor: `${e.id}-value`,
								className: `sr-only`,
							},
						}),
					],
				}),
				(0, A.jsx)(Le, {
					buttonSize: `xs`,
					buttonType: `negative`,
					leftIcon: (0, A.jsx)(`span`, {
						style: { display: `inline-flex`, alignItems: `center` },
						children: (0, A.jsx)(uc, {
							size: 14,
							strokeWidth: 2,
							style: { fill: `none` },
						}),
					}),
					onClick: () => i(e.id),
					children: `Delete`,
				}),
			],
		})
	);
}
var { getCtxParams: _c, getDefaultValue: vc } = Ys(),
	yc = ({ ctx: e, configType: t }) => {
		let n = _c(e, t),
			[r, i] = (0, k.useState)(
				(vc(n, `iconOptions`, []) ?? []).map((e, t) => ({
					id: t,
					label: e.label,
					value: e.value,
				})),
			),
			a = async () => {
				let i = [];
				r.forEach((e) => {
					i.push({ label: e.label, value: e.value });
				});
				let a = { ...n, iconOptions: i };
				(t === `plugin_settings`
					? await e.updatePluginParameters(a)
					: t === `field_settings` &&
						(await e.setParameters({ field_settings: a })),
					e.notice(`Icon settings saved successfully`));
			},
			o = (e) => {
				i(
					e.sort((e, t) =>
						e.label < t.label ? -1 : e.label > t.label ? 1 : 0,
					),
				);
			},
			s = (e, t) => {
				let n = [...r];
				((n[t].id = e), o(n));
			},
			c = (e, t) => {
				let n = [...r];
				((n[t].label = e), o(n));
			},
			l = (e, t) => {
				let n = [...r];
				((n[t].value = e), o(n));
			},
			u = (e) => {
				let t = [...r];
				(t.splice(e, 1), o(t));
			};
		function d(e) {
			let t = new Set(),
				n = new Set(),
				r = new Set(),
				i = [],
				a = [],
				o = [];
			for (let s of e)
				(t.has(s.id) ? i.push(s.id) : t.add(s.id),
					n.has(s.label) ? a.push(s.label) : n.add(s.label),
					r.has(s.value) ? o.push(s.value) : r.add(s.value));
			return { duplicateIds: i, duplicateLabels: a, duplicateValues: o };
		}
		let f = () => {
				let {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				} = d(r);
				return {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				};
			},
			p = () => {
				let {
					duplicateIds: e,
					duplicateLabels: t,
					duplicateValues: n,
				} = f();
				return e.length > 0 || t.length > 0 || n.length > 0;
			};
		return (0, A.jsx)(`div`, {
			children: (0, A.jsxs)(rt, {
				onSubmit: a,
				className: dc[`style-settings__form`],
				children: [
					(0, A.jsx)(Ye, {
						className: dc[`style-settings__controlls`],
						children: r.map((e, t) =>
							(0, A.jsx)(
								gc,
								{
									item: e,
									onIdChange: (e) => s(e, t),
									onLabelChange: (e) => c(e, t),
									onValueChange: (e) => l(e, t),
									onDelete: () => u(t),
									duplicateArrays: f(),
									isRequired: !0,
								},
								e.id,
							),
						),
					}),
					(0, A.jsxs)(Ye, {
						className: dc[`style-settings__buttons`],
						children: [
							(0, A.jsx)(Le, {
								fullWidth: !0,
								buttonType: `muted`,
								leftIcon: (0, A.jsx)(`span`, {
									style: {
										display: `inline-flex`,
										alignItems: `center`,
									},
									children: (0, A.jsx)(lc, {
										size: 16,
										strokeWidth: 2,
										style: { fill: `none` },
									}),
								}),
								disabled: p(),
								onClick: (e) => {
									if ((e.preventDefault(), !p())) {
										let e = Date.now();
										o([
											...r,
											{ id: e, label: ``, value: `` },
										]);
									}
								},
								children: `Add item`,
							}),
							(0, A.jsx)(Le, {
								fullWidth: !0,
								type: `submit`,
								buttonType: `primary`,
								className: dc[`style-settings__submit`],
								children: `Save icon settings`,
							}),
						],
					}),
					p() &&
						(0, A.jsx)(Ye, {
							className: dc[`style-settings__warinig`],
							children: (0, A.jsx)(`p`, {
								className: dc[`style-settings__error`],
								children: `All keys need to be unique. Saving this can result in data loss.`,
							}),
						}),
				],
			}),
		});
	};
function bc({ ctx: e }) {
	let [t, n] = (0, k.useState)(!0),
		[r, i] = (0, k.useState)(!0),
		[a, o] = (0, k.useState)(!0);
	return (0, A.jsxs)(Ue, {
		ctx: e,
		children: [
			(0, A.jsxs)(`div`, {
				className: `content`,
				children: [
					(0, A.jsx)(`p`, {
						children: `Welcome to the "Better Linking" plugin!`,
					}),
					(0, A.jsx)(`p`, {
						children: `This DatoCMS plugin allows you to easily create a complex link field, containing:`,
					}),
					(0, A.jsxs)(`ul`, {
						children: [
							(0, A.jsx)(`li`, {
								children: `Different link types (records, assets, URLs, email links, or telephone numbers)`,
							}),
							(0, A.jsx)(`li`, {
								children: `Custom styling/link classes`,
							}),
							(0, A.jsx)(`li`, {
								children: `Custom link text overrides`,
							}),
							(0, A.jsx)(`li`, {
								children: `Aria-label text overrides`,
							}),
							(0, A.jsx)(`li`, {
								children: `Target window controls`,
							}),
						],
					}),
				],
			}),
			(0, A.jsxs)(`div`, {
				children: [
					(0, A.jsx)(`h2`, { children: `Installation` }),
					(0, A.jsxs)(`ol`, {
						children: [
							(0, A.jsx)(`li`, {
								children: `Install the plugin.`,
							}),
							(0, A.jsxs)(`li`, {
								children: [
									`Go to the plugin and fill in the`,
									` `,
									(0, A.jsx)(`strong`, {
										children: `"Link Settings"`,
									}),
									` and`,
									` `,
									(0, A.jsx)(`strong`, {
										children: `"Styling Settings"`,
									}),
									`. These values will be your default link field values.`,
								],
							}),
							(0, A.jsx)(`li`, {
								children: `Create a new JSON field.`,
							}),
							(0, A.jsx)(`li`, {
								children: `Fill in your preferred name, fieldId, and localization (leave all other fields empty for now).`,
							}),
							(0, A.jsxs)(`li`, {
								children: [
									`Go to `,
									(0, A.jsx)(`strong`, {
										children: `"Presentation"`,
									}),
									` and choose the`,
									` `,
									(0, A.jsx)(`strong`, {
										children: `"Better Linking"`,
									}),
									` appearance.`,
								],
							}),
							(0, A.jsxs)(`li`, {
								children: [
									`Optionally, go to the `,
									(0, A.jsx)(`strong`, {
										children: `"Link Settings"`,
									}),
									` `,
									`and `,
									(0, A.jsx)(`strong`, {
										children: `"Styling Settings"`,
									}),
									` to override the default values.`,
								],
							}),
							(0, A.jsx)(`li`, {
								children: `Save the settings and the field.`,
							}),
							(0, A.jsx)(`li`, {
								children: `You can now add this field to your site and start using it.`,
							}),
						],
					}),
				],
			}),
			(0, A.jsxs)(`div`, {
				children: [
					(0, A.jsx)(`h2`, { children: `How it works` }),
					(0, A.jsx)(`p`, {
						children: `After installing the plugin and creating a new field (see installation instructions), you can start using the new "Better Linking" field. "Better Linking" allows you to set default settings in the plugin window and customize those settings for each field in the field appearance window. The settings of the plugin, field, and its content will be saved as a JSON object.`,
					}),
					(0, A.jsx)(`p`, {
						children: `The JSON data will be hidden in the CMS/frontend and will be replaced with a user-friendly UI, which helps the user to easily create a link with customized data, giving them more control over their links.`,
					}),
				],
			}),
			(0, A.jsxs)(`div`, {
				children: [
					(0, A.jsx)(`h2`, { children: `Development` }),
					(0, A.jsx)(`p`, {
						children: `When using the plugin, a JSON data object will be generated with all the settings and filled-in content. This data will be hidden in the CMS/frontend but is accessible using GraphQL and the CDA Playground.`,
					}),
					(0, A.jsxs)(`p`, {
						children: [
							`When querying the data of a`,
							` `,
							(0, A.jsx)(`strong`, {
								children: `"Better Linking"`,
							}),
							` field, the whole JSON data object will be returned, containing all the data and selected options, allowing developers full access to the detailed information of the link.`,
						],
					}),
					(0, A.jsx)(`p`, {
						children: `This might look a bit intimidating at first glance, but don't be scared. In the JSON data object, you will also find an object called "formatted". This object contains a minimized representation of all link data. In most cases, this data will be more than enough to handle your links.`,
					}),
				],
			}),
			(0, A.jsxs)(`div`, {
				children: [
					(0, A.jsx)(`h2`, { children: `Settings` }),
					(0, A.jsx)(yt, {
						title: `Link setting`,
						collapsible: {
							isOpen: t,
							onToggle: () => n((e) => !e),
						},
						children: (0, A.jsx)($s, {
							ctx: e,
							configType: `plugin_settings`,
						}),
					}),
					(0, A.jsx)(yt, {
						title: `Styling settings`,
						collapsible: {
							isOpen: r,
							onToggle: () => i((e) => !e),
						},
						children: (0, A.jsx)(hc, {
							ctx: e,
							configType: `plugin_settings`,
						}),
					}),
					(0, A.jsx)(yt, {
						title: `Icon settings`,
						collapsible: {
							isOpen: a,
							onToggle: () => o((e) => !e),
						},
						children: (0, A.jsx)(yc, {
							ctx: e,
							configType: `plugin_settings`,
						}),
					}),
				],
			}),
		],
	});
}
var { getCtxParams: xc } = Ys();
function Sc({ ctx: e }) {
	let [t, n] = (0, k.useState)(!1),
		[r, i] = (0, k.useState)(!1),
		[a, o] = (0, k.useState)(!1),
		s = xc(e, `plugin_settings`);
	return (0, A.jsxs)(Ue, {
		ctx: e,
		children: [
			(0, A.jsx)(yt, {
				title: `Link setting`,
				collapsible: { isOpen: t, onToggle: () => n((e) => !e) },
				children: (0, A.jsx)($s, {
					ctx: e,
					configType: `field_settings`,
				}),
			}),
			(0, A.jsx)(yt, {
				title: `Styling settings`,
				collapsible: { isOpen: r, onToggle: () => i((e) => !e) },
				children: (0, A.jsx)(hc, {
					ctx: e,
					configType: `field_settings`,
				}),
			}),
			(0, A.jsx)(yt, {
				title: `Icon settings`,
				collapsible: { isOpen: a, onToggle: () => o((e) => !e) },
				children: (0, A.jsx)(yc, {
					ctx: e,
					configType: `field_settings`,
				}),
			}),
			(0, A.jsx)(Le, {
				fullWidth: !0,
				buttonType: `primary`,
				onClick: () => {
					e.setParameters({ field_settings: s });
				},
				children: `Reset to Plugin default settings`,
			}),
		],
	});
}
var Cc = `_published_czzfq_62`,
	wc = `_updated_czzfq_63`,
	Tc = {
		"field__selection-group": `_field__selection-group_czzfq_1`,
		"field__selection-group__label": `_field__selection-group__label_czzfq_13`,
		"field__selection-group__content": `_field__selection-group__content_czzfq_20`,
		"field__selection-group__result": `_field__selection-group__result_czzfq_37`,
		published: Cc,
		updated: wc,
		"field__selection-group__result-title": `_field__selection-group__result-title_czzfq_78`,
		"field__selection-group__button": `_field__selection-group__button_czzfq_87`,
	},
	Ec = {
		id: void 0,
		title: void 0,
		alt: void 0,
		url: void 0,
		cms_url: void 0,
		status: void 0,
	},
	Dc = ({ ctx: e, savedFieldSettings: t, locale: n, onValueUpdate: r }) => {
		let [i, a] = (0, k.useState)(t),
			o = async (t) => {
				let i = (e, t) => (t && typeof e == `object` ? e[t] : e),
					o = (e) =>
						e.length > 1
							? e.slice(0, -1).join(`, `) +
								` & ` +
								e[e.length - 1]
							: e[0] || ``,
					s = { ...Ec },
					c = t?.id || null,
					l = t?.attributes?.filename || null,
					u = i(t?.attributes?.default_field_metadata, n)?.title || l,
					d = i(t?.attributes?.default_field_metadata, n)?.alt || u,
					f =
						t?.attributes?.url ||
						(e?.site?.attributes?.internal_domain && t?.id
							? `https://${e.site.attributes.internal_domain}/media/assets/${t.id}`
							: null),
					p = t?.attributes?.url || null;
				if (c && (u || l) && f && p)
					s = {
						id: c,
						title: u || l,
						alt: d || u || l,
						cms_url: f,
						status: `published`,
						url: p,
					};
				else if (t !== null) {
					let t = [];
					(c === null && t.push("`ID`"),
						u === null && t.push("`Title`"),
						p === null && t.push("`URL`"),
						await e.alert(`Asset ${o(t)} could not be found`));
				}
				(a(s), r(s));
			},
			s = async (t) => {
				let n = await e.editUpload(t);
				n && o(n);
			};
		return i?.id
			? (0, A.jsxs)(Ye, {
					className: Tc[`field__selection-group`],
					children: [
						(0, A.jsx)(`p`, {
							className: Tc[`field__selection-group__label`],
							children: `Asset`,
						}),
						(0, A.jsxs)(`div`, {
							className: Tc[`field__selection-group__content`],
							children: [
								(0, A.jsxs)(Le, {
									buttonType: `muted`,
									onClick: () => s(i.id),
									className:
										Tc[`field__selection-group__result`],
									children: [
										(0, A.jsx)(`span`, {
											className:
												Tc[
													`${i.status || `published`}`
												],
											children: i.status,
										}),
										(0, A.jsx)(`span`, {
											className:
												Tc[
													`field__selection-group__result-title`
												],
											children: i.title,
										}),
									],
								}),
								(0, A.jsx)(Le, {
									buttonSize: `xs`,
									buttonType: `negative`,
									leftIcon: (0, A.jsx)(`span`, {
										style: {
											display: `inline-flex`,
											alignItems: `center`,
										},
										children: (0, A.jsx)(uc, {
											size: 14,
											strokeWidth: 2,
											style: { fill: `none` },
										}),
									}),
									onClick: () => o(null),
								}),
							],
						}),
					],
				})
			: (0, A.jsxs)(Ye, {
					className: Tc[`field__selection-group`],
					children: [
						(0, A.jsx)(`p`, {
							className: Tc[`field__selection-group__label`],
							children: `Asset`,
						}),
						(0, A.jsx)(Le, {
							buttonType: `primary`,
							className: Tc[`field__selection-group__button`],
							leftIcon: (0, A.jsx)(A.Fragment, {
								children: (0, A.jsx)(`span`, {
									className: `sr-only`,
									children: `Asset`,
								}),
							}),
							onClick: async () => {
								o(await e.selectUpload({ multiple: !1 }));
							},
						}),
					],
				});
	},
	Oc = {
		id: void 0,
		title: void 0,
		slug: void 0,
		url: void 0,
		cms_url: void 0,
		status: void 0,
		modelApiKey: void 0,
	},
	kc = { label: `--select--`, value: ``, api_key: `` },
	Ac = ({
		ctx: e,
		ctxFieldParameters: t,
		ctxPluginParameters: n,
		savedFieldSettings: r,
		locale: i,
		onValueUpdate: a,
	}) => {
		let [o, s] = (0, k.useState)(r),
			c = t.itemTypes || n.itemTypes || [],
			l = (e, t) => (t && typeof e == `object` ? e[t] : e),
			u = (e) =>
				e.length > 1
					? e.slice(0, -1).join(`, `) + ` & ` + e[e.length - 1]
					: e[0] || ``,
			d = async (t) => {
				let n = { ...Oc },
					r = t?.id || null,
					o =
						l(t?.attributes?.slug, i) ||
						l(t?.attributes?.uri, i) ||
						l(t?.attributes?.url, i) ||
						null,
					d = l(t?.attributes?.title, i) || o || null,
					f =
						e?.site?.attributes?.internal_domain &&
						t?.relationships?.item_type?.data?.id &&
						t?.id
							? `https://${e.site.attributes.internal_domain}/editor/item_types/${t.relationships.item_type.data.id}/items/${t.id}/edit`
							: null,
					p = t?.meta?.status || null,
					m = o,
					h;
				if (t?.relationships?.item_type?.data?.id) {
					let e = t.relationships.item_type.data.id,
						n = c.find((t) => t.id === e);
					t?.relationships?.item_type?.data?.attributes?.api_key
						? (h = String(
								t.relationships.item_type.data.attributes
									.api_key,
							))
						: n?.api_key && (h = String(n.api_key));
				}
				if (r && d && f && o && p && m)
					n = {
						id: r,
						title: d,
						cms_url: f,
						slug: o,
						status: p,
						url: m,
						modelApiKey: h,
					};
				else if (t !== null) {
					let t = [];
					(r === null && t.push("`ID`"),
						d === null && t.push("`Title`"),
						o === null && t.push("`Slug`"),
						await e.alert(`Record ${u(t)} could not be found`));
				}
				(s(n), a(n));
			},
			f = async (t) => {
				let n = await e.editItem(t);
				n && d(n);
			},
			p = async (t) => {
				let n = null;
				(t.value !== `` &&
					(n = await e.selectItem(t.value, { multiple: !1 })),
					d(n));
			};
		return o?.id
			? (0, A.jsxs)(Ye, {
					className: Tc[`field__selection-group`],
					children: [
						(0, A.jsx)(`p`, {
							className: Tc[`field__selection-group__label`],
							children: `Record`,
						}),
						(0, A.jsxs)(`div`, {
							className: Tc[`field__selection-group__content`],
							children: [
								(0, A.jsxs)(Le, {
									buttonType: `muted`,
									onClick: () => f(o.id),
									className:
										Tc[`field__selection-group__result`],
									children: [
										(0, A.jsx)(`span`, {
											className:
												Tc[
													`${o.status || `published`}`
												],
											children: o.status,
										}),
										(0, A.jsx)(`span`, {
											className:
												Tc[
													`field__selection-group__result-title`
												],
											children: o.title,
										}),
									],
								}),
								(0, A.jsx)(Le, {
									buttonSize: `xs`,
									buttonType: `negative`,
									leftIcon: (0, A.jsx)(`span`, {
										style: {
											display: `inline-flex`,
											alignItems: `center`,
										},
										children: (0, A.jsx)(uc, {
											size: 14,
											strokeWidth: 2,
											style: { fill: `none` },
										}),
									}),
									onClick: () => d(null),
								}),
							],
						}),
					],
				})
			: (0, A.jsx)(xt, {
					name: `styling`,
					id: `styling`,
					label: `Record`,
					value: kc,
					selectInputProps: { options: c },
					onChange: (e) => p(e),
				});
	},
	jc = { title: `Telephone number`, url: `tel:` },
	Mc = ({ ctx: e, savedFieldSettings: t, onValueUpdate: n }) => {
		let [r, i] = (0, k.useState)(t),
			a = (e) => {
				let t = e.url.replace(/[^\d\s()\-+]/g, ``);
				t = `tel:${t}`;
				let r = { ...jc, ...e, url: t };
				(i(r), n(r));
			};
		return (0, A.jsx)(Ws, {
			name: `link`,
			id: `link`,
			label: r?.title || jc.title,
			value: r?.url || jc.url,
			textInputProps: { monospaced: !0 },
			onChange: (e) => {
				a({ url: e });
			},
		});
	},
	Nc = { title: `Email address`, url: `mailto:` },
	Pc = ({ ctx: e, savedFieldSettings: t, onValueUpdate: n }) => {
		let [r, i] = (0, k.useState)(t),
			a = (e) => {
				let t = e.url
					? e.url.replace(/[^\w@.-]/g, ``).replace(`mailto`, ``)
					: ``;
				t = `mailto:${t}`;
				let r = { ...Nc, ...e, url: t };
				(i(r), n(r));
			};
		return (0, A.jsx)(Ws, {
			name: `link`,
			id: `link`,
			label: r?.title || Nc.title,
			value: r?.url || Nc.url,
			textInputProps: { monospaced: !0 },
			onChange: (e) => {
				a({ url: e });
			},
		});
	},
	Fc = { title: `URL`, url: `` },
	Ic = ({ ctx: e, savedFieldSettings: t, onValueUpdate: n }) => {
		let [r, i] = (0, k.useState)(t),
			a = (e) => {
				let t = e.url.replace(
						/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g,
						``,
					),
					r = { ...Fc, url: t };
				(i(r), n(r));
			};
		return (0, A.jsx)(Ws, {
			name: `link`,
			id: `link`,
			label: r?.title || Fc.title,
			value: r?.url || Fc.url,
			textInputProps: { monospaced: !0 },
			onChange: (e) => {
				a({ url: e });
			},
		});
	},
	Lc = {
		"link-field": `_link-field_ojjpf_1`,
		"link-field__row-type": `_link-field__row-type_ojjpf_15`,
		"link-field__row-title": `_link-field__row-title_ojjpf_26`,
		"link-field__row-variant": `_link-field__row-variant_ojjpf_37`,
		"link-field__row-bottom": `_link-field__row-bottom_ojjpf_48`,
		"link-field__error": `_link-field__error_ojjpf_61`,
	},
	{ getCtxParams: W, getDefaultValue: Rc } = Ys(),
	zc = {
		linkType: {},
		stylingType: {},
		iconType: {},
		record: {},
		asset: {},
		url: {},
		tel: {},
		email: {},
		formatted: {},
		custom_text: void 0,
		aria_label: void 0,
		open_in_new_window: !1,
		nofollow: !1,
		isValid: !1,
		plugin_version: ``,
	};
function Bc({ ctx: e }) {
	let t = (0, k.useRef)({ ...zc }),
		n = e?.locale,
		r = W(e, `field_settings`),
		i = W(e, `plugin_settings`),
		a = W(e, `content_settings`),
		o = r.itemTypes || i.itemTypes || [],
		s = r?.linkTypeOptions || [];
	o.length === 0 && (s = s.filter((e) => e.value !== `record`));
	let c = { label: `--select--`, value: `` },
		l = r?.stylingOptions ?? [],
		u = r?.iconOptions ?? [],
		d = r?.allow_new_target ?? !0,
		f = r?.allow_custom_text ?? !0,
		p = r?.allow_aria_label ?? !0,
		m = r?.allow_icons ?? !0,
		h = r?.allow_nofollow ?? !0,
		g = {
			cms_url: void 0,
			id: void 0,
			slug: void 0,
			status: void 0,
			title: void 0,
			url: void 0,
			modelApiKey: void 0,
			modelData: void 0,
		},
		_ = {
			alt: void 0,
			cms_url: void 0,
			id: void 0,
			status: void 0,
			title: void 0,
			url: void 0,
		},
		v = { title: void 0, url: void 0 },
		y = { title: void 0, url: void 0 },
		b = { title: void 0, url: void 0 },
		x = l && l.length > 0,
		S = u.length > 0 && m,
		C = (e) => {
			let t = (e?.cms_url || ``).match(/item_types\/([A-Za-z0-9_-]+)/),
				n = t ? t[1] : null;
			return (n && o.find((e) => e.id === n)) || null;
		},
		w = (e) => {
			if (!e?.cms_url) return null;
			let t = C(e),
				n;
			if (t && t.api_key) n = String(t.api_key);
			else if (t && t.attributes && t.attributes.api_key)
				n = String(t.attributes.api_key);
			else {
				let t = e.cms_url.match(/item_types\/([A-Za-z0-9_-]+)/);
				if (t && t[1]) {
					let e = t[1],
						r = o.find((t) => t.id === e);
					r && r.api_key && (n = String(r.api_key));
				}
			}
			return {
				...e,
				modelApiKey: n,
				modelData:
					n && t
						? {
								id: t?.id,
								api_key: n,
								label: t?.label,
								type: t?.type,
							}
						: void 0,
			};
		},
		ee = (e, t) => {
			switch (t) {
				case `tel`:
					return (
						e?.custom_text ||
						(e?.[t]?.url
							? e?.[t]?.url.replace(`tel:`, ``)
							: void 0) ||
						void 0
					);
				case `email`:
					return (
						e?.custom_text ||
						(e?.[t]?.url
							? e?.[t]?.url.replace(`mailto:`, ``)
							: void 0) ||
						void 0
					);
				case `url`:
					return e?.custom_text || e?.[t]?.url || void 0;
				default:
					return e?.custom_text || e?.[t]?.title || void 0;
			}
		},
		[T, te] = (0, k.useState)({
			linkType: Rc(a, `linkType`, s?.[0] || c),
			stylingType: x ? Rc(a, `stylingType`, l?.[0] || void 0) : void 0,
			iconType: S ? Rc(a, `iconType`, u?.[0] || void 0) : void 0,
			record: w(Rc(a, `record`, g)),
			asset: Rc(a, `asset`, _),
			url: Rc(a, `url`, v),
			tel: Rc(a, `tel`, y),
			email: Rc(a, `email`, b),
			formatted: Rc(a, `formatted`, {}),
			custom_text: f ? Rc(a, `custom_text`, void 0) : void 0,
			aria_label: p ? Rc(a, `aria_label`, void 0) : void 0,
			open_in_new_window: d ? Rc(a, `open_in_new_window`, !1) : !1,
			nofollow: h ? Rc(a, `nofollow`, !1) : !1,
			isValid: Rc(a, `isValid`, !1),
			plugin_version: Rc(i, `version`, void 0),
		}),
		ne = !x || T.stylingType?.allowIcons === !0,
		re = S && ne,
		ie = async (n) => {
			let r = { ...t.current, ...T, ...n };
			if (r?.record && Object.keys(r.record).length > 0) {
				let e = w(r.record);
				e && (r.record = { ...e });
			}
			let i = r.linkType.value;
			((r = {
				...r,
				record: i === `record` ? r.record : g,
				asset: i === `asset` ? r.asset : _,
				url: i === `url` ? r.url : v,
				tel: i === `tel` ? r.tel : y,
				email: i === `email` ? r.email : b,
			}),
				i === `record` &&
					r?.record?.id &&
					(r.record = w(r.record) || r.record));
			let a = !x || r.stylingType?.allowIcons === !0;
			((!a || !S) && (r.iconType = void 0),
				r.open_in_new_window || (r.nofollow = !1));
			let o = S && a,
				s = {
					isValid: !1,
					type: i,
					modelApiKey:
						i === `record` ? r?.record?.modelApiKey : void 0,
					text: ee(r, i),
					ariaLabel: r.aria_label ?? ee(r, i),
					url: i === `` ? null : r?.[i]?.url || null,
					target: r?.open_in_new_window ? `_blank` : `_self`,
					rel:
						r?.open_in_new_window && r?.nofollow
							? `nofollow`
							: null,
					noFollow: (r?.open_in_new_window && r?.nofollow) || !1,
					class: r?.stylingType?.value || null,
					icon: (o && r?.iconType?.value) || null,
				};
			s.isValid = !!(s.text && s.url);
			let c = { ...r, isValid: s.isValid, formatted: s };
			((t.current = c),
				te(c),
				e.setFieldValue(e.fieldPath, JSON.stringify(c)));
		};
	return (0, A.jsx)(Ue, {
		ctx: e,
		children: T.linkType?.value
			? (0, A.jsx)(rt, {
					children: (0, A.jsxs)(`div`, {
						className: Lc[`link-field`],
						children: [
							(0, A.jsxs)(`div`, {
								className: Lc[`link-field__row-type`],
								children: [
									(0, A.jsx)(`div`, {
										children: (0, A.jsx)(xt, {
											name: `type`,
											id: `type`,
											label: `Type`,
											value: T.linkType,
											selectInputProps: { options: s },
											onChange: (e) => {
												ie({ linkType: e });
											},
										}),
									}),
									(0, A.jsx)(`div`, {
										children:
											T.linkType.value === `record`
												? (0, A.jsx)(Ac, {
														ctx: e,
														ctxFieldParameters: r,
														ctxPluginParameters: i,
														savedFieldSettings:
															T.record,
														onValueUpdate: (e) =>
															ie({ record: e }),
														locale: n,
													})
												: T?.linkType?.value === `asset`
													? (0, A.jsx)(Dc, {
															ctx: e,
															savedFieldSettings:
																T.asset,
															onValueUpdate: (
																e,
															) =>
																ie({
																	asset: e,
																}),
															locale: n,
														})
													: T?.linkType?.value ===
														  `url`
														? (0, A.jsx)(Ic, {
																ctx: e,
																savedFieldSettings:
																	T.url,
																onValueUpdate: (
																	e,
																) =>
																	ie({
																		url: e,
																	}),
															})
														: T?.linkType?.value ===
															  `tel`
															? (0, A.jsx)(Mc, {
																	ctx: e,
																	savedFieldSettings:
																		T.tel,
																	onValueUpdate:
																		(e) =>
																			ie({
																				tel: e,
																			}),
																})
															: T?.linkType
																		?.value ===
																  `email`
																? (0, A.jsx)(
																		Pc,
																		{
																			ctx: e,
																			savedFieldSettings:
																				T.email,
																			onValueUpdate:
																				(
																					e,
																				) =>
																					ie(
																						{
																							email: e,
																						},
																					),
																		},
																	)
																: null,
									}),
								],
							}),
							(f || p) &&
								(0, A.jsxs)(`div`, {
									className: Lc[`link-field__row-title`],
									children: [
										f &&
											(0, A.jsx)(`div`, {
												children: (0, A.jsx)(Ws, {
													name: `custom_text`,
													id: `custom_text`,
													label: `Title (Optional)`,
													value: T.custom_text,
													textInputProps: {
														monospaced: !0,
													},
													onChange: (e) => {
														ie({ custom_text: e });
													},
												}),
											}),
										p &&
											(0, A.jsx)(`div`, {
												children: (0, A.jsx)(Ws, {
													name: `aria_label`,
													id: `aria_label`,
													label: `Aria-label (Optional)`,
													value: T.aria_label,
													textInputProps: {
														monospaced: !0,
													},
													onChange: (e) => {
														ie({ aria_label: e });
													},
												}),
											}),
									],
								}),
							(x || re) &&
								(0, A.jsxs)(`div`, {
									className: Lc[`link-field__row-variant`],
									children: [
										x &&
											(0, A.jsx)(`div`, {
												children: (0, A.jsx)(xt, {
													name: `styling`,
													id: `styling`,
													label: `Variant`,
													value: T.stylingType,
													selectInputProps: {
														options: l,
													},
													onChange: (e) => {
														ie({ stylingType: e });
													},
												}),
											}),
										re &&
											(0, A.jsx)(`div`, {
												children: (0, A.jsx)(xt, {
													name: `icon`,
													id: `icon`,
													label: `Icon`,
													value: T.iconType,
													selectInputProps: {
														options: u,
													},
													onChange: (e) => {
														ie({ iconType: e });
													},
												}),
											}),
									],
								}),
							d &&
								(0, A.jsxs)(`div`, {
									className: Lc[`link-field__row-bottom`],
									children: [
										(0, A.jsx)(Rs, {
											name: `open_in_new_window`,
											id: `open_in_new_window`,
											label: `Open in new window`,
											value: T.open_in_new_window,
											onChange: (e) => {
												ie({ open_in_new_window: e });
											},
										}),
										T.open_in_new_window &&
											h &&
											(0, A.jsx)(Rs, {
												name: `nofollow`,
												id: `nofollow`,
												label: `NoFollow`,
												value: T.nofollow,
												onChange: (e) => {
													ie({ nofollow: e });
												},
											}),
									],
								}),
						],
					}),
				})
			: (0, A.jsx)(`div`, {
					children: (0, A.jsxs)(`p`, {
						className: Lc[`link-field__error`],
						children: [
							(0, A.jsx)(`strong`, { children: `Error!` }),
							` No valid link types could be found for this field.`,
							(0, A.jsx)(`br`, {}),
							`Please add the wanted link types to the field appearance settings or the plugin settings`,
						],
					}),
				}),
	});
}
var Vc = {
		private: !1,
		name: `datocms-plugin-better-linking`,
		homepage: `https://github.com/ColinDorr/datocms-plugin-better-linking`,
		version: `1.0.0`,
		description: `DatoCMS plugin for advanced link management with records, assets, URLs, telephone and email links — including styling variants, icons, titles, aria-labels and nofollow control.`,
		engines: { node: `>=20.0.0` },
		scripts: {
			dev: `vite`,
			build: `tsc -b && vite build`,
			preview: `vite preview`,
			test: `jest --passWithNoTests`,
			"test:watch": `jest --watch`,
			prettier: `prettier --write .`,
			"pre-commit": `npm run prettier`,
			prepack: `npm run build`,
			prepare: `husky install`,
			postversion: `git push --follow-tags`,
		},
		dependencies: {
			"datocms-plugin-sdk": `^2.1.1`,
			"datocms-react-ui": `^2.1.4`,
			"lucide-react": `^1.7.0`,
			react: `^19.2.4`,
			"react-dom": `^19.2.4`,
		},
		devDependencies: {
			"@types/jest": `^30.0.0`,
			"@types/node": `^25.5.0`,
			"@types/react": `^19.2.14`,
			"@types/react-dom": `^19.2.3`,
			"@vitejs/plugin-react": `^6.0.1`,
			"eslint-config-prettier": `^10.1.8`,
			"eslint-plugin-prettier": `^5.5.5`,
			husky: `^9.1.7`,
			jest: `^30.3.0`,
			prettier: `^3.8.1`,
			"ts-jest": `^29.4.6`,
			typescript: `^5.9.3`,
			vite: `^8.0.3`,
		},
		files: [`dist`, `docs`],
		keywords: [
			`datocms-plugin`,
			`datocms`,
			`record`,
			`asset`,
			`url`,
			`tel`,
			`telephone`,
			`phone number`,
			`email`,
			`target`,
			`title`,
			`link`,
			`linking`,
			`accessibility`,
			`aria-label`,
			`nofollow`,
			`icon`,
			`variant`,
			`styling`,
		],
		repository: {
			type: `git`,
			url: `git+https://github.com/ColinDorr/datocms-plugin-better-linking.git`,
		},
		author: `Colin Dorr`,
		license: `ISC`,
		datoCmsPlugin: {
			title: `Better Linking`,
			previewImage: `docs/preview.png`,
			coverImage: `docs/cover.png`,
			entryPoint: `dist/index.html`,
			permissions: [`currentUserAccessToken`],
		},
	},
	Hc = { id: `betterLinking`, name: `Better Linking` };
he({
	async onBoot(e) {
		let t = Vc.version;
		e.plugin.attributes.parameters?.version !== t &&
			(e.plugin.attributes.parameters = {
				...e.plugin.attributes.parameters,
				version: t,
			});
	},
	renderConfigScreen(e) {
		return Oe((0, A.jsx)(bc, { ctx: e }));
	},
	manualFieldExtensions() {
		return [
			{
				id: Hc.id,
				name: Hc.name,
				type: `editor`,
				fieldTypes: [`json`],
				configurable: !0,
			},
		];
	},
	overrideFieldExtensions(e) {
		if (
			e.attributes.field_type === `json` &&
			e.attributes.appearance?.field_extension === Hc.id
		)
			return { editor: { id: Hc.id } };
	},
	renderManualFieldExtensionConfigScreen(e, t) {
		return Oe((0, A.jsx)(Sc, { ctx: t }));
	},
	renderFieldExtension(e, t) {
		switch (e) {
			case Hc.id:
				return Oe((0, A.jsx)(Bc, { ctx: t }));
		}
	},
});
