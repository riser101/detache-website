// Shared Navigation Component for Detache Website
// Include this script on any page that needs the navigation

// Navigation HTML template
const navigationHTML = `
    <nav class="nav">
        <div class="nav-content">
            <a href="index.html" class="logo">detache</a>
            <ul class="nav-links">
                <li><a href="about.html">About Us</a></li>
                <li><a href="index.html#features">Features</a></li>
                <li><a href="index.html#download" class="nav-download-btn">Get Early Access</a></li>
            </ul>
            <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
        </div>
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-nav-links">
                <a href="about.html">About Us</a>
                <a href="index.html#features">Features</a>
                <a href="index.html#download" class="mobile-nav-btn">Get Early Access</a>
            </div>
        </div>
    </nav>
`;

// Navigation CSS styles
const navigationCSS = `
    <style>
        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 20px 40px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
        }

        .mobile-menu {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
        }

        .mobile-menu.active {
            max-height: 300px;
            padding: 30px 20px;
        }

        .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: stretch;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease-in-out 0.1s, transform 0.3s ease-in-out 0.1s;
        }

        .mobile-menu.active .mobile-nav-links {
            opacity: 1;
            transform: translateY(0);
        }

        .mobile-nav-links a {
            color: white;
            text-decoration: none;
            font-size: 18px;
            font-weight: 500;
            padding: 16px 0;
            transition: color 0.3s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            text-align: left;
        }

        .mobile-nav-links a:last-child {
            border-bottom: none;
            margin-top: 10px;
        }

        .mobile-nav-links a:hover {
            color: #FF9800;
        }

        .mobile-nav-btn {
            font-family: 'Quicksand', sans-serif !important;
            background: linear-gradient(135deg, #FF9800, #FF6F00) !important;
            color: white !important;
            padding: 16px 24px !important;
            border: none !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            letter-spacing: 1.5px !important;
            text-transform: uppercase !important;
            transition: all 0.3s !important;
            text-decoration: none !important;
            display: inline-block !important;
            text-align: center !important;
            margin-top: 10px !important;
        }

        .mobile-nav-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3) !important;
            color: white !important;
        }

        .logo {
            font-family: 'Quicksand', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: white;
            text-decoration: none;
            text-transform: uppercase;
        }

        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: #FF9800;
        }

        .nav-download-btn {
            font-family: 'Quicksand', sans-serif !important;
            background: transparent !important;
            border: 3px solid #FF9800 !important;
            color: white !important;
            padding: 10px 24px !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            letter-spacing: 1.5px !important;
            text-transform: uppercase !important;
            transition: all 0.3s !important;
        }

        .nav-download-btn:hover {
            background: transparent !important;
            color: white !important;
            border-color: #FF9800 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .mobile-menu-toggle {
                display: block;
            }

            .nav-content {
                padding: 0 20px;
            }

            .nav {
                padding: 15px 0;
            }
            
            .logo {
                font-size: 20px;
            }
        }
    </style>
`;

// Function to inject navigation
function injectNavigation() {
    // Add CSS to head
    document.head.insertAdjacentHTML('beforeend', navigationCSS);
    
    // Add navigation HTML to body
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
    
    // Setup mobile menu functionality
    setupMobileMenu();
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Auto-inject navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    injectNavigation();
}); 