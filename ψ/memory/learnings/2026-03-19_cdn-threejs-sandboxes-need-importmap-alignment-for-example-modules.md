# CDN Three.js sandboxes need import-map alignment for example modules

When building a no-build Three.js sandbox directly in the browser, importing example modules such as `OrbitControls` from the CDN is not enough on its own. Those example modules often import the bare specifier `three`, which the browser cannot resolve unless the page provides an import map. The symptom is a runtime error like: `Failed to resolve module specifier "three"`.

The stable fix is to add an import map in `index.html` that maps `three` to the same CDN module URL used by the page. Once that alignment is present, the browser can resolve both the local module imports and the internal imports used by Three.js example modules.

Practical rule: for static CDN-based Three.js prototypes, scaffold the import map up front whenever any `examples/jsm/*` module is involved instead of waiting for the browser to fail.
