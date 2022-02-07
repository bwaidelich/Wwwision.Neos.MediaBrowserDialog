window.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('[data-asset]').forEach(async container => {
        wireEventListeners(container);
        await toggleAssetPreview(container, container.dataset.asset);
    });

    function wireEventListeners(container) {
        container.querySelectorAll('[data-asset-browse]').forEach(selectorElement => {
            selectorElement.addEventListener('click', async event => {
                event.preventDefault();
                const assetSources = 'assetConstraintsAssetSources' in container.dataset ? container.dataset.assetConstraintsAssetSources.split(',') : [];
                const mediaTypes = 'assetConstraintsMediaTypes' in container.dataset ? container.dataset.assetConstraintsMediaTypes.split(',') : [];
                const assetIdentifier = await browseAssets(assetSources, mediaTypes, container.dataset.asset);
                if (!assetIdentifier) {
                    return;
                }
                container.dataset.asset = assetIdentifier;
                container.dispatchEvent(new CustomEvent('assetChosen', { detail: assetIdentifier }));
                await toggleAssetPreview(container);
            });
        });
        container.querySelectorAll('[data-asset-replace]').forEach(replaceElement => {
            replaceElement.addEventListener('click', async event => {
                event.preventDefault();
                container.dataset.asset = '';
                container.dispatchEvent(new CustomEvent('assetRemoved'));
                await toggleAssetPreview(container);
            });
        });
    }

    async function loadAssetPreview(assetIdentifier) {
        const response = await fetch(`/neos/service/assets/${assetIdentifier}`);
        const html = await response.text();
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const label = dom.querySelector('label.asset-label').textContent;
        const previewUrl = dom.querySelector('a[rel="preview"]').getAttribute('href');
        return {label, previewUrl};
    }

    async function toggleAssetPreview(container) {
        const assetIdentifier = container.dataset.asset;
        const hasAsset = assetIdentifier.length > 0;
        const fieldElement = container.querySelector('[data-asset-field]');
        if (fieldElement) {
            fieldElement.value = hasAsset ? assetIdentifier : '';
        }
        container.querySelectorAll('[data-asset-hide-if-set]').forEach(element => element.style.display = hasAsset ? 'none' : '');
        container.querySelectorAll('[data-asset-hide-if-missing]').forEach(element => element.style.display = hasAsset ? '' : 'none');
        if (!hasAsset) {
            return;
        }
        const previewImageElement = container.querySelector('img[data-asset-preview-image]');
        const previewLabelElement = container.querySelector('[data-asset-preview-label]');
        if (previewImageElement || previewLabelElement) {
            if (previewImageElement) {
                previewImageElement.setAttribute('src', '');
            }
            if (previewLabelElement) {
                previewLabelElement.textContent = '';
            }
            const {label, previewUrl} = await loadAssetPreview(assetIdentifier);
            if (previewImageElement) {
                previewImageElement.setAttribute('src', previewUrl);
            }
            if (previewLabelElement) {
                previewLabelElement.textContent = label;
            }
        }
    }
    async function browseAssets(assetSources, mediaTypes, assetIdentifier) {
        return new Promise(resolve => {
            const url = assetIdentifier ? new URL('/neos/media/browser/images/edit.html?asset=' + assetIdentifier, window.location.origin) : new URL('/neos/media/browser/assets/index.html', window.location.origin);
            assetSources.map(assetSource => url.searchParams.append('constraints[assetSources][]', assetSource.trim()));
            mediaTypes.map(mediaType => url.searchParams.append('constraints[mediaTypes][]', mediaType.trim()));
            // store reference of related input field, to be able to set value later via handleSelectedAssetCallback
            const mediaBrowserPopup = window.open('', '', 'width=1280,height=720,menubar=no,location=no,addressbar=no');
            mediaBrowserPopup.document.write('<html lang="en"><head><title>Media</title>');
            // subscribe to assetChosen callback ( calling from within MediaBrowser iframe )
            mediaBrowserPopup.document.write('<script>window.NeosMediaBrowserCallbacks={assetChosen:assetIdentifier => { this.dispatchEvent(new CustomEvent(\'assetChosen\', { detail: assetIdentifier })); window.close(); }};<\/script>');
            mediaBrowserPopup.document.write('<body style="margin:0;">');
            // render iframe with media browser
            mediaBrowserPopup.document.write('<iframe name="neos-media-selection-screen" src="' + url.toString() + '" style="position:absolute;width:100%;height:100%;border-width:0;background-color:#222"/>');
            mediaBrowserPopup.document.write('</body></html>');
            mediaBrowserPopup.document.close();
            mediaBrowserPopup.addEventListener('assetChosen', e => resolve(e.detail));
            mediaBrowserPopup.addEventListener('beforeunload', _ => resolve(null));
        })
    }
});
