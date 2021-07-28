import { colorise, AnsiEscapesColors } from "./colorise";

test("Colorise works", () => {
    expect(colorise("Hello", AnsiEscapesColors.GREEN)).toBe(
        "\x1b[92mHello\x1b[m"
    );
});
test("Default colorise is OK", () => {
    expect(colorise("Hello")).toBe("\x1b[97mHello\x1b[m");
});
