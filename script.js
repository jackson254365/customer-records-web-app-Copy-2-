document.addEventListener('DOMContentLoaded', () => {
    // --- FORM HANDLING (index.html) ---
    if (document.getElementById('customer-form')) {
        const customerForm = document.getElementById('customer-form');
        const phoneNumberInput = document.getElementById('phone-number');
        const idNumberInput = document.getElementById('id-number');

        // Restrict input to only numbers for phone and ID fields
        phoneNumberInput.addEventListener('input', () => {
            phoneNumberInput.value = phoneNumberInput.value.replace(/[^0-9]/g, '');
        });

        idNumberInput.addEventListener('input', () => {
            idNumberInput.value = idNumberInput.value.replace(/[^0-9]/g, '');
        });

        customerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                name: document.getElementById('name').value.trim(),
                idNumber: idNumberInput.value.trim(),
                phoneNumber: phoneNumberInput.value.trim(),
                service: document.getElementById('service').value
            };

            if (payload.phoneNumber.length !== 10) {
                alert('Phone number must be 10 digits.');
                return;
            }
            if (payload.idNumber.length > 9) {
                alert('ID number must be max 9 digits.');
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || 'Server error');
                    return;
                }

                customerForm.reset();
                location.href = 'report.html';
            } catch (err) {
                alert('Network error: ' + err.message);
            }
        });
    }

    // --- REPORT HANDLING (report.html) ---
    if (document.getElementById('customer-table')) {
        const tbody = document.querySelector('#customer-table tbody');
        let allRows = [];

        // Render table rows
        function renderRows(rows) {
            tbody.innerHTML = '';
            rows.forEach(c => {
                const tr = tbody.insertRow();
                tr.innerHTML = `
                    <td>${c.name}</td>
                    <td>${c.idNumber}</td>
                    <td>${c.phoneNumber}</td>
                    <td>${c.service}</td>
                    <td>${c.date}</td>
                    <td>${c.time}</td>
                    <td><button class="delete-btn" data-id="${c.id}">Delete</button></td>
                `;
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async function () {
                    const id = this.getAttribute('data-id');
                    if (confirm('Delete this customer?')) {
                        const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) {
                            // Remove from allRows and re-render
                            allRows = allRows.filter(row => row.id != id);
                            renderRows(allRows);
                        } else {
                            const data = await res.json();
                            alert(data.error || 'Delete failed');
                        }
                    }
                });
            });
        }

        // Fetch and display all customers
        fetch('http://localhost:3000/api/customers')
            .then(r => r.json())
            .then(rows => {
                allRows = rows;
                renderRows(allRows);
            })
            .catch(console.error);

        // --- SEARCH FEATURE ---
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const query = this.value.trim().toLowerCase();
                const filtered = allRows.filter(row =>
                    row.name.toLowerCase().includes(query)
                );
                renderRows(filtered);
            });
        }
    }
});