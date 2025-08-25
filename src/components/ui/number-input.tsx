import { ChangeEvent, InputHTMLAttributes, KeyboardEvent } from "react";
import { Input } from "./input";

type NumberInput = {
  value: string | number;
  setValue: (value: string) => void;
  allowZero?: boolean;
  allowFloat?: boolean;
  maxNumber?: number | null;
} & InputHTMLAttributes<HTMLInputElement>;

export default function NumberInput({
  value,
  setValue,
  allowZero = false,
  allowFloat = false,
  maxNumber = null,
  ...props
}: NumberInput) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === "") return setValue(newValue);

    // Validate based on allowFloat
    const floatPattern = /^\d*\.?\d*$/;
    const isOnlyZero = newValue === "0";
    const intPattern = /^[1-9]\d*$/;

    const isValidFloat = allowFloat && floatPattern.test(newValue);
    const isValidInt =
      !allowFloat && ((isOnlyZero && allowZero) || intPattern.test(newValue));
    if (!(isValidFloat || isValidInt)) return;

    const numberEquivalent = Number.parseFloat(newValue);

    if (maxNumber == null || numberEquivalent <= maxNumber) {
      setValue(newValue);
    } else {
      setValue(String(maxNumber));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const invalidKeys = allowFloat
      ? ["e", "E", "+", "-"]
      : ["e", "E", "+", "-", ".", ","];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}