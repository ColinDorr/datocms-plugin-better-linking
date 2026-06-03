/**
 * Base used to resolve relative references (`/path`, `#anchor`, `?q=1`,
 * protocol-relative `//host`) so they validate just as the old character
 * filter accepted them. Only parse success/failure is read — never the
 * resolved href — so the caller keeps storing the user's value verbatim.
 */
const RELATIVE_BASE = "https://datocms-better-linking.invalid/";

/**
 * Returns whether `input` parses as a URL via the WHATWG parser (`new URL`),
 * resolving relative references against {@link RELATIVE_BASE}.
 *
 * This replaces a hand-rolled character allowlist that silently dropped `%`
 * (issue #18) with the platform parser, and deliberately adds no rules of its
 * own: every scheme the old filter let through — `javascript:`, `data:`,
 * `mailto:`, `tel:`, … — still validates. Editors are trusted, so the goal is
 * to validate URLs correctly, not to restrict them. Only blank input and
 * genuinely malformed URLs (e.g. a scheme with no host) are rejected.
 *
 * @param input - Raw URL text from the editor.
 * @returns Whether the value parses as a URL.
 */
export const isValidUrl = (input: string): boolean => {
	if (!input || !input.trim()) {
		return false;
	}

	try {
		// `new URL` throws on malformed input; reaching the next line means it
		// parsed successfully. The parsed value itself is not needed.
		new URL(input, RELATIVE_BASE);
		return true;
	} catch {
		return false;
	}
};
