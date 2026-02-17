/**
 * Braga Bazaar – Location & delivery availability
 * Braga, Portugal only. Optional: user can skip. Postal & city autocomplete.
 */

(function () {
  const STORAGE_KEY = 'bragaBazaarLocation';
  const MODAL_ID = 'locationModal';

  // We only deliver in Braga, Portugal (district 47xx)
  const DELIVERY_POSTAL_PREFIXES = ['47'];
  const DELIVERY_CITIES = ['braga', 'barcelos', 'guimarães', 'guimaraes', 'famalicão', 'famalicao', 'vila nova de famalicão', 'esposende', 'vila verde', 'amares', 'terras de bouro', 'ponte de lima', 'viana do castelo'];

  // Braga-area postal codes for autocomplete (47XX-XXX format)
  const BRAGA_POSTAL_CODES = [
    '4700-000', '4700-001', '4700-002', '4700-003', '4700-004', '4700-005', '4700-006', '4700-007', '4700-008', '4700-009',
    '4700-010', '4700-020', '4700-030', '4700-040', '4700-050', '4700-100', '4700-200', '4700-300', '4700-400', '4700-500',
    '4701-901', '4704-500', '4705-002', '4705-100', '4710-000', '4710-100', '4710-228', '4710-400', '4715-000', '4715-100',
    '4720-000', '4720-100', '4750-000', '4760-000', '4770-000', '4800-000', '4830-000'
  ];

  const BRAGA_CITIES = [
    'Braga', 'Barcelos', 'Guimarães', 'Vila Nova de Famalicão', 'Famalicão', 'Esposende', 'Vila Verde', 'Amares',
    'Terras de Bouro', 'Póvoa de Lanhoso', 'Vieira do Minho', 'Cabeceiras de Basto', 'Celorico de Basto', 'Fafe'
  ];

  function getStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setStored(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function normalizePostal(value) {
    return (value || '').replace(/\s/g, '').replace(/-/g, '').slice(0, 8);
  }

  function normalizeCity(value) {
    return (value || '').trim().toLowerCase().normalize('NFD').replace(/\u0307/g, '').replace(/[\u0300-\u036f]/g, '');
  }

  function checkDelivery(postal, city) {
    var code = normalizePostal(postal);
    var cityNorm = normalizeCity(city);
    var prefixOk = DELIVERY_POSTAL_PREFIXES.some(function (p) {
      return code.indexOf(p) === 0 && code.length >= 4;
    });
    var cityOk = DELIVERY_CITIES.some(function (c) {
      var cNorm = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cityNorm.indexOf(cNorm) === 0 || cNorm.indexOf(cityNorm) === 0;
    });
    return prefixOk || cityOk;
  }

  function showModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function hideModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function applyLocation(postal, city, deliveryAvailable) {
    setStored({
      postal: (postal || '').trim(),
      city: (city || '').trim(),
      deliveryAvailable: !!deliveryAvailable,
      skipped: false,
      setAt: new Date().toISOString()
    });
    hideModal();
    updateLocationBar();
    if (typeof window.onLocationSet === 'function') {
      window.onLocationSet(getStored());
    }
  }

  function skipLocation() {
    setStored({ skipped: true, setAt: new Date().toISOString() });
    hideModal();
    updateLocationBar();
  }

  function updateLocationBar() {
    var stored = getStored();
    var bar = document.getElementById('locationBar');
    var textEl = document.getElementById('locationBarText');
    if (!bar || !textEl) return;
    if (stored && stored.skipped) {
      bar.style.display = 'none';
      return;
    }
    if (stored && (stored.city || stored.postal)) {
      textEl.textContent = stored.city || stored.postal;
      bar.style.display = 'block';
      bar.style.background = stored.deliveryAvailable ? '#e8f5e9' : '#fef3c7';
      bar.style.color = stored.deliveryAvailable ? '#166534' : '#92400e';
    } else {
      bar.style.display = 'none';
    }
  }

  function formatPostalInput(val) {
    var digits = (val || '').replace(/\D/g, '').slice(0, 7);
    if (digits.length <= 4) return digits;
    return digits.slice(0, 4) + '-' + digits.slice(4);
  }

  function initLocationModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    var postalInput = modal.querySelector('[data-location-postal]');
    var cityInput = modal.querySelector('[data-location-city]');
    var submitBtn = modal.querySelector('[data-location-submit]');
    var messageEl = modal.querySelector('[data-location-message]');
    var skipBtn = modal.querySelector('[data-location-skip]');
    var postalList = document.getElementById('locationPostalSuggestions');
    var cityList = document.getElementById('locationCitySuggestions');

    function showMessage(text, isError) {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.style.display = 'block';
      messageEl.style.color = isError ? '#b91c1c' : '#166534';
      messageEl.style.marginTop = '12px';
    }

    function hideMessage() {
      if (messageEl) messageEl.style.display = 'none';
    }

    function showPostalSuggestions(prefix) {
      if (!postalList || !postalInput) return;
      var raw = (prefix || '').replace(/\D/g, '');
      var matches = BRAGA_POSTAL_CODES.filter(function (code) {
        var codeRaw = code.replace(/-/g, '');
        return codeRaw.indexOf(raw) === 0 || raw.indexOf(codeRaw.slice(0, raw.length)) === 0;
      }).slice(0, 8);
      if (matches.length === 0 && raw.length >= 2) {
        matches = BRAGA_POSTAL_CODES.filter(function (code) {
          return code.replace(/-/g, '').indexOf(raw.slice(0, 2)) === 0;
        }).slice(0, 8);
      }
      postalList.innerHTML = '';
      matches.forEach(function (code) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.textContent = code;
        li.style.cssText = 'padding:10px 12px;cursor:pointer;list-style:none;border-bottom:1px solid #f1f5f9;';
        li.addEventListener('click', function () {
          postalInput.value = code;
          postalList.style.display = 'none';
          postalInput.focus();
        });
        postalList.appendChild(li);
      });
      postalList.style.display = matches.length ? 'block' : 'none';
    }

    function showCitySuggestions(prefix) {
      if (!cityList || !cityInput) return;
      var lower = (prefix || '').trim().toLowerCase();
      var matches = BRAGA_CITIES.filter(function (c) {
        return c.toLowerCase().indexOf(lower) === 0 || lower.indexOf(c.toLowerCase().slice(0, lower.length)) === 0;
      }).slice(0, 8);
      cityList.innerHTML = '';
      matches.forEach(function (city) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.textContent = city;
        li.style.cssText = 'padding:10px 12px;cursor:pointer;list-style:none;border-bottom:1px solid #f1f5f9;';
        li.addEventListener('click', function () {
          cityInput.value = city;
          cityList.style.display = 'none';
          cityInput.focus();
        });
        cityList.appendChild(li);
      });
      cityList.style.display = matches.length ? 'block' : 'none';
    }

    function hideSuggestions() {
      if (postalList) postalList.style.display = 'none';
      if (cityList) cityList.style.display = 'none';
    }

    if (postalInput) {
      postalInput.addEventListener('input', function () {
        this.value = formatPostalInput(this.value);
        showPostalSuggestions(this.value);
      });
      postalInput.addEventListener('focus', function () {
        if (this.value.trim().length >= 2) showPostalSuggestions(this.value);
      });
      postalInput.addEventListener('blur', function () {
        setTimeout(hideSuggestions, 200);
      });
    }
    if (cityInput) {
      cityInput.addEventListener('input', function () {
        showCitySuggestions(this.value);
      });
      cityInput.addEventListener('focus', function () {
        if (this.value.trim()) showCitySuggestions(this.value);
      });
      cityInput.addEventListener('blur', function () {
        setTimeout(hideSuggestions, 200);
      });
    }

    function onSubmit(e) {
      e.preventDefault();
      hideMessage();
      var postal = postalInput ? postalInput.value.trim() : '';
      var city = cityInput ? cityInput.value.trim() : '';
      if (!postal && !city) {
        showMessage(window.locationMessageNoInput || 'Please enter your postal code or city.', true);
        return;
      }
      var available = checkDelivery(postal, city);
      if (!available) {
        showMessage(window.locationMessageOutOfArea || 'We only deliver in Braga, Portugal. Please enter a postal code starting with 47 or a city in the Braga area.', true);
        return;
      }
      applyLocation(postal, city, true);
      if (submitBtn) submitBtn.disabled = false;
    }

    if (modal.querySelector('form')) {
      modal.querySelector('form').addEventListener('submit', onSubmit);
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        onSubmit(e);
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        skipLocation();
      });
    }
    document.querySelectorAll('[data-location-change]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showModal();
      });
    });
  }

  window.BragaBazaarLocation = {
    get: getStored,
    set: setStored,
    checkDelivery: checkDelivery,
    showModal: showModal,
    hideModal: hideModal,
    applyLocation: applyLocation,
    skipLocation: skipLocation,
    initLocationModal: initLocationModal
  };

  document.addEventListener('DOMContentLoaded', function () {
    initLocationModal();
    var stored = getStored();
    if (stored && stored.skipped) {
      updateLocationBar();
      return;
    }
    if (!stored || (!stored.postal && !stored.city)) {
      showModal();
    } else {
      updateLocationBar();
    }
  });

  window.BragaBazaarLocation.updateLocationBar = updateLocationBar;
})();
