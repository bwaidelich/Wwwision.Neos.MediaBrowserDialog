# Wwwision.Neos.MediaBrowserDialog

JavaScripts to provide asset selection via Media Browser in Neos Backend Modules

## Installation

Install via composer:

    composer require wwwision/neos-mediabrowserdialog

## Usage

In the configuration of a Neos backend module, include the provided `dist.js` file:

```yaml
Neos:
  Neos:
    modules:
      'administration':
        submodules:
          'some-module':
            # ...
            additionalResources:
              javaScripts:
                - 'resource://Wwwision.Neos.MediaBrowserDialog/Public/dist.js'
```

With that in place, the following `data` attributes can be added to HTML elements in the module in order to include the
Neos Media Browser and/or asset preview:

| Attribute                         | Effect                                                                                     | Allowed on elements                                               |
|-----------------------------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `asset`                           | If not empty the specified asset id is used to populate preview and form fields (required) | container                                                         |
| `asset-constraints-media-types`   | Comma separated list of allowed mediaTypes (optional)                                      | container                                                         |
| `asset-constraints-asset-sources` | Comma separated list of allowed asset sources (optional)                                   | container                                                         |
| `asset-hide-if-set`               | Element will be hidden if an asset is selected (optional)                                  | any element within the container                                  |
| `asset-hide-if-missing`           | Element will be hidden if no asset is selected (optional)                                  | any element within the container                                  |
| `asset-field`                     | Element value will contain the identifier of the selected field (optional)                 | any input form field within the container, usually a hidden field |
| `asset-preview-label`             | Element will contain the label of the asset, if one is selected (optional)                 | any element within the container                                  |
| `asset-preview-image`             | Element will render a preview of the asset, if one is selected (optional)                  | any `img` element within the container                            |
| `asset-browse`                    | Element open the Media Browser on click (optional)                                         | any element within the container that dispatches `click` events   |
| `asset-replace`                   | Element unset a previously selected asset (optional)                                       | any element within the container that dispatches `click` events   |

### Example

#### Simple asset selection

To render just the input field and a button to open the Media Browser:

```html
<div data-asset>
    <input type="text" name="assetId" data-asset-field />
    <a href="#" data-asset-browse>
</div>
```

#### Asset preview

To render a preview image and the label of a previously selected asset:

```html
<div data-asset="{someAssetId}">
    <figure data-asset-hide-if-missing>
        <img style="width: 100px" data-asset-preview-image />
        <figcaption data-asset-preview-label></figcaption>
    </figure>
    <span data-asset-hide-if-set>-</span>
</div>
```

Elements with the `data-asset-hide-if-missing` attribute will be _hidden_ when no asset is selected.
Elements with the `data-asset-hide-if-set` attribute will only be _visible_ if no asset is selected – this allows for
rendering fallbacks.

#### Fully fledged example (Fluid)

The following example renders a hidden field and browse button. If an asset is selected, the browse button is replaced
with the label of the asset and a button to replace the asset.
If the label is clicked, the Media Browser is opened allowing to inspect or replace the selected asset.

Furthermore, the Media Browser will be limited to only show documents and images of the `neos` and `someAssetSource`
Asset sources (see [Asset Constraints](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html#property-type-asset-neos-media-domain-model-asset-array-neos-media-domain-model-asset-asseteditor-file-selection-editor)):

```html
<div data-asset="{someAssetId}" data-asset-constraints-media-types="application/*,image/*" data-asset-constraints-asset-sources="neos,someAssetSource">
    <f:form.hidden property="someAsset" value="{someAssetId}" data="{asset-field: true}" />
    <div data-asset-hide-if-missing>
        <a href="#" data-asset-browse>
            <i class="fas fa-camera icon-white"></i> <span data-asset-preview-label></span>
        </a>
        <a data-asset-replace href="#" class="neos-button" title="Replace asset">
            <i class="fas fa-trash icon-white"></i>
        </a>
    </div>
    <div data-asset-hide-if-set>
        <a class="neos-button neos-button-icon" data-asset-browse>
            <i class="fas fa-camera icon-white"></i> Browse assets
        </a>
    </div>
</div>
```

### Events

The following events are dispatched on the container element (with the `data-asset` attribute):

| Event                             | Payload                                  |
|-----------------------------------|------------------------------------------|
| `assetChosen`                     | The asset identifier (in `event.detail`) |
| `assetRemoved`                    | -                                        |

#### Example

```javascript
document.querySelectorAll('[data-asset]').forEach(container => {
    container.addEventListener('assetChosen', e => console.log('Asset selected: ' + e.detail));
    container.addEventListener('assetRemoved', e => console.log('Asset removed'));
});
```

## Acknowledgements

The idea for this package and parts of the implementation are inspired by [Alois Rietzler](https://github.com/riea), thank you!

## Contribution

Contributions in the form of issues or pull requests are highly appreciated.

## License

See [LICENSE](./LICENSE)
