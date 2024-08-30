// /public/scripts/imagePreview.js

function previewImage() {
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('previewImage');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';  // Show the preview image
        };

        reader.readAsDataURL(file);  // Read the uploaded image file
    } else {
        preview.src = '';
        preview.style.display = 'none';  // Hide the preview if no image is uploaded
    }
}
