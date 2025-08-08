document.addEventListener("DOMContentLoaded", () => {
    // Fetch user profile
    fetch('https://jsonplaceholder.typicode.com/users/10')
        .then(res => res.json())
        .then(user => {
            // Profile section
            document.getElementById('profile-name').textContent = user.name;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-catchphrase').textContent = user.company?.catchPhrase || '';

            // Header username
            const headerUser = document.getElementById('user-name');
            if (headerUser) headerUser.textContent = user.name;

            // Form values
            document.getElementById('displayName').value = localStorage.getItem('displayName') || user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('catchphrase').value = localStorage.getItem('catchphrase') || user.company?.catchPhrase || '';
        })
        .catch(err => console.error('Error loading profile:', err));

    // Profile picture fallback
    const profileImg = document.getElementById('profile-picture');
    profileImg.src = 'images/icons/random.png';
    profileImg.onerror = () => {
        profileImg.src = 'https://via.placeholder.com/40';
    };

    // Dashboard users table
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(users => {
            const tbody = document.querySelector('#data-table tbody');
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                `;
                tbody.appendChild(tr);
            });
        });

    // Product cards
    fetch('https://fakestoreapi.com/products') // no limit applied
        .then(res => res.json())
        .then(products => {
            const grid = document.createElement('div');
            grid.className = 'product-grid';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <div class="price-box">$${product.price}</div>
                `;
                grid.appendChild(card);
            });
            document.getElementById('product').appendChild(grid);
        });

    // Dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    document.getElementById('profile-picture').addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // Dropdown actions
    dropdownMenu.querySelector('a[href="#profile"]').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('profile');
        dropdownMenu.classList.remove('show');
    });
    dropdownMenu.querySelector('a[href="#settings"]').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('settings');
        dropdownMenu.classList.remove('show');
    });
    dropdownMenu.querySelector('a[href="#logout"]').addEventListener('click', (e) => {
        e.preventDefault();
        alert('You have been logged out.');
        location.reload();
    });

    // ToDo: Add Task
    document.getElementById('add-todo').addEventListener('click', () => {
        const taskText = document.getElementById('new-todo').value.trim();
        const dueDate = document.getElementById('due-date').value;
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}${dueDate ? ` <small>(Due: ${dueDate})</small>` : ''}</span>
            <button class="todo-delete-btn">&times;</button>
        `;
        document.getElementById('todo-items').appendChild(li);
        document.getElementById('new-todo').value = '';
        document.getElementById('due-date').value = '';
    });

    // ToDo: Delete Task
    document.getElementById('todo-items').addEventListener('click', (e) => {
        if (e.target.classList.contains('todo-delete-btn')) {
            e.target.parentElement.remove();
        }
    });

    // Sidebar nav
    const links = document.querySelectorAll('aside nav a');
    const sections = document.querySelectorAll('.content-section');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.dataset.target;
            sections.forEach(s => s.classList.remove('active'));
            links.forEach(l => l.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            link.classList.add('active');
        });
    });

    // Dark mode toggle
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggle.src = isDark ? 'images/icons/lightmode.svg' : 'images/icons/darkmode.svg';
        toggle.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });

    // Mobile hamburger toggle
    document.getElementById('hamburger-btn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Form validation + LocalStorage
    document.getElementById('settings-form').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('displayName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phrase = document.getElementById('catchphrase').value.trim();

        if (!name || !email || !phrase) {
            alert("All fields are required.");
            return;
        }

        // Save to local storage
        localStorage.setItem('displayName', name);
        localStorage.setItem('catchphrase', phrase);

        document.getElementById('form-success').textContent = "Preferences updated!";
        setTimeout(() => {
            document.getElementById('form-success').textContent = "";
        }, 3000);
    });

    // Default: show home
    document.getElementById('home').classList.add('active');

    // Logo click returns to Dashboard
    document.querySelector('.logo').addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('home').classList.add('active');
        document.querySelector('[data-target="home"]').classList.add('active');
    });

    // Helper: show section
    function showSection(id) {
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        document.querySelector(`[data-target="${id}"]`)?.classList.add('active');
    }
});
