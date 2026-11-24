(function () {
  const app = window.FINDITApp;
  if (!app) return;

  function validateFields(fields) {
    return Object.values(fields).every((value) => value && String(value).trim().length > 0);
  }

  async function handleImagePreview(inputId, previewId, previewWrapId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const previewWrap = document.getElementById(previewWrapId);

    if (!input || !preview || !previewWrap) return;

    input.addEventListener('change', async function () {
      const file = input.files && input.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        app.showMessage('Please upload an image file only.', 'error');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        app.showMessage('Image size must be under 2MB.', 'error');
        return;
      }

      try {
        const imageData = await app.readFileAsDataUrl(file);
        preview.src = imageData;
        previewWrap.classList.remove('hidden');
      } catch (error) {
        app.showMessage('Could not preview the selected image.', 'error');
      }
    });
  }

  async function uploadItemImage(file) {
    const findit = window.FINDIT;
    if (!findit || findit.demo.active || !findit.ready || !findit.supabase || !file) {
      return null;
    }

    const extension = file.name.split('.').pop() || 'jpg';
    const uniqueId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `reports/${Date.now()}-${uniqueId}.${extension}`;
    const { error: uploadError } = await findit.supabase.storage
      .from(findit.config.STORAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data } = findit.supabase.storage
      .from(findit.config.STORAGE_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  function handleReportSubmit(reportType, formId, mapping) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const payload = {
        itemName: document.getElementById(mapping.itemName)?.value.trim(),
        category: document.getElementById(mapping.category)?.value.trim(),
        colour: document.getElementById(mapping.colour)?.value.trim(),
        description: document.getElementById(mapping.description)?.value.trim(),
        location: document.getElementById(mapping.location)?.value.trim(),
        date: document.getElementById(mapping.date)?.value.trim(),
        imageUrl: document.getElementById(mapping.preview)?.src || ''
      };

      if (!validateFields(payload)) {
        app.showMessage('Please complete all required fields before submitting.', 'error');
        return;
      }

      const findit = window.FINDIT;
      if (findit && !findit.demo.active && findit.ready && findit.supabase) {
        const { data: sessionData } = await findit.supabase.auth.getSession();
        const user = sessionData && sessionData.session ? sessionData.session.user : null;

        if (!user) {
          app.showMessage('Please log in before submitting a report.', 'error');
          return;
        }

        try {
          const fileInput = document.getElementById(reportType === 'Lost' ? 'item-image' : 'found-item-image');
          const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
          const imageUrl = await uploadItemImage(selectedFile);

          const { error } = await findit.supabase.from('items').insert({
            user_id: user.id,
            report_type: reportType,
            item_name: payload.itemName,
            category: payload.category,
            colour: payload.colour,
            description: payload.description,
            location: payload.location,
            report_date: payload.date,
            image_url: imageUrl,
            status: 'Active'
          });

          if (error) throw error;

          app.showMessage('Report submitted successfully. It is now available for review and matching.', 'success');
        } catch (error) {
          app.showMessage(error.message || 'Could not submit the report.', 'error');
          return;
        }
      } else {
        const newReport = app.buildItem(reportType, payload);
        const items = app.getAllItems();
        items.unshift(newReport);
        app.saveAllItems(items);
        app.showMessage('Report submitted successfully. It is now available for review and matching.', 'success');
      }

      form.reset();
      const previewWrap = document.getElementById(mapping.previewWrap);
      if (previewWrap) previewWrap.classList.add('hidden');
    });
  }

  document.getElementById('review-report')?.addEventListener('click', function () {
    const values = {
      itemName: document.getElementById('item-name')?.value.trim(),
      category: document.getElementById('item-category')?.value.trim(),
      colour: document.getElementById('item-colour')?.value.trim(),
      description: document.getElementById('item-description')?.value.trim(),
      location: document.getElementById('item-location')?.value.trim(),
      date: document.getElementById('item-date')?.value.trim()
    };

    if (!validateFields(values)) {
      app.showMessage('Review is incomplete. Please fill out the required fields first.', 'error');
      return;
    }

    app.showMessage('Lost report reviewed and ready to submit.', 'success');
  });

  document.getElementById('review-found-report')?.addEventListener('click', function () {
    const values = {
      itemName: document.getElementById('found-item-name')?.value.trim(),
      category: document.getElementById('found-item-category')?.value.trim(),
      colour: document.getElementById('found-item-colour')?.value.trim(),
      description: document.getElementById('found-item-description')?.value.trim(),
      location: document.getElementById('found-item-location')?.value.trim(),
      date: document.getElementById('found-item-date')?.value.trim()
    };

    if (!validateFields(values)) {
      app.showMessage('Review is incomplete. Please fill out the required fields first.', 'error');
      return;
    }

    app.showMessage('Found report reviewed and ready to submit.', 'success');
  });

  handleImagePreview('item-image', 'image-preview', 'image-preview-wrap');
  handleImagePreview('found-item-image', 'found-image-preview', 'found-image-preview-wrap');

  handleReportSubmit('Lost', 'loss-form', {
    itemName: 'item-name',
    category: 'item-category',
    colour: 'item-colour',
    description: 'item-description',
    location: 'item-location',
    date: 'item-date',
    preview: 'image-preview',
    previewWrap: 'image-preview-wrap'
  });

  handleReportSubmit('Found', 'found-form', {
    itemName: 'found-item-name',
    category: 'found-item-category',
    colour: 'found-item-colour',
    description: 'found-item-description',
    location: 'found-item-location',
    date: 'found-item-date',
    preview: 'found-image-preview',
    previewWrap: 'found-image-preview-wrap'
  });
})();
