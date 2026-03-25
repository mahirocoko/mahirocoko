# Mahiro-style UI depth should be earned

When refining `mahiro-style`, do not frame unnecessary nesting as an HTML-only problem or as a simple count-based smell. The better doctrine is that UI depth must earn its place. That rule needs to cover both HTML wrappers and wrapper components, because both can hide weak ownership just as easily as they can express real layout or semantic structure.

Do not teach "long props are bad" as a shortcut. A long prop list can still be correct when it expresses one clear component contract. The real drift appears when scattered parent internals leak through a boundary that has not earned its own ownership. Good doctrine should preserve that distinction explicitly.

Examples matter as much as the rule text. Tailwind-heavy UI examples need to show the difference between useful layout layers and wrapper-on-wrapper noise, otherwise the doctrine will sound right but train the wrong instinct in practice.
