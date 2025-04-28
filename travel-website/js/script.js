// JavaScript for mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', function () {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    });

    // Fetch and display tour packages dynamically
    async function fetchTourPackages() {
        try {
            const response = await fetch('/api/tour-packages');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const packages = await response.json();
            const container = document.getElementById('packages-container');
            container.innerHTML = '';

            packages.forEach(pkg => {
                const card = document.createElement('div');
                card.className = 'package-card border rounded p-4 mb-4 shadow';

                card.innerHTML = `
                    <h4 class="text-lg font-semibold mb-2">${pkg.title}</h4>
                    <p>Duration: ${pkg.duration_days ? pkg.duration_days + ' Days' : 'N/A'}</p>
                    <p>Price: $${pkg.price}</p>
                    <p>${pkg.description ? pkg.description : ''}</p>
                    <button class="booking-button bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition" data-id="${pkg.id}">Book Now</button>
                `;

                container.appendChild(card);
            });

            // Add event listeners to booking buttons
            document.querySelectorAll('.booking-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const packageId = e.target.getAttribute('data-id');
                    openBookingModal(packageId);
                });
            });
        } catch (error) {
            console.error('Error fetching tour packages:', error);
        }
    }

    // Booking modal handling
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('booking-form');
    const closeModalBtn = document.getElementById('close-modal');

    function openBookingModal(packageId) {
        bookingModal.classList.remove('hidden');
        document.getElementById('package-id').value = packageId;
    }

    function closeBookingModal() {
        bookingModal.classList.add('hidden');
        bookingForm.reset();
    }

    closeModalBtn.addEventListener('click', closeBookingModal);

    // Handle booking form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            package_id: document.getElementById('package-id').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            dates: document.getElementById('dates').value,
            people: document.getElementById('people').value,
            payment_method: document.getElementById('payment-method').value,
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Booking submission failed');
            }

            alert('Booking submitted successfully!');
            closeBookingModal();
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Failed to submit booking. Please try again.');
        }
    });

    // Initialize
    fetchTourPackages();
});
