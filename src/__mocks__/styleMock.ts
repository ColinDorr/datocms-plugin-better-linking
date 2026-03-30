const styles: Record<string, string> = new Proxy(
	{},
	{ get: (_target, name) => String(name) },
);
export default styles;
