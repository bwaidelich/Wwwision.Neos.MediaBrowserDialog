window.addEventListener('DOMContentLoaded', () => {

	document.querySelectorAll('[data-asset]').forEach(async container => {
		wireEventListeners(container);
		await toggleAssetPreview(container, container.dataset.asset);
	});

	function wireEventListeners(container) {
		container.addEventListener('assetChosen', async event => {
			const multiple = container.dataset.assetMultiple !== undefined;
			if (multiple) {
				let assets = container.dataset.asset.split(',');
				assets.push(event.detail);
				container.dataset.asset = assets.join(',');
			} else {
				container.dataset.asset = event.detail;
			}
			await toggleAssetPreview(container);
		});
		container.querySelectorAll('[data-asset-browse]').forEach(selectorElement => {
			selectorElement.addEventListener('click', async event => {
				event.preventDefault();
				const assetSources = 'assetConstraintsAssetSources' in container.dataset ? container.dataset.assetConstraintsAssetSources.split(',') : [];
				const mediaTypes = 'assetConstraintsMediaTypes' in container.dataset ? container.dataset.assetConstraintsMediaTypes.split(',') : [];
				browseAssets(assetSources, mediaTypes, container);
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
		const label = dom.querySelector('label.asset-label')?.textContent;
		const previewUrl = dom.querySelector('a[rel="preview"]')?.getAttribute('href');
		return {label, previewUrl};
	}

	async function toggleAssetPreview(container) {
		const assetIds = container.dataset.asset.split(',').filter(e => e.length > 0);
		const hasAsset = assetIds.length > 0;
		const fieldElement = container.querySelector('[data-asset-field]');
		if (fieldElement) {
			fieldElement.value = hasAsset ? assetIds.join(',') : '';
		}
		container.querySelectorAll('[data-asset-hide-if-set]').forEach(element => element.style.display = hasAsset ? 'none' : '');
		container.querySelectorAll('[data-asset-hide-if-missing]').forEach(element => element.style.display = hasAsset ? '' : 'none');
		const previewTemplate = container.querySelector('[data-asset-preview-template]');
		const previewContainer = container.querySelector('[data-asset-preview-container]');
		if (!previewTemplate || !previewContainer) {
			return;
		}
		previewContainer.innerText = '';
		if (!hasAsset) {
			return;
		}
		assetIds.forEach(async assetId => {
			const preview = previewTemplate.content.cloneNode(true);
			const previewImageElement = preview.querySelector('img[data-asset-preview-image]');
			const fieldElement = preview.querySelector('[data-asset-field]');
			if (fieldElement) {
				fieldElement.value = assetId;
				fieldElement.disabled = false;
			}
			preview.querySelectorAll('[data-asset-replace]').forEach(replaceAssetElement => {
				replaceAssetElement.addEventListener('click', event => {
					container.dataset.asset = assetIds.filter(idToRemove => idToRemove !== assetId).join(',');
					toggleAssetPreview(container);
				});
			});
			preview.querySelectorAll('[data-asset-browse]').forEach(selectorElement => {
				selectorElement.addEventListener('click', async event => {
					event.preventDefault();
					const assetSources = 'assetConstraintsAssetSources' in container.dataset ? container.dataset.assetConstraintsAssetSources.split(',') : [];
					const mediaTypes = 'assetConstraintsMediaTypes' in container.dataset ? container.dataset.assetConstraintsMediaTypes.split(',') : [];
					browseAssets(assetSources, mediaTypes, container);
				});
			});
			const previewLabelElement = preview.querySelector('[data-asset-preview-label]');
			previewContainer.appendChild(preview);
			const {label, previewUrl} = await loadAssetPreview(assetId);
			if (previewImageElement) {
				previewImageElement.setAttribute('src', previewUrl);
			}
			if (previewLabelElement) {
				previewLabelElement.textContent = label;
			}
		});

	}

	function browseAssets(assetSources, mediaTypes, container) {

		const multiple = container.dataset.assetMultiple !== undefined;
		const assetIdentifier = container.dataset.asset;
		const url = assetIdentifier && !multiple ? new URL('/neos/media/browser/images/edit.html?asset=' + assetIdentifier, window.location.origin) : new URL('/neos/media/browser/assets/index.html', window.location.origin);
		assetSources.map(assetSource => url.searchParams.append('constraints[assetSources][]', assetSource.trim()));
		mediaTypes.map(mediaType => url.searchParams.append('constraints[mediaTypes][]', mediaType.trim()));

		const dialog = document.createElement('dialog');
		dialog.style.padding = '0';
		dialog.style.width = '90%';
		dialog.style.height = '720px';
		const closeButton = document.createElement('a');
		closeButton.innerText = 'X';
		closeButton.style.fontSize = '18px';
		closeButton.style.padding = '10px';
		closeButton.style.position = 'absolute';
		closeButton.style.cursor = 'pointer';
		closeButton.style.right = '25px';
		closeButton.style.zIndex = '1000';
		closeButton.addEventListener('click', e => dialog.close());
		const iframe = document.createElement('iframe');
		iframe.setAttribute('src', url.toString());
		iframe.style.position = 'absolute';
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.style.borderWidth = '0';
		iframe.style.backgroundColor = '#222';
		dialog.appendChild(closeButton);
		dialog.appendChild(iframe);

		window.NeosMediaBrowserCallbacks = {
			assetChosen: assetIdentifier => {
				container.dispatchEvent(new CustomEvent('assetChosen', {detail: assetIdentifier}));
				if (!multiple) {
					dialog.close();
				}
			}
		};
		dialog.addEventListener('cancel', e => resolve(assetIds));
		dialog.addEventListener('click', e => {
			if (e.target !== dialog) {
				return;
			}
			dialog.close();
		});
		container.appendChild(dialog);
		dialogPolyfill.registerDialog(dialog);
		dialog.showModal();
	}
});
