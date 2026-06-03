import { isValidUrl } from "./urlValidation";

describe("isValidUrl", () => {
	describe("accepts URLs the platform parser understands", () => {
		test.each([
			"https://example.com",
			"http://example.com/path",
			"https://example.com:8080/a/b?query=1#frag",
			"https://sub.example.co.uk/a/b/c",
		])("absolute http(s) URL: %s", (url) => {
			expect(isValidUrl(url)).toBe(true);
		});

		// Issue #18: the percent sign drives percent-encoding and is essential
		// in URLs. The previous character allowlist stripped it on every
		// keystroke, making encoded URLs impossible to enter.
		test.each([
			"https://example.com/path%20with%20spaces",
			"https://example.com/caf%C3%A9",
			"https://example.com/search?q=a%20b&name=%C3%A9",
			"https://example.com/?discount=50%",
		])("preserves percent-encoding (issue #18): %s", (url) => {
			expect(isValidUrl(url)).toBe(true);
		});

		// A CMS link field must accept internal links, anchors and queries,
		// exactly as the old character filter did.
		test.each([
			"/about",
			"/blog/my-post",
			"/caf%C3%A9",
			"#section",
			"?page=2",
			"//cdn.example.com/lib.js",
		])("relative reference: %s", (url) => {
			expect(isValidUrl(url)).toBe(true);
		});

		// Every scheme the old allowlist let through stays valid — editors are
		// trusted, so the validator adds no scheme restrictions of its own.
		test.each([
			"mailto:hi@example.com",
			"tel:+15551234567",
			"ftp://files.example.com/file.zip",
			"javascript:void(0)",
			"data:text/plain,hello",
		])("non-http(s) scheme: %s", (url) => {
			expect(isValidUrl(url)).toBe(true);
		});
	});

	describe("rejects only blank or genuinely malformed input", () => {
		test.each([
			["empty string", ""],
			["whitespace only", "   "],
			["scheme without host", "https://"],
			["http scheme without host", "http://"],
			["space in host", "https://exa mple.com"],
			["unterminated IPv6 host", "http://[bad"],
		])("rejects %s: %j", (_label, url) => {
			expect(isValidUrl(url)).toBe(false);
		});
	});
});
