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
              styleSheets:
                - 'resource://Wwwision.Neos.MediaBrowserDialog/Public/dist.css'
```

With that in place, the following `data` attributes can be added to HTML elements in the module in order to include the
Neos Media Browser and/or asset preview:

| Attribute                         | Effect                                                                                                  | Allowed on elements                                               |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `asset`                           | If not empty the specified asset id/s is/are used to populate preview and form fields (required)        | container                                                         |
| `asset-constraints-media-types`   | Comma separated list of allowed mediaTypes (optional)                                                   | container                                                         |
| `asset-constraints-asset-sources` | Comma separated list of allowed asset sources (optional)                                                | container                                                         |
| `asset-multiple`                  | If set, multiple assets can be added (optional)                                                         | container                                                         |
| `asset-hide-if-set`               | Element will be hidden if an asset is selected (optional)                                               | any element within the container                                  |
| `asset-hide-if-missing`           | Element will be hidden if no asset is selected (optional)                                               | any element within the container                                  |
| `asset-field`                     | Element value will contain the identifier of the selected field (optional)                              | any input form field within the container, usually a hidden field |
| `asset-preview-template`          | Template element that will be added to the DOM, if an asset is added (optional)                         | `template` element within the container                           |
| `asset-preview-container`         | Element that the `asset-preview-template` template will be added to, if an asset is selected (optional) | any element within the container                                  |
| `asset-preview-label`             | Element will contain the label of the asset, if one is selected (optional)                              | any element within the container                                  |
| `asset-preview-image`             | Element will render a preview of the asset, if one is selected (optional)                               | any `img` element within the container                            |
| `asset-browse`                    | Element will open the Media Browser on click (optional)                                                 | any element within the container that dispatches `click` events   |
| `asset-replace`                   | Element will unset a previously selected asset (optional)                                               | any element within the container that dispatches `click` events   |
| `asset-move-up`                   | Element will move the selected asset one position up (optional, only for asset lists)                   | any element within the container that dispatches `click` events   |
| `asset-move-down`                 | Element will move the selected asset one position down (optional, only for asset lists)                 | any element within the container that dispatches `click` events   |

### Example

#### Simple asset selection

To render just the input field and a button to open the Media Browser:

```html

<div data-asset>
  <input type="text" name="assetId" data-asset-field/>
  <a href="#" data-asset-browse>
</div>
```

#### Asset preview

To render a preview image and the label of a previously selected asset:

```html
<div data-asset="{someAssetId}">
  <template data-asset-preview-template>
    <figure data-asset-hide-if-missing>
      <img style="width: 100px" data-asset-preview-image/>
      <figcaption data-asset-preview-label></figcaption>
    </figure>
    <span data-asset-hide-if-set>-</span>
  </template>
  <div data-asset-preview-container data-asset-hide-if-missing></div>
</div>
```

Elements with the `data-asset-hide-if-missing` attribute will be _hidden_ when no asset is selected.
Elements with the `data-asset-hide-if-set` attribute will only be _visible_ if no asset is selected – this allows for
rendering fallbacks.

#### Example 01 (Single image upload, Fluid)

The following example renders a hidden field and browse button. If an asset is selected, the browse button is replaced
with the label of the asset and a button to replace the asset.
If the label is clicked, the Media Browser is opened allowing to inspect or replace the selected asset.

Furthermore, the Media Browser will be limited to only show documents and images of the `neos` and `someAssetSource`
Asset sources (see [Asset Constraints](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html#property-type-asset-neos-media-domain-model-asset-array-neos-media-domain-model-asset-asseteditor-file-selection-editor)):

```html
<div data-asset="{someAssetId}" data-asset-constraints-media-types="application/*,image/*" data-asset-constraints-asset-sources="neos,someAssetSource">
  <template data-asset-preview-template>
    <a href="#" data-asset-browse>
      <i class="fas fa-camera icon-white"></i> <span data-asset-preview-label></span>
    </a>
    <a data-asset-replace href="#" class="neos-button" title="Replace asset">
      <i class="fas fa-trash icon-white"></i>
    </a>
    <f:form.hidden property="someAsset" value="{someAssetId}" data="{asset-field: true}" additionalAttributes="{disabled: true}" />
  </template>
  <div data-asset-preview-container data-asset-hide-if-missing></div>
  <div data-asset-hide-if-set>
    <a class="neos-button neos-button-icon" data-asset-browse>
      <i class="fas fa-camera icon-white"></i> Browse assets
    </a>
  </div>
</div>
```

#### Example 02 (Multiple images upload, Fluid)

The following example, renders a list of `{images}` as preview image. Next to every image, move buttons are shown and a delete button is shown that removes the specific asset from the list.
Underneath the list, a Browse button allows to select additional images and finally the whole list can be emptied with an additional button:

```html
<div data-asset="<f:for each='{images}' as='image'>{image.identifier},</f:for>"
     data-asset-constraints-media-types="image/*"
     data-asset-constraints-asset-sources="neos"
     data-asset-multiple>
  <template data-asset-preview-template>
    <div>
      <h2 data-asset-preview-label></h2>
      <img data-asset-preview-image />
      <f:form.hidden name="images[]" data="{asset-field: true}" additionalAttributes="{disabled: true}" />
      <a data-asset-move-up href="#" class="neos-button" title="Move this image one position up">
        <i class="fas fa-arrow-up icon-white"></i>
      </a>
      <a data-asset-move-down href="#" class="neos-button" title="Move this image one position down">
        <i class="fas fa-arrow-down icon-white"></i>
      </a>
      <a data-asset-replace href="#" class="neos-button neos-button-danger" title="Remove this image">
        <i class="fas fa-eraser icon-white"></i>
      </a>
    </div>
  </template>
  <div data-asset-preview-container data-asset-hide-if-missing></div>
  <div data-asset-hide-if-set>
    No images have been selected yet
  </div>
  <div class="neos-button-group">
    <div data-asset-hide-if-missing>
      <a href="#" class="neos-button" data-asset-browse>
        <i class="fas fa-camera icon-white"></i> Add image(s)
      </a>
      <a data-asset-replace href="#" class="neos-button" title="Remove all">
        <i class="fas fa-eraser icon-white"></i>
      </a>
    </div>
    <div data-asset-hide-if-set>
      <a class="neos-button neos-button-icon" data-asset-browse>
        <i class="fas fa-camera icon-white"></i> Add image(s)
      </a>
    </div>
  </div>
</div>
```

**Note:** For multiple assets to be mapped correctly, you might need to explicitly allow them in the MVC controller:

```php
class SomeController extends ActionController {

    // ...

    protected function initializeUpdateAction(): void
    {
        $this->arguments->getArgument('images')->getPropertyMappingConfiguration()->allowAllProperties();
    }

    /**
     * @param array<ImageInterface> $images
     * @Flow\IgnoreValidation("$images")
     */
    public function updateAction(array $images = []): void
    {
        // ...
    }
    
}
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

The idea for this package and parts of the implementation are inspired by [Alois Rietzler](https://github.com/riea) from [brandung GmbH](https://brandung.de), thank you!

## Contribution

Contributions in the form of issues or pull requests are highly appreciated.

## License

See [LICENSE](./LICENSE)
