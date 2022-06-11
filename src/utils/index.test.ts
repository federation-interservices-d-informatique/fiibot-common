/**
 * All tests for util
 */
import { colorise } from "./colorise";
import { codeBlock } from "./format";

/* Tests for colorise.ts */
test("Colorise works", () => {
    expect(colorise("Hello", "GREEN")).toBe("\u001b[32mHello\u001b[0m");
});

test("Default colorise is OK", () => {
    expect(colorise("Hello")).toBe("\u001b[37mHello\u001b[0m");
});

/* Tests for format.ts */
test("codeBlock function works", () => {
    expect(codeBlock("markdown", "# Hello")).toBe("```markdown\n# Hello```");
});
