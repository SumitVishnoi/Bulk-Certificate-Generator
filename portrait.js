 // Select all images with the class 'downloadable'
 const images = document.querySelectorAll('.downloadable');

 // Attach a click event listener to each image
 images.forEach((image, index) => {
   image.addEventListener('click', () => {
     const imageUrl = image.src;

     // Create an image element
     const img = new Image();
     img.crossOrigin = "Anonymous"; // Ensure the image is not blocked by CORS if it's from a different origin
     img.src = imageUrl;

     img.onload = () => {
       // Create a canvas element
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');

       // Set canvas size to the image size
       canvas.width = img.width;
       canvas.height = img.height;

       // Draw the image on the canvas
       ctx.drawImage(img, 0, 0);

       // Convert canvas content to PNG format
       const dataURL = canvas.toDataURL('image/png');

       // Create a temporary anchor element
       const anchor = document.createElement('a');
       anchor.href = dataURL;
       anchor.download = `downloaded-image-${index + 1}.png`; // Set the download file name

       // Trigger the download
       anchor.click();
     };

     img.onerror = () => {
       alert('Failed to load image. Please ensure the image URL is correct.');
     };
   });
 });