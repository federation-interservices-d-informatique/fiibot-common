import { colorise } from "./colorise";

test("Colorise works", () => {
    expect(colorise("Hello", "GREEN")).toBe("\u001b[32mHello\u001b[m");
});
test("Default colorise is OK", () => {
    expect(colorise("Hello")).toBe("\u001b[37mHello\u001b[m");
});
