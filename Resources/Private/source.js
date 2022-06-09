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
                const assetIdentifier = await browseAssets(assetSources, mediaTypes, container);
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
            fieldElement.disabled = !hasAsset;
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
    async function browseAssets(assetSources, mediaTypes, container) {
        return new Promise(resolve => {
            const assetIdentifier = container.dataset.asset;
            const url = assetIdentifier ? new URL('/neos/media/browser/images/edit.html?asset=' + assetIdentifier, window.location.origin) : new URL('/neos/media/browser/assets/index.html', window.location.origin);
            assetSources.map(assetSource => url.searchParams.append('constraints[assetSources][]', assetSource.trim()));
            mediaTypes.map(mediaType => url.searchParams.append('constraints[mediaTypes][]', mediaType.trim()));

            const dialog = document.createElement('dialog');
            dialog.style.padding = '0';
            dialog.style.width = '90%';
            dialog.style.height = '720px';
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', url.toString());
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.borderWidth = '0';
            iframe.style.backgroundColor = '#222';
            dialog.appendChild(iframe);
            window.NeosMediaBrowserCallbacks={assetChosen:assetIdentifier => {
                    resolve(assetIdentifier);
                    dialog.close();
                }};
            dialog.addEventListener('cancel', e => resolve(null));
            container.appendChild(dialog);
            dialogPolyfill.registerDialog(dialog);
            dialog.showModal();
        })
    }
});
