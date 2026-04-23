document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. HEADER: Aşağı gidince gizle, yukarı gelince göster
    // =========================================================
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Arka plan efekti
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Gizle / Göster
        if (currentScrollY > 80) {
            if (currentScrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    }, { passive: true });


    // =========================================================
    // 2. MOBİL MENÜ TOGGLE
    // =========================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('mobile-open')) {
                icon.className = 'ph ph-x';
                // Menü açıkken header'ı gizleme
                header.style.transform = 'translateY(0)';
            } else {
                icon.className = 'ph ph-list';
            }
        });

        // Linke tıklanınca menüyü kapat
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'ph ph-list';
                }
            });
        });
    }


    // =========================================================
    // 3. ÖZELLİKLER SEKME MANTIĞI
    // =========================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });

    // =========================================================
    // 3b. ACCORDION TOGGLE
    // =========================================================
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const list = item.closest('.accordion-list');
            const isOpen = item.classList.contains('active');
            list.querySelectorAll('.accordion-item.active').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });


    // =========================================================
    // 4. MOCKUP SEKME OTO-GEÇİŞ
    // =========================================================
    const mockupPills = document.querySelectorAll('.mockup-categories .cat-pill');
    const mockupCardGroups = document.querySelectorAll('.mockup-cards-container .mockup-cards');
    let mockupInterval;
    let currentMockupIndex = 0;

    function activateMockupTab(index) {
        mockupPills.forEach(p => p.classList.remove('active'));
        mockupCardGroups.forEach(c => c.classList.remove('active'));
        if (mockupPills[index]) mockupPills[index].classList.add('active');
        const targetId = mockupPills[index] ? mockupPills[index].getAttribute('data-mockup') : null;
        if (targetId) {
            const targetCardGroup = document.getElementById('mockup-' + targetId);
            if (targetCardGroup) targetCardGroup.classList.add('active');
        }
        currentMockupIndex = index;
    }

    function startMockupAutoPlay() {
        mockupInterval = setInterval(() => {
            activateMockupTab((currentMockupIndex + 1) % mockupPills.length);
        }, 3500);
    }

    mockupPills.forEach((pill, index) => {
        pill.addEventListener('click', () => {
            clearInterval(mockupInterval);
            activateMockupTab(index);
            startMockupAutoPlay();
        });
    });

    if (mockupPills.length > 0) {
        startMockupAutoPlay();
    }


    // =========================================================
    // 5. SMOOTH SCROLL (Sayfa içi linkler)
    // =========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });


    // =========================================================
    // 6. KATEGORİ SLAYTİ OTO-KAYDIR
    // =========================================================
    const catGrid = document.querySelector('.cat-grid');
    if (catGrid) {
        let isHovered = false;
        catGrid.addEventListener('mouseenter', () => { isHovered = true; });
        catGrid.addEventListener('mouseleave', () => { isHovered = false; });

        setInterval(() => {
            if (isHovered) return;
            const maxScrollLeft = catGrid.scrollWidth - catGrid.clientWidth;
            if (catGrid.scrollLeft >= maxScrollLeft - 10) {
                catGrid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                catGrid.scrollBy({ left: 280, behavior: 'smooth' });
            }
        }, 4000);
    }


    // =========================================================
    // 7. İLAN FİLTRELERİ
    // =========================================================
    const filterBtns = document.querySelectorAll('.listing-filter');
    const listingCards = document.querySelectorAll('.listing-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            listingCards.forEach(card => {
                if (cat === 'all' || card.dataset.cat === cat) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // =========================================================
    // 8. İÇ HARİTA (map-inner)
    // =========================================================
    const mapEl = document.getElementById('map-inner');
    if (mapEl && typeof L !== 'undefined') {
        const map = L.map('map-inner', {
            center: [41.0082, 28.9784],
            zoom: 14,
            zoomControl: true,
            scrollWheelZoom: false
        });

        // CartoDB Positron - Premium minimal harita teması
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        function makeIcon(color) {
            return L.divIcon({
                className: '',
                html: `<div style="width:38px;height:38px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.25);"></div>`,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -42]
            });
        }

        const pins = [
            { lat: 41.0150, lng: 28.9700, name: 'Ali Y.', role: 'Matematik Öğretmeni', dist: '1.2 km', star: '4.9', color: '#5462eb', avatar: 'assets/images/av_t_m.png' },
            { lat: 41.0050, lng: 28.9900, name: 'Ayşe T.', role: 'İngilizce Öğretmeni', dist: '850 m', star: '5.0', color: '#5462eb', avatar: 'assets/images/av_t_f.png' },
            { lat: 41.0200, lng: 28.9950, name: 'Hedef Etüt', role: 'Lise Hazırlık Kursu', dist: '2.4 km', star: '4.8', color: '#0891b2', avatar: 'assets/images/av_s.png' },
            { lat: 40.9980, lng: 28.9650, name: 'Burak K.', role: 'Fitness Koçu', dist: '1.5 km', star: '4.8', color: '#059669', avatar: 'assets/images/av_sp.png' },
            { lat: 41.0120, lng: 28.9550, name: 'Vizyon Koleji', role: 'Özel Lise', dist: '3.5 km', star: '5.0', color: '#dc2626', avatar: 'assets/images/av_s.png' },
            { lat: 41.0000, lng: 29.0050, name: 'Aqua Kulüp', role: 'Yüzme Okulu', dist: '8.0 km', star: '4.9', color: '#0284c7', avatar: 'assets/images/av_s.png' },
            { lat: 41.0250, lng: 28.9820, name: 'Selin H.', role: 'Tenis Antrenörü', dist: '3.2 km', star: '5.0', color: '#5462eb', avatar: 'assets/images/av_t_f.png' },
        ];

        pins.forEach(p => {
            const popup = `
                <div class="map-popup">
                    <img src="${p.avatar}" alt="${p.name}" onerror="this.src='assets/images/av_t_m.png'">
                    <div class="map-popup-info">
                        <strong>${p.name}</strong>
                        <span>${p.role}</span>
                        <div class="map-popup-meta">
                            <span class="tag tag-dist">📍 ${p.dist}</span>
                            <span class="tag tag-star">⭐ ${p.star}</span>
                        </div>
                    </div>
                </div>`;
            L.marker([p.lat, p.lng], { icon: makeIcon(p.color) })
                .addTo(map)
                .bindPopup(popup, { maxWidth: 260 });
        });
    }

    // =========================================================
    // 9. APP DOWNLOAD REDIRECT LOGIC
    // =========================================================
    const appLinks = document.querySelectorAll('a[href="https://link-to.app/ljiMjxDi5g"], .app-btn-mini, .app-btn');
    
    appLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            
            // Check iOS
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                window.location.href = "https://apps.apple.com/tr/app/id123456789"; // App Store Link
            } 
            // Check Android
            else if (/android/i.test(userAgent)) {
                window.location.href = "https://play.google.com/store/apps/details?id=com.ogretsen.app"; // Play Store Link
            } 
            // Desktop
            else {
                showDesktopWarning();
            }
        });
    });

    function showDesktopWarning() {
        if (document.getElementById('desktop-warning-popup')) return;

        const popupHtml = `
        <div id="desktop-warning-popup" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); opacity:0; transition: opacity 0.3s ease;">
            <div style="background:white; padding:40px; border-radius:24px; max-width:400px; width:90%; text-align:center; box-shadow:0 20px 40px rgba(0,0,0,0.2); transform: scale(0.9); transition: transform 0.3s ease;">
                <div style="width:80px; height:80px; background:#f0f4ff; color:var(--royal-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto 20px;">
                    <i class="ph ph-device-mobile"></i>
                </div>
                <h3 style="font-size:1.5rem; color:#1a1a2e; margin-bottom:15px; font-weight:700;">Mobil Uygulama Gerekli</h3>
                <p style="color:#555; line-height:1.6; margin-bottom:25px; font-size:1.05rem;">Devam etmek için lütfen Öğretsen mobil uygulamasını telefonunuza indirin. <br><br> Telefonunuzun tarayıcısından sitemize girerek uygulamamızı indirebilirsiniz.</p>
                <div style="display:flex; justify-content:center;">
                    <button id="close-warning-btn" style="background:var(--royal-blue); color:white; border:none; padding:14px 28px; border-radius:12px; font-weight:600; cursor:pointer; width:100%; font-size:1.05rem; transition: background 0.3s;">Anladım, Kapat</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', popupHtml);
        
        const popup = document.getElementById('desktop-warning-popup');
        const innerBox = popup.querySelector('div');
        
        setTimeout(() => {
            popup.style.opacity = '1';
            innerBox.style.transform = 'scale(1)';
        }, 10);

        document.getElementById('close-warning-btn').addEventListener('click', () => {
            popup.style.opacity = '0';
            innerBox.style.transform = 'scale(0.9)';
            setTimeout(() => popup.remove(), 300);
        });
    }

});
