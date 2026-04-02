import { ParseKeyValuePairs } from "../ParseKeyValuePairs";

describe("ParseKeyValuePairs", () => {

    // Basic parsing

    it("should parse simple key/value pairs", () => {
        const result = ParseKeyValuePairs("key1=value1; key2=value2; key3=value3");
        expect(result.get("key1")).toBe("value1");
        expect(result.get("key2")).toBe("value2");
        expect(result.get("key3")).toBe("value3");
    });

    it("should trim whitespace from keys and values", () => {
        const result = ParseKeyValuePairs("  key1 = value1 ;  key2 = value2 ");
        expect(result.get("key1")).toBe("value1");
        expect(result.get("key2")).toBe("value2");
    });

    it("should handle a single key/value pair", () => {
        const result = ParseKeyValuePairs("key=value");
        expect(result.get("key")).toBe("value");
        expect(result.size).toBe(1);
    });

    it("should return an empty map for an empty string", () => {
        const result = ParseKeyValuePairs("");
        expect(result.size).toBe(0);
    });

    it("should skip entries without a key/value delimiter", () => {
        const result = ParseKeyValuePairs("key1=value1; garbage; key2=value2");
        expect(result.get("key1")).toBe("value1");
        expect(result.get("key2")).toBe("value2");
        expect(result.size).toBe(2);
    });

    // Nested value delimiters

    it("should parse values wrapped in start/end value delimiters", () => {
        const result = ParseKeyValuePairs("normalKVP=-1; nestedKVP={p1=true; p2=false}");
        expect(result.get("normalKVP")).toBe("-1");
        expect(result.get("nestedKVP")).toBe("p1=true; p2=false");
    });

    it("should handle deeply nested delimiters", () => {
        const result = ParseKeyValuePairs("key={outer{inner=val; other=val2}end}");
        expect(result.get("key")).toBe("outer{inner=val; other=val2}end");
    });

    it("should handle multiple nested values in the same string", () => {
        const result = ParseKeyValuePairs("a={x=1; y=2}; b={m=3; n=4}");
        expect(result.get("a")).toBe("x=1; y=2");
        expect(result.get("b")).toBe("m=3; n=4");
    });

    it("should handle values with only start/end delimiters and no content", () => {
        const result = ParseKeyValuePairs("key={}");
        expect(result.get("key")).toBe("");
    });

    it("should preserve nested braces inside values", () => {
        const result = ParseKeyValuePairs("expr={eval{something}}");
        expect(result.get("expr")).toBe("eval{something}");
    });

    it("should parse a complex connection string with multiple nested expressions", () => {
        const conString = [
            "IncludeActivePower=true",
            " IncludeReactivePower=true",
            " Include3Phase=true",
            " UsePrecisionTimer=false",
            " TimeResolution=0",
            " OutputMeasurementNamingExpression={eval{\"{Current.PointTag}\".Substring(0, \"{Current.PointTag}\".IndexOf('_', \"{Current.PointTag}\".IndexOf('_') + 1))}_{Output}_{Power.Phase}}",
            " ThreePhaseKeyExpression={eval{\"{Current.PointTag}\".Substring(0, \"{Current.PointTag}\".IndexOf('_', \"{Current.PointTag}\".IndexOf('_') + 1))}}",
            " Currents={CHINA_PM_7I;CHINA_PM_8I;CHINA_PM_9I}",
            " DescriptionExpression={{Output} forr {Current.DeviceAcronym}}"
        ].join(";");

        const result = ParseKeyValuePairs(conString);

        expect(result.get("IncludeActivePower")).toBe("true");
        expect(result.get("IncludeReactivePower")).toBe("true");
        expect(result.get("Include3Phase")).toBe("true");
        expect(result.get("UsePrecisionTimer")).toBe("false");
        expect(result.get("TimeResolution")).toBe("0");
        expect(result.get("Currents")).toBe("CHINA_PM_7I;CHINA_PM_8I;CHINA_PM_9I");
        expect(result.get("DescriptionExpression")).toBe("{Output} forr {Current.DeviceAcronym}");
    });

    //  Unmatched brace handling

    it("should handle an unmatched opening brace without corrupting other pairs", () => {
        const result = ParseKeyValuePairs("key1=value1; key2={noClosing; key3=value3");
        expect(result.get("key1")).toBe("value1");
        expect(result.get("key3")).toBe("value3");
    });

    it("should handle an unmatched closing brace as a literal character", () => {
        const result = ParseKeyValuePairs("key1=val}ue; key2=value2");
        expect(result.get("key1")).toBe("val}ue");
        expect(result.get("key2")).toBe("value2");
    });

    it("should not corrupt matched nested values when an unmatched brace exists elsewhere", () => {
        const result = ParseKeyValuePairs("nested={a=1; b=2}; broken={noClose; simple=yes");
        expect(result.get("nested")).toBe("a=1; b=2");
        expect(result.get("simple")).toBe("yes");
    });

    it("should handle a value that is just an opening brace", () => {
        const result = ParseKeyValuePairs("key1={; key2=value2");
        expect(result.get("key2")).toBe("value2");
    });

    it("should parse correctly when unmatched brace appears in a complex connection string", () => {
        const conString = [
            "IncludeActivePower=true",
            " Currents={CHINA_PM_7I;CHINA_PM_8I;CHINA_PM_9I}",
            " PointTagNamingExpression={someText",
            " UsePrecisionTimer=false"
        ].join(";");

        const result = ParseKeyValuePairs(conString);

        expect(result.get("IncludeActivePower")).toBe("true");
        expect(result.get("Currents")).toBe("CHINA_PM_7I;CHINA_PM_8I;CHINA_PM_9I");
        expect(result.get("UsePrecisionTimer")).toBe("false");
    });

    //  Duplicate key handling 

    it("should overwrite duplicate keys when ignoreDuplicateKeys is true", () => {
        const result = ParseKeyValuePairs("key=first; key=second", ";", "=", "{", "}", true);
        expect(result.get("key")).toBe("second");
    });

    it("should throw on duplicate keys when ignoreDuplicateKeys is false", () => {
        expect(() => {
            ParseKeyValuePairs("key=first; key=second", ";", "=", "{", "}", false);
        }).toThrow();
    });

    //  Custom delimiters

    it("should support custom parameter and key/value delimiters", () => {
        const result = ParseKeyValuePairs("key1:value1|key2:value2", "|", ":", "{", "}");
        expect(result.get("key1")).toBe("value1");
        expect(result.get("key2")).toBe("value2");
    });

    it("should support custom start/end value delimiters", () => {
        const result = ParseKeyValuePairs("key=[a=1; b=2]", ";", "=", "[", "]");
        expect(result.get("key")).toBe("a=1; b=2");
    });

    // Delimiter validation

    it("should throw if delimiters are not unique", () => {
        expect(() => ParseKeyValuePairs("key=value", ";", ";", "{", "}")).toThrow("All delimiters must be unique");
        expect(() => ParseKeyValuePairs("key=value", ";", "=", ";", "}")).toThrow("All delimiters must be unique");
        expect(() => ParseKeyValuePairs("key=value", ";", "=", "{", "=")).toThrow("All delimiters must be unique");
        expect(() => ParseKeyValuePairs("key=value", ";", "=", "{", "{")).toThrow("All delimiters must be unique");
    });

    //  Backslash escaping 

    it("should handle backslashes in values", () => {
        const result = ParseKeyValuePairs("path=C:\\Users\\test; key2=value2");
        expect(result.get("path")).toBe("C:\\Users\\test");
        expect(result.get("key2")).toBe("value2");
    });

    it("should handle backslashes inside nested values", () => {
        const result = ParseKeyValuePairs("path={C:\\Users\\test=yes}");
        expect(result.get("path")).toBe("C:\\Users\\test=yes");
    });
});