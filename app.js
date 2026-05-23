document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Carrito de Compras ---
    
    // Seleccionar elementos del DOM
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartBtn = document.querySelector('.cart-btn');
    
    // Inicializar el carrito a 0 en lugar de 3 estático
    let cartCount = 0; 
    cartCountElement.textContent = cartCount;
    cartCountElement.style.transition = 'transform 0.2s ease-in-out';

    // Añadir funcionalidad a todos los botones de "Agregar al carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Evitar que el clic afecte otros elementos (si la tarjeta fuera un enlace)
            e.stopPropagation();
            
            // Incrementar contador
            cartCount++;
            
            // Animación de pop en el número del carrito
            cartCountElement.style.transform = 'scale(1.6)';
            cartCountElement.textContent = cartCount;
            
            // Regresar el tamaño del badge del carrito a la normalidad
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 250);

            // Efecto visual de éxito en el propio botón de agregar
            const originalIcon = button.textContent;
            button.textContent = '✓';
            button.style.backgroundColor = 'var(--accent-color)';
            button.style.color = 'white';
            button.style.borderColor = 'var(--accent-color)';
            button.style.transform = 'rotate(0deg)'; // reset rotation from css hover

            // Restaurar el estado original del botón después de 1 segundo
            setTimeout(() => {
                button.textContent = originalIcon;
                button.style.backgroundColor = '';
                button.style.color = '';
                button.style.borderColor = '';
                button.style.transform = '';
            }, 1000);
        });
    });

    // --- Lógica del Checkout (Pago) ---
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModal = document.getElementById('close-modal');
    const checkoutForm = document.getElementById('checkout-form');

    // Acción al hacer clic en el botón del carrito principal
    cartBtn.addEventListener('click', () => {
        if(cartCount === 0) {
            alert("Tu carrito está vacío. ¡Agrega algunos productos!");
        } else {
            // Abrir el modal de pago
            checkoutModal.classList.add('active');
        }
    });

    // Cerrar modal al hacer clic en la "X"
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Cerrar al hacer clic en el fondo oscuro fuera del modal
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove('active');
            }
        });
    }

    // Procesar el pago simulado
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que se recargue la página
            
            // Simular carga de procesamiento
            const btnSubmit = checkoutForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Procesando...';
            btnSubmit.style.opacity = '0.7';
            btnSubmit.style.cursor = 'not-allowed';
            
            // Simular una espera de 1.5 segundos para contactar con el banco
            setTimeout(() => {
                alert('¡Pago procesado con éxito!\nGracias por tu compra en Lumina. Te enviaremos un correo con los detalles.');
                
                // Vaciar carrito, resetear formulario y cerrar modal
                cartCount = 0;
                cartCountElement.textContent = cartCount;
                checkoutForm.reset();
                checkoutModal.classList.remove('active');
                
                // Restaurar estado
                document.querySelectorAll('.pay-method-btn')[0].click(); // reset to card
                
                // Restaurar botón a su estado original
                btnSubmit.textContent = originalText;
                btnSubmit.style.opacity = '1';
                btnSubmit.style.cursor = 'pointer';
            }, 1500);
        });
    }

    // --- Lógica de Cambio de Método de Pago ---
    const methodBtns = document.querySelectorAll('.pay-method-btn');
    const paymentBodies = document.querySelectorAll('.payment-body');
    const cardInputs = document.querySelectorAll('#method-tarjeta input');

    if (methodBtns.length > 0) {
        methodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos los botones
                methodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Ocultar todos los cuerpos
                paymentBodies.forEach(body => {
                    body.style.display = 'none';
                });

                // Mostrar el correcto
                const targetId = `method-${btn.getAttribute('data-target')}`;
                document.getElementById(targetId).style.display = 'block';

                // Ajustar validación (quitar "required" de tarjeta si se usa yape/plin)
                if (btn.getAttribute('data-target') !== 'tarjeta') {
                    cardInputs.forEach(input => input.removeAttribute('required'));
                } else {
                    cardInputs.forEach(input => input.setAttribute('required', 'true'));
                }
            });
        });
    }

    // --- Lógica del Menú Móvil (Responsivo) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            
            // Cambiar icono entre hamburguesa y X
            if (navLinks.classList.contains('nav-active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Cerrar menú automáticamente al hacer clic en un enlace
        const mobileLinks = document.querySelectorAll('.nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuToggle.textContent = '☰';
            });
        });
    }

    // --- Lógica del Dashboard Modal ---
    const openDashboardBtn = document.getElementById('open-dashboard');
    const dashboardModal = document.getElementById('dashboard-modal');
    const closeDashboardBtn = document.getElementById('close-dashboard');

    if (openDashboardBtn && dashboardModal) {
        openDashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dashboardModal.classList.add('active');
            
            // Si el menu móvil está abierto, cerrarlo
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                menuToggle.textContent = '☰';
            }
        });

        if (closeDashboardBtn) {
            closeDashboardBtn.addEventListener('click', () => {
                dashboardModal.classList.remove('active');
            });
        }

        dashboardModal.addEventListener('click', (e) => {
            if (e.target === dashboardModal) {
                dashboardModal.classList.remove('active');
            }
        });
    }

    // --- Lógica de Filtrado de Categorías ---
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');
    const viewAllBtn = document.querySelector('.view-all');

    if (categoryCards.length > 0 && productCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetCategory = card.getAttribute('data-category-target');
                
                // Hacer scroll suave hacia la sección de tienda
                document.getElementById('tienda').scrollIntoView({ behavior: 'smooth' });

                // Filtrar productos
                productCards.forEach(product => {
                    // Resetear la animación para que se reproduzca de nuevo
                    product.style.animation = 'none';
                    product.offsetHeight; /* Trigger reflow */

                    if (product.getAttribute('data-category') === targetCategory) {
                        product.style.display = 'block';
                        product.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Botón para "Ver Todo"
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            productCards.forEach(product => {
                product.style.animation = 'none';
                product.offsetHeight; /* Trigger reflow */
                
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });
    }
});
