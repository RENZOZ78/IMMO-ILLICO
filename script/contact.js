/* =====================================================================
   DELTA-IMMO — formulaire de contact
   Validation côté client et envoi vers Netlify Forms sans rechargement
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('[type="submit"]');
  var success = document.querySelector('[data-form-success]');

  function fieldWrapper(input) {
    return input.closest('.field') || input.closest('.consent');
  }

  function setError(input, message) {
    var wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.add('is-invalid');
    var err = wrap.querySelector('.field__error');
    if (err) err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  function validateField(input) {
    var value = input.value.trim();
    if (input.type === 'checkbox') {
      if (input.required && !input.checked) { setError(input, 'Merci de cocher cette case.'); return false; }
      clearError(input); return true;
    }
    if (input.required && !value) { setError(input, 'Ce champ est requis.'); return false; }
    if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(input, 'Adresse e-mail invalide.'); return false;
    }
    if (input.type === 'tel' && value && !/^[+0-9 ().-]{6,20}$/.test(value)) {
      setError(input, 'Numéro de téléphone invalide.'); return false;
    }
    if (input.minLength > 0 && value && value.length < input.minLength) {
      setError(input, 'Merci de détailler un peu plus (' + input.minLength + ' caractères minimum).'); return false;
    }
    clearError(input);
    return true;
  }

  var inputs = Array.prototype.slice.call(form.querySelectorAll('input:not([type="hidden"]):not([type="radio"]), textarea, select'));
  inputs.forEach(function (input) {
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (fieldWrapper(input) && fieldWrapper(input).classList.contains('is-invalid')) validateField(input);
    });
  });

  function showStatus(type, message) {
    if (!status) return;
    status.className = 'form-status is-' + type;
    status.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    inputs.forEach(function (input) { if (!validateField(input)) valid = false; });
    if (!valid) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      showStatus('error', 'Certains champs demandent votre attention.');
      return;
    }

    if (status) { status.className = 'form-status'; status.textContent = ''; }
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('aria-busy', 'true');

    var data = new FormData(form);
    var body = new URLSearchParams();
    data.forEach(function (value, key) { body.append(key, value); });

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      if (success) {
        form.hidden = true;
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      } else {
        showStatus('success', 'Merci, votre message a bien été envoyé. Nous revenons vers vous sous 24 h.');
      }
    }).catch(function () {
      // Hors ligne ou en dehors de Netlify : on retombe sur l'envoi classique
      showStatus('error', 'L’envoi direct a échoué. Nouvelle tentative…');
      window.setTimeout(function () { form.submit(); }, 600);
    }).finally(function () {
      submitBtn.classList.remove('is-loading');
      submitBtn.removeAttribute('aria-busy');
    });
  });
})();
