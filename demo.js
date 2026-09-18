(function () {
  const selects = Array.from(document.querySelectorAll('.demo-select'));

  const closeAll = (except) => {
    selects.forEach((select) => {
      if (select !== except) {
        select.classList.remove('is-open');
        const trigger = select.querySelector('.demo-select__trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  selects.forEach((select) => {
    const trigger = select.querySelector('.demo-select__trigger');
    const valueEl = select.querySelector('.demo-select__value');
    const hidden = select.querySelector('input[type="hidden"]');
    const options = Array.from(select.querySelectorAll('.demo-select__option'));
    const placeholder = select.dataset.placeholder || 'Select';

    const setValue = (option) => {
      const text = option.textContent.trim();
      valueEl.textContent = text;
      valueEl.classList.remove('is-placeholder');
      hidden.value = text;
      options.forEach((opt) => {
        opt.classList.toggle('is-selected', opt === option);
      });
      select.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('is-open');
      closeAll();
      if (!isOpen) {
        select.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        const selected = select.querySelector('.demo-select__option.is-selected');
        if (selected) selected.scrollIntoView({ block: 'nearest' });
      }
    });

    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        setValue(option);
      });
    });

    select.addEventListener('keydown', (e) => {
      if (!select.classList.contains('is-open')) return;
      const current = options.findIndex((opt) => opt.classList.contains('is-highlighted'));
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = current < options.length - 1 ? current + 1 : 0;
        options.forEach((opt, i) => opt.classList.toggle('is-highlighted', i === next));
        options[next].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = current > 0 ? current - 1 : options.length - 1;
        options.forEach((opt, i) => opt.classList.toggle('is-highlighted', i === prev));
        options[prev].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && current >= 0) {
        e.preventDefault();
        setValue(options[current]);
      } else if (e.key === 'Escape') {
        select.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', () => closeAll());

  const form = document.querySelector('.demo-form');
  const success = document.querySelector('.demo-success');
  if (form) {
    const wrapperOf = (el) => el.closest('.demo-field, .demo-check');

    const validate = () => {
      let firstInvalid = null;
      form.querySelectorAll('[required]').forEach((el) => {
        const wrapper = wrapperOf(el);
        // Hidden inputs (custom selects) are skipped by native validation.
        const valid = el.type === 'hidden' ? el.value.trim() !== '' : el.validity.valid;
        if (wrapper) wrapper.classList.toggle('is-invalid', !valid);
        if (!valid && !firstInvalid) firstInvalid = el;
      });
      return firstInvalid;
    };

    form.addEventListener('input', (e) => {
      const wrapper = wrapperOf(e.target);
      if (wrapper) wrapper.classList.remove('is-invalid');
    });
    form.addEventListener('change', (e) => {
      const wrapper = wrapperOf(e.target);
      if (wrapper) wrapper.classList.remove('is-invalid');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstInvalid = validate();
      if (firstInvalid) {
        const target = firstInvalid.type === 'hidden'
          ? firstInvalid.closest('.demo-select').querySelector('.demo-select__trigger')
          : firstInvalid;
        target.focus();
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      // TODO: send FormData(form) to the backend / form service here.
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  }
})();
