# Prop documentation standard

Place a `/** ... */` JSDoc block immediately above each property in a React component's props interface.

- Use one concise, plain-English that explains what the prop does.
- Begin optional prop descriptions with `Optional` and include known default values.
- Add `@param name - description` for every callback argument.
- Add `@returns` only when a callback's return value affects behavior.
- Do not add `@type`; TypeScript already supplies the type.
- Skip inherited `children` unless its meaning is not obvious.

```ts
interface IProps {
    /**
     * Title shown in the card header.
     */
    HeaderText: string;
    /**
     * Optional initial open state of the card, defaulting to true.
     */
    IsOpenInitially?: boolean;
    /**
     * Optional callback fired when the card is opened or closed.
     * @param isOpen - Whether the card is now open.
     */
    SetIsCardOpen?: (isOpen: boolean) => void;
}
```
