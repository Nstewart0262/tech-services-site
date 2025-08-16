document.getElementById('contactForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch('/contact', {
        method: 'POST',
        body: data
    });

    const result = await response.text();
    document.getElementById('response').textContent = result;
    form.reset();
});