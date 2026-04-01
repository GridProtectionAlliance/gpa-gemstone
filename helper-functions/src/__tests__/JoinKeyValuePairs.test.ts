import { JoinKeyValuePairs } from "../JoinKeyValuePairs";
import { ParseKeyValuePairs } from "../ParseKeyValuePairs";

describe("JoinKeyValuePairs", () => {

    // Basic join

    it("should join simple key/value pairs", () => {
        const result = JoinKeyValuePairs({ key1: "value1", key2: "value2" });
        expect(result).toBe("key1=value1; key2=value2");
    });

    it("should return an empty string for an empty object", () => {
        const result = JoinKeyValuePairs({});
        expect(result).toBe("");
    });

    it("should handle a single key/value pair", () => {
        const result = JoinKeyValuePairs({ key: "value" });
        expect(result).toBe("key=value");
    });

    // Boolean lowercasing

    it("should lowercase boolean true values", () => {
        const result = JoinKeyValuePairs({ enabled: "True" });
        expect(result).toBe("enabled=true");
    });

    it("should lowercase boolean false values", () => {
        const result = JoinKeyValuePairs({ enabled: "False" });
        expect(result).toBe("enabled=false");
    });

    it("should lowercase mixed-case boolean values", () => {
        const result = JoinKeyValuePairs({ a: "TRUE", b: "false", c: "True" });
        expect(result).toContain("a=true");
        expect(result).toContain("b=false");
        expect(result).toContain("c=true");
    });

    // Value wrapping with delimiters

    it("should wrap values containing the parameter delimiter", () => {
        const result = JoinKeyValuePairs({ key: "a;b;c" });
        expect(result).toBe("key={a;b;c}");
    });

    it("should wrap values containing the key/value delimiter", () => {
        const result = JoinKeyValuePairs({ key: "a=b" });
        expect(result).toBe("key={a=b}");
    });

    it("should wrap values containing the start value delimiter", () => {
        const result = JoinKeyValuePairs({ key: "a{b" });
        expect(result).toBe("key={a{b}");
    });

    it("should wrap values containing the end value delimiter", () => {
        const result = JoinKeyValuePairs({ key: "a}b" });
        expect(result).toBe("key={a}b}");
    });

    it("should wrap values containing multiple delimiter types", () => {
        const result = JoinKeyValuePairs({ key: "a=1; b=2" });
        expect(result).toBe("key={a=1; b=2}");
    });

    it("should not wrap values that contain no delimiters", () => {
        const result = JoinKeyValuePairs({ key: "simple" });
        expect(result).toBe("key=simple");
    });

    // Null/undefined handling 

    it("should handle null values as empty strings", () => {
        const source: Record<string, string> = { key: null as unknown as string };
        const result = JoinKeyValuePairs(source);
        expect(result).toBe("key=");
    });

    it("should handle undefined values as empty strings", () => {
        const source: Record<string, string> = { key: undefined as unknown as string };
        const result = JoinKeyValuePairs(source);
        expect(result).toBe("key=");
    });

    // Custom delimiters

    it("should support custom parameter and key/value delimiters", () => {
        const result = JoinKeyValuePairs({ key1: "value1", key2: "value2" }, "|", ":");
        expect(result).toBe("key1:value1| key2:value2");
    });

    it("should support custom start/end value delimiters", () => {
        const result = JoinKeyValuePairs({ key: "a;b" }, ";", "=", "[", "]");
        expect(result).toBe("key=[a;b]");
    });

    it("should wrap based on custom delimiters", () => {
        const result = JoinKeyValuePairs({ key: "a|b" }, "|", ":", "[", "]");
        expect(result).toBe("key:[a|b]");
    });

    // Prototype pollution safety

    it("should only include own properties", () => {
        const source = Object.create({ inherited: "nope" });
        source.own = "yes";
        const result = JoinKeyValuePairs(source);
        expect(result).toBe("own=yes");
        expect(result).not.toContain("inherited");
    });

    // Round-trip with ParseKeyValuePairs -- maybe not the best place but need to test both together to confirm compatibility

    it("should produce output that ParseKeyValuePairs can round-trip for simple values", () => {
        const source = { key1: "value1", key2: "value2", key3: "value3" };
        const joined = JoinKeyValuePairs(source);
        const parsed = ParseKeyValuePairs(joined);

        expect(parsed.get("key1")).toBe("value1");
        expect(parsed.get("key2")).toBe("value2");
        expect(parsed.get("key3")).toBe("value3");
    });

    it("should produce output that ParseKeyValuePairs can round-trip for nested values", () => {
        const source = { simple: "yes", nested: "a=1; b=2", list: "x;y;z" };
        const joined = JoinKeyValuePairs(source);
        const parsed = ParseKeyValuePairs(joined);

        expect(parsed.get("simple")).toBe("yes");
        expect(parsed.get("nested")).toBe("a=1; b=2");
        expect(parsed.get("list")).toBe("x;y;z");
    });

    it("should round-trip boolean values as lowercase", () => {
        const source = { enabled: "True", verbose: "False" };
        const joined = JoinKeyValuePairs(source);
        const parsed = ParseKeyValuePairs(joined);

        expect(parsed.get("enabled")).toBe("true");
        expect(parsed.get("verbose")).toBe("false");
    });
});