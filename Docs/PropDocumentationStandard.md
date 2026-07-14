# TypeScript API documentation standard

Document every TypeScript interface, every interface member, and every named type alias that defines a contract or union. This applies to domain models, state, service contracts, test fixtures, and React props alike; an interface is not out of scope merely because it is not consumed by a component.

- Place a concise `/** ... */` JSDoc block immediately above each interface and named type alias.
- Place a separate JSDoc block immediately above every interface property, method, call signature, and index signature.
- Expand compact interfaces and object-literal contracts, including anonymous nested contracts, so every member is declared on its own line.
- Place each member's JSDoc on the line or lines immediately above the member; never place member JSDoc inline.
- Describe the member's role or behavior instead of restating its TypeScript type.

## React props

Place a `/** ... */` JSDoc block immediately above each property in a React component's props interface.

- Use one concise, plain-English sentence that explains what the prop does.
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
