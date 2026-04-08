/* ============================================
   FIRST RIDE 2026 – Registration Page JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

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
  // PHOTO UPLOAD & PREVIEW
  // ==========================================
  const photoInput = document.getElementById('regPhoto');
  const uploadArea = document.getElementById('photoUploadArea');
  const placeholder = document.getElementById('uploadPlaceholder');
  const previewContainer = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const removeBtn = document.getElementById('removePhoto');

  let photoDataURL = null;

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

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

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
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // Resize image to prevent localStorage quota issues
      resizeImage(e.target.result, 600, (resizedDataURL) => {
        photoDataURL = resizedDataURL;
        previewImage.src = resizedDataURL;
        placeholder.style.display = 'none';
        previewContainer.style.display = 'flex';
        uploadArea.classList.add('has-preview');
        // Clear error state
        uploadArea.closest('.form-group').classList.remove('error');
      });
    };
    reader.readAsDataURL(file);
  }

  function resizeImage(dataURL, maxSize, callback) {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) {
          h = Math.round((h * maxSize) / w);
          w = maxSize;
        } else {
          w = Math.round((w * maxSize) / h);
          h = maxSize;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.7));
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
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    let hasError = false;

    // Validate name
    if (!name) {
      document.getElementById('regName').closest('.form-group').classList.add('error');
      hasError = true;
    }

    // Validate phone
    if (!phone) {
      document.getElementById('regPhone').closest('.form-group').classList.add('error');
      hasError = true;
    }

    // Validate photo
    if (!photoDataURL) {
      document.getElementById('regPhoto').closest('.form-group').classList.add('error');
      hasError = true;
    }

    if (hasError) {
      // Scroll to first error
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // ==========================================
    // SUPABASE CONFIGURATION
    // ==========================================
    // Silakan ganti [YOUR_ANON_KEY] dengan key yang Anda dapatkan dari Settings > API
    const SUPABASE_URL = 'https://uctaqoxtbubkmqvyltmi.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdGFxb3h0YnVia21xdnlsdG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTYxMjAsImV4cCI6MjA5MTIzMjEyMH0.mTnYlg_Rfu0ZXNdXycXuTTr6VpJTG2WZQy7rPwuIDls';

    let supabase;
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (err) {
      console.error('Supabase initialization failed:', err);
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitText.textContent = 'Processing...';

    async function handleRegistration() {
      try {
        if (!supabase) throw new Error('Database connection not ready');

        // 1. Convert resized photo (base64) to Blob for upload
        const response = await fetch(photoDataURL);
        const blob = await response.blob();

        // 2. Upload to Supabase Storage (Bucket: photo)
        const fileName = `ride2026_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photo')
          .upload(fileName, blob, {
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        // 3. Get Public URL for the uploaded photo
        const { data: { publicUrl } } = supabase.storage
          .from('photo')
          .getPublicUrl(fileName);

        // 4. Save Participant data to Database (Table: participants)
        const { error: dbError } = await supabase
          .from('participants')
          .insert([
            {
              name: name,
              phone: phone,
              photo_url: publicUrl
            }
          ]);

        if (dbError) throw dbError;

        // Success!
        showSuccess(name);

      } catch (err) {
        console.error('Registration error:', err);
        alert('Gagal mendaftar: ' + (err.message || 'Terjadi kesalahan pada server'));

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitText.textContent = 'Register Now';
      }
    }

    // Execute the async registration
    handleRegistration();

  });

  // ==========================================
  // SUCCESS MODAL & WHATSAPP REDIRECT
  // ==========================================
  function showSuccess(name) {
    const overlay = document.getElementById('successOverlay');
    const countdownEl = document.getElementById('countdown');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    let seconds = 3;
    countdownEl.textContent = seconds;

    const timer = setInterval(() => {
      seconds--;
      countdownEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        // Redirect to WhatsApp
        const waURL = `https://wa.me/6282132579131?text=Halo%20saya%20sudah%20daftar%20First%20Ride%202026%0ANama:%20${encodeURIComponent(name)}`;
        window.location.href = waURL;
      }
    }, 1000);
  }

  // ==========================================
  // ENTRANCE ANIMATION
  // ==========================================
  const card = document.querySelector('.register-card');
  const backBtn = document.querySelector('.register-back');

  setTimeout(() => {
    if (backBtn) backBtn.classList.add('visible');
  }, 200);

  setTimeout(() => {
    if (card) card.classList.add('visible');
  }, 400);

  // ==========================================
  // INPUT FOCUS EFFECTS
  // ==========================================
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
    // Clear error on input
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

});
