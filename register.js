/* ============================================
   FIRST RIDE 2026 – Registration Page JS (PRO)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const PRICE_PER_PAX = 775000;
  const MAX_PAX = 4;

  // State
  let currentPax = 1;
  let photoDataURL = null;

  // Elements
  const paxMinus = document.getElementById('paxMinus');
  const paxPlus = document.getElementById('paxPlus');
  const paxDisplay = document.getElementById('paxDisplay');
  const paxInput = document.getElementById('regPax');
  const additionalParticipantsContainer = document.getElementById('additionalParticipants');
  const totalAmountEl = document.getElementById('totalAmount');
  const totalCostContainer = document.querySelector('.total-cost-container');

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const photoInput = document.getElementById('regPhoto');
  const uploadArea = document.getElementById('photoUploadArea');
  const placeholder = document.getElementById('uploadPlaceholder');
  const previewContainer = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const removeBtn = document.getElementById('removePhoto');

  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');

  // Size Modal Elements
  const openSizeChartBtn = document.getElementById('openSizeChart');
  const closeSizeChartBtn = document.getElementById('closeSizeChart');
  const sizeModal = document.getElementById('sizeChartModal');

  // ==========================================
  // HELPERS
  // ==========================================

  /**
   * Formats 775000 into "775" (for Rp ...K format)
   * or handles 1550000 into "1.550"
   */
  function formatK(amount) {
    const kValue = amount / 1000;
    return kValue.toLocaleString('id-ID');
  }

  function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // SIZE CHART MODAL LOGIC
  // ==========================================
  function toggleSizeModal(show) {
    if (show) {
      sizeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      sizeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openSizeChartBtn && closeSizeChartBtn && sizeModal) {
    openSizeChartBtn.addEventListener('click', () => toggleSizeModal(true));
    closeSizeChartBtn.addEventListener('click', () => toggleSizeModal(false));

    // Close on overlay click
    sizeModal.addEventListener('click', (e) => {
      if (e.target === sizeModal) toggleSizeModal(false);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sizeModal.classList.contains('active')) {
        toggleSizeModal(false);
      }
    });
  }

  // ==========================================
  // PAX & PRICING LOGIC
  // ==========================================

  function updatePax(newPax) {
    if (newPax < 1 || newPax > MAX_PAX) return;

    // Update state
    const oldPax = currentPax;
    currentPax = newPax;

    // Update UI
    paxDisplay.textContent = currentPax;
    paxInput.value = currentPax;
    paxMinus.disabled = currentPax === 1;
    paxPlus.disabled = currentPax === MAX_PAX;

    // Update Price
    const totalCost = currentPax * PRICE_PER_PAX;
    totalAmountEl.textContent = formatK(totalCost);

    // Smooth pulse effect on price change
    totalCostContainer.classList.add('updating');
    setTimeout(() => totalCostContainer.classList.remove('updating'), 300);

    // Dynamic Fields Handling
    if (currentPax > oldPax) {
      // Add more fields
      for (let i = oldPax + 1; i <= currentPax; i++) {
        addParticipantField(i);
      }
    } else if (currentPax < oldPax) {
      // Remove extra fields
      for (let i = oldPax; i > currentPax; i--) {
        removeParticipantField(i);
      }
    }
  }

  function addParticipantField(index) {
    const fieldSet = document.createElement('div');
    fieldSet.className = 'form-group participant-field';
    fieldSet.id = `participantField_${index}`;
    fieldSet.innerHTML = `
      <label class="form-label">Nama Peserta ${index}</label>
      <input type="text" name="additional_name" class="form-input additional-name-input" 
             placeholder="Masukkan nama peserta ${index}" required>
      <div class="form-error">Nama peserta ${index} wajib diisi</div>
      
      <div class="additional-size-field">
        <select name="additional_size" class="form-input form-select additional-size-input" required>
          <option value="" disabled selected>Pilih Ukuran Jersey</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="XXXL">XXXL</option>
          <option value="4XL">4XL</option>
          <option value="5XL">5XL</option>
        </select>
        <div class="form-error">Ukuran jersey wajib dipilih</div>
      </div>
    `;

    additionalParticipantsContainer.appendChild(fieldSet);

    // Reveal animation delay
    requestAnimationFrame(() => {
      fieldSet.classList.add('visible');
    });

    // Auto scroll to new field
    fieldSet.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add listener to new input
    const inputs = fieldSet.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.closest('.form-group').classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.closest('.form-group').classList.remove('focused');
      });
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('error');
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          input.closest('.form-group').classList.remove('error');
        });
      }
    });
  }

  function removeParticipantField(index) {
    const field = document.getElementById(`participantField_${index}`);
    if (field) {
      field.style.opacity = '0';
      field.style.transform = 'translateY(-10px)';
      setTimeout(() => field.remove(), 400);
    }
  }

  paxMinus.addEventListener('click', () => updatePax(currentPax - 1));
  paxPlus.addEventListener('click', () => updatePax(currentPax + 1));

  // Initialize
  updatePax(1);

  // ==========================================
  // PHOTO UPLOAD & PREVIEW
  // ==========================================

  // Click to upload
  uploadArea.addEventListener('click', (e) => {
    if (e.target.closest('.preview-remove')) return;
    photoInput.click();
  });

  // Drag & drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  });

  photoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resizeImage(e.target.result, 800, (resizedDataURL) => {
        photoDataURL = resizedDataURL;
        previewImage.src = resizedDataURL;
        placeholder.style.display = 'none';
        previewContainer.style.display = 'flex';
        uploadArea.classList.add('has-preview');
        uploadArea.closest('.form-group').classList.remove('error');
      });
    };
    reader.readAsDataURL(file);
  }

  function resizeImage(dataURL, maxSize, callback) {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round((h * maxSize) / w); w = maxSize; }
        else { w = Math.round((w * maxSize) / h); h = maxSize; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataURL;
  }

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    photoDataURL = null;
    photoInput.value = '';
    previewImage.src = '';
    placeholder.style.display = 'flex';
    previewContainer.style.display = 'none';
    uploadArea.classList.remove('has-preview');
  });

  // ==========================================
  // FORM VALIDATION & SUBMISSION
  // ==========================================

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Validation
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    const mainName = document.getElementById('regName').value.trim();
    const phoneRaw = document.getElementById('regPhone').value.trim();
    const phone = normalizePhone(phoneRaw);
    const mainSize = document.getElementById('regSize') ? document.getElementById('regSize').value : "";

    let hasError = false;

    if (!mainName) {
      document.getElementById('regName').closest('.form-group').classList.add('error');
      hasError = true;
    }

    if (!phone || phone.length < 9) {
      document.getElementById('regPhone').closest('.form-group').classList.add('error');
      hasError = true;
    }

    // Check additional names & sizes visibility & count
    const visibleParticipants = document.querySelectorAll('.participant-field');
    visibleParticipants.forEach(field => {
      const nameInput = field.querySelector('.additional-name-input');
      const sizeInput = field.querySelector('.additional-size-input');

      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('error');
        hasError = true;
      }
      if (!sizeInput.value) {
        sizeInput.closest('.form-group').classList.add('error');
        hasError = true;
      }
    });

    if (!mainSize) {
      document.getElementById('regSize').closest('.form-group').classList.add('error');
      hasError = true;
    }

    if (!photoDataURL) {
      document.getElementById('regPhoto').closest('.form-group').classList.add('error');
      hasError = true;
    }

    if (hasError) {
      const firstError = document.querySelector('.form-group.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 2. Database Integration
    const SUPABASE_URL = 'https://uctaqoxtbubkmqvyltmi.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdGFxb3h0YnVia21xdnlsdG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTYxMjAsImV4cCI6MjA5MTIzMjEyMH0.mTnYlg_Rfu0ZXNdXycXuTTr6VpJTG2WZQy7rPwuIDls';

    let supabase;
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (err) {
      console.error('Supabase init failed', err);
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitText.textContent = 'Memproses...';

    async function handleRegistration() {
      try {
        if (!supabase) throw new Error('Database connection failed');

        // UPLOAD PHOTO
        const response = await fetch(photoDataURL);
        const blob = await response.blob();
        const fileName = `ride2026_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('photo')
          .upload(fileName, blob, { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('photo')
          .getPublicUrl(fileName);

        // SAVE DATA
        const totalBiaya = currentPax * PRICE_PER_PAX;
        
        // Final collection check right before DB call
        const finalSizes = [
          document.getElementById('regSize') ? document.getElementById('regSize').value : "",
          ...Array.from(document.querySelectorAll('.additional-size-input')).map(input => input.value)
        ].filter(s => s && s.trim() !== "");

        const finalAdditionalNames = Array.from(document.querySelectorAll('.additional-name-input'))
          .map(input => input.value.trim())
          .filter(n => n !== "");

        const { error: dbError } = await supabase
          .from('participants')
          .insert([
            {
              name: mainName,
              phone: phone,
              photo_url: publicUrl,
              jumlah_pax: currentPax,
              additional_participants: finalAdditionalNames,
              total_biaya: totalBiaya,
              sizes: finalSizes
            }
          ]);

        if (dbError) throw dbError;

        // Success Flow
        showSuccess(mainName, currentPax, finalAdditionalNames, totalBiaya, finalSizes);

      } catch (err) {
        console.error('Registration error:', err);
        alert('Gagal mendaftar: ' + (err.message || 'Terjadi kesalahan pada server. Coba lagi.'));

        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitText.textContent = 'Register Now';
      }
    }

    handleRegistration();
  });

  // ==========================================
  // SUCCESS & WHATSAPP REDIRECT
  // ==========================================

  function showSuccess(mainName, pax, others, total, sizes) {
    const overlay = document.getElementById('successOverlay');
    const countdownEl = document.getElementById('countdown');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // WA Message Construction
    let detailList = `1. ${mainName} (Size: ${sizes[0]})`;
    others.forEach((name, idx) => {
      const size = sizes[idx + 1] || '-';
      detailList += `\n${idx + 2}. ${name} (Size: ${size})`;
    });

    const message = `_Mohon kirim pesan ini tanpa mengedit teks._

━━━━━━━━
*PENDAFTARAN FIRST RIDE 2026*
━━━━━━━━

*Nama:*
${mainName}

*Jumlah Peserta:*
${pax} Pax

━━━━━━━━
*Detail Peserta:*
━━━━━━━━
${detailList}

━━━━━━━━
*Total Biaya:*
━━━━━━━━
*Rp ${formatK(total)}K*
━━━━━━━━


Mohon info pembayaran selanjutnya. Terima kasih.


_Pesan ini dibuat otomatis oleh sistem._`;

    const waURL = `https://wa.me/6282132579131?text=${encodeURIComponent(message)}`;

    let seconds = 3;
    countdownEl.textContent = seconds;

    const timer = setInterval(() => {
      seconds--;
      if (seconds >= 0) countdownEl.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(timer);
        setTimeout(() => {
          window.location.href = waURL;
        }, 600); // 600ms final delay for smoothness
      }
    }, 1000);
  }

  // ==========================================
  // UX: ENTRANCE & FOCUS
  // ==========================================
  const card = document.querySelector('.register-card');
  const backBtn = document.querySelector('.register-back');

  setTimeout(() => { if (backBtn) backBtn.classList.add('visible'); }, 200);
  setTimeout(() => { if (card) card.classList.add('visible'); }, 400);

  document.querySelectorAll('.form-input').forEach(input => {
    const g = input.closest('.form-group');
    if (!g) return;
    input.addEventListener('focus', () => g.classList.add('focused'));
    input.addEventListener('blur', () => g.classList.remove('focused'));
    input.addEventListener('input', () => g.classList.remove('error'));
  });
});
