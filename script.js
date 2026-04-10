VANTA.WAVES({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: 0x000000,
  shininess: 30.0,
  waveHeight: 15.0,
  waveSpeed: 0.5,
  zoom: 1.0,
});

const magneticBtns = document.querySelectorAll(".magnetic");
magneticBtns.forEach((btn) => {
  btn.style.transition = "transform 0.3s ease-out";
  btn.addEventListener("mousemove", (e) => {
    const pos = btn.getBoundingClientRect();
    const x = e.clientX - pos.left - pos.width / 2;
    const y = e.clientY - pos.top - pos.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

// Penanganan Form Kontak secara AJAX
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const statusDiv = document.getElementById("form-status");
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Mengirim...';
    submitBtn.disabled = true;
    statusDiv.style.display = "none";

    // Email tujuan
    const emailTujuan = "email tujuan";

    fetch(`https://formsubmit.co/ajax/${emailTujuan}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success === "true" || result.success === true) {
          statusDiv.innerHTML =
            "Pesan berhasil terkirim! Terima kasih telah menghubungi.";
          statusDiv.style.backgroundColor = "rgba(40, 167, 69, 0.15)";
          statusDiv.style.color = "#28a745";
          statusDiv.style.border = "1px solid rgba(40, 167, 69, 0.3)";
          contactForm.reset();
        } else {
          throw new Error(result.message || "Gagal mengirim pesan.");
        }
      })
      .catch((error) => {
        statusDiv.innerHTML =
          "Maaf, terjadi kesalahan. Pastikan email kamu sudah terverifikasi di FormSubmit.";
        statusDiv.style.backgroundColor = "rgba(220, 53, 69, 0.15)";
        statusDiv.style.color = "#dc3545";
        statusDiv.style.border = "1px solid rgba(220, 53, 69, 0.3)";
        console.error(error);
      })
      .finally(() => {
        statusDiv.style.display = "block";
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}

const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  result.innerHTML = "Mohon tunggu...";
  result.style.color = "var(--primary)";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = "Pesan berhasil terkirim! Terima kasih.";
        result.style.color = "#4ade80"; // Warna sukses
        form.reset(); // Reset form setelah sukses
      } else {
        console.log(response);
        result.innerHTML = json.message;
        result.style.color = "#f87171"; // Warna error
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Terjadi kesalahan koneksi.";
    })
    .then(function () {
      setTimeout(() => {
        result.innerHTML = "";
      }, 5000); // Pesan hilang setelah 5 detik
    });
});
